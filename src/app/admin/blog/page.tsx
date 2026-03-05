'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'

type BlogPost = {
    id: string
    title: string
    slug: string
    is_published: boolean
    created_at: string
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    async function fetchPosts() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('blog_posts')
                .select('id, title, slug, is_published, created_at')
                .order('created_at', { ascending: false })

            if (error) throw error
            setPosts(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching blog posts')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [supabase])

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete the blog post "${title}"?`)) return

        try {
            const { error } = await supabase.from('blog_posts').delete().eq('id', id)
            if (error) throw error
            setPosts(posts.filter(p => p.id !== id))
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error deleting post')
        }
    }

    if (loading) return <div className="p-8 text-zinc-400 font-bold uppercase tracking-widest animate-pulse">Loading Blog Posts...</div>

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all font-bold uppercase tracking-widest"
                >
                    <Plus size={16} />
                    <span>New Post</span>
                </Link>
            </div>

            {error && (
                <div className="mb-6 rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                    {error}
                </div>
            )}

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-300">
                        <tr>
                            <th className="px-6 py-4 font-medium">Title</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white max-w-xs truncate">{post.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${post.is_published
                                            ? 'bg-green-500/10 text-green-400'
                                            : 'bg-yellow-500/10 text-yellow-400'
                                            }`}>
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-zinc-500">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-5">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="text-zinc-400 hover:text-white transition-colors"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                href={`/admin/blog/${post.id}/edit`}
                                                className="text-amber-400 hover:text-amber-300 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id, post.title)}
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
                                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                    No blog posts found. Write your first post!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
