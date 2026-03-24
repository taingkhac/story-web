'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Eye, Copy, Search, Filter } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Quiz } from '@/types'

export default function AdminQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [duplicating, setDuplicating] = useState<string | null>(null) // holds id of quiz being duplicated

    const supabase = createClient()

    async function fetchQuizzes() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('quizzes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setQuizzes(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching quizzes')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuizzes()
    }, [supabase])

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete the quiz "${title}"? This will also delete all questions, answers, and results associated with it.`)) return

        try {
            const { error } = await supabase.from('quizzes').delete().eq('id', id)
            if (error) throw error
            setQuizzes(quizzes.filter(q => q.id !== id))
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error deleting quiz')
        }
    }

    const handleDuplicate = async (quiz: Quiz) => {
        if (!confirm(`Are you sure you want to duplicate "${quiz.title}"?`)) return
        
        try {
            setDuplicating(quiz.id)
            const newSlug = quiz.slug + '-copy-' + Math.floor(Math.random() * 10000)
            
            // 1. Duplicate Quiz
            const { data: newQuiz, error: insertError } = await supabase.from('quizzes').insert({
                title: quiz.title + ' (Copy)',
                slug: newSlug,
                description: quiz.description,
                thumbnail_url: quiz.thumbnail_url,
                category: quiz.category,
                total_questions: quiz.total_questions,
                is_published: false,
                seo_title: quiz.seo_title,
                seo_description: quiz.seo_description
            }).select().single()

            if (insertError) throw insertError

            // 2. Duplicate Results
            const { data: results } = await supabase.from('quiz_results').select('*').eq('quiz_id', quiz.id)
            if (results && results.length > 0) {
                const newResults = results.map(({ id, ...rest }) => ({ ...rest, quiz_id: newQuiz.id }))
                await supabase.from('quiz_results').insert(newResults)
            }
            
            // 3. Duplicate Questions and their Answers
            const { data: questions } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quiz.id)
            if (questions && questions.length > 0) {
                for (const q of questions) {
                    const { data: newQ } = await supabase.from('quiz_questions').insert({
                        quiz_id: newQuiz.id,
                        question_text: q.question_text,
                        question_image_url: q.question_image_url,
                        question_order: q.question_order,
                        explanation: q.explanation
                    }).select().single()
                    
                    if (newQ) {
                        const { data: answers } = await supabase.from('quiz_answers').select('*').eq('question_id', q.id)
                        if (answers && answers.length > 0) {
                            const newAnswers = answers.map(({ id, ...rest }) => ({ ...rest, question_id: newQ.id }))
                            await supabase.from('quiz_answers').insert(newAnswers)
                        }
                    }
                }
            }

            await fetchQuizzes()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error duplicating quiz')
        } finally {
            setDuplicating(null)
        }
    }

    const filteredQuizzes = quizzes.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase())
        if (statusFilter === 'published') return matchesSearch && q.is_published
        if (statusFilter === 'draft') return matchesSearch && !q.is_published
        return matchesSearch
    })

    if (loading) return <LoadingSpinner text="Loading Quizzes..." />

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
                <Link
                    href="/admin/quizzes/new"
                    className="flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 transition-all font-bold uppercase tracking-widest"
                >
                    <Plus size={16} />
                    <span>New Quiz</span>
                </Link>
            </div>

            {error && (
                <div className="mb-6 rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                    {error}
                </div>
            )}

            {/* Filters and Search */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-md border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-zinc-500" size={18} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-md border border-zinc-800 bg-zinc-900 py-2.5 px-4 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none min-w-[140px]"
                    >
                        <option value="all">All Statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-300">
                        <tr>
                            <th className="px-6 py-4 font-medium">Title</th>
                            <th className="px-6 py-4 font-medium">Questions</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Views</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {filteredQuizzes.length > 0 ? (
                            filteredQuizzes.map((quiz) => (
                                <tr key={quiz.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white max-w-xs truncate">{quiz.title}</div>
                                        {quiz.category && <div className="text-xs text-zinc-500 mt-1">{quiz.category}</div>}
                                    </td>
                                    <td className="px-6 py-4">{quiz.total_questions}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${quiz.is_published
                                            ? 'bg-green-500/10 text-green-400'
                                            : 'bg-yellow-500/10 text-yellow-400'
                                            }`}>
                                            {quiz.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300 font-medium">{quiz.view_count.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-zinc-500">
                                        {new Date(quiz.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-5">
                                            {quiz.is_published && (
                                                <Link
                                                    href={`/quiz/${quiz.slug}`}
                                                    target="_blank"
                                                    className="text-zinc-400 hover:text-white transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleDuplicate(quiz)}
                                                disabled={duplicating === quiz.id}
                                                className={`text-indigo-400 hover:text-indigo-300 transition-colors ${duplicating === quiz.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title="Duplicate"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <Link
                                                href={`/admin/quizzes/${quiz.id}`}
                                                className="text-amber-400 hover:text-amber-300 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(quiz.id, quiz.title)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                    {searchQuery ? 'No quizzes found matching your criteria.' : 'No quizzes found. Create your first quiz!'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
