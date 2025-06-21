"use client";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white py-0 flex flex-col">
      {/* App Bar / Hero */}
      <header className="sticky top-0 bg-white z-20 border-b border-blue-100 shadow-sm mb-2">
        <div className="max-w-2xl mx-auto flex items-center px-4 py-4">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-700 tracking-tight flex-1">
            Privacy Policy
          </h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-2 sm:px-4 py-4">
        <div className="space-y-4">
          {/* Last updated badge */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Effective: 21 June 2025</span>
            <Link href="/terms" className="text-xs text-blue-700 underline font-medium">
              Terms of Service
            </Link>
          </div>

          {/* Card sections */}
          <section className="rounded-2xl bg-white/90 shadow p-4 mb-2">
            <h2 className="text-lg font-semibold mb-1 text-blue-700">1. Introduction</h2>
            <p className="text-gray-700">
              TBAE (“we”, “us”, “our”) is committed to protecting your privacy. This policy explains how we collect, use, and protect your data when you interact with our website and services.
            </p>
          </section>

          <section className="rounded-2xl bg-white/90 shadow p-4 mb-2">
            <h2 className="text-lg font-semibold mb-1 text-blue-700">2. What We Collect</h2>
            <ul className="list-disc ml-6 text-gray-700 text-base space-y-1">
              <li>Personal details you provide (name, email, bookings, etc).</li>
              <li>Usage and device info (analytics, cookies).</li>
              <li>Details from trusted partners (e.g. payment, marketing).</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-white/90 shadow p-4 mb-2">
            <h2 className="text-lg font-semibold mb-1 text-blue-700">3. Use of Information</h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Service delivery, support, and improvement.</li>
              <li>Contacting you about your booking or enquiry.</li>
              <li>Security and legal compliance.</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-white/90 shadow p-4 mb-2">
            <h2 className="text-lg font-semibold mb-1 text-blue-700">4. Sharing</h2>
            <p className="text-gray-700">
              We never sell your data. We may share it with partners who help us operate, or as required by law.
            </p>
          </section>

          <section className="rounded-2xl bg-white/90 shadow p-4 mb-2">
            <h2 className="text-lg font-semibold mb-1 text-blue-700">5. Security & Rights</h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>We use modern security practices.</li>
              <li>You may access, update, or request deletion of your data.</li>
              <li>Contact us to manage your information or privacy preferences.</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-white/90 shadow p-4 mb-2">
            <h2 className="text-lg font-semibold mb-1 text-blue-700">6. Cookies</h2>
            <p className="text-gray-700">
              We use cookies to improve your experience. You may manage cookies in your browser.
            </p>
          </section>

          <section className="rounded-2xl bg-white/90 shadow p-4 mb-2">
            <h2 className="text-lg font-semibold mb-1 text-blue-700">7. Changes & Contact</h2>
            <p className="text-gray-700">
              We may update this policy from time to time. For questions or requests,{" "}
              <Link href="/contact" className="text-blue-700 underline">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
