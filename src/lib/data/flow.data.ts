// src/lib/data/flow.data.ts
import prisma from "@/lib/db/prisma";

import { Flow } from "@prisma/client";

// Define the exact type required by the AutomationAudit component
export type FlowAuditData = Pick<
  Flow,
  "id" | "name" | "isActive" | "updatedAt"
>;

/**
 * Fetches essential flow metadata required for dashboard auditing.
 * @returns List of flows with ID, name, status, and last update time.
 */
export async function getFlowsForAudit(): Promise<FlowAuditData[]> {
  try {
    const flows = await prisma.flow.findMany({
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
    // We cast here to ensure strict type matching, though Prisma typically returns the correct shape
    return flows as FlowAuditData[];
  } catch (e) {
    console.error("Error fetching flows for audit dashboard:", e);
    // Return an empty array on failure so the dashboard can still render
    return [];
  }
}
