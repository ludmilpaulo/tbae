"use client";
import { useState, useMemo } from "react";
import {
  useGetActivitiesQuery,
  useGetActivityCategoriesQuery,
} from "@/redux/services/activitiesApi";
import ActivityCard from "@/components/ActivityCard";
import ActivityFilters from "@/components/ActivityFilters";

const ITEMS_PER_PAGE = 9;

export default function ActivitiesPage() {
  const [selected, setSelected] = useState<number | string | null>(null);
  const [page, setPage] = useState(1);

  const { data: categories = [] } = useGetActivityCategoriesQuery();
  const { data: allActivities = [], isLoading } = useGetActivitiesQuery(); // fetch everything

  // Step 1: Filter by category (if any)
  const filteredActivities = useMemo(() => {
    if (!selected) return allActivities;
    return allActivities.filter(
      (activity) => activity.category?.id === selected
    );
  }, [allActivities, selected]);

  // Step 2: Paginate the filtered results
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);

  const paginatedActivities = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredActivities.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredActivities, page]);

  // Reset to page 1 when category changes
  const handleSelect = (id: number | string | null) => {
    setSelected(id);
    setPage(1);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4 text-center drop-shadow">
        Activities
      </h1>
      <p className="mb-8 text-gray-600 text-center max-w-2xl mx-auto">
        Explore our full range of{" "}
        <span className="font-semibold text-blue-700">team building activities</span>.
        Click an activity to learn more or request a quote.
      </p>

      <ActivityFilters categories={categories} selected={selected} onSelect={handleSelect} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-400 py-12 text-xl">
            Loading activities…
          </div>
        ) : paginatedActivities.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-12 text-xl">
            No activities found for this category.
          </div>
        ) : (
          paginatedActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-full font-bold transition border ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-full font-bold transition border ${
                page === p
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-full font-bold transition border ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
