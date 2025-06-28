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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
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
        <Image
          src="/logo.png"
          alt="TBAE Logo"
          width={76}
          height={76}
          className="mb-3"
          priority
        />
        <h1 className="text-4xl font-extrabold text-blue-700 mb-3 text-center">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center">
          We’re here to help! Send us your enquiry, suggestion, or request and our team will get back to you promptly.
        </p>
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

      {/* Contact details and Social Icons */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        <div>
          Or email us at{" "}
          <a
            href="mailto:info@tbae.co.za"
            className="text-blue-600 underline"
          >
            info@tbae.co.za
          </a>
        </div>
        <div>
          Tel:{" "}
          <a
            href="tel:+27117651693"
            className="text-blue-600 underline"
          >
            +27 833990000
          </a>
        </div>
        <h2 className="text-xl font-bold my-6 text-blue-700">Connect with us</h2>
        <div className="flex flex-wrap gap-4 justify-center items-center mt-2">
          <SocialIcon
            href="https://www.facebook.com/teambuildingandevents"
            ariaLabel="Facebook"
            className="bg-[#3b5998] hover:ring-[#3b5998]/40"
          >
            <FaFacebookF />
          </SocialIcon>
          <SocialIcon
            href="https://instagram.com/tbaeza"
            ariaLabel="Instagram"
            className="bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-600 hover:ring-pink-400/40"
          >
            <FaInstagram />
          </SocialIcon>
          <SocialIcon
            href="https://twitter.com/tbaesa"
            ariaLabel="Tumblr"
            className="bg-[#65c8fa] hover:ring-[#65c8fa]/40"
          >
            <FaTumblr />
          </SocialIcon>
          <SocialIcon
            href="http://www.pinterest.com/tbaeevents/"
            ariaLabel="Pinterest"
            className="bg-[#cb2027] hover:ring-[#cb2027]/40"
          >
            <FaPinterestP />
          </SocialIcon>
          <SocialIcon
            href="http://www.linkedin.com/company/tbae-team-building-and-events"
            ariaLabel="LinkedIn"
            className="bg-[#0077b5] hover:ring-[#0077b5]/40"
          >
            <FaLinkedinIn />
          </SocialIcon>
          <SocialIcon
            href="https://www.youtube.com/user/TBAETeamBuilding"
            ariaLabel="YouTube"
            className="bg-[#ff0000] hover:ring-[#ff0000]/40"
          >
            <FaYoutube />
          </SocialIcon>
        </div>
      </div>
    </main>
  );
}

/**
 * Social icon button – Accessible, styled, and animated
 */
function SocialIcon({
  href,
  ariaLabel,
  className,
  children,
}: {
  href: string;
  ariaLabel: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`w-10 h-10 flex items-center justify-center rounded-full text-white shadow-md p-2 hover:scale-110 hover:ring-4 transition-all duration-200 text-2xl ${className}`}
      tabIndex={0}
    >
      {children}
    </Link>
  );
}
