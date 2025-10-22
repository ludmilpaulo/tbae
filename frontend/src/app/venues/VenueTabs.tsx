"use client";

import { useState } from "react";
import Image from "next/image";
import { Venue } from "@/types/venue";

interface VenueTabsProps {
  regions: string[];
  venues: Venue[];
}

export default function VenueTabs({ regions, venues }: VenueTabsProps) {
  const [activeRegion, setActiveRegion] = useState(regions[0]);

  // If you want region == province.name (recommended), adjust here:
  const filteredVenues = venues.filter((v) => v.province.name === activeRegion);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {regions.map((region) => (
          <button
            key={region}
            className={`px-5 py-2 rounded-full font-semibold transition
              ${region === activeRegion
                ? "bg-blue-600 text-white shadow"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
            onClick={() => setActiveRegion(region)}
          >
            {region}
          </button>
        ))}
      </div>
      {/* Venues */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredVenues.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No venues available for this region.
          </div>
        ) : (
          filteredVenues.map((venue) => {
            // Get first image (if any)
            const firstImg = venue.images?.[0]?.image || "/no-image.png";
            return (
              <div key={venue.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
                <div className="w-full h-[180px] relative mb-3">
                  <Image
                    src={firstImg}
                    alt={venue.name}
                    fill
                    className="rounded-lg object-cover w-full h-[180px] bg-gray-100"
                    sizes="(max-width: 768px) 100vw, 340px"
                  />
                </div>
                <h3 className="text-lg font-bold text-blue-700 mb-1">{venue.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{venue.town.name}, {venue.province.name}</p>
                {venue.description && (
                  <p className="text-xs text-gray-400 text-center">{venue.description}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
