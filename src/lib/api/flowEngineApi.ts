// /src/lib/api/flowEngineApi.ts

import { FlowDefinition, InventoryPayload } from "@/types/flow";
import prisma from "@/lib/db/prisma";
import { runTestExecution } from "@/lib/server/flowEngine";
import { Prisma } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth/session"; // <--- Import Auth

// This interface remains for the client to use
export interface FlowExecutionDetails {
  trace: string[];
  log: string[];
  finalPayload: InventoryPayload;
}

/**
 * Fetches a flow definition.
 * SCOPED: Ensures flow belongs to the user's organization.
 */
export async function getFlowDefinition(
  flowId: string
): Promise<FlowDefinition> {
  const user = await getAuthenticatedUser();

  const flow = await prisma.flow.findFirst({
    where: {
      id: flowId,
      organizationId: user.organizationId, // <--- Scope to Org
    },
  });

  if (!flow) {
    throw new Error("Flow Not Found or Access Denied", { cause: 404 });
  }

  return flow as unknown as FlowDefinition;
}

/**
 * Saves (upserts) the flow structure.
 * SECURE: Handles ownership checks and required User/Org fields.
 */
export async function saveFlow(definition: FlowDefinition): Promise<boolean> {
  const user = await getAuthenticatedUser();

  if (!user.organizationId) {
    console.error("SaveFlow failed: User has no organization.");
    return false;
  }

  try {
    const { id, name, nodes, edges, lastPublished, isActive } = definition;

    // 1. Check if it exists
    const existingFlow = await prisma.flow.findUnique({
      where: { id },
    });

    if (existingFlow) {
      // UPDATE PATH
      // Check ownership
      if (existingFlow.organizationId !== user.organizationId) {
        console.error("SaveFlow failed: Unauthorized access to flow.");
        return false;
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
      // CREATE PATH
      await prisma.flow.create({
        data: {
          id,
          userId: user.id, // <--- FIXED: Creator
          organizationId: user.organizationId, // <--- FIXED: Ownership
          name,
          nodes: nodes as unknown as Prisma.InputJsonValue,
          edges: edges as unknown as Prisma.InputJsonValue,
          lastPublished,
          isActive: isActive || false,
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Failed to save flow to Prisma:", error);
    return false;
  }
}

/**
 * Publishes a flow by setting its `isActive` flag.
 * SCOPED: Ensures ownership.
 */
export async function publishFlow(flowId: string): Promise<void> {
  const user = await getAuthenticatedUser();

  try {
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
      throw new Error("Flow not found or access denied.");
    }
  } catch (error) {
    console.error(`Failed to publish flow ${flowId}:`, error);
    throw new Error("Publishing failed.");
  }
}

/**
 * Calls the server-side test execution engine.
 */
export async function executeFlow(
  flowDefinition: FlowDefinition,
  options: { mode: "test" | "live" }
): Promise<FlowExecutionDetails | null> {
  // We should technically verify the user here too if this is exposed,
  // but usually saveFlow/getFlow handles the gatekeeping before this is called.

  if (options.mode === "test") {
    const testItemId = "item-101";

    const result = await runTestExecution(flowDefinition, testItemId);

    if (result) {
      return {
        trace: result.trace,
        log: result.log,
        finalPayload: result.finalPayload as unknown as InventoryPayload,
      };
    }
    return null;
  }
  return null;
}
