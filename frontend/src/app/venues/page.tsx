"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Example provinces and towns structure
const PROVINCES = [
  "Western Cape",
  "Gauteng",
  "KwaZulu Natal",
  "Eastern Cape",
  "Free State",
  "North West Province",
  "Mpumalanga",
  "Limpopo Province",
  "Northern Cape",
];

const TOWNS: Record<string, string[]> = {
  "Western Cape": ["Cape Town", "Stellenbosch", "Paarl", "Somerset West"],
  "Gauteng": [
    "Johannesburg",
    "Pretoria",
    "Sandton",
    "Midrand",
    "Lanseria",
    "Centurion",
    "Randburg",
    "Fourways",
    "Bedfordview",
    "Kempton Park",
    "Vanderbijlpark",
  ],
  "KwaZulu Natal": ["Durban", "Umhlanga", "Pietermaritzburg"],
  "Eastern Cape": ["Port Elizabeth", "East London"],
  "Free State": ["Bloemfontein"],
  "North West Province": ["Rustenburg", "Hartbeespoort"],
  "Mpumalanga": ["Nelspruit", "Mbombela"],
  "Limpopo Province": ["Polokwane"],
  "Northern Cape": ["Kimberley", "Upington"],
};

// Example venues data (replace with your real data)
const VENUES = [
  {
    id: 1,
    name: "Cape Town Waterfront Venue",
    image: "/venues/capetown.jpg",
    town: "Cape Town",
    province: "Western Cape",
    description: "A beautiful venue at the Cape Town Waterfront, perfect for corporate team building events with stunning mountain views.",
  },
  {
    id: 2,
    name: "Shumba Valley Lodge",
    image: "/venues/shumba-valley.jpg",
    town: "Lanseria",
    province: "Gauteng",
    description:
      "A tranquil country setting close to Johannesburg and Pretoria, offering open grounds and multiple team building activities.",
  },
  {
    id: 3,
    name: "Durban Beachfront Venue",
    image: "/venues/durban.jpg",
    town: "Durban",
    province: "KwaZulu Natal",
    description: "Hold your next team building session with ocean views, direct beach access, and modern amenities.",
  },
  // ...add more venues as needed
];

function ProvinceTabsDropdown({
  provinces,
  active,
  setActive,
}: {
  provinces: string[];
  active: string;
  setActive: (province: string) => void;
}) {
  // Responsive detection (SSR-safe)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Mobile: dropdown
  if (isMobile) {
    return (
      <select
        className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 mb-6 focus:ring-blue-500 focus:border-blue-500 text-base"
        value={active}
        onChange={e => setActive(e.target.value)}
      >
        {provinces.map(p => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    );
  }

  // Desktop: tabs
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {provinces.map(province => (
        <button
          key={province}
          className={`px-5 py-2 rounded-full font-semibold transition shadow-md
            ${province === active
              ? "bg-blue-600 text-white shadow-lg scale-105"
              : "bg-blue-50 text-blue-600 hover:bg-blue-200"}`}
          onClick={() => setActive(province)}
        >
          {province}
        </button>
      ))}
    </div>
  );
}

export default function VenuesPage() {
  // State for province and town
  const [province, setProvince] = useState(PROVINCES[0]);
  const [town, setTown] = useState(TOWNS[PROVINCES[0]][0] || "");

  // Update town if province changes
  useEffect(() => {
    setTown(TOWNS[province]?.[0] || "");
  }, [province]);

  // Filter venues for current selection
  const filteredVenues = VENUES.filter(
    v => v.province === province && v.town === town
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="mb-3 text-sm">
        <a href="/" className="text-blue-700 hover:underline">Home</a>
        {" > "}
        <span className="text-blue-700 font-bold">Venues</span>
      </nav>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-3 text-center">
        Corporate Team Building Venues
      </h1>
      <p className="text-center text-lg text-gray-600 mb-10">
        Choose your province and town to see our available venues. All venues are handpicked for outstanding team building experiences.
      </p>

      {/* Province Selector */}
      <div className="mb-2">
        <label className="block font-bold text-blue-800 mb-2" htmlFor="province">
          Select a Province:
        </label>
        <ProvinceTabsDropdown
          provinces={PROVINCES}
          active={province}
          setActive={setProvince}
        />
      </div>

      {/* Town Selector */}
      <div className="mb-10 max-w-lg mx-auto">
        <label className="block font-bold text-blue-800 mb-2" htmlFor="town">
          Select a Town:
        </label>
        <select
          id="town"
          className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          value={town}
          onChange={e => setTown(e.target.value)}
        >
          {(TOWNS[province] || []).map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Venues List */}
      <div>
        {filteredVenues.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map(venue => (
              <div
                key={venue.id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition"
              >
                <Image
                  src={venue.image}
                  alt={venue.name}
                  width={360}
                  height={180}
                  className="rounded-lg mb-4 object-cover w-full h-[180px] bg-gray-100"
                />
                <h2 className="text-lg font-bold text-blue-700 mb-2 text-center">{venue.name}</h2>
                <p className="text-sm text-gray-500 mb-3 text-center">{venue.description}</p>
                <button
                  className="mt-auto bg-gradient-to-r from-blue-600 via-green-400 to-cyan-400 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition"
                  onClick={() => alert(`Request a quote for ${venue.name}`)}
                >
                  Request a Quote
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-12 text-lg">
            No venues available for <span className="font-semibold">{town}</span> in <span className="font-semibold">{province}</span> yet.
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-16 text-center max-w-3xl mx-auto">
        <h3 className="font-bold text-red-700 mb-2 text-lg">
          TBAE CAN FACILITATE TEAM BUILDING AT ANY SUITABLE VENUE IN SOUTH AFRICA
        </h3>
        <p className="text-gray-700 mb-2">
          Should these venues not be convenient or suitable for your event, we can either find you an alternative venue or you can arrange your own venue and we will come there.
        </p>
        <p className="text-gray-700">
          We offer team building in <a href="/venues/gauteng" className="text-blue-600 underline">Johannesburg</a>,
          <a href="/venues/western-cape" className="text-blue-600 underline ml-1">Cape Town</a>,
          <a href="/venues/gauteng" className="text-blue-600 underline ml-1">Pretoria</a> and
          <a href="/venues/kwazulu-natal" className="text-blue-600 underline ml-1">Durban</a>.
        </p>
      </div>
    </main>
  );
}
