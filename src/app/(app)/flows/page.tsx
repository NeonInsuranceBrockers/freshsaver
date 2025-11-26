// /app/(app)/flows/page.tsx

import prisma from "@/lib/db/prisma";
import FlowsClientWrapper from "./FlowsClientWrapper";
import { getAuthenticatedUser } from "@/lib/auth/session";

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
 * Fetches the list of flows belonging to the user's organization.
 */
export default async function FlowsPage() {
  // 1. Secure the page and get current user context
  const user = await getAuthenticatedUser();

  let flows: FlowListItem[] = [];
  let error: string | null = null;

  try {
    // 2. Fetch flow metadata SCOPED to the Organization
    flows = (await prisma.flow.findMany({
      where: {
        organizationId: user.organizationId,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        lastPublished: true,
        updatedAt: true,
      },
      // 3. Order by last modified date for dashboard relevance
      orderBy: {
        updatedAt: "desc",
      },
    })) as FlowListItem[];
  } catch (e) {
    console.error("Error fetching flows:", e);
    error = "Failed to load flows data. Please check the database connection.";
  }

  // 4. Pass the fetched data to the client component
  return (
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
