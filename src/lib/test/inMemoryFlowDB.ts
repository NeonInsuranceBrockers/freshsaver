// src/lib/test/inMemoryFlowDB.ts

import { FlowDefinition, CleanNode, CleanEdge } from "@/types/flow";

// --- Utility Functions ---

/**
 * Generates a mock unique ID for edges.
 */
const nextId = () => `edge-${(Math.random() * 100000).toFixed(0)}`;

// --- 1. MOCK FLOW DEFINITIONS ---

// --- A. Complex Flow Definition ---
const complexNodes: CleanNode[] = [
  {
    id: "n1",
    type: "ExpirationTrigger",
    position: { x: 50, y: 150 },
    config: {
      label: "Dairy Expiration Check",
      type: "ExpirationTrigger",
      timeOffset: 2,
      filterCategory: "dairy",
    },
  },
  {
    id: "n2",
    type: "ConditionalBranch",
    position: { x: 300, y: 100 },
    config: {
      label: "Check If Fridge",
      type: "ConditionalBranch",
      checkField: "inventory_item.location",
      operator: "==",
      checkValue: "Fridge",
    },
  },
  {
    id: "n3",
    type: "SendNotification",
    position: { x: 550, y: 50 },
    config: {
      label: "Push Alert (True)",
      type: "SendNotification",
      channel: "push",
      messageBody: "Dairy expiring in 2 days: {{inventory_item.name}}",
    },
  },
  {
    id: "n4",
    type: "GenerateRecipe",
    position: { x: 550, y: 250 },
    config: {
      label: "Generate Leftover Recipe",
      type: "GenerateRecipe",
      prompt:
        "Suggest a healthy dish using this item and zero carb ingredients.",
      minUsage: 75,
    },
  },
  {
    id: "n5",
    type: "WebhookDelivery",
    position: { x: 800, y: 250 },
    config: {
      label: "Log Waste Reduction",
      type: "WebhookDelivery",
      targetUrl: "https://api.analytics.com/log",
      httpMethod: "POST",
    },
  },
];

const complexEdges: CleanEdge[] = [
  {
    id: nextId(),
    source: "n1",
    sourceHandle: "output-payload",
    target: "n2",
    targetHandle: "input-payload",
    type: undefined,
  },
  {
    id: nextId(),
    source: "n2",
    sourceHandle: "output-true",
    target: "n3",
    targetHandle: "input-final-payload",
    type: "custom-edge",
  },
  {
    id: nextId(),
    source: "n2",
    sourceHandle: "output-false",
    target: "n4",
    targetHandle: "input-payload",
    type: "custom-edge",
  },
  {
    id: nextId(),
    source: "n4",
    sourceHandle: "output-recipe-payload",
    target: "n5",
    targetHandle: "input-payload",
    type: undefined,
  },
];

export const MOCK_FLOW_COMPLEX: FlowDefinition = {
  id: "complex-123",
  name: "Full Waste Reduction Pipeline",
  nodes: complexNodes,
  edges: complexEdges,
  lastPublished: new Date(Date.now() - 86400000),
};

// --- B. Empty Flow Definition ---
export const MOCK_FLOW_EMPTY: FlowDefinition = {
  id: "empty-456",
  name: "New Empty Flow Template",
  nodes: [],
  edges: [],
  lastPublished: null,
};

// --- C. Simple Status Change Flow (for execution testing) ---
export const MOCK_FLOW_SIMPLE: FlowDefinition = {
  id: "simple-status-789",
  name: "Handle Expired Items",
  nodes: [
    {
      id: "s1",
      type: "InventoryStatusTrigger",
      position: { x: 50, y: 50 },
      config: {
        label: "Item Expired",
        type: "InventoryStatusTrigger",
        targetStatus: "expired", // This is the key field for the trigger
      },
    },
    {
      id: "s2",
      type: "SendNotification",
      position: { x: 300, y: 50 },
      config: {
        label: "Alert Item Expired",
        type: "SendNotification",
        channel: "push",
        messageBody:
          "ALERT: {{inventory_item.name}} has been marked as expired.",
      },
    },
  ],
  edges: [
    {
      id: nextId(),
      source: "s1",
      sourceHandle: "output-payload",
      target: "s2",
      targetHandle: "input-final-payload",
      type: undefined,
    },
  ],
  lastPublished: new Date(),
};

// --- 2. IN-MEMORY FLOW STORE ---
const flowStore = new Map<string, FlowDefinition>([
  [MOCK_FLOW_COMPLEX.id, MOCK_FLOW_COMPLEX],
  [MOCK_FLOW_EMPTY.id, MOCK_FLOW_EMPTY],
  [MOCK_FLOW_SIMPLE.id, MOCK_FLOW_SIMPLE],
]);

// --- 3. DATABASE ACCESS SIMULATION FUNCTIONS ---

/**
 * Retrieves a flow definition by ID from the in-memory store.
 * @param flowId The ID of the flow.
 * @returns The FlowDefinition or null if not found.
 */
export function getFlowById(flowId: string): FlowDefinition | null {
  // Simulate asynchronous database retrieval
  // await new Promise((resolve) => setTimeout(resolve, 50));
  return flowStore.get(flowId) || null;
}

/**
 * Retrieves all currently saved flow definitions.
 * @returns An array of all FlowDefinitions.
 */
export function getAllFlows(): FlowDefinition[] {
  // Simulate asynchronous database retrieval
  // await new Promise((resolve) => setTimeout(resolve, 50));
  return Array.from(flowStore.values());
}

/**
 * Saves or updates a flow definition in the in-memory store.
 * @param flow The flow definition to save.
 */
export function saveFlowDefinition(flow: FlowDefinition): void {
  // Simulate asynchronous database write
  // await new Promise((resolve) => setTimeout(resolve, 100));
  flowStore.set(flow.id, flow);
}

// NOTE: This file now acts as the authoritative source for mock flow data,
// replacing the usage of flowMocks.ts entirely.
