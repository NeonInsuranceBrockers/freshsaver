// src/app/flows/editor/[flowId]/loading.tsx

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-50/50">
      <div className="flex flex-col items-center">
        {/* Placeholder Loading UI (using assumed Tailwind styling) */}
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
        <p className="mt-4 text-sm text-gray-600">Loading flow canvas...</p>
      </div>
    </div>
  );
}
