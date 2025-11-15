// /src/app/(app)/meal-planner/error.tsx

"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function MealPlannerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry or LogRocket
    console.error(error);
  }, [error]);

  return (
    <div className="flex-grow p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center">
      <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full">
        <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Oops, something went wrong!
      </h2>
      <p className="mt-2 text-md text-gray-600 dark:text-gray-400 max-w-md">
        We couldn&apos;t load the Meal Planner data. This might be a temporary
        issue. Please try again.
      </p>
      <Button onClick={() => reset()} className="mt-6">
        Try Again
      </Button>
    </div>
  );
}
