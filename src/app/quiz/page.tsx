import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import QuizListClient from './QuizListClient'

export const metadata = {
    title: 'NovaLore Quizzes - Test Your Knowledge',
    description: 'Challenge yourself with our curated quizzes on history, lore, and epic tales.',
}

export default async function QuizPage() {
    const supabase = createClient()

    // Fetch initial 12 quizzes server-side for SEO
    const { data: initialQuizzes } = await supabase
        .from('quizzes')
        .select('id, title, slug, thumbnail_url, total_questions, view_count, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(12)

    return (
        <main className="min-h-screen bg-[#ffffff] font-sans text-[#333]">
            <Header />

            <div className="content-container py-12 lg:py-20">
                <header className="mb-16 text-center">
                    <h1 className="mb-6 text-[#111] drop-shadow-sm">
                        Epic <span className="text-blue-600 bg-blue-50 px-4 py-1 rounded-2xl">Quizzes</span>
                    </h1>
                    <p className="max-w-2xl mx-auto font-medium">
                        Test your knowledge against the greatest tales of history, science, and lore. Will you survive?
                    </p>
                </header>

                <div className="ad-slot bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-2xl text-zinc-400 font-bold uppercase tracking-widest text-xs shadow-inner mb-12">
                    [ AD BANNER SLOT - TOP (728x90) ]
                </div>

                <QuizListClient initialQuizzes={initialQuizzes || []} />
            </div>
        </main>
    )
}
