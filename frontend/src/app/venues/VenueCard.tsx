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
  const heroImage = venue.images?.[0]?.image;

  return (
    <div className="group rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 hover:shadow-xl hover:ring-gray-200 transition-all duration-300">
      <div className="relative h-48 w-full">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={venue.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">{venue.province?.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 text-xs rounded-full bg-white/90 text-blue-700 font-semibold">
            {venue.province?.name}
          </span>
          {venue.town?.name && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-white/90 text-gray-700">
              {venue.town.name}
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-extrabold text-lg drop-shadow-sm line-clamp-2">{venue.name}</h3>
        </div>
      </div>

      <div className="p-4">
        {venue.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">{venue.description}</p>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            onClick={onDetails}
          >
            View Details
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md hover:shadow-lg hover:opacity-95 active:opacity-90 transition"
            onClick={onQuote}
          >
            Request a Quote
          </button>
        </div>
      </div>
    </div>
  );
}
