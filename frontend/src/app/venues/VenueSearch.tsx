"use client";
interface VenueSearchProps {
  value: string;
  setValue: (val: string) => void;
}

export default function VenueSearch({ value, setValue }: VenueSearchProps) {
  return (
    <input
      className="w-full border border-blue-300 rounded-lg px-4 py-2"
      placeholder="Search venues by name or description..."
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}
