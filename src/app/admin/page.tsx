import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = createClient()

    // Fetch all stories for the admin dashboard
    const { data: stories, error } = await supabase
        .from('stories')
        .select('*, chapters(count)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching stories:', error)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <Link
                    href="/admin/stories/new"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Add New Story
                </Link>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
                <table className="w-full text-left text-sm text-zinc-400">
                    <thead className="bg-zinc-950/50 text-xs uppercase text-zinc-300">
                        <tr>
                            <th className="px-6 py-4 font-medium">Title</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Chapters</th>
                            <th className="px-6 py-4 font-medium">Created At</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {stories && stories.length > 0 ? (
                            stories.map((story) => (
                                <tr key={story.id} className="hover:bg-zinc-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{story.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${story.is_published
                                            ? 'bg-green-500/10 text-green-400'
                                            : 'bg-yellow-500/10 text-yellow-400'
                                            }`}>
                                            {story.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Supabase returns count as an array with one item for related tables when using count */}
                                        {story.chapters[0]?.count || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(story.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3 text-xs font-bold uppercase tracking-widest">
                                            <Link
                                                href={`/story/${story.slug}`}
                                                target="_blank"
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/stories/${story.id}/edit`}
                                                className="text-amber-400 hover:text-amber-300"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={`/admin/stories/${story.id}/chapters`}
                                                className="text-zinc-300 hover:text-white"
                                            >
                                                Chapters
                                            </Link>
                                            <button
                                                className="text-red-400 hover:text-red-300"
                                            // We'll add a proper delete handler later or just link to a delete route/action
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                                    No stories found. Create your first story to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
