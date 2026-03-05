import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata, ResolvingMetadata } from 'next'
import { ChevronRight } from 'lucide-react'
import Header from '@/components/Header'

interface Props {
    params: { slug: string }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const supabase = createClient()

    const { data: story } = await supabase
        .from('stories')
        .select('title, summary, cover_image_url')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .maybeSingle()

    if (!story) return { title: 'Story Not Found' }

    return {
        title: `${story.title} | Nova Roma`,
        description: story.summary || `Read ${story.title} on Nova Roma.`,
        openGraph: {
            title: story.title,
            description: story.summary || '',
            images: story.cover_image_url ? [story.cover_image_url] : [],
        },
    }
}

export default async function StoryReaderPage({ params }: Props) {
    const supabase = createClient()

    const { data: rawStory } = await supabase
        .from('stories')
        .select(`
            id, title, slug, summary, cover_image_url, created_at, is_published,
            categories (name, slug)
        `)
        .eq('slug', params.slug)
        .eq('is_published', true)
        .maybeSingle() // Keep maybeSingle to ensure a single object or null

    const story = rawStory as any // Cast to any to handle potential type issues with categories
    if (!story) notFound()

    const { data: chapters } = await supabase
        .from('chapters')
        .select('id, chapter_number, title')
        .eq('story_id', story.id)
        .order('chapter_number', { ascending: true })

    // Fetch popular/latest stories for the sidebar or bottom section
    const { data: popularStories } = await supabase
        .from('stories')
        .select(`
            id, title, slug, cover_image_url,
            categories (name)
        `)
        .eq('is_published', true)
        .neq('id', story.id)
        .order('created_at', { ascending: false })
        .limit(4)

    const storyCategory = Array.isArray(story.categories) ? story.categories[0] : story.categories

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <div className="relative w-full h-[300px] lg:h-[450px]">
                {story.cover_image_url ? (
                    <Image
                        src={story.cover_image_url}
                        alt={story.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="mx-auto max-w-7xl px-6 relative -mt-32 lg:-mt-48 z-10">
                <div className="lg:flex gap-12">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
                            {/* Breadcrumbs */}
                            <nav className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-8">
                                <Link href="/" className="hover:text-blue-600 transition-colors uppercase tracking-wider">Home</Link>
                                <ChevronRight size={14} />
                                <Link href={`/category/${storyCategory?.slug}`} className="hover:text-blue-600 transition-colors uppercase tracking-wider">
                                    {storyCategory?.name}
                                </Link>
                                <ChevronRight size={14} />
                                <span className="text-gray-900 line-clamp-1 uppercase tracking-wider">{story.title}</span>
                            </nav>

                            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                                {story.title}
                            </h1>

                            <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-12">
                                <span className="text-gray-900 px-3 py-1 bg-gray-100 rounded-md">By Nova Admin</span>
                                <span>•</span>
                                <span>{new Date(story.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>

                            <article className="prose prose-lg max-w-none text-gray-600 mb-16">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Synopsis</h3>
                                <p className="leading-relaxed whitespace-pre-line">
                                    {story.summary || 'No description available for this story.'}
                                </p>
                            </article>

                            {/* Chapters Section */}
                            <div className="mt-16 pt-16 border-t border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                                    Chapter Index
                                </h2>

                                {chapters && chapters.length > 0 ? (
                                    <div className="space-y-3">
                                        {chapters.map((chapter) => (
                                            <Link
                                                key={chapter.id}
                                                href={`/story/${story.slug}/chapter/${chapter.chapter_number}`}
                                                className="group flex items-center justify-between p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all duration-300"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <span className="text-blue-600 font-bold text-sm uppercase tracking-widest min-w-[100px]">
                                                        Chapter {chapter.chapter_number}
                                                    </span>
                                                    <span className="text-gray-900 font-bold group-hover:text-blue-600 transition-colors">
                                                        {chapter.title}
                                                    </span>
                                                </div>
                                                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="italic text-gray-400 p-8 border border-dashed border-gray-200 rounded-2xl text-center">
                                        Stay tuned! Content is coming soon.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Most Popular Sidebar */}
                    <div className="lg:w-1/3 mt-12 lg:mt-0">
                        <div className="bg-gray-50 rounded-3xl p-8 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
                                Most Popular
                            </h2>

                            <div className="space-y-8">
                                {popularStories?.map((popular: any) => {
                                    const popularCategory = Array.isArray(popular.categories) ? popular.categories[0] : popular.categories
                                    return (
                                        <Link key={popular.id} href={`/story/${popular.slug}`} className="group flex gap-4">
                                            <div className="relative w-20 h-24 shrink-0 overflow-hidden rounded-xl bg-gray-200 shadow-sm">
                                                {popular.cover_url && (
                                                    <Image
                                                        src={popular.cover_url}
                                                        alt={popular.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-1 leading-none">
                                                    {popularCategory?.name}
                                                </span>
                                                <h4 className="text-gray-900 font-bold group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                                    {popular.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>

                            <Link
                                href="/stories"
                                className="mt-10 block text-center py-4 bg-white border border-gray-200 rounded-2xl font-bold text-sm text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
                            >
                                View All Stories
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="border-t border-gray-100 bg-gray-50 py-12 mt-24">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <p className="text-gray-500 text-sm font-medium">© 2026 Nova Roma. All rights reserved.</p>
                </div>
            </footer>
        </main>
    )
}
