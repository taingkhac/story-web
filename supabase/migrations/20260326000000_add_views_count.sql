-- Add views column to stories if it doesn't exist
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Add views column to chapters if it doesn't exist
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Create RPC function to increment story view
CREATE OR REPLACE FUNCTION increment_story_view(p_story_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.stories
  SET views = COALESCE(views, 0) + 1
  WHERE id = p_story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RPC function to increment chapter view
CREATE OR REPLACE FUNCTION increment_chapter_view(p_chapter_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.chapters
  SET views = COALESCE(views, 0) + 1
  WHERE id = p_chapter_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION increment_story_view(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_chapter_view(UUID) TO anon, authenticated;
