import Image from "next/image";
import { Testimonial } from "@/types";

export default function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  return (
    <div className="flex gap-6 overflow-x-auto">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white shadow rounded-xl p-6 min-w-[320px]">
          <div className="flex items-center gap-4 mb-4">
            {testimonial.image && (
              <Image src={testimonial.image} alt={testimonial.name} width={56} height={56} className="rounded-full" />
            )}
            <div>
              <div className="font-bold">{testimonial.name}</div>
              <div className="text-sm text-gray-500">{testimonial.company}</div>
            </div>
          </div>
          <p className="italic">&ldquo;{testimonial.text}&rdquo;</p>
        </div>
      ))}
    </div>
  );
}
