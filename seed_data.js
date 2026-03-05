
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mshimyujjjgdlzgypvkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zaGlteXVqampnZGx6Z3lwdmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MDI1MzYsImV4cCI6MjA4ODE3ODUzNn0.vnjFap3rlRjP0kmy_YxOxJEaqq-ZbnJs3jB5dahoeoM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
    console.log('Seeding stories...');

    // First, get categories
    const { data: categories } = await supabase.from('categories').select('*');
    if (!categories || categories.length === 0) {
        console.error('No categories found. Run schema.sql first.');
        return;
    }

    const fantasy = categories.find(c => c.slug === 'fantasy')?.id;
    const mystery = categories.find(c => c.slug === 'mystery')?.id;
    const scifi = categories.find(c => c.slug === 'sci-fi')?.id;

    const stories = [
        {
            title: 'The Echoes of Eternity',
            slug: 'echoes-of-eternity',
            summary: 'An epic journey across shattered realms in search of a lost melody.',
            cover_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
            is_published: true,
            category_id: fantasy
        },
        {
            title: 'Neon Midnight',
            slug: 'neon-midnight',
            summary: 'In a city that never sleeps, one detective hunts a ghost in the machine.',
            cover_image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
            is_published: true,
            category_id: scifi
        },
        {
            title: 'The Silent Witness',
            slug: 'silent-witness',
            summary: 'A locked room, a silent witness, and a secret that could destroy a dynasty.',
            cover_image_url: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=800',
            is_published: true,
            category_id: mystery
        },
        {
            title: 'Shadow of the Dragon',
            slug: 'shadow-of-dragon',
            summary: 'When the ancient wyrms awaken, the world will burn. Only one can stand against them.',
            cover_image_url: 'https://images.unsplash.com/photo-1577493322601-3ae1f3659160?auto=format&fit=crop&q=80&w=800',
            is_published: true,
            category_id: fantasy
        },
        {
            title: 'Beyond the Horizon',
            slug: 'beyond-horizon',
            summary: 'Space is vast, cold, and full of secrets. A crew of misfits discovers something they shouldn\'t.',
            cover_image_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800',
            is_published: true,
            category_id: scifi
        }
    ];

    for (const story of stories) {
        const { data, error } = await supabase
            .from('stories')
            .upsert(story, { onConflict: 'slug' });

        if (error) {
            console.error(`Error adding ${story.title}:`, error);
        } else {
            console.log(`Successfully added ${story.title}`);
        }
    }
}

seedData();
