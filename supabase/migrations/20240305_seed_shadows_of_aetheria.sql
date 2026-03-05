-- 1. Ensure chapters table has image_url column
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Insert the new story
INSERT INTO public.stories (title, slug, summary, cover_image_url, is_published, category_id)
VALUES (
  'Shadows of Aetheria',
  'shadows-of-aetheria',
  'A lone traveler journeys to the mystical floating islands of Aetheria to uncover the secrets of the ancient crystals and stop a rising darkness that threatens to sunder the realms.',
  '/stories/shadows-of-aetheria/cover.png',
  true,
  (SELECT id FROM public.categories WHERE slug = 'fantasy' LIMIT 1)
) ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  cover_image_url = EXCLUDED.cover_image_url,
  is_published = EXCLUDED.is_published;

-- 3. Get the story ID
DO $$
DECLARE
  v_story_id uuid;
BEGIN
  SELECT id INTO v_story_id FROM public.stories WHERE slug = 'shadows-of-aetheria';

  -- 4. Clear existing chapters for this story to avoid duplication
  DELETE FROM public.chapters WHERE story_id = v_story_id;

  -- 5. Insert 8 chapters
  INSERT INTO public.chapters (story_id, chapter_number, title, image_url, content)
  VALUES 
  (v_story_id, 1, 'The Whispering Woods', '/stories/shadows-of-aetheria/chapter-1.png', 'Kaelen entered the Whispering Woods as the sun began to set. The trees here didn''t just grow; they seemed to breathe, their bark etched with faces of those who had passed through centuries ago. Glowing blue mushrooms illuminated the path, casting long, dancing shadows on the mossy floor.'),
  (v_story_id, 2, 'The Crystal Tower', '/stories/shadows-of-aetheria/chapter-2.png', 'Emerging from the forest, the Crystal Tower loomed ahead, a jagged needle of pure light piercing the silver waters of Lake Mirra. It was said that the tower was grown from a single seed of starlight. As Kaelen approached, the tower pulsed with a rhythmic warmth, its facets reflecting a rainbow of colors.'),
  (v_story_id, 3, 'Forgotten Echoes', '/stories/shadows-of-aetheria/chapter-3.png', 'Below the tower lay the Catacombs of Echoes. Kaelen descended into the cold, damp dark, his staff providing the only light. The walls were lined with statues of forgotten kings, their eyes seemingly following his every move. He found ancient runes carved into the floor, still glowing.'),
  (v_story_id, 4, 'The Dragon''s Breath', '/stories/shadows-of-aetheria/chapter-4.png', 'The path led Kaelen to the Volcanic Peaks of Ignis. High above, a Great Red Dragon circled the summit, its roar shaking the very foundation of the world. Kaelen watched as the beast perched on the highest peak, breathing a gout of fire that lit up the ash-choked sky.'),
  (v_story_id, 5, 'Midnight at the Citadel', '/stories/shadows-of-aetheria/chapter-5.png', 'The Black Citadel stood as a silent sentinel under the moonless night. Its spires were like obsidian claws reaching for the stars. Inside, the corridors were silent, filled with the presence of a thousand unseen watchers. Kaelen moved like a ghost through the halls.'),
  (v_story_id, 6, 'The Sundered Veil', '/stories/shadows-of-aetheria/chapter-6.png', 'At the heart of the Citadel, Kaelen found the Rift. The veil between worlds had been torn asunder, revealing a cosmic ocean of swirling violet and gold. Debris from other realms floated in the void, drawn in by the gravitational pull of the anomaly.'),
  (v_story_id, 7, 'Requiem for the Fallen', '/stories/shadows-of-aetheria/chapter-7.png', 'Before the final ritual, Kaelen stood upon the Field of Swords. A thousand blades marked the graves of those who had failed before him. The sun set in a blood-red horizon, casting long shadows over the hallowed ground.'),
  (v_story_id, 8, 'Dawn of a New Age', '/stories/shadows-of-aetheria/chapter-8.png', 'The ritual was successful. The Rift closed with a thunderous clap, and for the first time in millennia, the sky over Aetheria was clear. Kaelen stood on the balcony of the restored Citadel as the sun rose over a lush, green world. A new age had begun.');
END $$;
