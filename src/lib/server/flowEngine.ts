// /lib/server/flowEngine.ts

import {
  FlowDefinition,
  InventoryPayload,
  CleanNode,
  NodeData,
  CleanEdge,
} from "@/types/flow";
import prisma from "@/lib/db/prisma"; // The one true data source
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
    user_id: "server-user-001", // Or from user session
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

// --- Helper functions (findStartNode, matchesTrigger) adapted for Prisma types ---
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

    // If we are here, the notification has NOT been sent yet.
    const message = applyTemplate(
      updatedPayload,
      (config.messageBody as string) || "No message body configured."
    );

    // --- Channel-Specific Logic ---
    if (config.channel === "sms") {
      const recipientPhoneNumber = process.env.TEST_RECIPIENT_PHONE_NUMBER;

      if (!recipientPhoneNumber) {
        log.push(
          `  [Action] SMS FAILED: TEST_RECIPIENT_PHONE_NUMBER is not set in .env file.`
        );
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
              `  [Action] SMS FAILED: API responded with an error: ${
                result.error || "Unknown error"
              }`
            );
            // We do NOT log to the DB, so the system can try again on the next cron run.
          } else {
            log.push(
              `  [Action] SMS Sent Successfully to ${recipientPhoneNumber}. SID: ${result.messageSid}`
            );
            // Log to DB only on successful send to prevent duplicates.
            await prisma.notificationLog.create({
              data: { deduplicationKey, flowId, itemId, message },
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          log.push(
            `  [Action] SMS FAILED: Could not connect to the notification API. Error: ${error.message}`
          );
        }
      }
    } else if (config.channel === "email") {
      const recipientEmail = process.env.TEST_RECIPIENT_EMAIL;
      if (!recipientEmail) {
        log.push(
          `  [Action] Email FAILED: TEST_RECIPIENT_EMAIL is not set in .env file.`
        );
      } else {
        try {
          // The subject can also be a template. For now, we'll create a generic one.
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
              `  [Action] Email FAILED: API responded with an error: ${
                result.error || "Unknown error"
              }`
            );
          } else {
            log.push(
              `  [Action] Email Sent Successfully to ${recipientEmail}.`
            );
            // Log to DB only on successful send
            await prisma.notificationLog.create({
              data: { deduplicationKey, flowId, itemId, message },
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          log.push(
            `  [Action] Email FAILED: Could not connect to the notification API. Error: ${error.message}`
          );
        }
      }
      // log.push(`  [Action] Email sending is not yet implemented.`);
      // In a real implementation, we would NOT log to the DB here until it's successful.
    } else if (config.channel === "push") {
      // For push notifications, you might call a service like Firebase Cloud Messaging.
      // Since this is a simulation, we'll consider it an instant success.
      log.push(
        `  [Action] Push Notification simulated: "${message.substring(
          0,
          50
        )}..."`
      );
      // Log success to DB for deduplication.
      await prisma.notificationLog.create({
        data: { deduplicationKey, flowId, itemId, message },
      });
    }
  } else if (currentNode.type === "PartnerIntegration") {
    const credentialId = config.credentialId as string;
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
    });
    if (credential) {
      log.push(`  [Action] Authenticated with credential: ${credential.name}.`);
      log.push(
        `  [Sim] Simulated external API call for action: "${config.actionDetail}".`
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        log.push(`  [DB] FAILED to update item ${itemId} in database.`);
      }
    } else {
      log.push(
        `  [Action] FAILED: UpdateData node only supports updating 'inventory_item.status' in this mock.`
      );
    }
  } else if (currentNode.type === "GenerateRecipe") {
    const promptTemplate = config.prompt as string;
    const credentialId = config.credentialId as string;

    if (!promptTemplate || !credentialId) {
      log.push(
        `  [AI] FAILED: Node is not fully configured. Missing prompt or credential link.`
      );
    } else {
      const finalPrompt = applyTemplate(currentPayload, promptTemplate);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/ai/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: finalPrompt, credentialId }),
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          // The API failed (e.g., invalid key, server error)
          log.push(
            `  [AI] FAILED: API responded with an error: ${
              result.error || "Unknown error"
            }`
          );

          // Enrich the payload with the error for downstream nodes to use
          updatedPayload = enrichPayload(
            updatedPayload,
            "recipe_error",
            `AI Error: ${result.error || "Unknown error"}`
          );
        } else {
          // The API call was successful
          log.push(`  [AI] Successfully generated recipe suggestion.`);

          // Enrich the payload with the AI's response data
          updatedPayload = enrichPayload(
            updatedPayload,
            "recipe_suggestions",
            result.data
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        log.push(
          `  [AI] FAILED: Could not connect to the AI proxy API. Error: ${error.message}`
        );
        updatedPayload = enrichPayload(
          updatedPayload,
          "recipe_error",
          `AI Connection Error: ${error.message}`
        );
      }
    }

    // const mockRecipe = {
    //   title: `Quick Recipe for ${currentPayload.inventory_item.name}`,
    //   link: `https://example.com/recipe/${currentPayload.inventory_item.id}`,
    // };
    // updatedPayload = enrichPayload(
    //   updatedPayload,
    //   "recipe_suggestions",
    //   mockRecipe
    // );
    // log.push(`  [AI] Generated recipe suggestion: "${mockRecipe.title}".`);
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
    log.push(
      "  [Error] Flow execution failed: No valid start/trigger node found."
    );
    return { trace, finalPayload: currentPayload, log };
  }

  let traceLimit = 50;
  while (currentNode && traceLimit-- > 0) {
    trace.push(currentNode.id);
    try {
      currentPayload = await runNode(currentNode, flow.id, currentPayload, log);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    if (nextNodeId) {
      currentNode = nodesMap.get(nextNodeId) || null;
    } else {
      log.push("  [Trace] Path ended.");
      currentNode = null;
    }
  }

  return { trace, finalPayload: currentPayload, log };
}

// --- PUBLIC EXPORTS FOR API/CRON JOB ---

/**
 * For the "Execute (Test)" button. Runs a specific flow against a test item.
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
 * For the background CRON job. Finds and executes all active flows against all relevant items.
 */
export async function findAndExecuteActiveFlows(): Promise<{
  count: number;
  message: string;
}> {
  console.log("--- [SERVER ENGINE CYCLE START] ---");
  const activeFlows = await prisma.flow.findMany({ where: { isActive: true } });
  if (activeFlows.length === 0)
    return { count: 0, message: "No active flows." };

  // In a real scenario, you'd filter for items that are near expiry, etc.
  const allItems = await prisma.inventoryItem.findMany();
  let executionCount = 0;

  for (const flow of activeFlows) {
    for (const item of allItems) {
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
