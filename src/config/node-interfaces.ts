// src/config/node-interfaces.ts

import { NodeData } from "@/types/flow";

/**
 * Defines the structure for a single configurable input field within a node.
 */
export interface NodeConfigField {
  key: keyof NodeData; // The key used in the node's 'data' object
  label: string;
  type:
    | "text"
    | "number"
    | "textarea"
    | "dropdown"
    | "boolean"
    | "variable-picker";
  required: boolean;
  defaultValue?: unknown;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For dropdowns
  // Defines input variable visibility (e.g., 'Target URL' field should not be available
  // for configuration in the 'ExpirationTrigger' node)
  isInputVariable?: boolean;
}

/**
 * Defines the complete structure for a single node type in the system.
 */
export interface FlowNodeDefinition {
  type: string; // Must match the string used in React Flow
  label: string;
  category:
    | "Triggers"
    | "Logic & Control"
    | "Data Actions"
    | "AI Processing"
    | "Result Delivery"
    | "Integration";
  description: string;
  color: string; // Tailwind class for visual distinction (e.g., 'bg-green-100')
  isTrigger: boolean; // True if this node can start a flow
  configFields: NodeConfigField[]; // Array of configuration fields shown in the Inspector
}

// NOTE: FlowDefinition and NodeData must be imported from "@/types/flow"
