import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'NovaLore - Discover Epic Stories',
    description: 'The ultimate platform for web novels, fantasy lore, and epic adventures.',
    icons: {
        icon: '/icon.png',
        apple: '/icon.png',
    }
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">

            <body className={`${inter.className} bg-white text-zinc-900 antialiased`}>{children}</body>
        </html>
    )
}
