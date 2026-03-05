import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen bg-zinc-950 text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-8 items-center">
                    <h2 className="text-xl font-bold tracking-tight text-white">Nova Roma</h2>
                    <p className="text-xs text-zinc-400">Admin Dashboard</p>
                </div>
                <nav className="space-y-2">
                    <Link
                        href="/admin"
                        className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/stories/new"
                        className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    >
                        New Story
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
