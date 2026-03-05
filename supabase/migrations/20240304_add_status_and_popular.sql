-- Add status and is_popular columns to stories table
ALTER TABLE public.stories 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'published',
ADD COLUMN IF NOT EXISTS is_popular boolean DEFAULT false;

-- Update existing records to have 'published' status if is_published was true
UPDATE public.stories SET status = 'published' WHERE is_published = true;
UPDATE public.stories SET status = 'draft' WHERE is_published = false;

-- Optionally rename columns if you prefer the new names (be careful with existing data migrations)
-- ALTER TABLE public.stories RENAME COLUMN cover_image_url TO cover_url;
-- ALTER TABLE public.stories RENAME COLUMN summary TO description;
