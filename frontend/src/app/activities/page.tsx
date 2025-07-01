"use client";
import { useState } from "react";
import { useGetActivitiesQuery, useGetActivityCategoriesQuery } from "@/redux/services/activitiesApi";
import ActivityCard from "@/components/ActivityCard";
import ActivityFilters from "@/components/ActivityFilters";

export default function ActivitiesPage() {
  const [selected, setSelected] = useState<number | string | null>(null);
  const { data: categories = [] } = useGetActivityCategoriesQuery();
  const { data: activities = [], isLoading } = useGetActivitiesQuery(
    selected ? { category: selected } : undefined
  );

  return (
    <main className="max-w-7xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4 text-center drop-shadow">Activities</h1>
      <p className="mb-8 text-gray-600 text-center max-w-2xl mx-auto">
        Explore our full range of <span className="font-semibold text-blue-700">team building activities</span>.
        Click an activity to learn more or request a quote.
      </p>
      <ActivityFilters categories={categories} selected={selected} onSelect={setSelected} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-400 py-12 text-xl">Loading activities…</div>
        ) : activities.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12 text-xl">No activities found for this category.</div>
        ) : (
          activities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </main>
  );
}
