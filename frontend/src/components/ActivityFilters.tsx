"use client";

import React, { useMemo } from "react";
import type { ActivityCategory } from "@/redux/services/activitiesApi";

type Props = {
  categories?: ReadonlyArray<ActivityCategory> | null; // may be undefined/null briefly
  selected: number | string | null;
  onSelect: (id: number | string | null) => void;
};

export default function ActivityFilters({ categories, selected, onSelect }: Props) {
  // Coerce to an array and (optionally) sort by 'order' if present
  const list = useMemo<ActivityCategory[]>(
    () =>
      Array.isArray(categories)
        ? [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : [],
    [categories]
  );

  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full font-bold transition border ${
          selected == null
            ? "bg-blue-600 text-white shadow"
            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
        }`}
        type="button"
      >
        All
      </button>

      {list.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full font-bold transition border ${
            selected === cat.id
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
          }`}
          type="button"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
