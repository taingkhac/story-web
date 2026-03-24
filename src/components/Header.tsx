import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronDown } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import MobileMenu from './MobileMenu'

export default async function Header() {
    const supabase = createClient()

    // Fetch categories for the dropdown
    const { data: categories } = await supabase
        .from('categories')
        .select('name, slug')
        .order('name')

    return (
        <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-100">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="shrink-0">
                    <Image src="/logo_wide.png" alt="NovaLore" width={180} height={48} className="h-10 w-auto object-contain" />
                </Link>

                <nav className="hidden md:flex gap-8 items-center font-semibold text-sm">
                    <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>

                    {/* All Stories Dropdown */}
                    <div className="relative group py-6">
                        <Link href="/stories" className="hover:text-blue-500 transition-colors flex items-center gap-1">
                            All Stories
                            <ChevronDown size={14} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-300" />
                        </Link>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 overflow-hidden">
                            <div className="py-2">
                                <Link href="/stories" className="block px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-colors font-bold border-b border-gray-50 mb-1">
                                    All Stories
                                </Link>
                                <div className="px-6 py-2">
                                    <Link href="/stories?sort=popular" className="block py-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                        🔥 Most Popular
                                    </Link>
                                    <Link href="/stories?sort=new" className="block py-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                        ✨ Daily Newest
                                    </Link>
                                </div>
                                <div className="border-t border-gray-50 mt-1 pt-1">
                                    {categories?.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            href={`/category/${cat.slug}`}
                                            className="block px-6 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-blue-500 transition-colors"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link href="/blog" className="hover:text-blue-500 transition-colors">Blog</Link>
                    <Link href="/about" className="hover:text-blue-500 transition-colors">About</Link>
                    <Link href="/contact" className="hover:text-blue-500 transition-colors">Contact</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:flex items-center">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-gray-100 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm w-48 transition-all"
                        />
                        <button className="bg-[#003D3D] text-white p-2.5 rounded-r-full hover:bg-[#002b2b] transition-colors">
                            <Search size={18} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <MobileMenu categories={categories} />
                </div>
            </div>
        </header>
    )
}
