import { Node, Edge } from "reactflow";
import { NodeData, InventoryPayload } from "@/types/flow";
import { TEST_PAYLOAD_NEAR_EXPIRY } from "@/lib/api/inventoryMocks";

/**
 * Safely retrieves a nested value from an object using a dot-notation path (e.g., "inventory_item.category").
 */
const getValueByPath = (obj: InventoryPayload, path: string): unknown => {
  // Start the accumulator chain with the initial object.
  // We explicitly type the accumulator to allow indexing with a string.
  return path.split(".").reduce(
    (current: unknown, key: string) => {
      // Stop if the current value is null or undefined
      if (current === undefined || current === null) {
        return undefined;
      }

      // Assert current as an indexable object and retrieve the next key's value.
      const next = (current as Record<string, unknown>)[key];

      // Return the next value, or undefined if the key didn't exist
      return next !== undefined ? next : undefined;
    },
    obj as unknown // Start the accumulator chain with the object
  );
};

/**
 * Evaluates the condition set in the ConditionalBranch node against the runtime test payload.
 * Uses dynamic path traversal.
 */
const evaluateCondition = (
  nodeData: NodeData,
  testData: InventoryPayload
): boolean => {
  const fieldPath = nodeData.checkField;
  const operator = nodeData.operator;
  const expectedValue = nodeData.checkValue;

  // If the logic node is unconfigured, default to TRUE to keep the flow moving.
  if (!fieldPath || !operator || !expectedValue) return true;

  // 1. Retrieve the actual runtime value dynamically
  const actualValue = getValueByPath(testData, fieldPath);

  if (actualValue === undefined || actualValue === null) {
    // Cannot evaluate condition because the data field is missing in the payload
    console.warn(
      `Trace Warning: Field path '${fieldPath}' missing in payload. Condition FALSE.`
    );
    return false;
  }

  // 2. Prepare values for comparison (robust comparison for different types)
  const actualString = String(actualValue).toLowerCase().trim();
  const expectedString = String(expectedValue).toLowerCase().trim();
  const actualNumber = Number(actualValue);
  const expectedNumber = Number(expectedValue);

  // 3. Perform comparison based on operator
  switch (operator) {
    case "==":
      // Strict equality check (case-insensitive for strings)
      return actualString === expectedString;
    case ">":
      // Numeric comparison
      return actualNumber > expectedNumber;
    case "<":
      // Numeric comparison
      return actualNumber < expectedNumber;

    case "includes":
      // String inclusion check
      return actualString.includes(expectedString);

    default:
      console.warn(
        `Trace Warning: Unsupported operator '${operator}'. Condition FALSE.`
      );
      return false;
  }
};

/**
 * Simulates a flow execution run on the client side to predict the path taken.
 *
 * @param nodes Current graph nodes.
 * @param edges Current graph edges.
 * @param startNodeId The ID of the node where the execution begins.
 * @returns An array of node IDs that were successfully executed in sequence.
 */
export const runClientTrace = (
  nodes: Node<NodeData>[],
  edges: Edge[],
  startNodeId: string
): string[] => {
  const executedNodes: string[] = [];
  const nodesMap = new Map(nodes.map((n) => [n.id, n]));

  // Get the default test payload structure
  const testPayload = TEST_PAYLOAD_NEAR_EXPIRY;
  let currentNodeId: string | undefined = startNodeId;
  let traceLimit = 50; // Safety measure to prevent infinite loops

  while (currentNodeId && traceLimit-- > 0) {
    const currentNode = nodesMap.get(currentNodeId);
    if (!currentNode) break;

    executedNodes.push(currentNodeId);

    let nextNodeId: string | undefined;
    const outgoingEdges = edges.filter((e) => e.source === currentNodeId);

    if (currentNode.type === "ConditionalBranch") {
      const conditionMet = evaluateCondition(currentNode.data, testPayload);

      // Look for the edge matching the result (output-true or output-false)
      const handleId = conditionMet ? "output-true" : "output-false";

      const nextEdge = outgoingEdges.find((e) => e.sourceHandle === handleId);
      nextNodeId = nextEdge?.target;
    } else {
      // For all non-branch nodes, simply follow the single outgoing edge
      const nextEdge = outgoingEdges.find(
        (e) => e.sourceHandle === "output-payload" || !e.sourceHandle
      );
      nextNodeId = nextEdge?.target;
    }

    currentNodeId = nextNodeId;

    // Stop execution if we hit a delivery node (assumed terminal action)
    if (
      currentNode.type === "SendNotification" ||
      currentNode.type === "WebhookDelivery"
    ) {
      break;
    }
  }

  return executedNodes;
};
