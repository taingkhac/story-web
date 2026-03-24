import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Zap, ArrowRight, HelpCircle } from 'lucide-react'

export default async function QuizPromo({ storyId, category }: { storyId: string, category?: string | null }) {
    const supabase = createClient()

    let { data: quiz } = await supabase
        .from('quizzes')
        .select('id, title, slug, total_questions')
        .eq('related_story_id', storyId)
        .eq('is_published', true)
        .maybeSingle()

    if (!quiz && category) {
        const { data: catQuizzes } = await supabase
            .from('quizzes')
            .select('id, title, slug, total_questions')
            .eq('category', category)
            .eq('is_published', true)
            .limit(1)
        
        if (catQuizzes && catQuizzes.length > 0) {
            quiz = catQuizzes[0]
        }
    }

    if (!quiz) return null

    // Fetch exactly 1 question from this quiz to preview
    const { data: questionPreview } = await supabase
        .from('quiz_questions')
        .select('question_text')
        .eq('quiz_id', quiz.id)
        .limit(1)
        .maybeSingle()

    if (!questionPreview) return null

    return (
        <div className="w-full my-6 bg-[#f8f9fa] border-l-[4px] border-l-blue-600 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 md:justify-between transform transition-transform duration-300 relative overflow-hidden">
            {/* Decal */}
            <Zap size={100} className="absolute -right-6 -bottom-6 text-blue-600/5 rotate-12" />

            <div className="flex-1 relative z-10 text-left">
                <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[11px] mb-2 text-blue-600">
                    <Zap size={14} className="fill-blue-600" />
                    Quick Break Challenge
                </div>
                <h4 className="text-[15px] sm:text-[17px] font-bold mb-0.5 text-[#111] leading-tight">
                    "{questionPreview.question_text}"
                </h4>
                <p className="text-[13px] font-medium text-[#888]">
                    From our complete {quiz.total_questions}-question quiz.
                </p>
            </div>

            <Link 
                href={`/quiz/${quiz.slug}`}
                className="relative z-10 shrink-0 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 min-h-[44px] rounded-lg font-bold text-[13px] transition-all w-full md:w-auto uppercase tracking-wider"
            >
                Take Quiz
                <ArrowRight size={14} />
            </Link>
        </div>
    )
}
