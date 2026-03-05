'use client'

import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Upload, Film } from 'lucide-react'
import Image from 'next/image'

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    chapter_number: z.number().int().min(1, "Must be at least 1"),
    content: z.string().min(1, "Content is required"),
})

type FormValues = z.infer<typeof formSchema>

export default function ChapterFormPage({ params }: { params: { id: string, chapterId?: string } }) {
    const isEdit = !!params.chapterId
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(isEdit)
    const [error, setError] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [currentVideo, setCurrentVideo] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema)
    })

    useEffect(() => {
        if (isEdit && params.chapterId) {
            async function fetchChapter() {
                try {
                    const { data, error } = await supabase
                        .from('chapters')
                        .select('*')
                        .eq('id', params.chapterId!)
                        .single()

                    if (error) throw error
                    if (data) {
                        setValue('title', data.title)
                        setValue('chapter_number', data.chapter_number)
                        setValue('content', data.content)
                        setCurrentImage(data.image_url)
                        setCurrentVideo(data.ai_video_url)
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Error loading chapter')
                } finally {
                    setLoading(false)
                }
            }
            fetchChapter()
        } else {
            // Suggest next chapter number
            async function suggestNumber() {
                const { data } = await supabase
                    .from('chapters')
                    .select('chapter_number')
                    .eq('story_id', params.id)
                    .order('chapter_number', { ascending: false })
                    .limit(1)

                const nextNum = data && data.length > 0 ? data[0].chapter_number + 1 : 1
                setValue('chapter_number', nextNum)
            }
            suggestNumber()
        }
    }, [isEdit, params, supabase, setValue])

    const uploadFile = async (file: File, folder: string): Promise<string> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${folder}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

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
            setSubmitting(true)
            setError(null)

            let image_url = currentImage
            if (imageFile) {
                image_url = await uploadFile(imageFile, 'chapter_img')
            }

            let ai_video_url = currentVideo
            if (videoFile) {
                ai_video_url = await uploadFile(videoFile, 'chapter_vid')
            }

            const payload = {
                story_id: params.id,
                title: data.title,
                chapter_number: data.chapter_number,
                content: data.content,
                image_url,
                ai_video_url
            }

            if (isEdit) {
                const { error } = await supabase
                    .from('chapters')
                    .update(payload)
                    .eq('id', params.chapterId!)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('chapters')
                    .insert([payload])
                if (error) throw error
            }

            router.push(`/admin/stories/${params.id}/chapters`)
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving chapter')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-8 text-zinc-400 font-bold uppercase tracking-widest animate-pulse">Loading...</div>

    return (
        <div className="max-w-4xl">
            <Link
                href={`/admin/stories/${params.id}/chapters`}
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest"
            >
                <ChevronLeft size={14} />
                <span>Back to Chapters</span>
            </Link>

            <h1 className="mb-8 text-3xl font-bold tracking-tight">
                {isEdit ? 'Edit Chapter' : 'Add New Chapter'}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-10 shadow-3xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Number</label>
                        <input
                            type="number"
                            {...register("chapter_number", { valueAsNumber: true })}
                            className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-center text-blue-500 font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.chapter_number && <p className="mt-1 text-[10px] text-red-500 font-bold">{errors.chapter_number.message}</p>}
                    </div>

                    <div className="md:col-span-3">
                        <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Chapter Title</label>
                        <input
                            {...register("title")}
                            className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-4 text-white font-bold tracking-wider placeholder:text-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="The Forbidden Knowledge..."
                        />
                        {errors.title && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.title.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-zinc-500">Story Content</label>
                    <textarea
                        {...register("content")}
                        rows={15}
                        className="w-full rounded-3xl border border-zinc-700 bg-zinc-950 p-6 text-zinc-200 leading-relaxed font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Once upon a time..."
                    />
                    {errors.content && <p className="mt-1 text-[10px] text-red-500 font-bold uppercase">{errors.content.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Visual Art (Image)</label>
                        {currentImage && (
                            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-zinc-800">
                                <Image src={currentImage} alt="Cover" fill className="object-cover" />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                            className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500">Immersive Experience (AI Video)</label>
                        {currentVideo && (
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                                <video src={currentVideo} controls className="w-full h-full" />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => e.target.files && setVideoFile(e.target.files[0])}
                            className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                        />
                    </div>
                </div>

                {error && (
                    <div className="rounded-2xl bg-red-500/10 p-5 text-sm font-bold text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 pt-10 border-t border-zinc-800">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 rounded-2xl bg-zinc-800 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-zinc-700 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-2xl hover:bg-blue-500 disabled:opacity-50 transition-all"
                    >
                        {submitting ? 'Saving...' : (isEdit ? 'Save Chapter' : 'Add Chapter')}
                    </button>
                </div>
            </form>
        </div>
    )
}
