"use client";
// Google Maps embed
export default function VenueMap({ lat, lng }: { lat: number; lng: number }) {
  const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  return (
    <div className="rounded-lg overflow-hidden border border-blue-100">
      <iframe
        src={mapUrl}
        width="100%"
        height="200"
        loading="lazy"
        style={{ border: 0 }}
        allowFullScreen
        aria-hidden="false"
        tabIndex={0}
        title="Venue Location Map"
      ></iframe>
    </div>
  );
}
