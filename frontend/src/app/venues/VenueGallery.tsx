"use client";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";

interface VenueImage {
  id: number;
  image: string;
  caption?: string;
}

export default function VenueGallery({ images }: { images: VenueImage[] }) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free-snap",
    slides: { perView: 1, spacing: 12 },
  });

  if (!images?.length) return null;

  return (
    <div ref={sliderRef} className="keen-slider rounded-lg overflow-hidden shadow-md">
      {images.map((img) => (
        <div key={img.id} className="keen-slider__slide flex flex-col items-center">
          <div className="relative w-full h-52 md:h-64">
            <Image
              src={img.image}
              alt={img.caption || ""}
              fill
              sizes="(min-width: 768px) 512px, 100vw"
              className="object-cover rounded-lg"
              priority={false}
            />
          </div>
          {img.caption && (
            <div className="text-xs text-gray-500 py-1">{img.caption}</div>
          )}
        </div>
      ))}
    </div>
  );
}
