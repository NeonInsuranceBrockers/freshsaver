// src/config/flowNodeDefinitions.ts

import { TriggerNodeDefinitions } from "./node-triggers";
import { ActionNodeDefinitions } from "./node-actions";
import { FlowNodeDefinition, NodeConfigField } from "./node-interfaces"; // Export interfaces needed externally

// Re-export the interfaces for external use (e.g., NodeInspectorPanel)
export type { FlowNodeDefinition, NodeConfigField };

/**
 * The full manifest of all available nodes in the FreshSaver Flow Editor.
 */
export const flowNodeDefinitions: FlowNodeDefinition[] = [
  ...TriggerNodeDefinitions,
  ...ActionNodeDefinitions,
];
