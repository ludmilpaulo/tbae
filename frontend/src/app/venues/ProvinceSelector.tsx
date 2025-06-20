"use client";

import { Province } from "@/types/venue";
import { useEffect, useState } from "react";

interface ProvinceSelectorProps {
  provinces: Province[];
  selected: number | null;
  setSelected: (provinceId: number) => void;
}

export default function ProvinceSelector({ provinces, selected, setSelected }: ProvinceSelectorProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!provinces.length) return null;

  // On mobile, use dropdown; on desktop, tabs
  return isMobile ? (
    <select
      className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
      value={selected ?? provinces[0]?.id}
      onChange={e => setSelected(Number(e.target.value))}
    >
      {provinces.map(p => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  ) : (
    <div className="flex flex-wrap gap-2 justify-center">
      {provinces.map(p => (
        <button
          key={p.id}
          className={`px-5 py-2 rounded-full font-semibold transition shadow-md
            ${p.id === selected
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-blue-50 text-blue-600 hover:bg-blue-200"
            }`}
          onClick={() => setSelected(p.id)}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
