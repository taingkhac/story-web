import Header from '@/components/Header'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy | NovaLore',
    description: 'Read the NovaLore Privacy Policy to understand how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            <section className="bg-gradient-to-br from-[#003D3D] to-[#005f5f] text-white py-20 px-6">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-4xl font-extrabold mb-3">Privacy Policy</h1>
                    <p className="text-teal-200 text-sm">Last updated: March 24, 2026</p>
                </div>
            </section>

            <section className="py-16 px-6">
                <div className="mx-auto max-w-4xl prose prose-gray prose-lg max-w-none">

                    <p className="text-gray-600 leading-relaxed">
                        Welcome to NovaLore (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We are committed to protecting your personal
                        information and your right to privacy. This Privacy Policy explains how we collect, use, disclose,
                        and safeguard your information when you visit our website <strong>story-web-henna.vercel.app</strong>.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Information We Collect</h2>
                    <p className="text-gray-600 leading-relaxed mb-3">
                        We may collect information about you in a variety of ways including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li><strong>Personal Data:</strong> Voluntarily provided data such as name and email address when you contact us or subscribe to our newsletter.</li>
                        <li><strong>Usage Data:</strong> Automatically collected data about how you interact with our website, including pages visited, time spent, and referring URLs.</li>
                        <li><strong>Cookies &amp; Tracking:</strong> We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. How We Use Your Information</h2>
                    <p className="text-gray-600 leading-relaxed mb-3">We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Operate, maintain, and improve our website and services.</li>
                        <li>Respond to your comments and questions.</li>
                        <li>Send you updates about new stories, features, or promotions (only with your consent).</li>
                        <li>Monitor and analyse usage to improve user experience.</li>
                        <li>Display personalised advertisements through Google AdSense and similar services.</li>
                        <li>Comply with legal obligations and protect against fraudulent activity.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Google AdSense &amp; Third-Party Advertising</h2>
                    <p className="text-gray-600 leading-relaxed mb-3">
                        NovaLore uses Google AdSense to display advertisements. Google, as a third-party vendor, uses
                        cookies to serve ads based on your visit to our website and other sites on the Internet. You may
                        opt out of personalised advertising by visiting{' '}
                        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">
                            Google Ads Settings
                        </a>.
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                        For more information on how Google uses data when you use our website, please visit{' '}
                        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-teal-700 underline">
                            Google&apos;s Privacy &amp; Terms
                        </a>.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Cookies</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Cookies are small data files stored on your device. We use cookies to remember your preferences,
                        analyse traffic, and serve targeted advertisements. You can instruct your browser to refuse all
                        cookies or to indicate when a cookie is being sent. However, some features of our website may not
                        function properly without cookies.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Third-Party Links</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Our website may contain links to third-party websites. We are not responsible for the privacy
                        practices or content of those sites and encourage you to review their privacy policies.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Data Retention</h2>
                    <p className="text-gray-600 leading-relaxed">
                        We retain personal information for as long as necessary to fulfil the purposes outlined in this
                        Privacy Policy, or as required by law. When data is no longer needed, we securely delete or
                        anonymise it.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. Children&apos;s Privacy</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Our website is not directed to children under the age of 13. We do not knowingly collect personal
                        information from children under 13. If you believe we have accidentally collected such information,
                        please contact us immediately so we can delete it.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">8. Your Rights</h2>
                    <p className="text-gray-600 leading-relaxed mb-3">
                        Depending on your location, you may have certain rights regarding your personal data, including:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>The right to access, update, or delete your personal information.</li>
                        <li>The right to withdraw consent at any time.</li>
                        <li>The right to lodge a complaint with a supervisory authority.</li>
                    </ul>
                    <p className="text-gray-600 leading-relaxed mt-4">
                        To exercise these rights, please contact us at{' '}
                        <a href="mailto:taicao75.kt@gmail.com" className="text-teal-700 underline">taicao75.kt@gmail.com</a>.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">9. Changes to This Policy</h2>
                    <p className="text-gray-600 leading-relaxed">
                        We may update this Privacy Policy from time to time. Changes will be posted on this page with an
                        updated &quot;Last updated&quot; date. We recommend reviewing this page periodically to stay informed.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">10. Contact Us</h2>
                    <p className="text-gray-600 leading-relaxed">
                        If you have any questions about this Privacy Policy, please contact us at:
                    </p>
                    <div className="mt-3 p-4 bg-gray-50 rounded-xl text-gray-700 text-sm">
                        <p><strong>NovaLore</strong></p>
                        <p>Email: <a href="mailto:taicao75.kt@gmail.com" className="text-teal-700 underline">taicao75.kt@gmail.com</a></p>
                        <p>Website: <a href="https://story-web-henna.vercel.app" className="text-teal-700 underline">story-web-henna.vercel.app</a></p>
                    </div>
                </div>
            </section>

            <footer className="border-t border-gray-100 bg-gray-50 py-12">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <p className="text-gray-500 text-sm font-medium">© 2026 NovaLore. All rights reserved.</p>
                    <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
                        <Link href="/about" className="hover:text-gray-600 transition-colors">About Us</Link>
                        <Link href="/contact" className="hover:text-gray-600 transition-colors">Contact</Link>
                        <Link href="/terms-of-service" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </main>
    )
}
