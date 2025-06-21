"use client";
import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Terms of Service</h1>
      <p className="mb-8 text-gray-700">
        Last updated: 21 June 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing and using the TBAE website and services, you agree to comply with these Terms of Service and all applicable laws and regulations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. Use of Services</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          <li>Our services are provided for lawful purposes only.</li>
          <li>You agree not to misuse or disrupt our services, servers, or networks.</li>
          <li>You must provide accurate information for bookings, quotes, or enquiries.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. Bookings and Payments</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          <li>All bookings are subject to availability and confirmation.</li>
          <li>Prices are subject to change. Quotes are valid for a limited period only.</li>
          <li>Payments must be made in accordance with the invoice terms provided.</li>
          <li>Cancellations and refunds are subject to our cancellation policy.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. Intellectual Property</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          <li>
            All content, branding, logos, images, and material on this website are the property of TBAE or its partners and are protected by South African and international copyright laws.
          </li>
          <li>
            You may not copy, reproduce, or use any part of our content without our prior written consent.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Disclaimers & Limitations</h2>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          <li>
            Our services are provided “as is” without warranties of any kind.
          </li>
          <li>
            We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">6. Changes to These Terms</h2>
        <p>
          TBAE reserves the right to update these Terms of Service at any time. Updates will be effective upon posting to this page.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please{" "}
          <Link href="/contact" className="text-blue-700 underline">contact us</Link>.
        </p>
      </section>
    </main>
  );
}
