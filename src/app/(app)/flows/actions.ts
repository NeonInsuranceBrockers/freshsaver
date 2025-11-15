// /app/(app)/flows/actions.ts
"use server"; // This directive enables Server Actions for all functions in this file

import { FlowDefinition, InventoryPayload } from "@/types/flow";
import prisma from "@/lib/db/prisma";
import { runTestExecution } from "@/lib/server/flowEngine";
import { Prisma } from "@prisma/client";

// Define the return type for the client
export interface FlowExecutionDetails {
  trace: string[];
  log: string[];
  finalPayload: InventoryPayload;
}

/**
 * SERVER ACTION: Fetches a single flow definition from the database.
 */
export async function getFlowDefinitionAction(
  flowId: string
): Promise<FlowDefinition> {
  console.log(`[Action] Fetching flow: ${flowId}`);
  const flow = await prisma.flow.findUnique({
    where: { id: flowId },
  });

  if (!flow) {
    // When a Server Action throws an error, the client's `catch` block receives it.
    throw new Error("Flow Not Found");
  }

  return flow as unknown as FlowDefinition;
}

/**
 * SERVER ACTION: Saves (upserts) a flow definition to the database.
 */
export async function saveFlowAction(
  definition: FlowDefinition
): Promise<{ success: boolean; message?: string }> {
  console.log(`[Action] Saving flow: ${definition.id}`);
  try {
    const { id, name, nodes, edges, lastPublished, isActive } = definition;
    await prisma.flow.upsert({
      where: { id },
      update: {
        name,
        nodes: nodes as unknown as Prisma.InputJsonValue,
        edges: edges as unknown as Prisma.InputJsonValue,
        lastPublished,
        isActive,
      },
      create: {
        id,
        name,
        nodes: nodes as unknown as Prisma.InputJsonValue,
        edges: edges as unknown as Prisma.InputJsonValue,
        lastPublished,
        isActive: isActive || false,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("saveFlowAction failed:", error);
    return { success: false, message: "Failed to save the flow." };
  }
}

/**
 * SERVER ACTION: Publishes a flow by setting its isActive flag.
 */
export async function publishFlowAction(
  flowId: string
): Promise<{ success: boolean; message?: string }> {
  console.log(`[Action] Publishing flow: ${flowId}`);
  try {
    // You could add validation here before publishing
    await prisma.flow.update({
      where: { id: flowId },
      data: {
        isActive: true,
        lastPublished: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    console.error(`publishFlowAction failed for ${flowId}:`, error);
    return { success: false, message: "Publishing failed." };
  }
}

/**
 * SERVER ACTION: Executes a test run of a given flow definition.
 */
export async function executeFlowAction(
  flowDefinition: FlowDefinition
): Promise<FlowExecutionDetails | null> {
  console.log(`[Action] Executing test for flow: ${flowDefinition.id}`);
  try {
    // Default item for client-side initiated tests
    const testItemId = "item-101";

    const result = await runTestExecution(flowDefinition, testItemId);

    if (result) {
      return {
        trace: result.trace,
        log: result.log,
        finalPayload: result.finalPayload as unknown as InventoryPayload,
      };
    }
    return null; // Trigger did not match
  } catch (error) {
    console.error(`executeFlowAction failed for ${flowDefinition.id}:`, error);
    // In case the engine itself throws an error, return null
    return null;
  }
}
