"use client";

import { useEffect, useState } from "react";
import { baseAPI } from "@/utils/configs";

export default function BrochurePage() {
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${baseAPI}/activities/brochure/latest/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.file) {
          setBrochureUrl(data.file);
        } else {
          setError("Brochure URL not found");
        }
      })
      .catch((err) => {
        console.error("Fetching PDF failed:", err);
        setError("Failed to fetch brochure");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = () => {
    if (brochureUrl) {
      const link = document.createElement("a");
      link.href = brochureUrl;
      link.download = "brochure.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading)
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Loading brochure...</p>
      </main>
    );

  if (error)
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error}</p>
      </main>
    );

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">Company Brochure</h1>

      <div className="mb-4">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Download PDF
        </button>
        {brochureUrl && (
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline ml-4"
          >
            Open in new tab
          </a>
        )}
      </div>

      {brochureUrl && (
        <object
          data={brochureUrl}
          type="application/pdf"
          width="100%"
          height="800px"
        >
          <p className="text-red-500 mt-4">
            PDF cannot be displayed.{" "}
            <a href={brochureUrl} target="_blank" className="underline">
              Click here to view/download directly.
            </a>
          </p>
        </object>
      )}
    </main>
  );
}
