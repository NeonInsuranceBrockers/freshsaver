/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/server/flowEngine.ts

import {
  FlowDefinition,
  InventoryPayload,
  CleanNode,
  NodeData,
  CleanEdge,
} from "@/types/flow";
import prisma from "@/lib/db/prisma";
import {
  evaluateCondition,
  applyTemplate,
  enrichPayload,
} from "@/lib/utils/payloadResolver";
import { Prisma } from "@prisma/client";

// This is a server-side version of the payload generator
function generateServerPayload(
  item: Prisma.InventoryItemGetPayload<object>,
  triggerEvent: string
): InventoryPayload {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const remainingDays = Math.ceil(
    (item.expiration_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    trigger_event: triggerEvent,
    timestamp: new Date(),
    // FIXED: Use the actual item owner's ID instead of a hardcoded string
    user_id: item.userId,
    inventory_item: {
      id: item.id,
      name: item.name,
      category: item.category,
      location: item.location,
      status: item.status,
      remaining_days: remainingDays,
      quantity: item.quantity,
    },
    related_data: {},
  };
}

// --- Types for Execution Result ---
interface ExecutionResult {
  trace: string[];
  finalPayload: InventoryPayload;
  log: string[];
}

// --- Helper functions ---
function findStartNode(flow: FlowDefinition): CleanNode | null {
  const nodes = flow.nodes as CleanNode[];
  const edges = flow.edges as CleanEdge[];
  if (nodes.length === 0) return null;
  const targetNodeIds = new Set(edges.map((edge) => edge.target));
  return (
    nodes.find(
      (node) => node.type.endsWith("Trigger") && !targetNodeIds.has(node.id)
    ) || null
  );
}

function matchesTrigger(
  item: Prisma.InventoryItemGetPayload<object>,
  flow: FlowDefinition
): boolean {
  const triggerNode = findStartNode(flow);
  if (!triggerNode) return false;
  const config = triggerNode.config as NodeData;
  if (triggerNode.type === "ExpirationTrigger") {
    const { timeOffset, filterCategory } = config;
    const payload = generateServerPayload(item, triggerNode.type);
    if (payload.inventory_item.remaining_days > (timeOffset as number))
      return false;
    if (
      filterCategory &&
      filterCategory !== "all" &&
      item.category.toLowerCase() !== (filterCategory as string).toLowerCase()
    )
      return false;
    return true;
  }
  if (triggerNode.type === "InventoryStatusTrigger") {
    const { targetStatus } = config;
    if (item.status.toUpperCase() === (targetStatus as string).toUpperCase())
      return true;
  }
  return false;
}

// --- CORE NODE EXECUTION LOGIC ---
async function runNode(
  currentNode: CleanNode,
  flowId: string,
  currentPayload: InventoryPayload,
  log: string[]
): Promise<InventoryPayload> {
  const config = currentNode.config as NodeData;
  let updatedPayload = { ...currentPayload };
  const currentUserId = currentPayload.user_id; // Retrieve owner ID from payload

  log.push(
    `-> Executing Node [${currentNode.id}] (${currentNode.type}): ${config.label}`
  );

  if (currentNode.type === "SendNotification") {
    const itemId = currentPayload.inventory_item.id;
    const deduplicationKey = `flow-${flowId}-item-${itemId}`;

    const existingLog = await prisma.notificationLog.findUnique({
      where: { deduplicationKey },
    });

    if (existingLog) {
      log.push(`  [Action] Notification SKIPPED: Already sent for this item.`);
      throw new Error("DUPLICATE_EXECUTION");
    }

    const message = applyTemplate(
      updatedPayload,
      (config.messageBody as string) || "No message body configured."
    );

    // Helper to log success to DB
    const logSuccessToDB = async () => {
      await prisma.notificationLog.create({
        data: {
          deduplicationKey,
          flowId,
          itemId,
          message,
          userId: currentUserId, // <--- FIXED: Added userId
        },
      });
    };

    // --- Channel-Specific Logic ---
    if (config.channel === "sms") {
      const recipientPhoneNumber = process.env.TEST_RECIPIENT_PHONE_NUMBER;

      if (!recipientPhoneNumber) {
        log.push(`  [Action] SMS FAILED: TEST_RECIPIENT_PHONE_NUMBER missing.`);
      } else {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/notify/sms`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: recipientPhoneNumber,
                message: message,
              }),
            }
          );
          const result = await response.json();

          if (!response.ok || !result.success) {
            log.push(
              `  [Action] SMS FAILED: ${result.error || "Unknown error"}`
            );
          } else {
            log.push(
              `  [Action] SMS Sent Successfully to ${recipientPhoneNumber}.`
            );
            await logSuccessToDB();
          }
        } catch (error: any) {
          log.push(`  [Action] SMS FAILED: ${error.message}`);
        }
      }
    } else if (config.channel === "email") {
      const recipientEmail = process.env.TEST_RECIPIENT_EMAIL;
      if (!recipientEmail) {
        log.push(`  [Action] Email FAILED: TEST_RECIPIENT_EMAIL missing.`);
      } else {
        try {
          const subject = `Notification for ${currentPayload.inventory_item.name}`;
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/notify/email`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ to: recipientEmail, subject, message }),
            }
          );
          const result = await response.json();

          if (!response.ok || !result.success) {
            log.push(
              `  [Action] Email FAILED: ${result.error || "Unknown error"}`
            );
          } else {
            log.push(
              `  [Action] Email Sent Successfully to ${recipientEmail}.`
            );
            await logSuccessToDB();
          }
        } catch (error: any) {
          log.push(`  [Action] Email FAILED: ${error.message}`);
        }
      }
    } else if (config.channel === "push") {
      log.push(
        `  [Action] Push Notification simulated: "${message.substring(
          0,
          50
        )}..."`
      );
      await logSuccessToDB();
    }
  } else if (currentNode.type === "PartnerIntegration") {
    const credentialId = config.credentialId as string;
    // Security Note: In a real run, we should also check if the credential belongs to the currentUserId's Org
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
    });
    if (credential) {
      log.push(`  [Action] Authenticated with credential: ${credential.name}.`);
      log.push(
        `  [Sim] Simulated external API call: "${config.actionDetail}".`
      );
    } else {
      log.push(`  [Action] FAILED: Credential ID "${credentialId}" not found.`);
    }
  } else if (currentNode.type === "UpdateData") {
    const targetPath = config.checkField as string;
    const newValue = config.checkValue;
    const itemId = currentPayload.inventory_item.id;
    if (targetPath === "inventory_item.status") {
      try {
        await prisma.inventoryItem.update({
          where: { id: itemId },
          data: { status: newValue as string },
        });
        log.push(`  [DB] Updated item ${itemId} status to: ${newValue}.`);
        updatedPayload.inventory_item.status = newValue as string;
      } catch (error) {
        log.push(`  [DB] FAILED to update item ${itemId}.`);
      }
    } else {
      log.push(
        `  [Action] FAILED: Only 'inventory_item.status' updates supported.`
      );
    }
  } else if (currentNode.type === "GenerateRecipe") {
    const promptTemplate = config.prompt as string;
    const credentialId = config.credentialId as string;

    if (!promptTemplate || !credentialId) {
      log.push(`  [AI] FAILED: Missing prompt or credential.`);
    } else {
      const finalPrompt = applyTemplate(currentPayload, promptTemplate);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/generate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Note: The AI route expects a Cookie/Auth header usually.
              // Since this is server-to-server, we might need an internal bypass or API Key.
              // For this demo, we assume the API route allows internal calls or we mock it.
            },
            body: JSON.stringify({ prompt: finalPrompt, credentialId }),
          }
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
          log.push(`  [AI] FAILED: ${result.error || "Unknown error"}`);
          updatedPayload = enrichPayload(
            updatedPayload,
            "recipe_error",
            `AI Error: ${result.error}`
          );
        } else {
          log.push(`  [AI] Successfully generated recipe suggestion.`);
          updatedPayload = enrichPayload(
            updatedPayload,
            "recipe_suggestions",
            result.data
          );
        }
      } catch (error: any) {
        log.push(`  [AI] FAILED: Connection Error: ${error.message}`);
        updatedPayload = enrichPayload(
          updatedPayload,
          "recipe_error",
          `Error: ${error.message}`
        );
      }
    }
  }

  return updatedPayload;
}

