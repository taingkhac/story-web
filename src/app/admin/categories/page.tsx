'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

type Category = {
    id: string
    name: string
    slug: string
    created_at: string
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    async function fetchCategories() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name')

            if (error) throw error
            setCategories(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching categories')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [supabase])

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return

        try {
            const { error } = await supabase.from('categories').delete().eq('id', id)
            if (error) throw error
            setCategories(categories.filter(c => c.id !== id))
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Error deleting category')
        }
    }

    if (loading) return <LoadingSpinner text="Loading Categories..." />

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <Link
                    href="/admin/categories/new"
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all"
                >
                    <Plus size={16} />
                    <span>New Category</span>
                </Link>
            </div>

            {error && (
                <div className="mb-6 rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                    {error}
                </div>
            )}

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-300">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Slug</th>
                            <th className="px-6 py-4 font-medium">Created At</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-zinc-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{category.name}</td>
                                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{category.slug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(category.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-4">
                                            <Link
                                                href={`/admin/categories/${category.id}/edit`}
                                                className="text-amber-400 hover:text-amber-300 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(category.id, category.name)}
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
                                    No categories found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
