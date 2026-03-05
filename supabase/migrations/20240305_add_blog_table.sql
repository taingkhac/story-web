-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  cover_image_url text,
  is_published boolean DEFAULT false,
  author_name text DEFAULT 'NovaLore Team'
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog Policies
CREATE POLICY "Public blog posts are viewable by everyone." ON public.blog_posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage blog posts." ON public.blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, content, excerpt, cover_image_url, is_published)
VALUES 
(
  'Welcome to NovaLore: A New Era of Storytelling',
  'welcome-to-novalore',
  'We are thrilled to welcome you to NovaLore, the official home for epic web novels and immersive lore. Our mission is to provide a premium reading experience for story lovers everywhere. From dark fantasy to futuristic sci-fi, NovaLore is where legends are born. Stay tuned for regular updates, author interviews, and sneak peeks into upcoming chapters.',
  'Discover the heart and soul of NovaLore and what we have in store for the community.',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
  true
),
(
  'The Art of World Building: Tips for Aspiring Authors',
  'art-of-world-building',
  'Creating a believable world is more than just drawing a map. It starts with a philosophy. What are the laws of magic? How does society function under the shadows of aetheria? In this post, we dive deep into the essential elements of building a living, breathing world that readers will never want to leave.',
  'Learn how to create immersive worlds that captivate your audience from the very first page.',
  'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&q=80&w=800',
  true
);
