"use client";
import { useGetTestimonialsQuery } from "@/redux/services/testimonialsApi";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

export default function TestimonialsCarousel() {
  const { data: testimonials = [], isLoading } = useGetTestimonialsQuery();
  const [isHovered, setIsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Responsive width
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
    if (containerWidth === 0 || testimonials.length === 0) return;
    const totalWidth = containerWidth * testimonials.length;
    async function loopSlider() {
      await controls.start({
        x: [0, -totalWidth],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: testimonials.length * 5,
          ease: "linear",
        },
      });
    }
    if (!isHovered) loopSlider();
    else controls.stop();
  }, [isHovered, containerWidth, testimonials.length, controls]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const displayTestimonials = [...testimonials, ...testimonials]; // Loop

  return (
    <div
      className="relative max-w-2xl mx-auto h-[320px] overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {isLoading ? (
        <div className="text-center py-32 text-gray-400">Loading testimonials…</div>
      ) : (
        <motion.div className="flex" animate={controls} style={{ x: 0 }}>
          {displayTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-full px-4 py-8"
              style={{ width: containerWidth || 350 }}
            >
              <div className="bg-gradient-to-br from-cyan-50 to-green-100 rounded-2xl shadow-lg px-6 py-8 flex flex-col items-center min-h-[260px] justify-center border border-blue-100">
                <div className="mb-3">
                  <Image
                    src={t.avatar || "/default-avatar.png"}
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
                  “{t.feedback || t.text}”
                </blockquote>
                <span className="text-xs text-gray-500">{t.company}</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}
     
    </div>
  );
}
