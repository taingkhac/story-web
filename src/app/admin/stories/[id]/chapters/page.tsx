'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Plus, Edit2, Trash2, ChevronLeft } from 'lucide-react'

type Chapter = {
    id: string
    title: string
    chapter_number: number
    created_at: string
}

type Story = {
    id: string
    title: string
}

export default function ChaptersPage({ params }: { params: { id: string } }) {
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [story, setStory] = useState<Story | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const fetchChapters = useCallback(async () => {
        try {
            setLoading(true)

            // Fetch story info
            const { data: storyData } = await supabase
                .from('stories')
                .select('id, title')
                .eq('id', params.id)
                .single()
            setStory(storyData)

            // Fetch chapters
            const { data, error } = await supabase
                .from('chapters')
                .select('id, title, chapter_number, created_at')
                .eq('story_id', params.id)
                .order('chapter_number', { ascending: true })

            if (error) throw error
            setChapters(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching chapters')
        } finally {
            setLoading(false)
        }
    }, [supabase, params.id])

    useEffect(() => {
        fetchChapters()
    }, [fetchChapters])

    const handleDelete = async (id: string, number: number) => {
        if (!confirm(`Are you sure you want to delete Chapter ${number}?`)) return

        try {
            const { error } = await supabase.from('chapters').delete().eq('id', id)
            if (error) throw error
            setChapters(chapters.filter(c => c.id !== id))
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error deleting chapter')
        }
    }

    if (loading) return <div className="p-8 text-zinc-400 font-bold uppercase tracking-widest animate-pulse">Loading Chapters...</div>

    return (
        <div>
            <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest"
            >
                <ChevronLeft size={14} />
                <span>Back to Stories</span>
            </Link>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{story?.title}</h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-1">Manage Chapters</p>
                </div>
                <Link
                    href={`/admin/stories/${params.id}/chapters/new`}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-lg"
                >
                    <Plus size={18} />
                    <span>Add Chapter</span>
                </Link>
            </div>

            {error && (
                <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 font-bold">
                    {error}
                </div>
            )}

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-950/50 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                        <tr>
                            <th className="px-8 py-5">#</th>
                            <th className="px-8 py-5">Title</th>
                            <th className="px-8 py-5">Date</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {chapters.length > 0 ? (
                            chapters.map((chapter) => (
                                <tr key={chapter.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-8 py-5 font-mono text-blue-500 font-bold">
                                        {chapter.chapter_number.toString().padStart(2, '0')}
                                    </td>
                                    <td className="px-8 py-5 font-bold text-white uppercase tracking-wider text-xs">
                                        {chapter.title}
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap text-zinc-500 text-xs">
                                        {new Date(chapter.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-5">
                                            <Link
                                                href={`/admin/stories/${params.id}/chapters/${chapter.id}/edit`}
                                                className="text-amber-400 hover:text-amber-300 transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(chapter.id, chapter.chapter_number)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-8 py-12 text-center text-zinc-500 font-bold uppercase tracking-widest italic text-xs">
                                    No chapters yet. Let the story begin!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
