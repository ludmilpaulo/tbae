"use client";
import { useState, useRef, useEffect } from "react";
import {
  useGetGalleryItemsQuery,
  useGetGalleryYearsQuery,
  useGetGalleryCategoriesQuery,
} from "@/redux/services/galleryApi";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  GalleryCategory,
  GalleryEvent,
  GalleryPhoto,
  GalleryVideo,
} from "@/types/gallery";

// Helper for YouTube thumbnail
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/watch\?v=|\/v\/|\/shorts\/))([\w\-]+)/);
  return match ? match[1] : null;
}

// Lazy load QuoteModal to reduce initial bundle
const QuoteModal = dynamic(() => import("@/components/QuoteModal"), { ssr: false });

type ModalState =
  | null
  | { type: "photo"; url: string; caption?: string }
  | { type: "video"; url: string; caption?: string };

export default function GalleryPage() {
  // Filters
  const [category, setCategory] = useState<string>("all");
  const [year, setYear] = useState<number | "all">("all");
  // Pagination
  const [page, setPage] = useState(1);
  const [gallery, setGallery] = useState<GalleryEvent[]>([]);
  const [hasMore, setHasMore] = useState(true);
  // Modal
  const [modal, setModal] = useState<ModalState>(null);
  // Quote form modal
  const [showQuote, setShowQuote] = useState(false);

  // RTK Query: categories, years, gallery items
 const { data: categories = [] } = useGetGalleryCategoriesQuery();
const { data: years = [] } = useGetGalleryYearsQuery();

  const { data, isFetching, refetch } = useGetGalleryItemsQuery(
    { event_type: category !== "all" ? category : undefined, year: year !== "all" ? year : undefined, page },
    { skip: false }
  );

  // Merge new pages
  useEffect(() => {
    if (page === 1) {
      setGallery(data?.results ?? []);
    } else if (data?.results) {
      setGallery((prev) => [...prev, ...data.results]);
    }
    setHasMore(!!data?.next);
  }, [data, page]);

  // Reset page and gallery when filters change
  useEffect(() => {
    setPage(1);
    refetch();
  }, [category, year, refetch]);

  // Infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!hasMore || isFetching) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((p) => p + 1);
      },
      { threshold: 1 }
    );
    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, isFetching]);

  // Labels for UI
  const eventTypeLabels: Record<string, string> = {
    indoor: "Indoor",
    outdoor: "Outdoor",
    virtual: "Virtual",
    other: "Other",
  };

  return (
    <main className="max-w-7xl mx-auto px-2 md:px-4 py-10">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-4xl font-bold text-blue-700">Event Gallery</h1>
        <button
          className="bg-gradient-to-r from-green-400 via-blue-600 to-cyan-400 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition text-lg"
          onClick={() => setShowQuote(true)}
        >
          Request Team Building Quote
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <span className="text-sm font-semibold">Category:</span>
        <button
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
            category === "all" ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
          }`}
          onClick={() => setCategory("all")}
        >All</button>
        {categories.map((cat: GalleryCategory) => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              category === cat.name ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
            }`}
            onClick={() => setCategory(cat.name)}
          >{eventTypeLabels[cat.name] || cat.display_name || cat.name}</button>
        ))}
        <span className="ml-4 text-sm font-semibold">Year:</span>
        <select
          className="border rounded px-3 py-2 text-sm focus:outline-blue-500"
          value={year}
          onChange={e => setYear(e.target.value === "all" ? "all" : parseInt(e.target.value))}
        >
          <option value="all">All</option>
          {years.sort((a, b) => b - a).map((y: number) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Masonry-style grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {gallery.map((item: GalleryEvent) =>
          [
            ...item.photos.map((photo: GalleryPhoto) => (
              <div
                key={`photo-${photo.id}`}
                className="relative mb-4 group break-inside-avoid cursor-pointer"
                onClick={() => setModal({ type: "photo", url: photo.image, caption: photo.caption || item.title })}
              >
                <Image
                  src={photo.image}
                  alt={photo.caption || item.title}
                  width={500}
                  height={350}
                  className="rounded-xl w-full object-cover aspect-[4/3] transition group-hover:brightness-75 group-hover:scale-105"
                />
                {/* Overlay info */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent px-4 py-2 text-xs md:text-sm text-white opacity-0 group-hover:opacity-100 transition">
                  <div className="font-semibold">{item.title}</div>
                  <div className="">{photo.caption}</div>
                  <div className="italic text-xs mt-1">{item.event_type && eventTypeLabels[item.event_type]}</div>
                </div>
              </div>
            )),
            ...item.videos.map((video: GalleryVideo) => {
              const vidId = getYouTubeId(video.youtube_url);
              return (
                <div
                  key={`video-${video.id}`}
                  className="relative mb-4 group break-inside-avoid cursor-pointer"
                  onClick={() => setModal({ type: "video", url: video.youtube_url, caption: video.caption || item.title })}
                >
                  {vidId ? (
                    <Image
                      src={`https://img.youtube.com/vi/${vidId}/hqdefault.jpg`}
                      alt={video.caption || item.title}
                      width={500}
                      height={350}
                      className="rounded-xl w-full object-cover aspect-[4/3] transition group-hover:brightness-75 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-48 bg-black flex items-center justify-center text-white text-xl rounded-xl">
                      Video
                    </div>
                  )}
                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 p-2 rounded-full">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="9.5,7.5 16.5,12 9.5,16.5" />
                      </svg>
                    </div>
                  </div>
                  {/* Overlay info */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent px-4 py-2 text-xs md:text-sm text-white opacity-0 group-hover:opacity-100 transition">
                    <div className="font-semibold">{item.title}</div>
                    <div>{video.caption}</div>
                    <div className="italic text-xs mt-1">{item.event_type && eventTypeLabels[item.event_type]}</div>
                  </div>
                </div>
              );
            }),
          ]
        ).flat()}
      </div>

      {/* Infinite scroll sentinel */}
      {hasMore && <div ref={sentinelRef} className="py-10 text-center text-gray-400">Loading more…</div>}

      {/* Modal/lightbox */}
      {modal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setModal(null)}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute -top-10 -right-8 bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold hover:bg-red-600 transition"
              onClick={() => setModal(null)}
              aria-label="Close"
            >
              ×
            </button>
            {modal.type === "photo" ? (
              <>
                <Image
                  src={modal.url}
                  alt={modal.caption || ""}
                  width={1200}
                  height={900}
                  className="rounded-2xl shadow-2xl max-h-[80vh] w-auto"
                  priority
                />
                {modal.caption && (
                  <div className="mt-4 text-center text-white text-lg font-semibold drop-shadow">
                    {modal.caption}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="aspect-w-16 aspect-h-9 w-[80vw] max-w-3xl rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(modal.url)}`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={modal.caption || "Video"}
                    className="w-full h-full"
                  ></iframe>
                </div>
                {modal.caption && (
                  <div className="mt-4 text-center text-white text-lg font-semibold drop-shadow">
                    {modal.caption}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Request Quote Modal */}
      {showQuote && <QuoteModal open={showQuote} onClose={() => setShowQuote(false)} />}
    </main>
  );
}
