// /src/app/(app)/meal-planner/loading.tsx

export default function MealPlannerLoading() {
  return (
    // We use animate-pulse to give a subtle loading effect to the skeleton shapes.
    <div className="flex-grow p-4 sm:p-6 lg:p-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      <div className="mt-2 h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md"></div>

      <div className="mt-6">
        {/* Kanban Board Area Skeleton */}
        <div className="flex w-full flex-col gap-4">
          {/* Placeholder for the Kanban/Calendar controls */}
          <div className="h-10 w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-md"></div>

          {/* Placeholder for the main content area */}
          <div className="flex w-full items-start gap-4 rounded-lg bg-gray-200/50 dark:bg-gray-900/50 p-2 min-h-[500px]">
            {/* We can mimic a few columns to make the skeleton more realistic */}
            <div className="h-96 w-80 flex-shrink-0 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-96 w-80 flex-shrink-0 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-96 w-80 flex-shrink-0 hidden md:block bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
