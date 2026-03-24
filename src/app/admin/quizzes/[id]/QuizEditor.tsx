'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Upload, Plus, Trash2, GripVertical, Check, HelpCircle, Trophy, Settings } from 'lucide-react'
import Image from 'next/image'
import LoadingSpinner from '@/components/LoadingSpinner'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

// Generate a pseudo-random temp ID for new items before saving
const generateTempId = () => 'temp_' + Math.random().toString(36).substr(2, 9)

type Answer = { id: string; text: string; is_correct: boolean; order: number }
type Question = { id: string; text: string; image_url: string | null; explanation: string | null; order: number; answers: Answer[] }
type ResultTier = { id: string; title: string; min_score: number; max_score: number; description: string | null; image_url: string | null; share_text: string | null }
type QuizBasic = { title: string; slug: string; description: string | null; category: string | null; thumbnail_url: string | null; seo_title: string | null; seo_description: string | null; is_published: boolean; related_story_id: string | null }

export default function QuizEditor({ quizId }: { quizId?: string }) {
    const isEdit = quizId !== 'new'
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(isEdit)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'basic' | 'questions' | 'results'>('basic')

    // Form States
    const [basic, setBasic] = useState<QuizBasic>({
        title: '', slug: '', description: '', category: '', thumbnail_url: null, seo_title: '', seo_description: '', is_published: false, related_story_id: null
    })
    const [questions, setQuestions] = useState<Question[]>([])
    const [results, setResults] = useState<ResultTier[]>([])
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [stories, setStories] = useState<{ id: string, title: string }[]>([])

    useEffect(() => {
        if (!isEdit) return

        const fetchQuiz = async () => {
            try {
                // Fetch basic quiz
                const { data: qData, error: qErr } = await supabase.from('quizzes').select('*').eq('id', quizId).single()
                if (qErr) throw qErr
                
                if (qData) {
                    setBasic({
                        title: qData.title, slug: qData.slug, description: qData.description, category: qData.category,
                        thumbnail_url: qData.thumbnail_url, seo_title: qData.seo_title, seo_description: qData.seo_description, is_published: qData.is_published, related_story_id: qData.related_story_id
                    })
                }

                // Fetch questions & answers
                const { data: questionsData, error: questsErr } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizId).order('question_order', { ascending: true })
                if (questsErr) throw questsErr

                const { data: answersData, error: ansErr } = await supabase.from('quiz_answers').select('*').in('question_id', questionsData.map(q => q.id)).order('answer_order', { ascending: true })
                if (ansErr) throw ansErr

                const formattedQuestions = questionsData.map(q => ({
                    id: q.id,
                    text: q.question_text,
                    image_url: q.question_image_url,
                    explanation: q.explanation,
                    order: q.question_order,
                    answers: answersData.filter(a => a.question_id === q.id).map(a => ({
                        id: a.id,
                        text: a.answer_text,
                        is_correct: a.is_correct,
                        order: a.answer_order
                    }))
                }))
                setQuestions(formattedQuestions)

                // Fetch results
                const { data: resultsData, error: resErr } = await supabase.from('quiz_results').select('*').eq('quiz_id', quizId).order('min_score', { ascending: true })
                if (resErr) throw resErr
                
                setResults(resultsData.map(r => ({
                    id: r.id, title: r.result_title, min_score: r.min_score, max_score: r.max_score,
                    description: r.result_description, image_url: r.result_image_url, share_text: r.share_text
                })))

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error loading quiz')
            } finally {
                setLoading(false)
            }
        }

        const fetchStories = async () => {
            const { data } = await supabase.from('stories').select('id, title').order('created_at', { ascending: false })
            if (data) setStories(data)
        }

        fetchQuiz()
        fetchStories()
    }, [isEdit, quizId, supabase])

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `quiz_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const { data: uploadData, error } = await supabase.storage.from('story-covers').upload(fileName, file)
        if (error) throw error
        const { data: { publicUrl } } = supabase.storage.from('story-covers').getPublicUrl(uploadData.path)
        return publicUrl
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            setError(null)

            // Validate
            if (!basic.title || !basic.slug) throw new Error("Title and Slug are required.")
            if (questions.length === 0) throw new Error("At least one question is required.")
            for (const q of questions) {
                if (!q.text) throw new Error("All questions must have text.")
                if (q.answers.length !== 4) throw new Error(`Question "${q.text || 'Untitled'}" must have exactly 4 answers.`)
                if (!q.answers.some(a => a.is_correct)) throw new Error(`Question "${q.text || 'Untitled'}" must have 1 correct answer.`)
            }

            let finalThumbnail = basic.thumbnail_url
            if (thumbnailFile) {
                finalThumbnail = await uploadImage(thumbnailFile)
            }

            const quizPayload = {
                title: basic.title, slug: basic.slug, description: basic.description, category: basic.category,
                thumbnail_url: finalThumbnail, seo_title: basic.seo_title, seo_description: basic.seo_description,
                is_published: basic.is_published, total_questions: questions.length, related_story_id: basic.related_story_id
            }

            let finalQuizId = quizId
            if (isEdit) {
                const { error } = await supabase.from('quizzes').update(quizPayload).eq('id', quizId)
                if (error) throw error
            } else {
                const { data, error } = await supabase.from('quizzes').insert([quizPayload]).select().single()
                if (error) throw error
                finalQuizId = data.id
            }

            // Sync Questions (brute force sync: delete all and reinsert since standard relation sync is tricky without ORM)
            // Note: In production we'd want to upsert and delete missing to preserve IDs, 
            // but for simplicity we will delete existing and insert new on edit if the user modifies them heavily.
            // Better approach: Upsert questions. Find missing and delete them.
            
            // Delete missing questions
            if (isEdit) {
                const qIds = questions.filter(q => !q.id.startsWith('temp_')).map(q => q.id)
                await supabase.from('quiz_questions').delete().eq('quiz_id', finalQuizId).not('id', 'in', `(${qIds.join(',')})`)
            }

            // Upsert Questions & Answers
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i]
                const qPayload = {
                    quiz_id: finalQuizId, question_text: q.text, question_image_url: q.image_url,
                    question_order: i, explanation: q.explanation
                }

                let finalQId = q.id
                if (q.id.startsWith('temp_')) {
                    const { data: newQ, error: qErr } = await supabase.from('quiz_questions').insert([qPayload]).select().single()
                    if (qErr) throw qErr
                    finalQId = newQ.id
                } else {
                    const { error: qErr } = await supabase.from('quiz_questions').update(qPayload).eq('id', q.id)
                    if (qErr) throw qErr
                }

                // Delete missing answers for this question
                if (isEdit && !q.id.startsWith('temp_')) {
                    const aIds = q.answers.filter(a => !a.id.startsWith('temp_')).map(a => a.id)
                    await supabase.from('quiz_answers').delete().eq('question_id', finalQId).not('id', 'in', `(${aIds.length > 0 ? aIds.join(',') : 'uuid-00000000-0000-0000-0000-000000000000'})`)
                }

                // Upsert Answers
                for (let j = 0; j < q.answers.length; j++) {
                    const a = q.answers[j]
                    const aPayload = {
                        question_id: finalQId, answer_text: a.text, answer_image_url: null,
                        is_correct: a.is_correct, answer_order: j
                    }
                    if (a.id.startsWith('temp_')) {
                        await supabase.from('quiz_answers').insert([aPayload])
                    } else {
                        await supabase.from('quiz_answers').update(aPayload).eq('id', a.id)
                    }
                }
            }

            // Sync Results
            if (isEdit) {
                const rIds = results.filter(r => !r.id.startsWith('temp_')).map(r => r.id)
                await supabase.from('quiz_results').delete().eq('quiz_id', finalQuizId).not('id', 'in', `(${rIds.length > 0 ? rIds.join(',') : 'uuid-00000000-0000-0000-0000-000000000000'})`)
            }
            
            for (const r of results) {
                const rPayload = {
                    quiz_id: finalQuizId, result_title: r.title, min_score: r.min_score, max_score: r.max_score,
                    result_description: r.description, result_image_url: r.image_url, share_text: r.share_text
                }
                if (r.id.startsWith('temp_')) {
                    await supabase.from('quiz_results').insert([rPayload])
                } else {
                    await supabase.from('quiz_results').update(rPayload).eq('id', r.id)
                }
            }

            router.push('/admin/quizzes')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving quiz')
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } finally {
            setSaving(false)
        }
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return
        const newQuestions = Array.from(questions)
        const [reorderedItem] = newQuestions.splice(result.source.index, 1)
        newQuestions.splice(result.destination.index, 0, reorderedItem)
        setQuestions(newQuestions)
    }

    const addQuestion = () => {
        setQuestions([...questions, {
            id: generateTempId(),
            text: '', image_url: null, explanation: '', order: questions.length,
            answers: Array(4).fill(null).map((_, i) => ({ id: generateTempId(), text: '', is_correct: i === 0, order: i }))
        }])
    }

    const addResultTier = () => {
        setResults([...results, {
            id: generateTempId(), title: '', min_score: 0, max_score: 0, description: '', image_url: null, share_text: ''
        }])
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <Link href="/admin/quizzes" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                    <ChevronLeft size={14} />
                    <span>Back to Quizzes</span>
                </Link>
                <div className="flex gap-4">
                    {isEdit && (
                        <Link href={`/quiz/${basic.slug}`} target="_blank" className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-bold uppercase tracking-widest text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all">
                            Preview
                        </Link>
                    )}
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-xl hover:bg-teal-500 disabled:opacity-50 transition-all hover:scale-[1.02]">
                        {saving && <LoadingSpinner size={16} text="" />}
                        <span>{saving ? 'Saving...' : 'Save Quiz'}</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{isEdit ? 'Edit Quiz' : 'Create New Quiz'}</h1>
                <div className="flex items-center gap-3 p-3 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-inner">
                    <input
                        type="checkbox"
                        id="is_published"
                        checked={basic.is_published}
                        onChange={e => setBasic({ ...basic, is_published: e.target.checked })}
                        className="h-5 w-5 rounded border-zinc-700 bg-zinc-950 text-teal-600 focus:ring-teal-500"
                    />
                    <label htmlFor="is_published" className="text-sm font-bold text-zinc-300 uppercase tracking-widest cursor-pointer pr-2">
                        Published
                    </label>
                </div>
            </div>

            {error && (
                <div className="mb-8 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 font-bold">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-1 p-1 bg-zinc-900 rounded-2xl border border-zinc-800 mb-8 w-fit">
                <button onClick={() => setActiveTab('basic')} className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'basic' ? 'bg-zinc-800 text-teal-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    <Settings size={16} /> Basic Info
                </button>
                <button onClick={() => setActiveTab('questions')} className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'questions' ? 'bg-zinc-800 text-teal-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    <HelpCircle size={16} /> Questions ({questions.length})
                </button>
                <button onClick={() => setActiveTab('results')} className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'results' ? 'bg-zinc-800 text-teal-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    <Trophy size={16} /> Results Tiers ({results.length})
                </button>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                {activeTab === 'basic' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Title</label>
                                <input value={basic.title} onChange={e => {
                                    setBasic({ ...basic, title: e.target.value, slug: isEdit ? basic.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })
                                }} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-bold" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Slug</label>
                                <input value={basic.slug} onChange={e => setBasic({ ...basic, slug: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-mono text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Description</label>
                            <textarea value={basic.description || ''} onChange={e => setBasic({ ...basic, description: e.target.value })} rows={3} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Category</label>
                                <input value={basic.category || ''} onChange={e => setBasic({ ...basic, category: e.target.value })} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" />
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Thumbnail Cover</label>
                                <div className="flex items-center gap-4">
                                    {(basic.thumbnail_url || thumbnailFile) && (
                                        <div className="h-12 w-20 relative rounded bg-zinc-800 overflow-hidden">
                                           {thumbnailFile ? <div className="absolute inset-0 bg-teal-500/20 flex items-center justify-center text-xs font-bold text-teal-400">NEW</div> : <Image src={basic.thumbnail_url!} alt="Thumb" fill className="object-cover" />}
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] || null)} className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-teal-400 hover:file:bg-zinc-700 transition-all cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-800">
                            <h3 className="text-lg font-bold mb-4">SEO Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">SEO Title</label>
                                    <input value={basic.seo_title || ''} onChange={e => setBasic({ ...basic, seo_title: e.target.value })} placeholder="Defaults to Title" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">SEO Description</label>
                                    <input value={basic.seo_description || ''} onChange={e => setBasic({ ...basic, seo_description: e.target.value })} placeholder="Defaults to Description" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Related Story (Cross-Linking)</label>
                                <select 
                                    value={basic.related_story_id || ''} 
                                    onChange={e => setBasic({ ...basic, related_story_id: e.target.value || null })} 
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-teal-500 transition-all"
                                >
                                    <option value="">None (Standalone Quiz)</option>
                                    {stories.map(s => (
                                        <option key={s.id} value={s.id}>{s.title}</option>
                                    ))}
                                </select>
                                <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Connects to Dive Deeper components automatically</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div className="space-y-6">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="questions-list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                                        {questions.map((q, index) => (
                                            <Draggable key={q.id} draggableId={q.id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-lg border-l-4 border-l-zinc-700">
                                                        <div className="flex bg-zinc-900 border-b border-zinc-800 p-4 items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div {...provided.dragHandleProps} className="text-zinc-500 hover:text-white cursor-grab active:cursor-grabbing p-1">
                                                                    <GripVertical size={20} />
                                                                </div>
                                                                <h3 className="font-bold">Question {index + 1}</h3>
                                                            </div>
                                                            <button onClick={() => setQuestions(questions.filter(qu => qu.id !== q.id))} className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        <div className="p-6 space-y-6">
                                                            <textarea
                                                                value={q.text}
                                                                onChange={e => {
                                                                    const n = [...questions]; n[index].text = e.target.value; setQuestions(n)
                                                                }}
                                                                placeholder="Ask something interesting..."
                                                                rows={2}
                                                                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-lg font-medium"
                                                            />
                                                            
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {q.answers.map((ans, aIdx) => (
                                                                    <div key={ans.id} className={`flex items-center gap-3 p-3 rounded-xl border ${ans.is_correct ? 'border-teal-500/50 bg-teal-500/5' : 'border-zinc-800 bg-zinc-900'} transition-all`}>
                                                                        <input
                                                                            type="radio"
                                                                            name={`correct_${q.id}`}
                                                                            checked={ans.is_correct}
                                                                            onChange={() => {
                                                                                const n = [...questions];
                                                                                n[index].answers.forEach(a => a.is_correct = false);
                                                                                n[index].answers[aIdx].is_correct = true;
                                                                                setQuestions(n)
                                                                            }}
                                                                            className="h-5 w-5 text-teal-600 focus:ring-teal-500 bg-zinc-800 border-zinc-600 cursor-pointer shrink-0"
                                                                        />
                                                                        <input
                                                                            value={ans.text}
                                                                            onChange={e => {
                                                                                const n = [...questions]; n[index].answers[aIdx].text = e.target.value; setQuestions(n)
                                                                            }}
                                                                            placeholder={`Answer ${aIdx + 1}`}
                                                                            className="w-full bg-transparent border-none focus:outline-none text-sm font-medium"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <div className="pt-4 border-t border-zinc-800">
                                                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Explanation (Shown after answering)</label>
                                                                <textarea
                                                                    value={q.explanation || ''}
                                                                    onChange={e => {
                                                                        const n = [...questions]; n[index].explanation = e.target.value; setQuestions(n)
                                                                    }}
                                                                    rows={2}
                                                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-zinc-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-sm"
                                                                    placeholder="Why is it the correct answer?"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        <button onClick={addQuestion} className="w-full py-6 rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all flex flex-col items-center justify-center gap-2 font-bold uppercase tracking-widest">
                            <Plus size={24} />
                            <span>Add New Question</span>
                        </button>
                    </div>
                )}

                {activeTab === 'results' && (
                    <div className="space-y-6">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-sm text-zinc-400 mb-8 flex items-center gap-3">
                            <Trophy className="text-amber-500" size={24} />
                            <p>Result tiers determine what message the user sees based on their total score. Set the <strong>Min</strong> and <strong>Max</strong> bounds covering all possible scores from 0 to {questions.length || 'total'}.</p>
                        </div>

                        {results.map((r, index) => (
                            <div key={r.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col md:flex-row gap-6">
                                <div className="md:w-1/4 flex flex-col gap-4">
                                    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Score Range</label>
                                        <div className="flex items-center gap-2">
                                            <input type="number" min="0" value={r.min_score} onChange={e => {
                                                const n = [...results]; n[index].min_score = parseInt(e.target.value) || 0; setResults(n)
                                            }} className="w-full rounded-lg bg-zinc-950 border border-zinc-700 p-2 text-center focus:border-teal-500 outline-none" />
                                            <span className="text-zinc-600 font-bold">to</span>
                                            <input type="number" min="0" value={r.max_score} onChange={e => {
                                                const n = [...results]; n[index].max_score = parseInt(e.target.value) || 0; setResults(n)
                                            }} className="w-full rounded-lg bg-zinc-950 border border-zinc-700 p-2 text-center focus:border-teal-500 outline-none" />
                                        </div>
                                    </div>
                                    <button onClick={() => setResults(results.filter(res => res.id !== r.id))} className="text-xs text-red-500 hover:text-red-400 mt-auto flex items-center gap-1 font-bold uppercase">
                                        <Trash2 size={12} /> Remove Tier
                                    </button>
                                </div>
                                <div className="md:w-3/4 space-y-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-zinc-400">Result Title</label>
                                        <input value={r.title} onChange={e => {
                                            const n = [...results]; n[index].title = e.target.value; setResults(n)
                                        }} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-white focus:border-teal-500 transition-all font-bold text-lg" placeholder="e.g., Novice Explorer" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-zinc-400">Description</label>
                                        <textarea value={r.description || ''} onChange={e => {
                                            const n = [...results]; n[index].description = e.target.value; setResults(n)
                                        }} rows={2} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-zinc-300 focus:border-teal-500 transition-all text-sm" placeholder="You did okay, but..." />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-zinc-400">Share Text (For Social Media)</label>
                                        <input value={r.share_text || ''} onChange={e => {
                                            const n = [...results]; n[index].share_text = e.target.value; setResults(n)
                                        }} className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-white focus:border-teal-500 transition-all text-sm" placeholder="I got Novice on this quiz! Try your luck!" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button onClick={addResultTier} className="w-full py-4 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-teal-400 hover:border-teal-500/50 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
                            <Plus size={18} /> Add Result Tier
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
