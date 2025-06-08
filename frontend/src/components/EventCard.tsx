import { Event } from "@/types";
import Image from "next/image";

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="rounded-2xl shadow-md bg-white overflow-hidden hover:shadow-xl transition">
      <Image
        src={event.image}
        alt={event.title}
        width={400}
        height={250}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{event.title}</h3>
        <p className="mt-2 text-gray-500">{event.description}</p>
        <p className="mt-4 text-sm text-primary font-semibold">
          {new Date(event.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
