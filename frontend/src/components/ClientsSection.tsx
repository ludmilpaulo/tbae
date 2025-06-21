"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useGetClientsQuery } from "@/redux/services/clientApi";

export default function ClientsSection() {
  const { data: clients = [] } = useGetClientsQuery();
  const [isHovered, setIsHovered] = useState(false);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Duplicate clients for smooth infinite scroll
  const logos = [...clients, ...clients];

  useEffect(() => {
    if (trackRef.current) {
      setCarouselWidth(trackRef.current.scrollWidth / 2);
    }
  }, [clients]);

  useEffect(() => {
    if (!carouselWidth) return;
    async function animate() {
      await controls.start({
        x: [0, -carouselWidth],
        transition: {
          x: { duration: (logos.length / 2) * 2.2, ease: "linear", repeat: Infinity },
        },
      });
    }
    if (!isHovered) {
      animate();
    } else {
      controls.stop();
    }
    // eslint-disable-next-line
  }, [isHovered, carouselWidth]);

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-blue-700 mb-6">
          Trusted by Leading Companies
        </h2>
        <p className="text-center text-gray-500 mb-10">
          We’re proud to have facilitated team building for South Africa’s most innovative organizations.
        </p>
        {/* Carousel */}
        <div
          className="overflow-hidden relative py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex gap-10 min-w-max"
            ref={trackRef}
            animate={controls}
            style={{ x: 0 }}
          >
            {logos.map((client, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center min-w-[128px]"
                style={{ width: 128 }}
              >
                <div className="bg-white rounded-lg shadow-md flex items-center justify-center w-28 h-16 p-2 hover:shadow-xl transition">
                  <Image
                    src={client.logo}
                    alt={client.name + " logo"}
                    width={110}
                    height={48}
                    className="object-contain max-h-12"
                  />
                </div>
                <span className="mt-2 text-xs text-gray-500">{client.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
