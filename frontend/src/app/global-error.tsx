// app/global-error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Helpful in prod too (you enabled prod source maps)
    // eslint-disable-next-line no-console
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <h2>Something went wrong.</h2>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
