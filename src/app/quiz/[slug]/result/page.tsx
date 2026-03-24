import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import ResultClient from './ResultClient'

interface Props {
    params: { slug: string }
    searchParams?: { score?: string; total?: string }
}

export async function generateMetadata({ params, searchParams }: Props) {
    const supabase = createClient()
    const { data: quiz } = await supabase.from('quizzes').select('title, seo_title, seo_description, thumbnail_url, description').eq('slug', params.slug).maybeSingle()
    if (!quiz) return {}

    const score = searchParams?.score
    const total = searchParams?.total
    const baseUrl = 'https://story-web-henna.vercel.app'

    let ogTitle = `Your Result - ${quiz.seo_title || quiz.title}`
    let ogDescription = quiz.seo_description || quiz.description || `I just finished the ${quiz.title} quiz on NovaLore!`
    let ogImages = quiz.thumbnail_url ? [quiz.thumbnail_url] : []

    // Viral App Logic: If a score is present in the URL, this is a shared link!
    if (score && total) {
        ogTitle = `I scored ${score}/${total} on the ${quiz.title} Quiz!`
        ogDescription = "Can you beat my score? Take the quiz now!"
        ogImages = [`${baseUrl}/api/og/quiz/${params.slug}?score=${score}&total=${total}&title=${encodeURIComponent(quiz.title)}&image=${encodeURIComponent(quiz.thumbnail_url || '')}`]
    }

    return {
        title: `${ogTitle} | NovaLore`,
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            images: ogImages,
        }
    }
}

export default async function QuizResultPage({ params, searchParams }: Props) {
    const supabase = createClient()

    const { data: quiz } = await supabase
        .from('quizzes')
        .select('id, title, slug, total_questions, category, related_story_id')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .maybeSingle()

    if (!quiz) notFound()

    const { data: results } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('quiz_id', quiz.id)
        .order('min_score', { ascending: true })

    if (!results) notFound()

    // Fetch 1 related story
    let storyQuery = supabase.from('stories').select('id, title, slug, cover_image_url').eq('is_published', true)
    
    if (quiz.related_story_id) {
        storyQuery = storyQuery.eq('id', quiz.related_story_id)
    } // Else could fall back to category if we mapped category IDs correctly

    const { data: relatedStoryData } = await storyQuery.order('created_at', { ascending: false }).limit(1)
    
    // Fetch 3 other quizzes
    const { data: moreQuizzes } = await supabase
        .from('quizzes')
        .select('id, title, slug')
        .eq('is_published', true)
        .neq('id', quiz.id)
        .order('created_at', { ascending: false })
        .limit(3)

    return (
        <main className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-20">
            <Header />
            <ResultClient 
                quiz={quiz} 
                results={results}
                relatedStory={relatedStoryData?.[0] || null}
                moreQuizzes={moreQuizzes || []}
            />
        </main>
    )
}
