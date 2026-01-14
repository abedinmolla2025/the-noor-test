-- 1) Content review comments table
CREATE TABLE IF NOT EXISTS public.content_review_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.admin_content(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL,
  comment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.content_review_comments ENABLE ROW LEVEL SECURITY;

-- Editors and admins can manage comments
CREATE POLICY "Admins and editors manage review comments"
ON public.content_review_comments
FOR ALL
USING (
  is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'::app_role)
)
WITH CHECK (
  is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'::app_role)
);

-- Anyone can view comments for published content or if admin/editor
CREATE POLICY "Anyone can view review comments for published content"
ON public.content_review_comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_content c
    WHERE c.id = content_id
      AND (c.is_published = true OR is_admin(auth.uid()) OR has_role(auth.uid(), 'editor'::app_role))
  )
);


-- 2) Role capabilities matrix for future fine-grained permissions
CREATE TABLE IF NOT EXISTS public.role_capabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  capability text NOT NULL,
  allowed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role, capability)
);

ALTER TABLE public.role_capabilities ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage capabilities
CREATE POLICY "Super admins manage role capabilities"
ON public.role_capabilities
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- Everyone can read capabilities (used by UI)
CREATE POLICY "Anyone can view role capabilities"
ON public.role_capabilities
FOR SELECT
USING (true);


-- 3) MFA settings table for future 2FA
CREATE TABLE IF NOT EXISTS public.user_mfa_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  is_mfa_enabled boolean NOT NULL DEFAULT false,
  method text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.user_mfa_settings ENABLE ROW LEVEL SECURITY;

-- Users can view and manage their own MFA settings
CREATE POLICY "Users manage own mfa settings"
ON public.user_mfa_settings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view MFA status for all users (no modifications)
CREATE POLICY "Admins can view all mfa settings"
ON public.user_mfa_settings
FOR SELECT
USING (is_admin(auth.uid()));