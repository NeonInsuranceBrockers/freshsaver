import { Node, Edge } from "reactflow";
import { FlowDefinition, CleanNode, CleanEdge, NodeType } from "@/types/flow";

/**
 * Converts React Flow's node and edge arrays into a clean, backend-executable FlowDefinition object.
 *
 * @param flowId The ID of the flow.
 * @param flowName The human-readable name of the flow.
 * @param rfNodes The nodes array from the React Flow instance.
 * @param rfEdges The edges array from the React Flow instance.
 * @returns A structured FlowDefinition object ready for the backend API.
 */
export const flowSerializer = (
  flowId: string,
  flowName: string,
  rfNodes: Node[],
  rfEdges: Edge[]
): FlowDefinition => {
  // 1. Serialize Nodes: Extract only essential configuration data
  const serializedNodes: CleanNode[] = rfNodes.map((node) => {
    // We must ensure the 'type' used is compliant with NodeType
    const nodeType = (node.type || "default") as NodeType;

    // Use the CleanNode structure defined in flow.ts
    const serializedNode: CleanNode = {
      id: node.id,
      type: nodeType,
      position: { x: node.position.x, y: node.position.y },
      config: node.data || {}, // Data is mapped to config
    };
    return serializedNode;
  });

  // 2. Serialize Edges: Extract only core connection information
  const serializedEdges: CleanEdge[] = rfEdges.map((edge) => {
    // Use the CleanEdge structure defined in flow.ts
    const serializedEdge: CleanEdge = {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || null,
      targetHandle: edge.targetHandle || null,
      type: edge.type,
    };
    return serializedEdge;
  });

  // 3. Assemble the final FlowDefinition object
  const definition: FlowDefinition = {
    id: flowId,
    name: flowName,
    // Store the cleaned nodes and edges arrays
    nodes: serializedNodes, // Now correctly typed as the imported CleanNode[]
    edges: serializedEdges, // Now correctly typed as the imported CleanEdge[]
    // lastPublished is usually updated by the publishing action,
    // but included here for structural completeness.
    lastPublished: null,
  };

  return definition;
};

// --- Helper Functions (Example Usage in Console) ---
/*
// Example of a raw React Flow Node input:
const sampleRfNode: Node = {
    id: 'a1',
    type: 'WebhookNode',
    position: { x: 100, y: 100 },
    data: { url: 'https://example.com/hook', method: 'POST' },
    // Numerous React Flow internal properties would follow (e.g., selected: true, positionAbsolute: {...})
};

// Example of desired CleanNode output:
// {
//   id: 'a1',
//   type: 'WebhookNode',
//   position: { x: 100, y: 100 },
//   config: { url: 'https://example.com/hook', method: 'POST' }
// }
*/
