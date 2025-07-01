"use client";
import { useGetActivityBySlugQuery } from "@/redux/services/activitiesApi";
import Image from "next/image";
import Link from "next/link";

export default function ActivityDetail({ params }: { params: { slug: string } }) {
  const { data: activity, isLoading, error } = useGetActivityBySlugQuery(params.slug);

  if (isLoading) return <div className="text-center text-gray-400 py-24">Loading…</div>;
  if (error || !activity)
    return <div className="text-center text-red-500 py-24">Activity not found.</div>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4 drop-shadow">{activity.title}</h1>
      <div className="mb-6 text-lg text-gray-700">{activity.short_description}</div>
      {activity.image && (
        <div className="relative w-full h-64 mb-8 rounded-xl overflow-hidden shadow">
          <Image
            src={activity.image.startsWith("http") ? activity.image : `/activities/${activity.image}`}
            alt={activity.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </div>
      )}
      <div
        className="prose max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: activity.description }}
      />
      <div className="flex flex-wrap gap-4 text-sm mb-8">
        {activity.duration && (
          <div className="bg-blue-100 px-4 py-2 rounded-full font-bold">
            Duration: {activity.duration}
          </div>
        )}
        {activity.physical_intensity && (
          <div className="bg-green-100 px-4 py-2 rounded-full font-bold">
            Intensity: {activity.physical_intensity}
          </div>
        )}
        {activity.main_outcomes && (
          <div className="bg-yellow-100 px-4 py-2 rounded-full font-bold">
            Outcomes: {activity.main_outcomes}
          </div>
        )}
        {activity.is_premium && (
          <div className="bg-pink-100 px-4 py-2 rounded-full font-bold">Premium</div>
        )}
        {activity.brochure_page && (
          <a
            href={`/brochure#page=${activity.brochure_page}`}
            className="bg-gray-100 px-4 py-2 rounded-full font-bold text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            See in Brochure
          </a>
        )}
      </div>
      <div className="mt-8">
        <Link
          href="/teambuilding-quote.htm"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow hover:bg-blue-700 transition"
        >
          Request a Quote for this Activity
        </Link>
      </div>
    </main>
  );
}
