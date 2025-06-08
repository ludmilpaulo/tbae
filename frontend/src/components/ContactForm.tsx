"use client";
import { useState } from "react";

export default function ContactForm({ setLoading }: { setLoading: (b: boolean) => void }) {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      // Replace with your API endpoint
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) setSuccess("Message sent!");
      else throw new Error("Failed to send");
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <form className="space-y-6 max-w-lg" onSubmit={handleSubmit}>
      <input
        name="name"
        required
        className="w-full border p-3 rounded"
        placeholder="Your Name"
        value={values.name}
        onChange={handleChange}
      />
      <input
        name="email"
        required
        type="email"
        className="w-full border p-3 rounded"
        placeholder="Your Email"
        value={values.email}
        onChange={handleChange}
      />
      <textarea
        name="message"
        required
        rows={5}
        className="w-full border p-3 rounded"
        placeholder="Your Message"
        value={values.message}
        onChange={handleChange}
      />
      <button type="submit" className="bg-blue-600 text-white font-bold px-8 py-3 rounded hover:bg-blue-700">
        Send Message
      </button>
      {success && <div className="text-green-600">{success}</div>}
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}
