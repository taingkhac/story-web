import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import NextImage from 'next/image'
import { ChevronLeft, ChevronRight, List } from 'lucide-react'
import Header from '@/components/Header'
import RelatedQuiz from '@/components/RelatedQuiz'
import QuizPromo from '@/components/QuizPromo'

import { Category } from '@/types'

interface Props {
    params: { slug: string; chapterNumber: string }
}

export default async function ChapterPage({ params }: Props) {
    const supabase = createClient()
    const chapterNum = parseInt(params.chapterNumber)

    // Fetch story and current chapter
    const { data: story } = await supabase
        .from('stories')
        .select(`
            id, title, slug,
            categories (name, slug)
        `)
        .eq('slug', params.slug)
        .eq('is_published', true)
        .maybeSingle()

    if (!story) notFound()

    const { data: chapter } = await supabase
        .from('chapters')
        .select('*')
        .eq('story_id', story.id)
        .eq('chapter_number', chapterNum)
        .maybeSingle()

    if (!chapter) notFound()

    // Fetch next and previous chapter existence
    const { data: prevChapter } = await supabase
        .from('chapters')
        .select('chapter_number')
        .eq('story_id', story.id)
        .eq('chapter_number', chapterNum - 1)
        .maybeSingle()

    const { data: nextChapter } = await supabase
        .from('chapters')
        .select('chapter_number')
        .eq('story_id', story.id)
        .eq('chapter_number', chapterNum + 1)
        .maybeSingle()

    const storyCategory = story.categories as unknown as Category

    return (
        <main className="min-h-screen bg-gray-50/50">
            <Header />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 lg:py-20">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-8 uppercase tracking-widest">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <ChevronRight size={12} />
                    <Link href={`/category/${storyCategory?.slug}`} className="hover:text-blue-600 transition-colors">{storyCategory?.name}</Link>
                    <ChevronRight size={12} />
                    <Link href={`/story/${story.slug}`} className="hover:text-blue-600 transition-colors line-clamp-1">{story.title}</Link>
                    <ChevronRight size={12} />
                    <span className="text-gray-900">Chapter {chapterNum}</span>
                </nav>

                <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                    <div className="p-8 lg:p-16">
                        <header className="mb-12 text-center">
                            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4">
                                Chapter {chapterNum}
                            </span>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                                {chapter.title}
                            </h1>
                        </header>

                        {/* Image Section if available */}
                        {chapter.image_url && (
                            <div className="mb-8 relative aspect-[3/2] lg:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
                                <NextImage
                                    src={chapter.image_url}
                                    alt={chapter.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Video Section if available */}
                        {chapter.ai_video_url && (
                            <div className="mb-12 aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                                <video
                                    src={chapter.ai_video_url}
                                    controls
                                    className="w-full h-full"
                                />
                            </div>
                        )}

                        <article className="prose prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                            {chapter.content}
                        </article>

                        {/* Bottom Navigation */}
                        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                            {prevChapter ? (
                                <Link
                                    href={`/story/${story.slug}/chapter/${prevChapter.chapter_number}`}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:border-blue-600 hover:text-blue-600 transition-all group text-sm"
                                >
                                    <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                                    <span>Prev</span>
                                </Link>
                            ) : (
                                <div className="invisible" />
                            )}

                            <Link
                                href={`/story/${story.slug}`}
                                className="flex items-center gap-1.5 px-4 py-2.5 text-gray-400 hover:text-gray-900 transition-colors font-bold uppercase tracking-widest text-[10px]"
                            >
                                <List size={16} />
                                <span>Index</span>
                            </Link>

                            {nextChapter ? (
                                <Link
                                    href={`/story/${story.slug}/chapter/${nextChapter.chapter_number}`}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 group text-sm"
                                >
                                    <span>Next</span>
                                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            ) : (
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg group text-sm"
                                >
                                    <span>Finish</span>
                                </Link>
                            )}
                        </div>

                        {/* Quiz Promo - Visible on every chapter for mobile-first engagement */}
                        <div className="mt-8">
                            <QuizPromo storyId={story.id} category={storyCategory?.slug} />
                        </div>

                        {/* Direct Linked Quiz (Only on last chapter) */}
                        {!nextChapter && (
                            <div className="mt-4 border-t border-gray-100 pt-4">
                                <RelatedQuiz 
                                    storyId={story.id} 
                                    category={storyCategory?.slug} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="py-12 text-center bg-transparent">
                <p className="text-gray-400 text-sm font-medium">© 2026 NovaLore</p>
            </footer>
        </main>
    )
}
