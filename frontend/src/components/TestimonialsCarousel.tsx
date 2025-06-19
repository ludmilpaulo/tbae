"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

// Testimonials data
const testimonials = [
  {
    name: "Sipho M.",
    quote: "Our team's productivity and morale skyrocketed after the TBAE event. Highly recommended!",
    company: "Johannesburg FinTech",
    logo: "https://ui-avatars.com/api/?name=Johannesburg+FinTech&background=3b82f6&color=fff",
  },
  {
    name: "Janine K.",
    quote: "Their facilitators made the event fun, inclusive, and meaningful. We'll book again!",
    company: "Cape Town Creatives",
    logo: "https://ui-avatars.com/api/?name=Cape+Town+Creatives&background=14b8a6&color=fff",
  },
  {
    name: "Thabo N.",
    quote: "Virtual team building actually brought our remote teams closer together. Brilliant!",
    company: "Durban Digital",
    logo: "https://ui-avatars.com/api/?name=Durban+Digital&background=22d3ee&color=fff",
  },
];

export default function TestimonialsCarousel() {
  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // For continuous movement
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      setContainerWidth(containerRef.current?.offsetWidth || 0);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (containerWidth === 0) return;
    const totalWidth = containerWidth * testimonials.length;

    async function loopSlider() {
      while (true) {
        await controls.start({
          x: [-0, -totalWidth],
          transition: {
            repeat: Infinity,
            repeatType: "loop",
            duration: testimonials.length * 5, // 5 seconds per testimonial
            ease: "linear",
          },
        });
      }
    }
    if (!isHovered) {
      loopSlider();
    } else {
      controls.stop();
    }
    // eslint-disable-next-line
  }, [isHovered, containerWidth]);

  // Pause on hover
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Duplicated testimonials for infinite effect
  const displayTestimonials = [...testimonials, ...testimonials];

  return (
    <div
      className="relative max-w-2xl mx-auto h-[320px] overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <motion.div
        className="flex"
        animate={controls}
        style={{ x: 0 }}
      >
        {displayTestimonials.map((t, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full px-4 py-8"
            style={{ width: containerWidth || 350 }}
          >
            <div className="bg-gradient-to-br from-cyan-50 to-green-100 rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center min-h-[260px] justify-center border border-blue-100">
              <div className="mb-3">
                <Image
                  src={t.logo}
                  alt={`${t.company} logo`}
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
                “{t.quote}”
              </blockquote>
              <span className="text-xs text-gray-500">{t.company}</span>
            </div>
          </div>
        ))}
      </motion.div>
      {/* Dots (manual navigation, optional) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {testimonials.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full transition bg-blue-300 ${
              (Math.round((containerRef.current?.scrollLeft || 0) / (containerWidth || 1)) % testimonials.length) === idx
                ? "bg-blue-700 scale-110"
                : "opacity-60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
