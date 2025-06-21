"use client";

import { useState } from "react";
import { useSubmitContactMutation } from "@/redux/services/contactApi";
import Image from "next/image";

import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaTumblr,
  FaPinterestP,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitContact, { isLoading, isSuccess, isError }] = useSubmitContactMutation();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitContact(form).unwrap();
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-8">
        <Image src="/logo.png" alt="TBAE Logo" width={76} height={76} className="mb-3" />
        <h1 className="text-4xl font-extrabold text-blue-700 mb-3">Contact Us</h1>
        <p className="text-gray-600 text-center">We’re here to help! Send us your enquiry, suggestion, or request and our team will get back to you promptly.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {isSuccess ? (
          <div className="text-green-700 text-lg font-bold text-center py-16">
            Thank you for reaching out!<br />We’ll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <input
                name="name"
                type="text"
                required
                placeholder="Your Name"
                className="border border-blue-200 rounded px-4 py-3 w-full"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Your Email"
                className="border border-blue-200 rounded px-4 py-3 w-full"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <input
              name="phone"
              type="text"
              placeholder="Phone Number (optional)"
              className="border border-blue-200 rounded px-4 py-3 w-full"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Your message"
              className="border border-blue-200 rounded px-4 py-3 w-full"
              value={form.message}
              onChange={handleChange}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-green-400 to-cyan-400 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition text-lg"
            >
              {isLoading ? "Sending..." : "Send Message"}
            </button>
            {isError && (
              <div className="text-red-600 text-center text-sm mt-2">
                Something went wrong. Please try again.
              </div>
            )}
          </form>
        )}
      </div>
      <div className="mt-10 text-center text-gray-500 text-sm">
        <div>Or email us at <a href="mailto:info@tbae.co.za" className="text-blue-600 underline">info@tbae.co.za</a></div>
        <div>Tel: <a href="tel:+27117651693" className="text-blue-600 underline">+27 11 765 1693</a></div>
        <div className="flex gap-3 justify-center mt-4">
          {/* Add social icons as needed */}
          <h2 className="text-xl font-bold mb-2">Connect with us</h2>
                    <div className="flex gap-6 mt-2">
                      <Link href="https://facebook.com/" target="_blank" aria-label="Facebook">
                        <FaFacebookF className="w-10 h-10 rounded-full p-2 bg-[#3b5998] hover:scale-110 transition transform duration-200" />
                      </Link>
                      <Link href="https://instagram.com/" target="_blank" aria-label="Instagram">
                        <FaInstagram className="w-10 h-10 rounded-full p-2 bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-600 hover:scale-110 transition transform duration-200" />
                      </Link>
                      <Link href="https://tumblr.com/" target="_blank" aria-label="Tumblr">
                        <FaTumblr className="w-10 h-10 rounded-full p-2 bg-[#65c8fa] hover:scale-110 transition transform duration-200" />
                      </Link>
                      <Link href="https://pinterest.com/" target="_blank" aria-label="Pinterest">
                        <FaPinterestP className="w-10 h-10 rounded-full p-2 bg-[#cb2027] hover:scale-110 transition transform duration-200" />
                      </Link>
                      <Link href="https://linkedin.com/" target="_blank" aria-label="LinkedIn">
                        <FaLinkedinIn className="w-10 h-10 rounded-full p-2 bg-[#0077b5] hover:scale-110 transition transform duration-200" />
                      </Link>
                      <Link href="https://youtube.com/" target="_blank" aria-label="YouTube">
                        <FaYoutube className="w-10 h-10 rounded-full p-2 bg-[#ff0000] hover:scale-110 transition transform duration-200" />
                      </Link>
                    </div>
        </div>
      </div>
    </main>
  );
}
