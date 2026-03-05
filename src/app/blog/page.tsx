import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { Calendar, User, ChevronRight } from 'lucide-react'
import { BlogPost } from '@/types'

export const metadata = {
    title: 'NovaLore Blog - Insights, Lore, and Community',
    description: 'Explore the latest updates, writing tips, and deep lore from the NovaLore team.',
}

export default async function BlogPage() {
    const supabase = createClient()

    const { data: posts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

    const blogPosts = posts as BlogPost[] | null

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="mx-auto max-w-7xl px-6 py-12 lg:py-20">
                <header className="mb-16">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        NovaLore <span className="text-blue-600">Blog</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl font-medium">
                        Insights into our world, writing tips for authors, and the latest news from the NovaLore community.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {blogPosts && blogPosts.length > 0 ? (
                        blogPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="aspect-[16/9] overflow-hidden relative bg-gray-100">
                                    {post.cover_image_url && (
                                        <Image
                                            src={post.cover_image_url}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )}
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-blue-500" />
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} className="text-blue-500" />
                                            <span>{post.author_name}</span>
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                                        {post.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center gap-2 text-blue-600 font-bold text-sm">
                                        <span>Read More</span>
                                        <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-gray-400 font-medium italic">No blog posts found. Check back later!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
