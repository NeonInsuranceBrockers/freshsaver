// import { Node, Edge } from "reactflow"; // Import React Flow types for better array definition

/**
 * 1. NodeType: Union of all possible flow node identifiers.
 * This ensures consistency across the FlowSidePanel, flowNodeDefinitions, and the Canvas.
 */

export type NodeType =
  | "ExpirationTrigger"
  | "InventoryStatusTrigger"
  | "ConditionalBranch"
  | "UpdateData"
  | "GenerateRecipe"
  | "SendNotification"
  | "WebhookDelivery"
  | "PartnerIntegration";

/**
 * Defines the structure for the configuration data stored within the 'data' property of every Node.
 * This object holds all the settings defined by the user in the Inspector Panel.
 *
 * We use Record<string, any> for flexibility, but define common, required keys explicitly.
 */
export interface NodeData extends Record<string, unknown> {
  // --- Common Fields ---
  label: string; // Human-readable label displayed on the node UI
  type: NodeType;

  // --- Trigger Configuration Fields ---
  timeOffset?: number; // ExpirationTrigger
  filterCategory?: string; // ExpirationTrigger
  targetStatus?: "near_expiry" | "expired"; // InventoryStatusTrigger

  // --- Logic Configuration Fields ---
  checkField?: string; // ConditionalBranch
  operator?: string; // ConditionalBranch (e.g., '==', '>')
  checkValue?: string; // ConditionalBranch

  // --- AI Configuration Fields ---
  prompt?: string; // GenerateRecipe
  minUsage?: number; // GenerateRecipe (e.g., 50%)

  // --- Delivery/Integration Configuration Fields ---
  channel?: "push" | "sms" | "email"; // SendNotification
  messageBody?: string; // SendNotification (Template content)

  targetUrl?: string; // WebhookDelivery
  httpMethod?: "POST" | "PUT"; // WebhookDelivery
  payloadTemplate?: string; // WebhookDelivery (JSON template)

  integrationType?: "grocery-order" | "smart-fridge-update"; // PartnerIntegration
  actionDetail?: string; // PartnerIntegration (Specific action name)
  credentialId?: string; // PartnerIntegration (Link to secure credentials)
}

/**
 * 3. InventoryPayload: Defines the structure of the data dictionary
 * that flows between nodes during execution. This is the "project context."
 */
export interface InventoryPayload {
  // --- Contextual Data ---
  trigger_event: string;
  timestamp: Date;
  user_id: string;

  // --- Core Item Data (Inventory Item being acted upon) ---
  inventory_item: {
    id: string;
    name: string;
    category: string;
    location: string;
    status: string; // Current Kanban status
    remaining_days: number;
    quantity: number;
    // Other item metadata...
  };

  // --- Related/Enriched Data (Added by AI/Logic nodes) ---
  related_data: {
    recipe_suggestions?: Array<{
      id: string;
      title: string;
      link: string;
      score: number; // AI confidence score
    }>;
    // Conditional branch results, API lookups, etc.
    [key: string]: unknown;
  };
}

/**
 * 4. FlowDefinition: Defines the structure of a saved flow ready for the backend execution engine.
 * We use the cleaned structure defined in flowSerializer.ts (CleanNode/CleanEdge).
 */

export interface CleanNode {
  id: string;
  type: NodeType;
  config: Record<string, unknown>; // Configuration derived from NodeData
  position: { x: number; y: number };
}

export interface CleanEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  type?: string;
}

/**
 * Defines the structure of a saved flow ready for the backend engine.
 */
export interface FlowDefinition {
  id: string;
  name: string;
  // Use React Flow's generic types for better compatibility,
  // or define CleanNode/CleanEdge interfaces (as used in flowSerializer).
  nodes: CleanNode[];
  edges: CleanEdge[];
  lastPublished: Date | null;
  isActive?: boolean;
}
