import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Pagination from '@/components/Pagination'
import { ChevronRight } from 'lucide-react'

export default async function AllStoriesPage({
    searchParams,
}: {
    searchParams: { page?: string }
}) {
    const supabase = createClient()
    const currentPage = parseInt(searchParams.page || '1')
    const pageSize = 10 // Changed to 12 for better grid alignment (3 or 4 per row)

    // Calculate range for pagination
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1

    // Fetch stories with count
    const { data: stories, count } = await supabase
        .from('stories')
        .select(`
            id,
            title,
            slug,
            summary,
            cover_image_url,
            created_at,
            is_published,
            categories (
                name
            )
        `, { count: 'exact' })
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .range(from, to)

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="mb-12 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                        All Stories
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl">
                        Explore our complete collection of web novels and stories. From epic fantasies to heart-warming romances.
                    </p>
                </div>

                {stories && stories.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                            {stories.map((story: any) => (
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

                                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2 block">
                                        {story.categories?.name || 'Uncategorized'}
                                    </span>

                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
                                        {story.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        {story.summary}
                                    </p>
                                </Link>
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalCount={count || 0}
                            pageSize={pageSize}
                        />
                    </>
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-24 text-center text-gray-400">
                        No stories have been published yet.
                    </div>
                )}
            </div>

            <footer className="border-t border-gray-100 bg-gray-50 py-12">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <p className="text-gray-500 text-sm font-medium">© 2026 Nova Roma. All rights reserved.</p>
                </div>
            </footer>
        </main>
    )
}
