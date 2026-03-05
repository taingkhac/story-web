import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'
import { ChevronLeft, Calendar, User, Share2 } from 'lucide-react'

interface Props {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
    const supabase = createClient()
    const { data: post } = await supabase
        .from('blog_posts')
        .select('title, excerpt')
        .eq('slug', params.slug)
        .maybeSingle()

    if (!post) return {}

    return {
        title: `${post.title} | NovaLore Blog`,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({ params }: Props) {
    const supabase = createClient()

    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', params.slug)
        .maybeSingle()

    if (!post) notFound()

    return (
        <main className="min-h-screen bg-gray-50/50">
            <Header />

            <div className="mx-auto max-w-4xl px-6 py-12 lg:py-20">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-widest mb-8"
                >
                    <ChevronLeft size={16} />
                    <span>Back to Blog</span>
                </Link>

                <article className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
                    {post.cover_image_url && (
                        <div className="aspect-[21/9] w-full relative overflow-hidden">
                            <img
                                src={post.cover_image_url}
                                alt={post.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}

                    <div className="p-8 lg:p-16">
                        <header className="mb-12">
                            <div className="flex flex-wrap items-center gap-6 mb-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                                    <Calendar size={14} />
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-blue-500" />
                                    <span>{post.author_name}</span>
                                </div>
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                                {post.title}
                            </h1>
                        </header>

                        <div className="prose prose-lg lg:prose-xl max-w-none text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                            {post.content}
                        </div>

                        <footer className="mt-16 pt-12 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Share this post</span>
                                <div className="flex gap-2">
                                    <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </div>
                </article>
            </div>

            <footer className="py-12 text-center">
                <p className="text-gray-400 text-sm font-medium">© 2026 NovaLore</p>
            </footer>
        </main>
    )
}
