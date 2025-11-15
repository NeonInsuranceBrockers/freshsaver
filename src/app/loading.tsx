// src/app/your-route/loading.tsx
// This file remains a Server Component by default.

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Spinner Container */}
      <div className="flex space-x-2">
        {/*
          The animate-spin class handles the rotation keyframes defined in Tailwind's
          default configuration.
        */}
        <div
          className="
            w-12 h-12 
            border-4 border-gray-300 border-t-blue-500 
            rounded-full 
            animate-spin
          "
        />
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-xl font-medium text-gray-600">
        Loading content...
      </p>
    </div>
  );
}
