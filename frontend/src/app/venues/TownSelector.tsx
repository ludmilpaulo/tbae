"use client";

import { Town } from "@/types/venue";
import { useEffect } from "react";

interface TownSelectorProps {
  towns: Town[];
  selected: number | null;
  setSelected: (townId: number) => void;
}

export default function TownSelector({ towns, selected, setSelected }: TownSelectorProps) {
  useEffect(() => {
    if (towns.length && (selected === null || !towns.some(t => t.id === selected))) {
      setSelected(towns[0].id);
    }
  }, [towns, selected, setSelected]);

  if (!towns.length) return null;

  return (
    <select
      className="w-full border-2 border-blue-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
      value={selected ?? towns[0]?.id}
      onChange={e => setSelected(Number(e.target.value))}
    >
      {towns.map(t => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}
