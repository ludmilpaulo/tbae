"use client";
import Image from "next/image";
import { useGetClientsQuery } from "@/redux/services/clientApi"; // Your RTK Query hook
import { useGetTestimonialsQuery } from "@/redux/services/testimonialsApi";

import { FaCheckCircle } from "react-icons/fa";
import { Testimonial } from "@/types/testimonial";
import { Client } from "@/types/client";

// Dummy stats for illustration
const stats = [
  { label: "Clients Served", value: 250 },
  { label: "Events Delivered", value: 1200 },
  { label: "Years Experience", value: 16 },
  { label: "Positive Feedback", value: "98%" },
];

export default function SuccessPage() {
  const { data: clients = [] } = useGetClientsQuery();
  const { data: testimonials = [] } = useGetTestimonialsQuery();

  // --- Testimonials carousel logic (auto-scroll) ---
  // (Use your preferred carousel component if you want.)
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 drop-shadow mb-4">
          Success Stories
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover why South Africa’s most innovative organizations trust TBAE for their team building.
        </p>
      </section>

      {/* Stats */}
      <section className="mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-md p-6 flex flex-col items-center border border-blue-50 hover:shadow-lg transition">
              <span className="text-4xl font-extrabold text-blue-700 mb-2 animate-bounce">{stat.value}</span>
              <span className="text-sm text-gray-700 font-semibold text-center">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Client Logos */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Our Clients</h2>
        <div className="flex flex-wrap justify-center gap-7">
          {clients.slice(0, 28).map((client: Client) => (
            <div key={client.id || client.id} className="flex flex-col items-center min-w-[128px]">
              <div className="bg-white rounded-lg shadow flex items-center justify-center w-28 h-16 p-2 hover:shadow-xl transition">
                <Image
                  src={client.logo.startsWith("http") ? client.logo : "/" + client.logo}
                  alt={client.name}
                  width={110}
                  height={48}
                  className="object-contain max-h-12"
                />
              </div>
              <span className="mt-2 text-xs text-gray-500">{client.name}</span>
            </div>
          ))}
        </div>
        {clients.length > 28 && (
          <div className="text-center mt-4">
            <span className="text-blue-600">...and many more!</span>
          </div>
        )}
      </section>

      {/* Testimonials Carousel */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-blue-700 text-center mb-8">What Our Clients Say</h2>
        <TestimonialsCarousel testimonials={testimonials} />
      </section>
    </main>
  );
}

// Carousel for testimonials
function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null;
  // Double for infinite scroll
  const display = [...testimonials, ...testimonials];
  // Carousel logic: manual/auto scroll can be added as needed
  return (
    <div className="relative max-w-2xl mx-auto h-[320px] overflow-hidden group">
      <div className="flex animate-carousel group-hover:pause">
        {display.map((t, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full px-4 py-8"
            style={{ width: 400 }}
          >
            <div className="bg-gradient-to-br from-cyan-50 to-green-100 rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center min-h-[260px] justify-center border border-blue-100">
              <div className="mb-3">
                <Image
                  src={t.avatar || t.image || "/logo.png"}
                  alt={t.company || t.name}
                  width={64}
                  height={64}
                  className="rounded-full shadow-lg object-contain border-2 border-white bg-white"
                />
              </div>
              <div className="flex items-center gap-2 justify-center mb-2">
                <FaCheckCircle className="text-green-400" />
                <span className="font-bold text-blue-700">{t.name}</span>
              </div>
              <blockquote className="text-gray-700 italic mb-2 text-lg text-center leading-snug">
                “{t.feedback || t.text }”
              </blockquote>
              <span className="text-xs text-gray-500">{t.company}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Carousel animation can be added with Framer Motion or CSS */}
      {/* Dots, arrows, swipe: can be added as needed */}
    </div>
  );
}
