// /lib/api/flowEngineApi.ts

import { FlowDefinition, InventoryPayload } from "@/types/flow";
import prisma from "@/lib/db/prisma";
import { runTestExecution } from "@/lib/server/flowEngine"; // <-- Use the new server engine
import { Prisma } from "@prisma/client";

// This interface remains for the client to use
export interface FlowExecutionDetails {
  trace: string[];
  log: string[];
  finalPayload: InventoryPayload;
}

/**
 * Fetches a flow definition from the SQLite database using Prisma.
 */
export async function getFlowDefinition(
  flowId: string
): Promise<FlowDefinition> {
  const flow = await prisma.flow.findUnique({
    where: { id: flowId },
  });

  if (!flow) {
    throw new Error("Flow Not Found", { cause: 404 });
  }

  // Cast the fetched data to our FlowDefinition type for client-side use
  return flow as unknown as FlowDefinition;
}

/**
 * Saves (upserts) the flow structure to the SQLite database using Prisma.
 */
export async function saveFlow(definition: FlowDefinition): Promise<boolean> {
  try {
    const { id, name, nodes, edges, lastPublished, isActive } = definition;

    await prisma.flow.upsert({
      where: { id },
      update: {
        name,
        nodes: nodes as unknown as Prisma.JsonArray,
        edges: edges as unknown as Prisma.JsonArray,
        lastPublished,
        isActive,
      },
      create: {
        id,
        name,
        nodes: nodes as unknown as Prisma.JsonArray,
        edges: edges as unknown as Prisma.JsonArray,
        lastPublished,
        isActive: isActive || false,
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to save flow to Prisma:", error);
    return false;
  }
}

/**
 * Publishes a flow by setting its `isActive` flag to true in the database.
 */
export async function publishFlow(flowId: string): Promise<void> {
  try {
    await prisma.flow.update({
      where: { id: flowId },
      data: {
        isActive: true,
        lastPublished: new Date(),
      },
    });
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
  if (options.mode === "test") {
    const testItemId = "item-101"; // Default item for client-side tests

    const result = await runTestExecution(flowDefinition, testItemId);

    if (result) {
      return {
        trace: result.trace,
        log: result.log,
        // Cast the payload back to the client-side type
        finalPayload: result.finalPayload as unknown as InventoryPayload,
      };
    }
    return null;
  }
  return null;
}
