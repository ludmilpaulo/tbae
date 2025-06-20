import VenueGallery from "./VenueGallery";
import VenueMap from "./VenueMap";
import { Venue } from "@/types/venue"; // ← Import your strict Venue type

interface VenueDetailsModalProps {
  open: boolean;
  venue: Venue | null;
  onClose: () => void;
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
        {venue.latitude && venue.longitude && (
          <VenueMap lat={venue.latitude} lng={venue.longitude} />
        )}
        <div className="flex justify-end mt-4">
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
