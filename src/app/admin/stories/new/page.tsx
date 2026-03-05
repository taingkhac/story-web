'use client'

import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    summary: z.string().optional(),
    category_id: z.string().min(1, "Category is required"),
})

type FormValues = z.infer<typeof formSchema>

type Category = {
    id: string
    name: string
}

export default function NewStoryPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    })

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase.from('categories').select('id, name').order('name')
            if (data) setCategories(data)
        }
        fetchCategories()
    }, [supabase])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

        const { data: uploadData, error } = await supabase.storage
            .from('story-covers')
            .upload(fileName, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('story-covers')
            .getPublicUrl(uploadData.path)

        return publicUrl
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            setUploading(true)
            setError(null)

            let cover_image_url = null
            if (imageFile) {
                cover_image_url = await uploadImage(imageFile)
            }

            const { error: dbError } = await supabase
                .from('stories')
                .insert([
                    {
                        title: data.title,
                        slug: data.slug,
                        summary: data.summary,
                        cover_image_url,
                        category_id: data.category_id,
                        is_published: false // Default to false
                    }
                ])

            if (dbError) throw dbError

            router.push('/admin')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'An error occurred during submission')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="max-w-2xl">
            <h1 className="mb-8 text-3xl font-bold tracking-tight">Create New Story</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Title</label>
                    <input
                        {...register("title")}
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="E.g. The Return of the King"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Category</label>
                    <select
                        {...register("category_id")}
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Select a category...</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Slug</label>
                    <input
                        {...register("slug")}
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="the-return-of-the-king"
                    />
                    {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Summary</label>
                    <textarea
                        {...register("summary")}
                        rows={4}
                        className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="A brief overview of the story..."
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-300">Cover Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-700"
                    />
                </div>

                {error && (
                    <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={uploading}
                    className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                >
                    {uploading ? 'Creating...' : 'Create Story'}
                </button>
            </form>
        </div>
    )
}
