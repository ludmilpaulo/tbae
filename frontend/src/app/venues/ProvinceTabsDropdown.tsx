"use client";

import { useEffect, useState } from "react";

interface ProvinceTabsDropdownProps {
  provinces: string[];
  active: string;
  setActive: (province: string) => void;
}

export default function ProvinceTabsDropdown({
  provinces,
  active,
  setActive,
}: ProvinceTabsDropdownProps) {
  // Mobile detection using window width (SSR safe)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Dropdown on mobile
  if (isMobile) {
    return (
      <select
        className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 mb-6 focus:ring-blue-500 focus:border-blue-500"
        value={active}
        onChange={e => setActive(e.target.value)}
      >
        {provinces.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    );
  }

  // Tabs on desktop
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {provinces.map((province) => (
        <button
          key={province}
          className={`px-5 py-2 rounded-full font-semibold transition
            ${province === active
              ? "bg-blue-600 text-white shadow"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
          onClick={() => setActive(province)}
        >
          {province}
        </button>
      ))}
    </div>
  );
}
