"use client";

import Link from "next/link";
import Image from "next/image";
import { FaUsers, FaGlobeAfrica, FaLaptopHouse, FaHandshake } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { useEffect, useState } from "react";
import ClientsSection from "@/components/ClientsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

// HERO IMAGE: /public/team-hero.jpg
// LOGO: /public/logo.png
// CLIENT LOGOS: /public/clients/*.png

export default function HomePage() {
  const [showHero, setShowHero] = useState(false);
  useEffect(() => {
    setShowHero(true);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-400 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Logo & Tagline */}
          <div className="flex-1">
            <Image
              src="/logo.png"
              alt="TBAE Logo"
              width={220}
              height={90}
              className="mb-8"
              priority
            />
            <h1 className={`text-4xl md:text-5xl font-extrabold leading-tight mb-6 transition-all duration-700 ease-in-out ${showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              Team Building <span className="text-green-300">that Moves Your Team Forward</span>
            </h1>
            <p className="mb-8 text-lg text-white/90 max-w-xl">
              Professional team building events and facilitation across South Africa — in-person and virtual, tailored for your company’s needs and success.
            </p>
            <Link href="/teambuilding-quote.htm" className="inline-block bg-green-400 hover:bg-green-500 text-blue-900 font-bold px-6 py-3 rounded-lg shadow-lg transition">
              Book Your Event
            </Link>
          </div>
          {/* Hero Image */}
          <div className="hidden md:block flex-1">
            <video
  src="/video.mp4"
   className="w-full h-auto object-cover"
  autoPlay
  muted
  loop
  playsInline
  poster="/logo.png" // optional, fallback image before video loads
>
  Sorry, your browser does not support embedded videos.
</video>

          </div>
        </div>
        {/* Decorative wave */}
        <svg className="absolute bottom-0 left-0 w-full h-16 text-white" viewBox="0 0 1440 320"><path fill="currentColor" fillOpacity="1" d="M0,64L60,90.7C120,117,240,171,360,186.7C480,203,600,181,720,154.7C840,128,960,96,1080,117.3C1200,139,1320,213,1380,250.7L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
      </section>

      {/* Why TBAE */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Why TBAE?</h2>
          <p className="text-lg text-gray-600 mb-6">
            We’re a mobile team building facilitation company, operating in Cape Town, Johannesburg, Pretoria, Durban, and nationwide. 
            <span className="hidden md:inline"> We also deliver customized virtual team building for remote teams, making connection and collaboration possible wherever you are.</span>
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
            <div className="flex-1 flex flex-col items-center">
              <FaGlobeAfrica className="w-12 h-12 text-green-400 mb-2" />
              <span className="font-bold text-blue-700">National Coverage</span>
              <p className="text-sm text-gray-500">Cape Town, Johannesburg, Pretoria, Durban, and beyond</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <FaLaptopHouse className="w-12 h-12 text-cyan-400 mb-2" />
              <span className="font-bold text-blue-700">Virtual Events</span>
              <p className="text-sm text-gray-500">Fun and effective experiences for remote teams</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <MdEventAvailable className="w-12 h-12 text-green-400 mb-2" />
              <span className="font-bold text-blue-700">Any Group Size</span>
              <p className="text-sm text-gray-500">From startups to multinationals, all are welcome</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features */}
      <section className="bg-blue-50 py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-blue-700 text-center">Our Services</h2>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
              <FaUsers className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Facilitated Team Building</h3>
              <p className="text-gray-600 text-center">Expertly crafted in-person sessions that build trust, communication, and unity—wherever your team is.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
              <FaLaptopHouse className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Virtual Team Building</h3>
              <p className="text-gray-600 text-center">Remote doesn’t mean disconnected! Fun, impactful, and customized virtual experiences for global teams.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
              <FaHandshake className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Custom Events & Workshops</h3>
              <p className="text-gray-600 text-center">Have a unique vision? We’ll partner with you to design the perfect event for your goals and people.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <ClientsSection />

      {/* Testimonials Section */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">What Our Clients Say</h2>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-400 py-12 px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 text-center">
            Ready to energize your team?
          </h2>
          <p className="text-white/90 text-center mb-6 max-w-lg">
            Get in touch for a free consultation or quote. Let’s build your next unforgettable team event together!
          </p>
          <Link
            href="/teambuilding-quote.htm"
            className="inline-block bg-green-400 hover:bg-green-500 text-blue-900 font-bold px-8 py-3 rounded-lg shadow-lg transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
