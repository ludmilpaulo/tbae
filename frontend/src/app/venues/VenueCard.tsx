import { Venue } from "@/types/venue";
import Image from "next/image";

export default function VenueCard({
  venue,
  onDetails,
  onQuote,
}: {
  venue: Venue;
  onDetails: () => void;
  onQuote: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col hover:shadow-2xl transition">
      {venue.images?.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto">
          {venue.images.map((img) => (
            <div key={img.id} className="relative w-40 h-24 flex-shrink-0">
              <Image
                src={img.image}
                alt={img.caption || venue.name}
                fill
                sizes="160px" // adjust as needed
                className="rounded shadow object-cover"
                style={{ objectFit: "cover" }}
                priority={false}
              />
            </div>
          ))}
        </div>
      )}
      <h2 className="text-lg font-bold text-blue-700 mb-1">{venue.name}</h2>
      <div className="mb-1 text-gray-600 text-sm">
        {venue.town?.name}, {venue.province?.name}
      </div>
      <p className="text-sm text-gray-500 mb-2">{venue.description}</p>
      <div className="flex gap-3 mt-auto">
        <button
          className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full font-semibold hover:bg-blue-100 transition"
          onClick={onDetails}
        >
          View Details
        </button>
        <button
          className="bg-gradient-to-r from-blue-600 via-green-400 to-cyan-400 text-white font-bold px-5 py-1 rounded-full shadow-lg hover:scale-105 transition"
          onClick={onQuote}
        >
          Request a Quote
        </button>
      </div>
    </div>
  );
}
