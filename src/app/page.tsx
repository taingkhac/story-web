import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import Header from '@/components/Header'

import { Story, Category } from '@/types'

interface CategoryWithStories extends Category {
    stories: Story[]
}

export default async function HomePage() {
    const supabase = createClient()

    // Fetch the single newest story for the hero section
    const { data: newestStory } = await supabase
        .from('stories')
        .select(`
            *,
            categories (name, slug)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    // Fetch categories that have at least one published story
    const { data: categoriesData } = await supabase
        .from('categories')
        .select(`
            id,
            name,
            slug,
            stories (
                id,
                title,
                slug,
                summary,
                cover_image_url,
                created_at,
                is_published
            )
        `)
        .order('name')

    // Filter categories to only include those with at least one published story
    const categories = (categoriesData as (Category & { stories: Story[] })[])?.map(category => ({
        ...category,
        stories: category.stories.filter((s: Story) => s.is_published).slice(0, 4)
    })).filter(category => category.stories.length > 0) as CategoryWithStories[] || []

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Featured "New Story" Section */}
                {newestStory && (
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                                New Story
                            </h2>
                            <Link href={`/story/${newestStory.slug}`} className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center gap-1 transition-colors">
                                View Story <ChevronRight size={16} />
                            </Link>
                        </div>

                        <Link href={`/story/${newestStory.slug}`} className="group relative block overflow-hidden rounded-3xl bg-gray-100 shadow-xl lg:flex items-stretch min-h-[450px]">
                            {/* Image side */}
                            <div className="relative h-64 w-full lg:h-auto lg:w-3/5 overflow-hidden">
                                {newestStory.cover_image_url ? (
                                    <Image
                                        src={newestStory.cover_image_url}
                                        alt={newestStory.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gray-200" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                            </div>

                            {/* Content side */}
                            <div className="flex flex-col justify-center p-8 lg:p-12 lg:w-2/5 bg-white relative">
                                <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 rounded-full mb-4 w-fit">
                                    Latest Update
                                </span>
                                <h3 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                    {newestStory.title}
                                </h3>
                                <p className="text-gray-600 text-lg mb-8 line-clamp-3 leading-relaxed">
                                    {newestStory.summary}
                                </p>
                                <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                                    <span className="bg-gray-100 px-3 py-1 rounded-md">{newestStory.categories?.name || 'Uncategorized'}</span>
                                    <span>•</span>
                                    <span>{new Date(newestStory.created_at).toLocaleDateString()}</span>
                                </div>

                                <div className="mt-8 flex items-center gap-2 bg-[#003D3D] text-white px-8 py-3 rounded-full font-bold hover:bg-[#002b2b] transition-all transform hover:translate-x-1 shadow-lg w-fit">
                                    Read Now <ChevronRight size={18} />
                                </div>
                            </div>
                        </Link>
                    </section>
                )}

                {/* Categories Sections */}
                {categories.length > 0 ? (
                    <div className="space-y-16">
                        {categories.map((category) => (
                            <section key={category.id}>
                                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                        {category.name}
                                    </h2>
                                    <Link
                                        href={`/category/${category.slug}`}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                                    >
                                        View all <ChevronRight size={16} />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                                    {category.stories.map((story) => (
                                        <Link key={story.id} href={`/story/${story.slug}`} className="group block">
                                            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                                                {story.cover_image_url ? (
                                                    <Image
                                                        src={story.cover_image_url}
                                                        alt={story.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-200" />
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                                                    <span className="text-white text-xs font-bold uppercase tracking-wider">Read Story</span>
                                                    <ChevronRight size={16} className="text-white" />
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                {story.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                                {story.summary}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center text-gray-500">
                        No novels have been published yet with categories. Connect to the Admin Dashboard to start writing!
                    </div>
                )}
            </div>

            <footer className="border-t border-gray-100 bg-gray-50 py-12 mt-12">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <p className="text-gray-500 text-sm font-medium">© 2026 Nova Roma. All rights reserved.</p>
                </div>
            </footer>
        </main>
    )
}
