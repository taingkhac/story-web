const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mshimyujjjgdlzgypvkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zaGlteXVqampnZGx6Z3lwdmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MDI1MzYsImV4cCI6MjA4ODE3ODUzNn0.vnjFap3rlRjP0kmy_YxOxJEaqq-ZbnJs3jB5dahoeoM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedChapters() {
    console.log('Fetching stories...');
    const { data: stories } = await supabase.from('stories').select('id, title');

    if (!stories) return console.error('No stories found');

    // Clear existing chapters to avoid duplicates
    console.log('Clearing existing chapters...');
    await supabase.from('chapters').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const story of stories) {
        console.log(`Seeding chapters for: ${story.title}`);

        const chapters = [
            {
                story_id: story.id,
                chapter_number: 1,
                title: 'The Awakening',
                content: `In the heart of the city, where the rain falls like molten copper, Kaelen stood alone. The air was thick with the scent of ozone and ancient magic. This was the beginning of everything.

The Praetorian Guard moved in the shadows, their eyes glowing with a cold, blue light. They were searching for the one who had the spark—the one who could change the fate of the realm.

Kaelen knew he couldn't stay. He took a deep breath and plunged into the darkness of the alleyway.`
            },
            {
                story_id: story.id,
                chapter_number: 2,
                title: 'Shadows of the Past',
                content: `The tunnels beneath the city were older than the skyscrapers above. Here, the history of the realm was written in stone and dried blood.

"You're late," a voice echoed through the damp corridor.

Kaelen turned to see Elara, her hands resting on the hilt of her twin blades. She was the best scout in the resistance, and the only person he could trust.

"The Praetorians are everywhere," Kaelen replied. "We need to move now."`
            },
            {
                story_id: story.id,
                chapter_number: 3,
                title: 'The Spark Ignite',
                content: `Deep within the Sanctum, the artifacts pulsed with a rhythm only Kaelen could hear. It was a song of fire and gold, a call to a power long forgotten.

"Put your hand on the stone," Elara whispered.

As his fingers brushed the cold surface, a surge of energy raced through his veins. The copper rain outside turned to fire, and for the first time in a thousand years, the dragon of the deep opened its eyes.`
            }
        ];

        for (const chapter of chapters) {
            const { error } = await supabase.from('chapters').insert(chapter);
            if (error) console.error(`Error adding chapter ${chapter.chapter_number}:`, error.message);
            else console.log(`Added chapter ${chapter.chapter_number} to ${story.title}`);
        }
    }
    console.log('Seeding complete!');
}

seedChapters();
