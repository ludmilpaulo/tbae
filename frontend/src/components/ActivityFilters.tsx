import React from "react";
import { ActivityCategory } from "@/redux/services/activitiesApi";

export default function ActivityFilters({
  categories,
  selected,
  onSelect,
}: {
  categories: ActivityCategory[];
  selected: number | string | null;
  onSelect: (id: number | string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full font-bold transition border ${
          selected == null
            ? "bg-blue-600 text-white shadow"
            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full font-bold transition border ${
            selected === cat.id
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
