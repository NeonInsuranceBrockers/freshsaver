// src/components/NextTopLoaderWrapper.tsx
"use client";

import NextTopLoader from "nextjs-toploader";

// This component must be 'use client' because it interacts with the browser's history API
// to track route changes and render the progress bar.
export default function NextTopLoaderWrapper() {
  return (
    <NextTopLoader
      color="#f97316" // Theme color from your metadata
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false} // Usually hidden for a cleaner look
      easing="ease"
      speed={200}
      shadow="0 0 10px #f97316,0 0 5px #f97316"
    />
  );
}
