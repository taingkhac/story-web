import Header from '@/components/Header'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service | NovaLore',
    description: 'Read the NovaLore Terms of Service — the rules and guidelines for using our platform.',
}

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            <section className="bg-gradient-to-br from-[#003D3D] to-[#005f5f] text-white py-20 px-6">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-4xl font-extrabold mb-3">Terms of Service</h1>
                    <p className="text-teal-200 text-sm">Last updated: March 24, 2026</p>
                </div>
            </section>

            <section className="py-16 px-6">
                <div className="mx-auto max-w-4xl">

                    <p className="text-gray-600 leading-relaxed text-lg">
                        Please read these Terms of Service (&quot;Terms&quot;) carefully before using the NovaLore website
                        located at <strong>story-web-henna.vercel.app</strong>. By accessing or using our service, you agree to be
                        bound by these Terms. If you disagree with any part of these Terms, you may not use our service.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-600 leading-relaxed">
                        By accessing and using NovaLore, you confirm that you are at least 13 years of age and agree to
                        comply with these Terms of Service and all applicable laws and regulations. If you are accessing
                        NovaLore on behalf of an organisation, you represent that you have the authority to bind that
                        organisation to these Terms.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Use of the Service</h2>
                    <p className="text-gray-600 leading-relaxed mb-3">You agree to use NovaLore only for lawful purposes. You must not:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Reproduce, duplicate, copy, or resell any part of our content without express written permission.</li>
                        <li>Use the platform to distribute spam, malware, or any harmful content.</li>
                        <li>Attempt to gain unauthorised access to any portion of the website or its related systems.</li>
                        <li>Engage in any activity that disrupts or interferes with the normal functioning of the website.</li>
                        <li>Post, transmit, or share content that is illegal, defamatory, threatening, or infringes on the rights of others.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Intellectual Property</h2>
                    <p className="text-gray-600 leading-relaxed">
                        All content on NovaLore — including but not limited to stories, text, graphics, logos, images,
                        and software — is the intellectual property of NovaLore or its content providers and is protected
                        by applicable copyright, trademark, and other intellectual property laws. You may not copy,
                        reproduce, distribute, or create derivative works without our express written consent.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. User-Generated Content</h2>
                    <p className="text-gray-600 leading-relaxed">
                        If you submit any content to NovaLore (such as comments or story submissions), you grant us a
                        non-exclusive, worldwide, royalty-free licence to use, reproduce, and display that content in
                        connection with our services. You represent that you own or have the necessary rights to submit
                        such content, and that it does not violate any third-party rights.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Third-Party Advertising</h2>
                    <p className="text-gray-600 leading-relaxed">
                        NovaLore displays advertisements provided by Ezoic and other third-party advertising
                        networks. These advertisements may use cookies and web beacons. By using our website, you
                        acknowledge and consent to the use of advertising technologies as described in our{' '}
                        <Link href="/privacy-policy" className="text-teal-700 underline">Privacy Policy</Link>.
                        NovaLore is not responsible for the content of third-party advertisements.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Disclaimers</h2>
                    <p className="text-gray-600 leading-relaxed">
                        NovaLore and its content are provided on an &quot;as is&quot; and &quot;as available&quot; basis without
                        warranties of any kind, either express or implied. We do not warrant that the website will be
                        uninterrupted, error-free, or free of viruses or other harmful components. NovaLore is not
                        responsible for the accuracy, reliability, or completeness of any content.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. Limitation of Liability</h2>
                    <p className="text-gray-600 leading-relaxed">
                        To the fullest extent permitted by law, NovaLore and its affiliates, officers, employees, and
                        agents shall not be liable for any indirect, incidental, special, consequential, or punitive
                        damages — including loss of profits, data, or goodwill — arising from your use of, or inability
                        to use, the website or its content.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">8. DMCA &amp; Copyright Infringement</h2>
                    <p className="text-gray-600 leading-relaxed">
                        NovaLore respects the intellectual property rights of others. If you believe that content on our
                        platform infringes your copyright, please send a DMCA notice to{' '}
                        <a href="mailto:taicao75.kt@gmail.com" className="text-teal-700 underline">taicao75.kt@gmail.com</a>{' '}
                        with: a description of the copyrighted work, the URL where the infringing content is located, and
                        your contact information. We will investigate and take appropriate action.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">9. Termination</h2>
                    <p className="text-gray-600 leading-relaxed">
                        We reserve the right to terminate or suspend access to our service immediately, without prior
                        notice, for conduct that we believe violates these Terms of Service or is harmful to other users,
                        us, or third parties, or for any other reason.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">10. Governing Law</h2>
                    <p className="text-gray-600 leading-relaxed">
                        These Terms shall be governed by and construed in accordance with applicable laws, without regard
                        to conflict of law provisions. Any disputes arising from these Terms will be subject to the
                        exclusive jurisdiction of the courts in the applicable jurisdiction.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">11. Changes to Terms</h2>
                    <p className="text-gray-600 leading-relaxed">
                        We reserve the right to modify these Terms at any time. Changes will become effective immediately
                        upon posting to the website. Your continued use of our website after any changes constitutes your
                        acceptance of the new Terms. We recommend reviewing this page periodically.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">12. Contact Us</h2>
                    <p className="text-gray-600 leading-relaxed">
                        If you have any questions about these Terms, please contact us:
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
                        <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </footer>
        </main>
    )
}
