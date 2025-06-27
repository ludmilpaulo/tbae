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

    // TODO: Replace this with real Django backend API call:
    try {
      const res = await fetch("/api/quote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSent(true);
      } else {
        alert("There was an error sending your quote. Please try again or use the alternative form below.");
      }
    } catch (err) {
      alert("Error sending your quote. Please try again later.");
    }
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
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Request a Quote</h1>
      <p className="mb-8 text-gray-600">
        Fill in your details and we’ll send a customized quote for your next event, team building, or venue booking.
      </p>
      {!sent ? (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-5 border border-blue-50">
          {/* ...all your form fields here... */}
          {/* (same as above) */}
          <div className="flex gap-4">
            <input name="name" value={form.name} onChange={handleChange} required type="text" className="flex-1 rounded border border-blue-200 px-4 py-2" placeholder="Your Name" />
            <input name="company" value={form.company} onChange={handleChange} type="text" className="flex-1 rounded border border-blue-200 px-4 py-2" placeholder="Company (optional)" />
          </div>
          <div className="flex gap-4">
            <input name="email" value={form.email} onChange={handleChange} required type="email" className="flex-1 rounded border border-blue-200 px-4 py-2" placeholder="Email" />
            <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="flex-1 rounded border border-blue-200 px-4 py-2" placeholder="Phone (optional)" />
          </div>
          <div className="flex gap-4">
            <select name="eventType" value={form.eventType} onChange={handleChange} required className="flex-1 rounded border border-blue-200 px-4 py-2">
              <option value="">Event Type</option>
              {EVENT_TYPES.map(type => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <input name="venue" value={form.venue} onChange={handleChange} type="text" className="flex-1 rounded border border-blue-200 px-4 py-2" placeholder="Preferred Venue (optional)" />
          </div>
          <div className="flex gap-4">
            <input name="date" value={form.date} onChange={handleChange} type="date" className="flex-1 rounded border border-blue-200 px-4 py-2" />
          </div>
          <textarea name="message" value={form.message} onChange={handleChange} required className="rounded border border-blue-200 px-4 py-2 min-h-[88px]" placeholder="Tell us about your event, group size, special requirements, etc." />
          <input name="spam" value={form.spam} onChange={handleChange} type="text" className="hidden" tabIndex={-1} autoComplete="off" />
          <button type="submit" className="bg-blue-600 text-white font-bold rounded py-3 mt-2 hover:bg-blue-700 shadow" disabled={loading}>
            {loading ? "Sending..." : "Request Quote"}
          </button>
        </form>
      ) : (
        <div className="max-w-xl mx-auto mt-10 bg-green-50 rounded-lg shadow p-8 text-center">
          <h1 className="text-3xl font-bold text-green-700 mb-2">Thank you!</h1>
          <p className="text-gray-700 mb-6">
            Your quote request has been received. We’ll be in touch within 1 business day.
          </p>
          <Link href="/" className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition">Back to Home</Link>
        </div>
      )}

      {/* --- Optionally, also show external quote form (iframe) as backup --- */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-blue-700 mb-2">Prefer a quick online form?</h2>
        <iframe
          title="TBAE Quote request"
          src="https://tbaeza.clientary.com/forms/139151/docview"
          width="100%"
          height="700"
          scrolling="no"
          frameBorder={0}
          allowTransparency={true}
          style={{ border: "none", minHeight: 700, width: "100%" }}
        />
        <div className="text-gray-400 text-xs text-center mt-2">
          This is a secure form powered by Clientary.
        </div>
      </div>
    </main>
  );
}
