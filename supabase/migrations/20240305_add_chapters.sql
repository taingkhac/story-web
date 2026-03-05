-- 1. Fix the story title if it contains "Chapter 1"
UPDATE public.stories 
SET title = 'The Copper Rain' 
WHERE id = '338d4ce6-a295-49e9-98a3-ea7dd1bb0480';

-- 2. Clear existing chapters for this story to avoid duplication if any
DELETE FROM public.chapters WHERE story_id = '338d4ce6-a295-49e9-98a3-ea7dd1bb0480';

-- 3. Insert fresh chapters
INSERT INTO public.chapters (story_id, chapter_number, title, content)
VALUES 
(
  '338d4ce6-a295-49e9-98a3-ea7dd1bb0480', 
  1, 
  'The Awakening', 
  'In the heart of the city, where the rain falls like molten copper, Kaelen stood alone. The air was thick with the scent of ozone and ancient magic. This was the beginning of everything.

The Praetorian Guard moved in the shadows, their eyes glowing with a cold, blue light. They were searching for the one who had the spark—the one who could change the fate of the realm.

Kaelen knew he couldn''t stay. He took a deep breath and plunged into the darkness of the alleyway.'
),
(
  '338d4ce6-a295-49e9-98a3-ea7dd1bb0480', 
  2, 
  'Shadows of the Past', 
  'The tunnels beneath the city were older than the skyscrapers above. Here, the history of the realm was written in stone and dried blood.

"You''re late," a voice echoed through the damp corridor.

Kaelen turned to see Elara, her hands resting on the hilt of her twin blades. She was the best scout in the resistance, and the only person he could trust.

"The Praetorians are everywhere," Kaelen replied. "We need to move now."'
);
