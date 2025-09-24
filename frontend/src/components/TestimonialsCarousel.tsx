"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import { useGetTestimonialsQuery } from "@/redux/services/testimonialsApi";
import type { Testimonial } from "@/types/testimonial";

export default function TestimonialsCarousel() {
  // transformResponse guarantees an array; default to [] for safety at render
  const { data: testimonials = [], isLoading } = useGetTestimonialsQuery();

  // Extra guard in case stale bundles return older shapes
  const list: Testimonial[] = Array.isArray(testimonials) ? testimonials : [];
  const displayTestimonials: Testimonial[] = list.length > 0 ? list.concat(list) : [];

  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateWidth = () => setContainerWidth(el.offsetWidth || 0);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (containerWidth === 0 || displayTestimonials.length === 0) return;

    const totalWidth = containerWidth * displayTestimonials.length;
    const duration = Math.max((displayTestimonials.length / 2) * 5, 8);

    if (!isHovered) {
      controls.start({
        x: [0, -totalWidth],
        transition: { repeat: Infinity, repeatType: "loop", duration, ease: "linear" },
      });
    } else {
      controls.stop();
    }
  }, [isHovered, containerWidth, displayTestimonials.length, controls]);

  return (
    <div
      className="relative max-w-2xl mx-auto h-[320px] overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={containerRef}
    >
      {isLoading ? (
        <div className="text-center py-32 text-gray-400">Loading testimonials…</div>
      ) : displayTestimonials.length === 0 ? (
        <div className="text-center py-32 text-gray-400">No testimonials yet.</div>
      ) : (
        <motion.div className="flex" animate={controls} style={{ x: 0 }}>
          {displayTestimonials.map((t, idx) => {
            const key = `${String((t as { id: number | string }).id ?? idx)}-${idx}`;
            const avatar =
              typeof (t as { avatar?: string }).avatar === "string" && (t as { avatar?: string }).avatar
                ? (t as { avatar: string }).avatar
                : "/default-avatar.png";
            const name = (t as { name?: string }).name ?? "Client";
            const company = (t as { company?: string }).company ?? "";
            const feedback = (t as { feedback?: string; text?: string }).feedback ?? (t as { text?: string }).text ?? "";

            return (
              <div key={key} className="flex-shrink-0 w-full px-4 py-8" style={{ width: containerWidth || 350 }}>
                <div className="bg-gradient-to-br from-cyan-50 to-green-100 rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center min-h-[260px] justify-center border border-blue-100">
                  <div className="mb-3">
                    <Image
                      src={avatar}
                      alt={`${company || name} avatar`}
                      width={64}
                      height={64}
                      className="rounded-full shadow-lg object-contain border-2 border-white bg-white"
                      unoptimized={avatar.startsWith("/")}
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-center mb-2">
                    <FaCheckCircle className="text-green-400" />
                    <span className="font-bold text-blue-700">{name}</span>
                  </div>
                  <blockquote className="text-gray-700 italic mb-2 text-lg text-center leading-snug">
                    “{feedback}”
                  </blockquote>
                  <span className="text-xs text-gray-500">{company}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
