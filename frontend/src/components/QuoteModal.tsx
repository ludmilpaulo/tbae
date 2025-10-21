"use client";
import { Venue } from "@/types/venue";
import { useState, useEffect } from "react";
import { baseAPI } from "@/utils/configs";

// Use your actual Venue type from your project for perfect type safety!


export interface QuoteModalProps {
  open: boolean;
  onClose: () => void;
  venue?: Venue | null;
}


export default function QuoteModal({ open, venue, onClose }: QuoteModalProps) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`${baseAPI}/quotes/request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          company: '',
          email: form.email,
          phone: form.phone,
          event_type: 'Team Building',
          venue: venue?.name || '',
          date: '',
          message: form.message,
          spam: ''
        }),
      });

      if (response.ok) {
        setSent(true);
      } else {
        console.error('Quote submission failed:', response.statusText);
        alert('Failed to submit quote request. Please try again.');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      alert('Failed to submit quote request. Please try again.');
    }
  }

  useEffect(() => { if (!open) setSent(false); }, [open]);

  if (!open || !venue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 text-2xl font-bold hover:text-blue-700"
          aria-label="Close"
        >×</button>
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Request a Quote <span className="block text-base text-gray-400 mt-1">{venue.name}</span>
        </h2>
        {sent ? (
          <div className="text-green-600 text-center py-12 font-bold text-lg">
            Thank you! We will contact you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="block w-full border border-blue-300 rounded px-4 py-2"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <input
              className="block w-full border border-blue-300 rounded px-4 py-2"
              type="email"
              placeholder="Your Email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <input
              className="block w-full border border-blue-300 rounded px-4 py-2"
              placeholder="Your Phone"
              required
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
            <textarea
              className="block w-full border border-blue-300 rounded px-4 py-2"
              placeholder="Message (optional)"
              rows={3}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-green-400 to-cyan-400 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition"
            >
              Send Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
