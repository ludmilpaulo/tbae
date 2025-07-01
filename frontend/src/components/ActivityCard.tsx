import Image from "next/image";
import Link from "next/link";
import { Activity } from "@/redux/services/activitiesApi";

export default function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Link href={`/activities/${activity.slug}`} className="block group">
      <div className="rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition border border-blue-50 flex flex-col h-full">
        <div className="relative h-48 w-full">
          <Image
            src={activity.image ? `https://africarise.pythonanywhere.com${activity.image}` : "/logo.png"}
            alt={activity.title}
            fill
            className="object-cover transition group-hover:scale-105 duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
          {activity.is_premium && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-3 py-1 rounded-full text-xs shadow font-semibold">
              Premium
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h2 className="text-xl font-bold text-blue-700 mb-2 group-hover:underline transition">{activity.title}</h2>
          <div className="text-sm text-gray-600 mb-3 flex-1">{activity.short_description}</div>
          <div className="flex flex-wrap gap-2 mt-auto">
            {activity.duration && (
              <span className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-medium">
                ⏱️ {activity.duration}
              </span>
            )}
            {activity.physical_intensity && (
              <span className="bg-green-50 text-green-700 rounded-full px-3 py-1 text-xs font-medium">
                {activity.physical_intensity}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
