'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { HelpCircle, Eye, ChevronRight } from 'lucide-react'

type QuizSummary = {
    id: string
    title: string
    slug: string
    thumbnail_url: string | null
    total_questions: number
    view_count: number
    created_at: string
}

export default function QuizListClient({ initialQuizzes }: { initialQuizzes: QuizSummary[] }) {
    const [quizzes, setQuizzes] = useState<QuizSummary[]>(initialQuizzes)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(initialQuizzes.length === 12)
    const [loading, setLoading] = useState(false)
    
    const observerTarget = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    const fetchMoreQuizzes = useCallback(async () => {
        if (loading || !hasMore) return
        
        setLoading(true)
        const from = page * 12
        const to = from + 11

        const { data, error } = await supabase
            .from('quizzes')
            .select('id, title, slug, thumbnail_url, total_questions, view_count, created_at')
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .range(from, to)

        if (!error && data) {
            setQuizzes(prev => [...prev, ...data])
            setPage(prev => prev + 1)
            if (data.length < 12) {
                setHasMore(false)
            }
        }
        setLoading(false)
    }, [page, loading, hasMore, supabase])

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    fetchMoreQuizzes()
                }
            },
            { threshold: 1.0 }
        )

        if (observerTarget.current) {
            observer.observe(observerTarget.current)
        }

        return () => observer.disconnect()
    }, [fetchMoreQuizzes, hasMore, loading])

    if (quizzes.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-zinc-500 font-medium italic text-lg">No quizzes found. Check back later!</p>
            </div>
        )
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {quizzes.map((quiz) => (
                    <Link
                        key={quiz.id}
                        href={`/quiz/${quiz.slug}`}
                        className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-zinc-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                    >
                        <div className="aspect-[4/3] overflow-hidden relative bg-zinc-100">
                            {quiz.thumbnail_url ? (
                                <Image
                                    src={quiz.thumbnail_url}
                                    alt={quiz.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                                    <HelpCircle size={48} className="text-zinc-600" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[13px] font-bold shadow-sm flex items-center gap-1.5 text-[#333] border border-[#e0e0e0]">
                                <HelpCircle size={14} className="text-blue-600" />
                                <span>{quiz.total_questions} Questions</span>
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <h2 className="text-[20px] font-bold text-[#111] mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                {quiz.title}
                            </h2>
                            <div className="mt-auto flex items-center justify-between text-[13px] font-semibold text-[#888]">
                                <div className="flex items-center gap-2">
                                    <Eye size={16} className="text-[#888]" />
                                    <span>{quiz.view_count.toLocaleString()} plays</span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600 group-hover:translate-x-1 transition-transform">
                                    <span>Play Now</span>
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Intersection Observer Target for Infinite Scroll */}
            {hasMore && (
                <div ref={observerTarget} className="py-12 flex justify-center">
                    {loading && (
                        <div className="h-8 w-8 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
                    )}
                </div>
            )}
            
            {!hasMore && quizzes.length > 0 && (
                <div className="py-12 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">
                    You've reached the end
                </div>
            )}
        </div>
    )
}
