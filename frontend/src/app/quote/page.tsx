"use client";

import { useState } from "react";
import Link from "next/link";

const EVENT_TYPES = [
  "Team Building",
  "Corporate Event",
  "Workshop",
  "Virtual Event",
  "Other"
];

export default function QuotePage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    eventType: "",
    venue: "",
    date: "",
    message: "",
    spam: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Simulate success (replace with real API call)
    setTimeout(() => {
      setSent(true);
      setLoading(false);
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        eventType: "",
        venue: "",
        date: "",
        message: "",
        spam: ""
      });
    }, 1200);
  }

  if (sent) {
    return (
      <div className="max-w-xl mx-auto mt-20 bg-green-50 rounded-lg shadow p-8 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Thank you!</h1>
        <p className="text-gray-700 mb-6">
          Your quote request has been received. We’ll be in touch within 1 business day.
        </p>
        <Link href="/" className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition">Back to Home</Link>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Request a Quote</h1>
      <p className="mb-8 text-gray-600">
        Fill in your details and we’ll send a customized quote for your next event, team building, or venue booking.
      </p>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-5 border border-blue-50">
        <div className="flex gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            type="text"
            className="flex-1 rounded border border-blue-200 px-4 py-2"
            placeholder="Your Name"
          />
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            type="text"
            className="flex-1 rounded border border-blue-200 px-4 py-2"
            placeholder="Company (optional)"
          />
        </div>
        <div className="flex gap-4">
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
            className="flex-1 rounded border border-blue-200 px-4 py-2"
            placeholder="Email"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            className="flex-1 rounded border border-blue-200 px-4 py-2"
            placeholder="Phone (optional)"
          />
        </div>
        <div className="flex gap-4">
          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            required
            className="flex-1 rounded border border-blue-200 px-4 py-2"
          >
            <option value="">Event Type</option>
            {EVENT_TYPES.map(type => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            type="text"
            className="flex-1 rounded border border-blue-200 px-4 py-2"
            placeholder="Preferred Venue (optional)"
          />
        </div>
        <div className="flex gap-4">
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            type="date"
            className="flex-1 rounded border border-blue-200 px-4 py-2"
          />
        </div>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          className="rounded border border-blue-200 px-4 py-2 min-h-[88px]"
          placeholder="Tell us about your event, group size, special requirements, etc."
        />

        {/* Simple spam honeypot (should be hidden in production) */}
        <input
          name="spam"
          value={form.spam}
          onChange={handleChange}
          type="text"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white font-bold rounded py-3 mt-2 hover:bg-blue-700 shadow"
          disabled={loading}
        >
          {loading ? "Sending..." : "Request Quote"}
        </button>
      </form>
    </main>
  );
}
