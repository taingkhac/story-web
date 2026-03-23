'use client'

import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Upload } from 'lucide-react'
import Image from 'next/image'
import LoadingSpinner from '@/components/LoadingSpinner'

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    excerpt: z.string().min(1, "Excerpt is required"),
    content: z.string().min(1, "Content is required"),
    author_name: z.string().min(1, "Author name is required"),
    is_published: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export default function BlogFormPage({ params }: { params?: { id: string } }) {
    const isEdit = !!params?.id
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(isEdit)
    const [error, setError] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            author_name: 'NovaLore Team',
            is_published: false
        }
    })

    useEffect(() => {
        if (isEdit && params?.id) {
            const fetchPost = async () => {
                try {
                    const { data, error } = await supabase
                        .from('blog_posts')
                        .select('*')
                        .eq('id', params!.id)
                        .single()

                    if (error) throw error
                    if (data) {
                        setValue('title', data.title)
                        setValue('slug', data.slug)
                        setValue('excerpt', data.excerpt)
                        setValue('content', data.content)
                        setValue('author_name', data.author_name)
                        setValue('is_published', data.is_published)
                        setCurrentImage(data.cover_image_url)
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Error loading post')
                } finally {
                    setLoading(false)
                }
            }
            fetchPost()
        }
    }, [isEdit, params, supabase, setValue])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0])
        }
    }

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `blog_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

        const { data: uploadData, error } = await supabase.storage
            .from('story-covers') // Reusing same bucket for now or use 'blog-images' if exists
            .upload(fileName, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('story-covers')
            .getPublicUrl(uploadData.path)

        return publicUrl
    }

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            setSubmitting(true)
            setError(null)

            let cover_image_url = currentImage
            if (imageFile) {
                cover_image_url = await uploadImage(imageFile)
            }

            const payload = {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                author_name: data.author_name,
                is_published: data.is_published,
                cover_image_url
            }

            if (isEdit) {
                const { error } = await supabase
                    .from('blog_posts')
                    .update(payload)
                    .eq('id', params!.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('blog_posts')
                    .insert([payload])
                if (error) throw error
            }

            router.push('/admin/blog')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving blog post')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="max-w-4xl">
            <Link
                href="/admin/blog"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest"
            >
                <ChevronLeft size={14} />
                <span>Back to Blog Posts</span>
            </Link>

            <h1 className="mb-8 text-3xl font-bold tracking-tight">
                {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Title</label>
                        <input
                            {...register("title")}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold"
                            placeholder="Post Title"
                        />
                        {errors.title && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Slug</label>
                        <input
                            {...register("slug")}
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                            placeholder="post-url-slug"
                        />
                        {errors.slug && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.slug.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Excerpt</label>
                    <textarea
                        {...register("excerpt")}
                        rows={2}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="A short summary for the listing page..."
                    />
                    {errors.excerpt && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.excerpt.message}</p>}
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Content</label>
                    <textarea
                        {...register("content")}
                        rows={12}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-zinc-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium leading-relaxed"
                        placeholder="Write your story here..."
                    />
                    {errors.content && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.content.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Cover Image</label>
                        <div className="flex flex-col gap-4">
                            {currentImage && (
                                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-lg">
                                    <Image src={currentImage} alt="Current" fill className="object-cover" />
                                </div>
                            )}
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-zinc-700 bg-zinc-950 group-hover:border-blue-500 transition-colors">
                                    <Upload size={18} className="text-zinc-500 group-hover:text-blue-500" />
                                    <span className="text-sm font-bold text-zinc-400 group-hover:text-blue-500 uppercase tracking-widest">
                                        {imageFile ? imageFile.name : 'Upload New Image'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-400">Author</label>
                            <input
                                {...register("author_name")}
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold"
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-inner">
                            <input
                                type="checkbox"
                                id="is_published"
                                {...register("is_published")}
                                className="h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="is_published" className="text-sm font-bold text-zinc-300 uppercase tracking-widest cursor-pointer">
                                Publish Post
                            </label>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 font-bold">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-zinc-800">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 rounded-xl bg-zinc-800 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-zinc-700 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-xl hover:bg-blue-500 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {submitting && <LoadingSpinner size={16} text="" />}
                        <span>{submitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Post')}</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
