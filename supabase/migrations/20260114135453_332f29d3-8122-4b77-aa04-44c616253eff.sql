-- Phase 1: Content Workflow + basic audit logging

-- 1) Extend admin_content with workflow fields
ALTER TABLE public.admin_content
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS current_version_id uuid,
  ADD COLUMN IF NOT EXISTS approval_required boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz;

-- Optional status constraint for safety
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'admin_content_status_check'
  ) THEN
    ALTER TABLE public.admin_content
      ADD CONSTRAINT admin_content_status_check
      CHECK (status IN ('draft', 'in_review', 'scheduled', 'published', 'archived'));
  END IF;
END $$;

-- Link approved_by and current_version_id via foreign keys where appropriate
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'admin_content_approved_by_fkey'
  ) THEN
    ALTER TABLE public.admin_content
      ADD CONSTRAINT admin_content_approved_by_fkey
      FOREIGN KEY (approved_by)
      REFERENCES public.profiles(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- We will add FK for current_version_id after creating content_versions table

-- 2) Create content_versions table
CREATE TABLE IF NOT EXISTS public.content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.admin_content(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  title text NOT NULL,
  title_arabic text,
  content text,
  content_arabic text,
  metadata jsonb DEFAULT '{}'::jsonb,
  change_summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL REFERENCES public.profiles(id)
);

-- Ensure (content_id, version_number) is unique for clean version history
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'content_versions_content_id_version_number_key'
  ) THEN
    ALTER TABLE public.content_versions
      ADD CONSTRAINT content_versions_content_id_version_number_key
      UNIQUE (content_id, version_number);
  END IF;
END $$;

-- Now link admin_content.current_version_id to content_versions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'admin_content_current_version_id_fkey'
  ) THEN
    ALTER TABLE public.admin_content
      ADD CONSTRAINT admin_content_current_version_id_fkey
      FOREIGN KEY (current_version_id)
      REFERENCES public.content_versions(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- 3) Create content_approvals table
CREATE TABLE IF NOT EXISTS public.content_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.admin_content(id) ON DELETE CASCADE,
  version_id uuid REFERENCES public.content_versions(id) ON DELETE SET NULL,
  requested_by uuid NOT NULL REFERENCES public.profiles(id),
  approved_by uuid REFERENCES public.profiles(id),
  status text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Optional status constraint for approvals
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'content_approvals_status_check'
  ) THEN
    ALTER TABLE public.content_approvals
      ADD CONSTRAINT content_approvals_status_check
      CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- 4) Create admin_audit_log table for basic audit logging
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES public.profiles(id),
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5) Enable RLS and policies for new tables
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- content_versions: admins and editors can manage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'content_versions'
      AND policyname = 'Admins and editors manage content versions'
  ) THEN
    CREATE POLICY "Admins and editors manage content versions"
    ON public.content_versions
    FOR ALL
    USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'editor'))
    WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'editor'));
  END IF;
END $$;

-- content_approvals: admins and editors can manage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'content_approvals'
      AND policyname = 'Admins and editors manage content approvals'
  ) THEN
    CREATE POLICY "Admins and editors manage content approvals"
    ON public.content_approvals
    FOR ALL
    USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'editor'))
    WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'editor'));
  END IF;
END $$;

-- admin_audit_log: any authenticated user can insert their own actions; only admins can read
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_audit_log'
      AND policyname = 'Anyone can insert own audit log entry'
  ) THEN
    CREATE POLICY "Anyone can insert own audit log entry"
    ON public.admin_audit_log
    FOR INSERT
    WITH CHECK (auth.uid() = actor_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_audit_log'
      AND policyname = 'Admins can view audit log'
  ) THEN
    CREATE POLICY "Admins can view audit log"
    ON public.admin_audit_log
    FOR SELECT
    USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- 6) Broaden admin_content policy to include editors for management
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_content'
      AND policyname = 'Admins can manage content'
  ) THEN
    DROP POLICY "Admins can manage content" ON public.admin_content;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'admin_content'
      AND policyname = 'Admins and editors can manage content'
  ) THEN
    CREATE POLICY "Admins and editors can manage content"
    ON public.admin_content
    FOR ALL
    USING (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'editor'))
    WITH CHECK (public.is_admin(auth.uid()) OR public.has_role(auth.uid(), 'editor'));
  END IF;
END $$;