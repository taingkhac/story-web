
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://mshimyujjjgdlzgypvkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zaGlteXVqampnZGx6Z3lwdmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MDI1MzYsImV4cCI6MjA4ODE3ODUzNn0.vnjFap3rlRjP0kmy_YxOxJEaqq-ZbnJs3jB5dahoeoM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const { data: stories } = await supabase.from('stories').select('*');
    console.log('STORIES_JSON START');
    console.log(JSON.stringify(stories, null, 2));
    console.log('STORIES_JSON END');

    const { data: categories } = await supabase.from('categories').select('*');
    console.log('CATEGORIES_JSON START');
    console.log(JSON.stringify(categories, null, 2));
    console.log('CATEGORIES_JSON END');
}
checkData();
