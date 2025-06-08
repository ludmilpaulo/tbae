"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchGallery } from "@/redux/slices/gallerySlice";
import LoadingOverlay from "@/components/LoadingOverlay";
import Image from "next/image";

export default function GalleryPage() {
  const dispatch = useAppDispatch();
  const { data: images, loading, error } = useAppSelector((state) => state.gallery);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  return (
    <>
      <LoadingOverlay show={loading} />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Gallery</h1>
        {error && <div className="text-red-600 bg-red-100 rounded-lg p-4 mb-6">Error: {error}</div>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="relative w-full aspect-square">
              <Image
                src={img.url}
                alt={img.alt || "Gallery Image"}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