// --- CORE FLOW EXECUTION LOGIC ---
async function runFlowExecution(
  flow: FlowDefinition,
  initialPayload: InventoryPayload
): Promise<ExecutionResult> {
  const nodes = flow.nodes as CleanNode[];
  const edges = flow.edges as CleanEdge[];
  const nodesMap = new Map(nodes.map((n) => [n.id, n]));
  const edgeMap = new Map<string, CleanEdge[]>();
  edges.forEach((edge) => {
    if (!edgeMap.has(edge.source)) edgeMap.set(edge.source, []);
    edgeMap.get(edge.source)!.push(edge);
  });

  const trace: string[] = [];
  const log: string[] = [];
  let currentPayload = initialPayload;
  let currentNode = findStartNode(flow);

  if (!currentNode) {
    log.push("  [Error] No valid start/trigger node found.");
    return { trace, finalPayload: currentPayload, log };
  }

  let traceLimit = 50;
  while (currentNode && traceLimit-- > 0) {
    trace.push(currentNode.id);
    try {
      currentPayload = await runNode(currentNode, flow.id, currentPayload, log);
    } catch (error: any) {
      if (error.message === "DUPLICATE_EXECUTION") {
        log.push("  [Trace] Execution halted by deduplication check.");
        break;
      }
      log.push(`  [Error] Unhandled exception: ${error.message}`);
      throw error;
    }

    const outgoingEdges: CleanEdge[] = edgeMap.get(currentNode.id) || [];
    let nextNodeId: string | undefined;

    if (currentNode.type === "ConditionalBranch") {
      const conditionMet = evaluateCondition(
        currentNode.config as NodeData,
        currentPayload
      );
      const handle = conditionMet ? "output-true" : "output-false";
      log.push(
        `  [Logic] Condition evaluated to ${conditionMet ? "TRUE" : "FALSE"}.`
      );
      nextNodeId = outgoingEdges.find(
        (e: CleanEdge) => e.sourceHandle === handle
      )?.target;
    } else {
      nextNodeId = outgoingEdges[0]?.target;
    }

    currentNode = nextNodeId ? nodesMap.get(nextNodeId) || null : null;
    if (!currentNode) log.push("  [Trace] Path ended.");
  }

  return { trace, finalPayload: currentPayload, log };
}

