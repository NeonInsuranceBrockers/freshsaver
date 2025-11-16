// /app/(app)/flows/page.tsx

import prisma from "@/lib/db/prisma";
import FlowsClientWrapper from "./FlowsClientWrapper";

// Define the type for the data we select, ensuring consistency with the Client Wrapper
type FlowListItem = {
  id: string;
  name: string;
  isActive: boolean;
  lastPublished: Date | null;
  updatedAt: Date;
};

/**
 * Flow Automation Dashboard Page (Server Component).
 * This component's sole responsibility is to fetch the list of flows
 * and render the interactive Client Component wrapper.
 */
export default async function FlowsPage() {
  let flows: FlowListItem[] = [];
  let error: string | null = null;

  try {
    // 1. Fetch all flow metadata from the database
    flows = (await prisma.flow.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
        lastPublished: true,
        updatedAt: true,
      },
      // 2. Order by last modified date for dashboard relevance
      orderBy: {
        updatedAt: "desc",
      },
    })) as FlowListItem[]; // Cast for type safety
  } catch (e) {
    console.error("Error fetching flows:", e);
    // In a production app, you might log this error externally
    error = "Failed to load flows data. Please check the database connection.";
    // If fetching fails, we pass an empty array and rely on the client component to display the error.
  }

  // 3. Pass the fetched data (or an empty array/error) to the client component
  return (
    // We use a main layout container here for full-width presentation
    <main className="flex-1 overflow-auto bg-gray-50">
      {error ? (
        <div className="p-8 text-center text-red-600 bg-red-100 m-8 rounded-lg border border-red-300">
          <h2 className="text-xl font-semibold">Data Load Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <FlowsClientWrapper initialFlows={flows} />
      )}
    </main>
  );
}
