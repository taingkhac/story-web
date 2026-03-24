import Header from '@/components/Header'
import Link from 'next/link'
import type { Metadata } from 'next'
import { BookOpen, Users, Globe, Star } from 'lucide-react'

export const metadata: Metadata = {
    title: 'About Us | NovaLore',
    description: 'Learn about NovaLore — our mission, our team, and our passion for epic storytelling and web novels.',
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#003D3D] to-[#005f5f] text-white py-24 px-6">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">About NovaLore</h1>
                    <p className="text-xl text-teal-100 leading-relaxed max-w-2xl mx-auto">
                        We are a passionate team of readers and writers dedicated to bringing the world's most
                        captivating web novels and epic stories to every screen.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-4">
                        NovaLore was founded with a single belief: <strong>great stories should be accessible to everyone</strong>.
                        From sprawling fantasy epics to heart-pounding thrillers, we curate and publish original web novels
                        that inspire, entertain, and spark the imagination.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Our platform connects talented writers with a global audience of readers who crave authentic,
                        high-quality storytelling. We believe stories have the power to build bridges across cultures —
                        and we are here to make that happen.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-gray-50 py-16 px-6">
                <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { icon: BookOpen, value: '500+', label: 'Stories Published' },
                        { icon: Users, value: '50K+', label: 'Active Readers' },
                        { icon: Globe, value: '30+', label: 'Countries Reached' },
                        { icon: Star, value: '4.9', label: 'Average Rating' },
                    ].map(({ icon: Icon, value, label }) => (
                        <div key={label} className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-[#003D3D] rounded-2xl flex items-center justify-center">
                                <Icon size={22} className="text-white" />
                            </div>
                            <p className="text-3xl font-extrabold text-gray-900">{value}</p>
                            <p className="text-sm text-gray-500 font-medium">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Who We Are */}
            <section className="py-20 px-6">
                <div className="mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-4">
                        The NovaLore team is made up of avid storytellers, editors, and technologists who share a deep
                        love for narrative fiction. Our editorial team carefully reviews every story on the platform to
                        ensure it meets our standards for quality, originality, and reader engagement.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        We work tirelessly to create an inclusive environment where both new and established authors
                        can share their creative visions — and where readers can always find their next favourite adventure.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-[#003D3D] text-white py-16 px-6 text-center">
                <div className="mx-auto max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4">Start Your Journey Today</h2>
                    <p className="text-teal-100 mb-8">
                        Dive into thousands of stories or share your own — the NovaLore community is waiting for you.
                    </p>
                    <Link
                        href="/stories"
                        className="inline-block bg-white text-[#003D3D] font-bold px-8 py-3 rounded-full hover:bg-teal-50 transition-colors"
                    >
                        Explore Stories
                    </Link>
                </div>
            </section>

            <footer className="border-t border-gray-100 bg-gray-50 py-12 mt-0">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <p className="text-gray-500 text-sm font-medium">© 2026 NovaLore. All rights reserved.</p>
                    <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
                        <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
                        <Link href="/contact" className="hover:text-gray-600 transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </main>
    )
}
