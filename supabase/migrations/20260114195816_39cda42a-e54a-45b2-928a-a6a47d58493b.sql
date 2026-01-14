-- Add per-language title and content fields for Dua content
ALTER TABLE public.admin_content
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS title_hi text,
  ADD COLUMN IF NOT EXISTS title_ur text,
  ADD COLUMN IF NOT EXISTS content_en text,
  ADD COLUMN IF NOT EXISTS content_hi text,
  ADD COLUMN IF NOT EXISTS content_ur text;