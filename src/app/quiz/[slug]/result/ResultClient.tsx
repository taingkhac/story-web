'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { Trophy, RefreshCw, Facebook, Twitter, Link as LinkIcon, Share, ArrowRight, BookOpen, Navigation } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

type ResultTier = { id: string; result_title: string; min_score: number; max_score: number; result_description: string | null; result_image_url: string | null; share_text: string | null }
type Quiz = { id: string; title: string; slug: string; total_questions: number }
type RelatedStory = { id: string; title: string; slug: string; cover_image_url: string | null }
type MoreQuiz = { id: string; title: string; slug: string }

export default function ResultClient({ 
    quiz, 
    results,
    relatedStory,
    moreQuizzes
}: { 
    quiz: Quiz, 
    results: ResultTier[],
    relatedStory: RelatedStory | null,
    moreQuizzes: MoreQuiz[]
}) {
    const router = useRouter()
    const supabase = createClient()
    const [score, setScore] = useState<number | null>(null)
    const [tier, setTier] = useState<ResultTier | null>(null)
    const [hasLogged, setHasLogged] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const urlScore = urlParams.get('score')
        const storedScoreStr = sessionStorage.getItem(`quiz_score_${quiz.id}`)

        // If they arrived via a shared link (URL has score) but have NO session score -> Redirect to intro page!
        if (urlScore && !storedScoreStr) {
            router.replace(`/quiz/${quiz.slug}`)
            return
        }

        const finalScore = storedScoreStr ? parseInt(storedScoreStr) : 0
        setScore(finalScore)

        // Find tier
        const matchedTier = results.find(r => finalScore >= r.min_score && finalScore <= r.max_score) || results[0]
        setTier(matchedTier)

        const percentage = Math.round((finalScore / quiz.total_questions) * 100)
        
        if (percentage > 80 && !hasLogged) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            })
        }

        // Log attempt to DB
        if (!hasLogged) {
            const logAttempt = async () => {
                await supabase.from('quiz_attempts').insert({
                    quiz_id: quiz.id,
                    score: finalScore,
                    total_questions: quiz.total_questions,
                    user_agent: navigator.userAgent
                })
            }
            logAttempt()
            setHasLogged(true)
        }
    }, [quiz.id, quiz.total_questions, results, supabase, hasLogged])

    const handleRetake = () => {
        sessionStorage.setItem(`quiz_score_${quiz.id}`, '0')
        sessionStorage.setItem(`quiz_highest_q_${quiz.id}`, '1')
    }

    const shareUrl = `https://story-web-henna.vercel.app/quiz/${quiz.slug}/result?score=${score}&total=${quiz.total_questions}`
    const shareTitle = `I scored ${score}/${quiz.total_questions} on "${quiz.title}"!`
    const shareText = tier?.share_text || shareTitle

    const handleShareFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    }

    const handleShareTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl)
        alert('Link copied to clipboard!')
    }

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            handleCopyLink()
        }
    }

    if (score === null || !tier) return null

    const percentage = Math.round((score / quiz.total_questions) * 100)

    return (
        <div className="content-container py-8 text-center pt-24 lg:pt-32">
            {/* Top Ad Banner Slot */}
            <div className="ad-slot bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-2xl text-zinc-400 font-bold uppercase tracking-widest text-xs shadow-inner">
                [ AD BANNER SLOT - TOP (728x90) ]
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-zinc-200 border border-[#e0e0e0] overflow-hidden mb-12">
                
                {/* Score Header */}
                <div className="bg-[#f8f9fa] border-b border-[#e0e0e0] p-12 text-[#111] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center">
                        <Trophy size={300} className="text-[#111]" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">🏆 YOUR RESULT</span>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-7xl font-bold leading-none">{score}</span>
                            <span className="text-3xl text-[#888] font-semibold leading-tight">/ {quiz.total_questions}</span>
                        </div>
                        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold mt-4 tracking-widest">
                            SCORE: {percentage}%
                        </span>
                    </div>
                </div>

                {/* Tier Result */}
                <div className="p-8 lg:p-12">
                    <h2 className="mb-6 uppercase leading-tight font-bold text-[#111]">{tier.result_title}</h2>
                    
                    {tier.result_image_url && (
                        <div className="relative w-full aspect-[4/3] max-w-md mx-auto rounded-2xl overflow-hidden mb-8 bg-zinc-100 shadow-md transform hover:scale-105 transition-transform duration-500">
                            <Image 
                                src={tier.result_image_url} 
                                alt={tier.result_title} 
                                fill 
                                className="object-cover"
                            />
                        </div>
                    )}
                    
                    <p className="text-[#333] font-medium leading-relaxed mb-10 max-w-xl mx-auto">
                        "{tier.result_description}"
                    </p>

                    {/* Desktop Social Grid / Mobile List */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-[10px] max-w-2xl mx-auto mb-10">
                        <button onClick={handleShareFacebook} className="flex flex-col items-center justify-center gap-2 bg-[#1877f2] hover:bg-[#1877f2]/90 text-white px-[16px] py-[12px] rounded-lg font-semibold uppercase tracking-widest transition-all">
                            <Facebook size={20} />
                            <span className="text-[10px]">Facebook</span>
                        </button>
                        <button onClick={handleShareTwitter} className="flex flex-col items-center justify-center gap-2 bg-[#000000] hover:bg-zinc-800 text-white px-[16px] py-[12px] rounded-lg font-semibold uppercase tracking-widest transition-all">
                            <Twitter size={20} />
                            <span className="text-[10px]">Tweet</span>
                        </button>
                        <button onClick={handleCopyLink} className="flex flex-col items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-[#333] px-[16px] py-[12px] rounded-lg font-semibold uppercase tracking-widest transition-all border border-[#e0e0e0]">
                            <LinkIcon size={20} />
                            <span className="text-[10px]">Copy Link</span>
                        </button>
                        <button onClick={handleNativeShare} className="flex flex-col items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-[16px] py-[12px] rounded-lg font-semibold uppercase tracking-widest transition-all md:hidden border border-blue-200">
                            <Share size={20} />
                            <span className="text-[10px]">Share</span>
                        </button>
                        <Link href={`/quiz/${quiz.slug}/question/1`} onClick={handleRetake} className="hidden md:flex flex-col items-center justify-center gap-2 bg-white hover:bg-zinc-50 text-[#333] px-[16px] py-[12px] rounded-lg font-semibold uppercase tracking-widest transition-all shadow-sm border border-[#e0e0e0]">
                            <RefreshCw size={20} />
                            <span className="text-[10px]">Retake</span>
                        </Link>
                    </div>
                    
                    <Link href={`/quiz/${quiz.slug}/question/1`} onClick={handleRetake} className="w-full md:hidden flex flex-col items-center justify-center gap-2 bg-white hover:bg-zinc-50 text-[#333] px-[16px] py-[12px] rounded-lg font-semibold uppercase tracking-widest transition-all shadow-sm border border-[#e0e0e0] mb-4">
                        <RefreshCw size={20} />
                        <span className="text-[12px]">Retake Quiz</span>
                    </Link>
                </div>
            </div>

            {/* Middle Ad Banner Slot */}
            <div className="ad-slot bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-2xl text-zinc-400 font-bold uppercase tracking-widest text-xs shadow-inner">
                [ AD BANNER SLOT - MIDDLE ]
            </div>

            <div className="text-left mb-12">
                <h3 className="text-[18px] font-bold text-[#111] mb-4 border-b border-[#e0e0e0] pb-2">Related Content</h3>
                <div className="flex flex-col">
                    {/* Dive Deeper */}
                    {relatedStory && (
                        <Link href={`/story/${relatedStory.slug}`} className="group flex gap-[12px] py-[16px] border-b border-[#f0f0f0] transition-colors hover:bg-[#f8f9fa] -mx-4 px-4 sm:mx-0 sm:px-2 rounded-lg">
                            {relatedStory.cover_image_url && (
                                <div className="relative shrink-0 w-[80px] h-[80px] rounded-[6px] overflow-hidden bg-zinc-100 border border-[#e0e0e0]">
                                    <Image src={relatedStory.cover_image_url} alt="Story" fill className="object-cover group-hover:scale-105 transition-transform" />
                                </div>
                            )}
                            <div className="flex flex-col justify-center">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#888] mb-1">📖 Story</span>
                                <h4 className="text-[15px] font-semibold text-[#111] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {relatedStory.title}
                                </h4>
                            </div>
                        </Link>
                    )}

                    {/* More Quizzes */}
                    {moreQuizzes.map(q => (
                        <Link key={q.id} href={`/quiz/${q.slug}`} className="group flex gap-[12px] py-[16px] border-b border-[#f0f0f0] transition-colors hover:bg-[#f8f9fa] -mx-4 px-4 sm:mx-0 sm:px-2 rounded-lg">
                            <div className="relative shrink-0 w-[80px] h-[80px] rounded-[6px] overflow-hidden bg-blue-50 border border-blue-100 flex items-center justify-center">
                                <Navigation size={24} className="text-blue-500 opacity-50" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-[#888] mb-1">📝 Quiz</span>
                                <h4 className="text-[15px] font-semibold text-[#111] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {q.title}
                                </h4>
                            </div>
                        </Link>
                    ))}
                </div>
                
                <Link href="/quiz" className="mt-[24px] inline-flex items-center justify-center gap-2 bg-[#f8f9fa] border border-[#e0e0e0] hover:bg-zinc-100 text-[#333] px-[16px] py-[12px] rounded-lg font-semibold w-full transition-all text-sm">
                    View All Quizzes
                </Link>
            </div>

            {/* Bottom Ad Banner Slot */}
            <div className="ad-slot bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-2xl text-zinc-400 font-bold uppercase tracking-widest text-xs shadow-inner mt-8">
                [ AD BANNER SLOT - BOTTOM (300x250) ]
            </div>
        </div>
    )
}
