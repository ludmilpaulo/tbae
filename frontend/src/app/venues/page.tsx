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
import { venuesApi } from "@/redux/services/venuesApi";

export default function VenuesPage() {
  // Redux queries
  const { data: provinces = [], isLoading: loadingProvinces, error: errorProvinces } = useGetProvincesQuery();
  const [province, setProvince] = useState<number | null>(null);

  // Fetch towns only when a province is selected
  const { data: towns = [] } = useGetTownsQuery(province ?? undefined);
  const [town, setTown] = useState<number | null>(null);

  // Fetch venues for current province/town
  const {
    data: venues = [],
    isLoading: loadingVenues,
    error: errorVenues,
  } = useGetVenuesQuery(
    { provinceId: province ?? undefined, townId: town ?? undefined },
    {
      skip: !province, // Only skip if no province selected
      refetchOnMountOrArgChange: true,
    }
  );

  // UI state
  const [search, setSearch] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [quoteVenue, setQuoteVenue] = useState<Venue | null>(null);
  
  // Simplified approach - remove complex fallback that might cause 500 errors

  const router = useRouter();

  // Clear RTK Query cache on venues page load
  useEffect(() => {
    // Reset venues API cache to ensure fresh data
    venuesApi.util.resetApiState();
    console.log('RTK Query cache cleared for venues');
  }, []);

  // Debug logging for production
  useEffect(() => {
    console.log('Venues Debug:', {
      province,
      town,
      provinces: provinces.length,
      towns: towns.length,
      venues: venues.length,
      loadingVenues,
      errorVenues,
      filteredVenues: venues?.filter(
        v =>
          v?.name?.toLowerCase().includes(search.toLowerCase()) ||
          v?.description?.toLowerCase().includes(search.toLowerCase())
      )?.length || 0,
      // Additional debugging
      provincesData: provinces,
      venuesData: venues?.slice(0, 2) || [], // First 2 venues for inspection
      apiBase: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
    });
    
    // Log errors in detail
    if (errorVenues) {
      console.error('Venues Error Details:', errorVenues);
    }
    
    // Simple debug logging only - no complex fallback
    if (province) {
      console.log('Province selected:', province, 'Venues count:', venues.length);
    }
  }, [province, town, provinces, towns, venues, loadingVenues, errorVenues, search]);

  // Handle auto-select of first province/town
  useEffect(() => {
    if (provinces.length && (province === null || !provinces.some(p => p.id === province))) {
      setProvince(provinces[0].id);
    }
  }, [provinces, province]);

  // Removed complex fallback logic that was causing 500 errors

  // Do not auto-select a town; let users optionally narrow down

  // Optional: Scroll to top when opening details modal (great for mobile)
  useEffect(() => {
    if (selectedVenue) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedVenue]);

  // Filter by search
  const filteredVenues = venues?.filter(
    v =>
      v?.name?.toLowerCase().includes(search.toLowerCase()) ||
      v?.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Book Venue handler
  const handleBookVenue = (venue: Venue) => {
    // Route to /venues/[id]/book page
    router.push(`/venues/${venue.id}/book`);
  };

  // Manual cache clear function for debugging
  const clearAllCaches = () => {
    // Clear RTK Query cache
    venuesApi.util.resetApiState();
    
    // Clear browser storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear service worker cache
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Force reload
    window.location.reload();
  };

  // Loading and error
  if (loadingProvinces || loadingVenues)
    return <div className="text-center text-gray-500 py-12">Loading venues...</div>;
  if (errorProvinces || errorVenues)
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
      
      {/* Debug cache clear button */}
      <div className="text-center mb-4">
        <button
          onClick={clearAllCaches}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
        >
          Clear Cache & Reload (Debug)
        </button>
      </div>

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
