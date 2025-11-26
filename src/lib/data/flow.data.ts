// /src/lib/data/flow.data.ts
import prisma from "@/lib/db/prisma";
import { Flow } from "@prisma/client";

// Define the exact type required by the AutomationAudit component
export type FlowAuditData = Pick<
  Flow,
  "id" | "name" | "isActive" | "updatedAt"
>;

/**
 * Fetches essential flow metadata required for dashboard auditing.
 * SCOPED: Only fetches flows belonging to the specified organization.
 *
 * @param organizationId - The ID of the organization to fetch flows for.
 * @returns List of flows with ID, name, status, and last update time.
 */
export async function getFlowsForAudit(
  organizationId: string
): Promise<FlowAuditData[]> {
  try {
    const flows = await prisma.flow.findMany({
      where: {
        organizationId: organizationId, // <--- Added Scope
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        updatedAt: true,
      },
      // Order by last modified date for relevance in the activity log
      orderBy: {
        updatedAt: "desc",
      },
    });

    return flows as FlowAuditData[];
  } catch (e) {
    console.error("Error fetching flows for audit dashboard:", e);
    // Return an empty array on failure so the dashboard can still render
    return [];
  }
}
