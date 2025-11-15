// src/app/flows/editor/[flowId]/error.tsx
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void; // Function to attempt re-rendering the segment
}

export default function FlowError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service (e.g., Sentry, Bugsnag)
    console.error("Workflow Load Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center bg-red-50/50 border border-red-200">
      <h2 className="text-xl font-semibold text-red-700">
        Oops! Could not load the workflow.
      </h2>
      <p className="mt-2 text-gray-600">
        An error occurred while fetching the flow definition. Details:
        <span className="font-mono text-xs block mt-1 p-2 bg-red-100 rounded-md">
          {error.message}
        </span>
      </p>
      <button
        onClick={
          // Attempt to re-render the page segment
          () => reset()
        }
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Try Reloading Flow
      </button>
    </div>
  );
}
