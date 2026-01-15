-- Create admin_ads table for centralized ad management
CREATE TABLE IF NOT EXISTS public.admin_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  zone TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'both',
  ad_type TEXT NOT NULL,
  ad_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paused',
  start_at TIMESTAMPTZ NULL,
  end_at TIMESTAMPTZ NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  frequency INTEGER NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Basic value validation (no time-based checks here)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_ads_zone_check'
  ) THEN
    ALTER TABLE public.admin_ads
      ADD CONSTRAINT admin_ads_zone_check
      CHECK (zone IN ('HOME_TOP','DUA_INLINE','QURAN_BOTTOM','ARTICLE_SIDEBAR','FULLSCREEN_SPLASH'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_ads_platform_check'
  ) THEN
    ALTER TABLE public.admin_ads
      ADD CONSTRAINT admin_ads_platform_check
      CHECK (platform IN ('web','android','both'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_ads_ad_type_check'
  ) THEN
    ALTER TABLE public.admin_ads
      ADD CONSTRAINT admin_ads_ad_type_check
      CHECK (ad_type IN ('html','script','image','admob'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_ads_status_check'
  ) THEN
    ALTER TABLE public.admin_ads
      ADD CONSTRAINT admin_ads_status_check
      CHECK (status IN ('active','paused'));
  END IF;
END $$;

-- Helpful indexes for fetching active ads
CREATE INDEX IF NOT EXISTS idx_admin_ads_zone ON public.admin_ads (zone);
CREATE INDEX IF NOT EXISTS idx_admin_ads_status ON public.admin_ads (status);
CREATE INDEX IF NOT EXISTS idx_admin_ads_platform ON public.admin_ads (platform);
CREATE INDEX IF NOT EXISTS idx_admin_ads_priority ON public.admin_ads (priority);
CREATE INDEX IF NOT EXISTS idx_admin_ads_schedule ON public.admin_ads (start_at, end_at);

-- Ensure updated_at is maintained
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_admin_ads_updated_at ON public.admin_ads;
CREATE TRIGGER update_admin_ads_updated_at
BEFORE UPDATE ON public.admin_ads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.admin_ads ENABLE ROW LEVEL SECURITY;

-- Public read: only active + within schedule
DROP POLICY IF EXISTS "Public can read active scheduled ads" ON public.admin_ads;
CREATE POLICY "Public can read active scheduled ads"
ON public.admin_ads
FOR SELECT
USING (
  status = 'active'
  AND (start_at IS NULL OR start_at <= now())
  AND (end_at IS NULL OR end_at >= now())
);

-- Admin management (insert/update/delete): admin or super admin
DROP POLICY IF EXISTS "Admins can insert ads" ON public.admin_ads;
CREATE POLICY "Admins can insert ads"
ON public.admin_ads
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update ads" ON public.admin_ads;
CREATE POLICY "Admins can update ads"
ON public.admin_ads
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete ads" ON public.admin_ads;
CREATE POLICY "Admins can delete ads"
ON public.admin_ads
FOR DELETE
USING (public.is_admin(auth.uid()));