// --- PUBLIC EXPORTS ---

/**
 * Execute a specific flow against a test item.
 */
export async function runTestExecution(
  flowDefinition: FlowDefinition,
  inventoryItemId: string
): Promise<(ExecutionResult & { flowId: string }) | null> {
  const item = await prisma.inventoryItem.findUnique({
    where: { id: inventoryItemId },
  });
  if (!item) return null;

  if (matchesTrigger(item, flowDefinition)) {
    const startNode = findStartNode(flowDefinition);
    const initialPayload = generateServerPayload(
      item,
      startNode?.type || "UnknownTrigger"
    );
    const result = await runFlowExecution(flowDefinition, initialPayload);
    return { ...result, flowId: flowDefinition.id };
  }
  return null;
}

/**
 * Background CRON job executor.
 * FIXED: Ensures flows only execute against items in the SAME ORGANIZATION.
 */
export async function findAndExecuteActiveFlows(): Promise<{
  count: number;
  message: string;
}> {
  console.log("--- [SERVER ENGINE CYCLE START] ---");

  // 1. Get all active flows
  const activeFlows = await prisma.flow.findMany({
    where: { isActive: true },
    // Make sure we know which org owns the flow
    select: {
      id: true,
      nodes: true,
      edges: true,
      organizationId: true,
      isActive: true,
      name: true,
      userId: true,
      lastPublished: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (activeFlows.length === 0)
    return { count: 0, message: "No active flows." };

  let executionCount = 0;

  for (const flow of activeFlows) {
    if (!flow.organizationId) continue; // Skip flows without an org (orphans)

    // 2. Fetch items ONLY for this flow's organization
    // This prevents "Data Leakage" between tenants.
    const orgItems = await prisma.inventoryItem.findMany({
      where: { organizationId: flow.organizationId },
    });

    for (const item of orgItems) {
      if (matchesTrigger(item, flow as unknown as FlowDefinition)) {
        const startNode = findStartNode(flow as unknown as FlowDefinition);
        const payload = generateServerPayload(
          item,
          startNode?.type || "Unknown"
        );

        await runFlowExecution(flow as unknown as FlowDefinition, payload);
        executionCount++;
      }
    }
  }

  const message = `Finished. Performed ${executionCount} flow execution(s).`;
  console.log(message);
  return { count: executionCount, message };
}
