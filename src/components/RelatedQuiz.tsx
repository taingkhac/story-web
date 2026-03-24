import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { HelpCircle } from 'lucide-react'

export default async function RelatedQuiz({ storyId, category }: { storyId: string, category?: string | null }) {
    const supabase = createClient()

    // Priority 1: Direct explicitly linked quiz
    let { data: quiz } = await supabase
        .from('quizzes')
        .select('id, title, slug, thumbnail_url, view_count, total_questions')
        .eq('related_story_id', storyId)
        .eq('is_published', true)
        .maybeSingle()

    // Priority 2: Fallback to same-category quiz
    if (!quiz && category) {
        const { data: catQuizzes } = await supabase
            .from('quizzes')
            .select('id, title, slug, thumbnail_url, view_count, total_questions')
            .eq('category', category)
            .eq('is_published', true)
            .limit(1)
        
        if (catQuizzes && catQuizzes.length > 0) {
            quiz = catQuizzes[0]
        }
    }

    if (!quiz) return null

    return (
        <div className="my-[32px]">
            <h3 className="text-[18px] font-bold text-[#111] mb-[16px]">Related Quiz</h3>
            <Link 
                href={`/quiz/${quiz.slug}`}
                className="group flex gap-3 py-4 border-b border-[#f0f0f0] transition-colors hover:bg-[#f8f9fa] -mx-4 px-4 sm:mx-0 sm:px-2 rounded-lg"
            >
                {quiz.thumbnail_url ? (
                    <div className="relative shrink-0 w-[70px] h-[70px] rounded-md overflow-hidden bg-zinc-100 border border-[#e0e0e0]">
                        <Image 
                            src={quiz.thumbnail_url} 
                            alt={quiz.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform"
                        />
                    </div>
                ) : (
                    <div className="relative shrink-0 w-[70px] h-[70px] rounded-md overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <HelpCircle size={20} className="text-blue-500 opacity-50" />
                    </div>
                )}
                
                <div className="flex flex-col justify-center">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#888] mb-1">📝 Featured Quiz</span>
                    <h4 className="text-[15px] font-semibold text-[#111] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {quiz.title}
                    </h4>
                    <div className="flex gap-4 mt-2 text-[12px] text-[#888]">
                        <span>{quiz.total_questions} Qs</span>
                        <span>{quiz.view_count.toLocaleString()} plays</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}
