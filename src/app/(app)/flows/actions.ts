// /app/(app)/flows/actions.ts
"use server";

import { FlowDefinition, InventoryPayload } from "@/types/flow";
import prisma from "@/lib/db/prisma";
import { runTestExecution } from "@/lib/server/flowEngine";
import { Prisma } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth/session";

// Define the return type for the client
export interface FlowExecutionDetails {
  trace: string[];
  log: string[];
  finalPayload: InventoryPayload;
}

/**
 * SERVER ACTION: Fetches a single flow definition from the database.
 * SCOPED: Only returns if the flow belongs to the user's organization.
 */
export async function getFlowDefinitionAction(
  flowId: string
): Promise<FlowDefinition> {
  const user = await getAuthenticatedUser();
  console.log(
    `[Action] Fetching flow: ${flowId} for Org: ${user.organizationId}`
  );

  // Use findFirst to allow filtering by organizationId
  const flow = await prisma.flow.findFirst({
    where: {
      id: flowId,
      organizationId: user.organizationId,
    },
  });

  if (!flow) {
    throw new Error("Flow Not Found or Access Denied");
  }

  return flow as unknown as FlowDefinition;
}

/**
 * SERVER ACTION: Saves (upserts) a flow definition.
 * SCOPED: Enforces organization ownership before updating.
 */
export async function saveFlowAction(
  definition: FlowDefinition
): Promise<{ success: boolean; message?: string }> {
  const user = await getAuthenticatedUser();
  console.log(`[Action] Saving flow: ${definition.id}`);

  try {
    const { id, name, nodes, edges, lastPublished, isActive } = definition;

    // 1. Check if the flow exists globally to determine if we are Updating or Creating
    const existingFlow = await prisma.flow.findUnique({
      where: { id },
    });

    if (existingFlow) {
      // UPDATE SCENARIO: Check ownership
      if (existingFlow.organizationId !== user.organizationId) {
        return {
          success: false,
          message: "Unauthorized: You do not own this flow.",
        };
      }

      await prisma.flow.update({
        where: { id },
        data: {
          name,
          nodes: nodes as unknown as Prisma.InputJsonValue,
          edges: edges as unknown as Prisma.InputJsonValue,
          lastPublished,
          isActive,
        },
      });
    } else {
      // CREATE SCENARIO: Enforce Organization ID
      await prisma.flow.create({
        data: {
          id, // Use the ID provided by client (usually from a previous createEmpty call, but handles edge cases)
          organizationId: user.organizationId, // <--- CRITICAL
          userId: user.id,
          name,
          nodes: nodes as unknown as Prisma.InputJsonValue,
          edges: edges as unknown as Prisma.InputJsonValue,
          lastPublished,
          isActive: isActive || false,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("saveFlowAction failed:", error);
    return { success: false, message: "Failed to save the flow." };
  }
}

/**
 * SERVER ACTION: Publishes a flow.
 * SCOPED: Updates only if organization matches.
 */
export async function publishFlowAction(
  flowId: string
): Promise<{ success: boolean; message?: string }> {
  const user = await getAuthenticatedUser();
  console.log(`[Action] Publishing flow: ${flowId}`);

  try {
    // Use updateMany to safely filter by Organization ID
    // updateMany returns a count of affected rows
    const result = await prisma.flow.updateMany({
      where: {
        id: flowId,
        organizationId: user.organizationId,
      },
      data: {
        isActive: true,
        lastPublished: new Date(),
      },
    });

    if (result.count === 0) {
      return { success: false, message: "Flow not found or access denied." };
    }

    return { success: true };
  } catch (error) {
    console.error(`publishFlowAction failed for ${flowId}:`, error);
    return { success: false, message: "Publishing failed." };
  }
}

/**
 * SERVER ACTION: Executes a test run.
 * SCOPED: Currently just checks auth.
 * TODO: Ensure runTestExecution uses the user's org context for inventory lookups.
 */
export async function executeFlowAction(
  flowDefinition: FlowDefinition
): Promise<FlowExecutionDetails | null> {
  const user = await getAuthenticatedUser();
  console.log(
    `[Action] Executing test for flow: ${flowDefinition.id} (Org: ${user.organizationId})`
  );

  try {
    // Default item for client-side initiated tests
    const testItemId = "item-101";

    // Note: In a real implementation, runTestExecution should probably accept
    // user.organizationId to ensure it only looks up items belonging to this org.
    // For now, we assume the engine might mock data or needs refactoring.
    const result = await runTestExecution(flowDefinition, testItemId);

    if (result) {
      return {
        trace: result.trace,
        log: result.log,
        finalPayload: result.finalPayload as unknown as InventoryPayload,
      };
    }
    return null;
  } catch (error) {
    console.error(`executeFlowAction failed for ${flowDefinition.id}:`, error);
    return null;
  }
}

/**
 * SERVER ACTION: Creates a new, empty flow.
 * SCOPED: Assigns the new flow to the user's organization.
 */
export async function createEmptyFlowAction(name: string): Promise<string> {
  const user = await getAuthenticatedUser();
  console.log("[Action] Creating new empty flow.");

  try {
    const newFlow = await prisma.flow.create({
      data: {
        name: name,
        userId: user.id,
        organizationId: user.organizationId, // <--- CRITICAL
        nodes: [] as unknown as Prisma.InputJsonValue,
        edges: [] as unknown as Prisma.InputJsonValue,
        isActive: false,
      },
      select: { id: true },
    });
    return newFlow.id;
  } catch (error) {
    console.error("createEmptyFlowAction failed:", error);
    throw new Error("Failed to create new flow.");
  }
}

/**
 * SERVER ACTION: Deactivates a flow.
 * SCOPED: Uses updateMany for safe filtering.
 */
export async function deactivateFlowAction(
  flowId: string
): Promise<{ success: boolean; message?: string }> {
  const user = await getAuthenticatedUser();
  console.log(`[Action] Deactivating flow: ${flowId}`);

  try {
    const result = await prisma.flow.updateMany({
      where: {
        id: flowId,
        organizationId: user.organizationId,
      },
      data: {
        isActive: false,
      },
    });

    if (result.count === 0) {
      return { success: false, message: "Flow not found or access denied." };
    }

    return { success: true };
  } catch (error) {
    console.error(`deactivateFlowAction failed for ${flowId}:`, error);
    return { success: false, message: "Deactivation failed." };
  }
}

/**
 * SERVER ACTION: Deletes a flow.
 * SCOPED: Uses deleteMany to ensure a user can only delete their own org's flows.
 */
export async function deleteFlowAction(
  flowId: string
): Promise<{ success: boolean; message?: string }> {
  const user = await getAuthenticatedUser();
  console.log(`[Action] Deleting flow: ${flowId}`);

  try {
    const result = await prisma.flow.deleteMany({
      where: {
        id: flowId,
        organizationId: user.organizationId,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        message: "Deletion failed. Flow may not exist or access denied.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error(`deleteFlowAction failed for ${flowId}:`, error);
    return { success: false, message: "Deletion failed." };
  }
}
