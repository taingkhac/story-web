-- Step 1.1: Create categories table
CREATE TABLE public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL
);

-- Insert some default categories
INSERT INTO public.categories (name, slug) VALUES 
('Fantasy', 'fantasy'),
('Romance', 'romance'),
('Sci-Fi', 'sci-fi'),
('Mystery', 'mystery');

-- Step 1.2: Create stories table
CREATE TABLE public.stories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  cover_image_url text,
  summary text,
  is_published boolean DEFAULT false,
  category_id uuid REFERENCES public.categories(id)
);

-- Step 1.2: Create chapters table
CREATE TABLE public.chapters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  story_id uuid REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
  chapter_number integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  ai_video_url text
);

-- Step 1.3: Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('story-covers', 'story-covers', true);

-- Step 1.4: Set up Row Level Security (RLS)

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone." ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories." ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Stories Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.stories
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all stories." ON public.stories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert stories." ON public.stories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update stories." ON public.stories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete stories." ON public.stories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Chapters Policies
CREATE POLICY "Public chapters are viewable by everyone." ON public.chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stories
      WHERE stories.id = chapters.story_id AND stories.is_published = true
    )
  );

CREATE POLICY "Admins can view all chapters." ON public.chapters
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert chapters." ON public.chapters
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update chapters." ON public.chapters
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete chapters." ON public.chapters
  FOR DELETE USING (auth.role() = 'authenticated');

-- Storage Policies for 'story-covers'
CREATE POLICY "Public Storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'story-covers');

CREATE POLICY "Admin Insert Storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'story-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Update Storage" ON storage.objects
  FOR UPDATE USING (bucket_id = 'story-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'story-covers' AND auth.role() = 'authenticated');
