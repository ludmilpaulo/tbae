"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useGetClientsQuery } from "@/redux/services/clientApi";

type Client = { id: number | string; name: string; logo: string };

export default function ClientsSection() {
  // ✅ ALWAYS an array at render time
  const { data: clients = [] } = useGetClientsQuery();

  // duplicate only if we have items (uses concat, not spread)
  const logos: Client[] = clients.length > 0 ? clients.concat(clients) : [];

  const [isHovered, setIsHovered] = useState(false);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (trackRef.current) setCarouselWidth(trackRef.current.scrollWidth / 2);
  }, [logos.length]);

  useEffect(() => {
    if (!carouselWidth || logos.length === 0) return;
    const baseCount = logos.length / 2;
    const duration = Math.max(baseCount * 2.2, 6);
    if (!isHovered) {
      controls.start({
        x: [0, -carouselWidth],
        transition: { x: { duration, ease: "linear", repeat: Infinity } },
      });
    } else {
      controls.stop();
    }
  }, [isHovered, carouselWidth, logos.length, controls]);

  if (logos.length === 0) {
    return (
      <section className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-2">
            Trusted by Leading Companies
          </h2>
          <p className="text-gray-500">Client logos will appear here soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-blue-700 mb-6">
          Trusted by Leading Companies
        </h2>
        <p className="text-center text-gray-500 mb-10">
          We’re proud to have facilitated team building for South Africa’s most innovative organizations.
        </p>

        <div
          className="overflow-hidden relative py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div className="flex gap-10 min-w-max" ref={trackRef} animate={controls} style={{ x: 0 }}>
            {logos.map((client, idx) => {
              const key = `${String(client.id)}-${idx}`;
              const src = client.logo?.trim() ? client.logo : "/logo.png";
              return (
                <div key={key} className="flex flex-col items-center min-w-[128px]" style={{ width: 128 }}>
                  <div className="bg-white rounded-lg shadow-md flex items-center justify-center w-28 h-16 p-2 hover:shadow-xl transition">
                    <Image
                      src={src}
                      alt={`${client.name} logo`}
                      width={110}
                      height={48}
                      className="object-contain max-h-12"
                      unoptimized={src.startsWith("/")}
                    />
                  </div>
                  <span className="mt-2 text-xs text-gray-500">{client.name}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
