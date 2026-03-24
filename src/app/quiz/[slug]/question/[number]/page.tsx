import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Header from '@/components/Header'
import QuestionClient from './QuestionClient'

interface Props {
    params: { slug: string; number: string }
}

export async function generateMetadata({ params }: Props) {
    const supabase = createClient()
    const { data: quiz } = await supabase.from('quizzes').select('title, seo_title').eq('slug', params.slug).maybeSingle()
    if (!quiz) return {}
    return {
        title: `Question ${params.number} - ${quiz.seo_title || quiz.title} | NovaLore`,
    }
}

export default async function QuestionPage({ params }: Props) {
    const questionIndex = parseInt(params.number) - 1 // 1-based to 0-based
    if (isNaN(questionIndex) || questionIndex < 0) notFound()

    const supabase = createClient()

    // 1. Fetch Quiz ID and total questions
    const { data: quiz } = await supabase
        .from('quizzes')
        .select('id, title, slug, total_questions')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .maybeSingle()

    if (!quiz) notFound()

    if (questionIndex >= quiz.total_questions) {
        redirect(`/quiz/${quiz.slug}/result`)
    }

    // 2. Fetch the specific question by order offset
    const { data: questions } = await supabase
        .from('quiz_questions')
        .select('id, question_text, question_image_url, explanation')
        .eq('quiz_id', quiz.id)
        .order('question_order', { ascending: true })
        .range(questionIndex, questionIndex) // fetch exactly 1
        
    if (!questions || questions.length === 0) notFound()
    
    const question = questions[0]

    // 3. Fetch its answers
    const { data: answers } = await supabase
        .from('quiz_answers')
        .select('id, answer_text, answer_image_url, is_correct, answer_order')
        .eq('question_id', question.id)
        .order('answer_order', { ascending: true })

    if (!answers) notFound()

    // Pass data down to client component
    return (
        <main className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-20">
            <Header />
            <QuestionClient 
                key={params.number}
                quiz={quiz} 
                question={question}
                answers={answers}
                currentNumber={parseInt(params.number)}
            />
        </main>
    )
}
