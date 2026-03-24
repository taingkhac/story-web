'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react'

type Answer = { id: string; answer_text: string; answer_image_url: string | null; is_correct: boolean; answer_order: number }
type Question = { id: string; question_text: string; question_image_url: string | null; explanation: string | null }
type Quiz = { id: string; title: string; slug: string; total_questions: number }

export default function QuestionClient({ quiz, question, answers, currentNumber }: { quiz: Quiz, question: Question, answers: Answer[], currentNumber: number }) {
    const router = useRouter()
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isClient, setIsClient] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    
    useEffect(() => { 
        setIsClient(true) 
        
        // Anti-cheat: prevent back button or skipping
        const highestQ = parseInt(sessionStorage.getItem(`quiz_highest_q_${quiz.id}`) || '1')
        
        if (currentNumber < highestQ) {
            router.replace(`/quiz/${quiz.slug}/question/${highestQ}`)
            return
        }
        if (currentNumber > highestQ) {
            router.replace(`/quiz/${quiz.slug}/question/${highestQ}`)
            return
        }

        // We are on the correct highest valid question
        // Prefetch next route
        if (currentNumber < quiz.total_questions) {
            router.prefetch(`/quiz/${quiz.slug}/question/${currentNumber + 1}`)
        } else {
            router.prefetch(`/quiz/${quiz.slug}/result`)
        }
    }, [currentNumber, quiz, router])

    const handleSelect = (ans: Answer) => {
        if (selectedId) return // Prevent multiple selections
        setSelectedId(ans.id)
        
        if (ans.is_correct) {
            const currentScore = parseInt(sessionStorage.getItem(`quiz_score_${quiz.id}`) || '0')
            sessionStorage.setItem(`quiz_score_${quiz.id}`, (currentScore + 1).toString())
        }
    }

    const nextQ = currentNumber + 1
    const nextRoute = currentNumber < quiz.total_questions ? `/quiz/${quiz.slug}/question/${nextQ}` : `/quiz/${quiz.slug}/result`

    const handleNextClick = () => {
        setIsNavigating(true)
        sessionStorage.setItem(`quiz_highest_q_${quiz.id}`, nextQ.toString())
    }

    const progressPercentage = (currentNumber / quiz.total_questions) * 100

    if (!isClient) return null // Prevent hydration mismatch on forms

    return (
        <div className="content-container py-8">
            {/* Top Ad Banner Slot */}
            <div className="ad-slot bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-2xl text-zinc-400 font-bold uppercase tracking-widest text-xs shadow-inner">
                [ AD BANNER SLOT - TOP (728x90) ]
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden mb-8">
                {/* Progress Bar */}
                <div className="bg-[#e0e0e0] h-[6px] w-full relative">
                    <div 
                        className="absolute top-0 left-0 h-full bg-blue-600 rounded-r-[3px] transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                
                <div className="p-4 sm:p-6 lg:p-10">
                    <div className="flex items-center justify-between mb-4 sm:mb-8">
                        <span className="text-meta uppercase font-bold tracking-widest text-[10px] sm:text-[13px]">Question {currentNumber} of {quiz.total_questions}</span>
                    </div>

                    <h2 className="text-[17px] sm:text-[20px] lg:text-[22px] font-bold text-[#111] mb-4 lg:mb-8 leading-snug">
                        {question.question_text}
                    </h2>

                    {question.question_image_url && (
                        <div className="relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-8 bg-zinc-100">
                            <Image 
                                src={question.question_image_url} 
                                alt="Question Image" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                    )}

                    <div className="mb-4 sm:mb-8">
                        {answers.map((ans) => {
                            const isSelected = selectedId === ans.id
                            const isCorrect = ans.is_correct
                            const showCorrectness = selectedId !== null

                            let btnStateClass = 'border-[#e0e0e0] bg-white hover:border-blue-600 hover:bg-[#f0f4ff] text-[#333]'
                            
                            if (showCorrectness) {
                                if (isCorrect) {
                                    btnStateClass = 'border-green-600 bg-green-100 text-green-900'
                                } else if (isSelected && !isCorrect) {
                                    btnStateClass = 'border-red-600 bg-red-50 text-red-900'
                                } else {
                                    btnStateClass = 'border-[#e0e0e0] bg-white opacity-50 text-[#888] cursor-not-allowed'
                                }
                            }

                            return (
                                <button
                                    key={ans.id}
                                    onClick={() => handleSelect(ans)}
                                    disabled={selectedId !== null}
                                    className={`w-full text-left px-[12px] py-[10px] sm:px-[16px] sm:py-[14px] mb-[8px] min-h-[44px] sm:min-h-[48px] rounded-[10px] border-2 transition-all duration-200 ease font-normal text-[14px] sm:text-[16px] flex items-center justify-between ${btnStateClass}`}
                                >
                                    <span>{ans.answer_text}</span>
                                    {showCorrectness && isCorrect && <CheckCircle2 className="text-green-600 shrink-0 ml-2" />}
                                    {showCorrectness && isSelected && !isCorrect && <XCircle className="text-red-600 shrink-0 ml-2" />}
                                </button>
                            )
                        })}
                    </div>

                    {selectedId && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {question.explanation && (
                                <div className="bg-[#f8f9fa] border-l-[3px] border-l-blue-600 rounded-lg px-3 py-2 sm:px-4 sm:py-3 mb-[16px] sm:mb-[24px] flex gap-2 sm:gap-3 animate-in fade-in zoom-in-95 duration-300">
                                    <Lightbulb className="text-blue-600 shrink-0 mt-0.5" size={16} />
                                    <div className="text-[#333] text-[13px] sm:text-[14px] leading-relaxed">
                                        {question.explanation}
                                    </div>
                                </div>
                            )}

                            <Link
                                href={nextRoute}
                                onClick={handleNextClick}
                                className={`w-full p-[14px] sm:p-[16px] flex items-center justify-center gap-2 rounded-[10px] font-semibold text-[15px] sm:text-[16px] transition-all ${isNavigating ? 'bg-blue-400 text-white cursor-wait pointer-events-none' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            >
                                {isNavigating ? 'Loading...' : (currentNumber < quiz.total_questions ? 'Next Question' : 'See Results')}
                                {!isNavigating && <ArrowRight size={18} />}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Ad Banner Slot */}
            <div className="ad-slot bg-zinc-100 border-2 border-dashed border-zinc-300 rounded-2xl text-zinc-400 font-bold uppercase tracking-widest text-xs shadow-inner">
                [ AD BANNER SLOT - BOTTOM (300x250) ]
            </div>
        </div>
    )
}
