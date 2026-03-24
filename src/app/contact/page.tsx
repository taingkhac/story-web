import Header from '@/components/Header'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Mail, MessageSquare, Clock, MapPin } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Contact Us | NovaLore',
    description: 'Get in touch with the NovaLore team. We\'d love to hear from you — for support, partnerships, or general inquiries.',
}

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#003D3D] to-[#005f5f] text-white py-24 px-6">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl font-extrabold mb-6 leading-tight">Contact Us</h1>
                    <p className="text-xl text-teal-100 max-w-2xl mx-auto">
                        Have a question, feedback, or a partnership proposal? We&apos;re here and happy to help.
                    </p>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-16">

                    {/* Contact Form */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                        <form className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Your name"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all bg-white"
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Reader Support</option>
                                    <option value="author">Author Submission</option>
                                    <option value="partnership">Partnership / Business</option>
                                    <option value="dmca">DMCA / Copyright</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={6}
                                    placeholder="Tell us what's on your mind..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#003D3D] text-white font-bold py-3 rounded-xl hover:bg-[#002b2b] transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900">Get In Touch</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We read every message and aim to respond within 1–2 business days. For urgent matters,
                            please mention it in your subject line.
                        </p>

                        {[
                            {
                                icon: Mail,
                                title: 'Email',
                                detail: 'taicao75.kt@gmail.com',
                                sub: 'For general support and inquiries',
                            },
                            {
                                icon: MessageSquare,
                                title: 'Business & Partnerships',
                                detail: 'taicao75.kt@gmail.com',
                                sub: 'For advertising and partnership proposals',
                            },
                            {
                                icon: Clock,
                                title: 'Response Time',
                                detail: '1–2 Business Days',
                                sub: 'We aim to reply as quickly as possible',
                            },
                            {
                                icon: MapPin,
                                title: 'Based In',
                                detail: 'Global',
                                sub: 'Our team works remotely worldwide',
                            },
                        ].map(({ icon: Icon, title, detail, sub }) => (
                            <div key={title} className="flex gap-4">
                                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center shrink-0 mt-1">
                                    <Icon size={18} className="text-[#003D3D]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{title}</p>
                                    <p className="text-[#003D3D] font-medium">{detail}</p>
                                    <p className="text-sm text-gray-500">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="border-t border-gray-100 bg-gray-50 py-12">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <p className="text-gray-500 text-sm font-medium">© 2026 NovaLore. All rights reserved.</p>
                    <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
                        <Link href="/about" className="hover:text-gray-600 transition-colors">About Us</Link>
                        <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </main>
    )
}
