"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchTestimonials } from "@/redux/slices/testimonialsSlice";
import LoadingOverlay from "@/components/LoadingOverlay";
import TestimonialSlider from "@/components/TestimonialSlider";

export default function TestimonialsPage() {
  const dispatch = useAppDispatch();
  const { data: testimonials, loading, error } = useAppSelector((state) => state.testimonials);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  return (
    <>
      <LoadingOverlay show={loading} />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Testimonials</h1>
        {error && <div className="text-red-600 bg-red-100 rounded-lg p-4 mb-6">Error: {error}</div>}
        <TestimonialSlider testimonials={testimonials} />
      </main>
    </>
  );
}
