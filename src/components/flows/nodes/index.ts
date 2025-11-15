import { NodeTypes } from "reactflow";
// Import the components from their respective .tsx files
import TriggerNode from "./TriggerNode";
import LogicNode from "./LogicNode";
import AIProcessingNode from "./AIProcessingNode";
import ResultDeliveryNode from "./ResultDeliveryNode";
import WebhookDeliveryNode from "./WebhookDeliveryNode";
import PartnerIntegrationNode from "./PartnerIntegrationNode";

/**
 * The mapping object used by React Flow to render custom components.
 * The keys must match the 'type' field in flowNodeDefinitions.ts.
 */
export const customNodeTypes: NodeTypes = {
  // --- Trigger Nodes ---
  ExpirationTrigger: TriggerNode,
  InventoryStatusTrigger: TriggerNode,

  // --- Logic & Control Nodes ---
  ConditionalBranch: LogicNode,
  UpdateData: LogicNode,

  // --- AI Processing Nodes ---
  GenerateRecipe: AIProcessingNode,

  // --- Result Delivery Nodes ---
  SendNotification: ResultDeliveryNode,

  // --- Integration Nodes ---
  WebhookDelivery: WebhookDeliveryNode,

  PartnerIntegration: PartnerIntegrationNode,
};
