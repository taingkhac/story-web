'use client'

import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
})

type FormValues = z.infer<typeof formSchema>

export default function CategoryFormPage({ params }: { params?: { id: string } }) {
    const isEdit = !!params?.id
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(isEdit)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    })

    useEffect(() => {
        if (isEdit && params?.id) {
            async function fetchCategory() {
                try {
                    const { data, error } = await supabase
                        .from('categories')
                        .select('*')
                        .eq('id', params!.id)
                        .single()

                    if (error) throw error
                    if (data) {
                        setValue('name', data.name)
                        setValue('slug', data.slug)
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Error loading category')
                } finally {
                    setLoading(false)
                }
            }
            fetchCategory()
        }
    }, [isEdit, params, supabase, setValue])

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            setSubmitting(true)
            setError(null)

            if (isEdit) {
                const { error } = await supabase
                    .from('categories')
                    .update({ name: data.name, slug: data.slug })
                    .eq('id', params!.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert([{ name: data.name, slug: data.slug }])
                if (error) throw error
            }

            router.push('/admin/categories')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving category')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-8 text-zinc-400 font-bold uppercase tracking-widest animate-pulse">Loading...</div>

    return (
        <div className="max-w-xl">
            <Link
                href="/admin/categories"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest"
            >
                <ChevronLeft size={14} />
                <span>Back to Categories</span>
            </Link>

            <h1 className="mb-8 text-3xl font-bold tracking-tight">
                {isEdit ? 'Edit Category' : 'Create New Category'}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Name</label>
                    <input
                        {...register("name")}
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="E.g. Fantasy"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Slug</label>
                    <input
                        {...register("slug")}
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                        placeholder="fantasy"
                    />
                    {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
                </div>

                {error && (
                    <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg hover:bg-blue-500 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                >
                    {submitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Category')}
                </button>
            </form>
        </div>
    )
}
