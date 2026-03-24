import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Link from 'next/link'
import { ChevronLeft, Clock, HelpCircle, Users, PlayCircle, BookOpen } from 'lucide-react'

interface Props {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
    const supabase = createClient()
    const { data: quiz } = await supabase
        .from('quizzes')
        .select('title, seo_title, seo_description, description')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .maybeSingle()

    if (!quiz) return {}

    return {
        title: quiz.seo_title || `${quiz.title} | NovaLore Quizzes`,
        description: quiz.seo_description || quiz.description,
    }
}

export default async function QuizIntroPage({ params }: Props) {
    const supabase = createClient()

    const { data: quiz } = await supabase
        .from('quizzes')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .maybeSingle()

    if (!quiz) notFound()

    // Fetch related stories (just latest 3 for now, ideally by category)
    const { data: stories } = await supabase
        .from('stories')
        .select('id, title, slug, cover_image_url')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(3)

    const estimatedMinutes = Math.max(1, Math.ceil(quiz.total_questions * 0.5))

    const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        name: quiz.title,
        description: quiz.description,
        url: `https://novalore.com/quiz/${quiz.slug}`,
    }

    return (
        <main className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <Header />

            <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
                <Link
                    href="/quiz"
                    className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-teal-600 transition-colors uppercase tracking-widest mb-8"
                >
                    <ChevronLeft size={16} />
                    <span>Back to Quizzes</span>
                </Link>

                <article className="bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-zinc-100 overflow-hidden">
                    {quiz.thumbnail_url && (
                        <div className="aspect-[21/9] w-full relative overflow-hidden bg-zinc-100">
                            <Image
                                src={quiz.thumbnail_url}
                                alt={quiz.title}
                                fill
                                className="object-cover w-full h-full"
                                priority
                            />
                        </div>
                    )}

                    <div className="p-8 lg:p-12 text-center">
                        <header className="mb-10">
                            {quiz.category && (
                                <span className="inline-block px-4 py-1.5 bg-zinc-100 text-zinc-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                                    {quiz.category}
                                </span>
                            )}
                            <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 leading-tight mb-6">
                                {quiz.title}
                            </h1>
                            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
                                {quiz.description}
                            </p>
                        </header>

                        {/* Quiz Meta Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-12 mb-12">
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-1">
                                    <HelpCircle size={24} />
                                </div>
                                <span className="text-2xl font-black text-zinc-900">{quiz.total_questions}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Questions</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
                                    <Clock size={24} />
                                </div>
                                <span className="text-2xl font-black text-zinc-900">{estimatedMinutes}m</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Est. Time</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-1">
                                    <Users size={24} />
                                </div>
                                <span className="text-2xl font-black text-zinc-900">{(quiz.view_count || 0).toLocaleString()}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Players</span>
                            </div>
                        </div>

                        {/* Start Action */}
                        <Link
                            href={`/quiz/${quiz.slug}/question/1`}
                            className="inline-flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-500 text-white px-10 py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all hover:scale-105 hover:shadow-xl hover:shadow-teal-500/20 active:scale-95 w-full sm:w-auto"
                        >
                            <PlayCircle size={28} />
                            Start Quiz
                        </Link>
                    </div>
                </article>

                {/* Related Stories */}
                {stories && stories.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center gap-3 mb-8">
                            <BookOpen className="text-teal-600" size={24} />
                            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Expand Your Knowledge</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {stories.map(story => (
                                <Link key={story.id} href={`/story/${story.slug}`} className="group bg-white rounded-3xl p-4 border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                                    <div className="aspect-[4/3] w-full relative rounded-2xl overflow-hidden bg-zinc-100 mb-4">
                                        {story.cover_image_url && (
                                            <Image src={story.cover_image_url} alt={story.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                    </div>
                                    <h3 className="font-bold text-zinc-900 group-hover:text-teal-600 transition-colors line-clamp-2 px-2 pb-2">
                                        {story.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
