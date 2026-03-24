'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Search } from 'lucide-react'

interface Category {
    name: string
    slug: string
}

interface MobileMenuProps {
    categories: Category[] | null
}

export default function MobileMenu({ categories }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!mounted) {
        return (
            <div className="md:hidden">
                <button className="p-2 text-gray-400">
                    <Menu size={28} />
                </button>
            </div>
        )
    }

    const drawerContent = (
        <div className={`fixed inset-0 z-[999] md:hidden ${isOpen ? 'visible' : 'invisible'}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0 bg-white">
                        <Link href="/" onClick={() => setIsOpen(false)} className="shrink-0">
                            <Image src="/logo_wide.png" alt="NovaLore" width={140} height={36} className="h-8 w-auto object-contain" />
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-8 bg-white">
                        <div className="space-y-2">
                            {/* Mobile Search */}
                            <div className="relative mb-8 pt-2">
                                <input
                                    type="text"
                                    placeholder="Search stories..."
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 pr-12 focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-base text-gray-900 placeholder:text-gray-400"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search size={22} className="translate-y-1" />
                                </div>
                            </div>

                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="block py-4 text-xl font-extrabold text-gray-900 border-b border-gray-50 hover:text-blue-600"
                            >
                                Home
                            </Link>

                            <div className="border-b border-gray-50 py-2">
                                <div
                                    className="flex items-center justify-between py-4 cursor-pointer group"
                                    onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                                >
                                    <span className="text-xl font-extrabold text-gray-900 group-hover:text-blue-600">
                                        All Stories
                                    </span>
                                    <ChevronDown
                                        size={24}
                                        className={`text-gray-400 transition-transform duration-300 ${isCategoriesExpanded ? 'rotate-180' : ''}`}
                                    />
                                </div>

                                {isCategoriesExpanded && (
                                    <div className="mt-2 ml-4 flex flex-col space-y-2 border-l-4 border-blue-50 pl-6 animate-in slide-in-from-top-2 duration-300">
                                        <Link
                                            href="/stories"
                                            onClick={() => setIsOpen(false)}
                                            className="block py-3 text-gray-800 font-bold hover:text-blue-600"
                                        >
                                            View All Directory
                                        </Link>
                                        <div className="flex flex-col space-y-2 py-2 mb-2 border-b border-gray-50">
                                            <Link
                                                href="/stories?sort=popular"
                                                onClick={() => setIsOpen(false)}
                                                className="text-gray-600 hover:text-blue-600 font-medium"
                                            >
                                                🔥 Most Popular
                                            </Link>
                                            <Link
                                                href="/stories?sort=new"
                                                onClick={() => setIsOpen(false)}
                                                className="text-gray-600 hover:text-blue-600 font-medium"
                                            >
                                                ✨ Daily Newest
                                            </Link>
                                        </div>
                                        {categories?.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                href={`/category/${cat.slug}`}
                                                onClick={() => setIsOpen(false)}
                                                className="block py-3 text-gray-600 font-semibold hover:text-blue-600"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link
                                href="/blog"
                                onClick={() => setIsOpen(false)}
                                className="block py-5 text-xl font-extrabold text-gray-900 border-b border-gray-50 hover:text-blue-600"
                            >
                                Blog
                            </Link>

                            <Link
                                href="/about"
                                onClick={() => setIsOpen(false)}
                                className="block py-5 text-xl font-extrabold text-gray-900 border-b border-gray-50 hover:text-blue-600"
                            >
                                About
                            </Link>

                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="block py-5 text-xl font-extrabold text-gray-900 border-b border-gray-50 hover:text-blue-600"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Footer in Drawer */}
                    <div className="p-8 border-t border-gray-50 bg-gray-50/50">
                        <p className="text-gray-400 text-sm font-medium">© 2026 NovaLore</p>
                        <div className="flex gap-4 mt-3">
                            <Link href="/privacy-policy" onClick={() => setIsOpen(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</Link>
                            <Link href="/terms-of-service" onClick={() => setIsOpen(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-900 hover:text-blue-600 transition-colors"
                aria-label="Open menu"
            >
                <Menu size={30} strokeWidth={2.5} />
            </button>
            {createPortal(drawerContent, document.body)}
        </div>
    )
}
