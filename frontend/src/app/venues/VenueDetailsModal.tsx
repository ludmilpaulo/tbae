import VenueGallery from "./VenueGallery";
import VenueMap from "./VenueMap";
import { Venue } from "@/types/venue";
import Link from "next/link";


interface VenueDetailsModalProps {
  open: boolean;
  venue: Venue | null;
  onClose: () => void;
  onBookVenue?: (venue: Venue) => void; // Pass booking logic/modal trigger here
}

export default function VenueDetailsModal({
  open,
  venue,
  onClose,
 
}: VenueDetailsModalProps) {
  if (!open || !venue) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 text-2xl font-bold hover:text-blue-700"
          aria-label="Close"
        >
          ×
        </button>
        <VenueGallery images={venue.images} />
        <h2 className="text-2xl font-bold text-blue-700 mb-2">{venue.name}</h2>
        <p className="mb-2 text-gray-700">{venue.description}</p>
        <div className="mb-4 text-gray-600 text-sm">
          <strong>Details: </strong>
          {venue.details}
        </div>
        {venue.price && (
          <div className="mb-4 text-green-700 text-lg font-bold">
            From: {new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(Number(venue.price))}
          </div>
        )}
        {venue.latitude && venue.longitude && (
          <VenueMap lat={venue.latitude} lng={venue.longitude} />
        )}
        <div className="flex justify-end mt-4 gap-2">
        <Link
            href={`/venues/${venue.id}/book`}
            className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition text-center"
        >
            Book Venue
        </Link>
        <button
            className="bg-gradient-to-r from-blue-600 via-green-400 to-cyan-400 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition"
            onClick={onClose}
        >
            Close
        </button>
        </div>

      </div>
    </div>
  );
}
