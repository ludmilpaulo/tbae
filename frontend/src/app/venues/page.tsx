"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  useGetProvincesQuery,
  useGetTownsQuery,
  useGetVenuesQuery,
} from "@/redux/services/venuesApi";

import ProvinceSelector from "./ProvinceSelector";
import TownSelector from "./TownSelector";
import VenueCard from "./VenueCard";
import VenueSearch from "./VenueSearch";
import VenueDetailsModal from "./VenueDetailsModal";
import QuoteModal from "@/components/QuoteModal";

import { Venue } from "@/types/venue";
import { useRouter } from "next/navigation";

export default function VenuesPage() {
  // Redux queries
  const { data: provinces = [], isLoading: loadingProvinces, error: errorProvinces } = useGetProvincesQuery();
  const [province, setProvince] = useState<number | null>(null);

  // Fetch towns only when a province is selected
  const { data: towns = [], isLoading: loadingTowns, error: errorTowns } = useGetTownsQuery(province ?? undefined);
  const [town, setTown] = useState<number | null>(null);

  // Fetch venues for current province/town
  const {
    data: venues = [],
    isLoading: loadingVenues,
    error: errorVenues
  } = useGetVenuesQuery({ provinceId: province ?? undefined, townId: town ?? undefined }, {
    skip: !province || !town,
  });

  // UI state
  const [search, setSearch] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [quoteVenue, setQuoteVenue] = useState<Venue | null>(null);

  const router = useRouter();

  // Handle auto-select of first province/town
  useEffect(() => {
    if (provinces.length && (province === null || !provinces.some(p => p.id === province))) {
      setProvince(provinces[0].id);
    }
  }, [provinces, province]);

  useEffect(() => {
    if (towns.length && (town === null || !towns.some(t => t.id === town))) {
      setTown(towns[0].id);
    }
  }, [towns, town]);

  // Optional: Scroll to top when opening details modal (great for mobile)
  useEffect(() => {
    if (selectedVenue) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedVenue]);

  // Filter by search
  const filteredVenues = venues.filter(
    v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.description.toLowerCase().includes(search.toLowerCase())
  );

  // Book Venue handler
  const handleBookVenue = (venue: Venue) => {
    // Route to /venues/[id]/book page
    router.push(`/venues/${venue.id}/book`);
  };

  // Loading and error
  if (loadingProvinces || loadingTowns || loadingVenues)
    return <div className="text-center text-gray-500 py-12">Loading venues...</div>;
  if (errorProvinces || errorTowns || errorVenues)
    return <div className="text-center text-red-600 py-12">Failed to load data.</div>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <nav className="mb-3 text-sm">
        <Link href="/" className="text-blue-700 hover:underline">
          Home
        </Link>
        {" > "}
        <span className="text-blue-700 font-bold">Venues</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-3 text-center">
        Corporate Team Building Venues
      </h1>
      <p className="text-center text-lg text-gray-600 mb-8">
        Find the perfect venue for your next event. Search by province, town, or keyword.
      </p>

      {/* Selectors and search */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <ProvinceSelector provinces={provinces} selected={province} setSelected={setProvince} />
        <TownSelector towns={towns} selected={town} setSelected={setTown} />
        <VenueSearch value={search} setValue={setSearch} />
      </div>

      {/* Venues grid */}
      {filteredVenues.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onDetails={() => setSelectedVenue(venue)}
              onQuote={() => setQuoteVenue(venue)}
              // Optional: Uncomment to show "Book Venue" on each card:
              // onBook={() => handleBookVenue(venue)}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-12 text-lg">
          No venues available matching your search.
        </div>
      )}

      {/* Modals */}
     <VenueDetailsModal
        open={!!selectedVenue}
        venue={selectedVenue}
        onClose={() => setSelectedVenue(null)}
       onBookVenue={handleBookVenue}
        />

      <QuoteModal open={!!quoteVenue} venue={quoteVenue} onClose={() => setQuoteVenue(null)} />
    </main>
  );
}
