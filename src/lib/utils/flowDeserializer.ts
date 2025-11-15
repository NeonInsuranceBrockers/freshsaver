import { Node, Edge, XYPosition } from "reactflow";
import {
  FlowDefinition,
  CleanNode,
  CleanEdge,
  NodeData,
  NodeType,
} from "@/types/flow";

/**
 * Transforms the backend-optimized FlowDefinition (using CleanNode/CleanEdge structures)
 * back into the specific Node and Edge array format required by React Flow for rendering.
 *
 * @param flowDefinition The FlowDefinition loaded from the API.
 * @returns An object containing React Flow ready arrays.
 */
export const flowDeserializer = (flowDefinition: FlowDefinition) => {
  // 1. Deserializing Nodes
  const nodes: Node<NodeData>[] = flowDefinition.nodes.map(
    (cleanNode: CleanNode) => {
      // 1a. Extract required string properties with safe fallbacks
      const label: string =
        (cleanNode.config.label as string) || cleanNode.type;
      const type: NodeType = cleanNode.type;

      // The CleanNode stores user inputs in 'config', React Flow requires them in 'data'.
      const nodeData: NodeData = {
        ...(cleanNode.config as NodeData), // Spread the configuration fields
        label: label, // Ensure a label exists
        type: type, // Ensure the type field is correctly mapped
      };

      // Create the final React Flow Node structure
      const rfNode: Node<NodeData> = {
        id: cleanNode.id,
        type: cleanNode.type, // RF uses this for component mapping
        position: cleanNode.position as XYPosition,
        data: nodeData, // Pass the transformed configuration here
      };

      return rfNode;
    }
  );

  // 2. Deserializing Edges (Simpler mapping)
  const edges: Edge[] = flowDefinition.edges.map((cleanEdge: CleanEdge) => {
    // CleanEdge structure closely matches basic React Flow Edge structure
    const rfEdge: Edge = {
      id: cleanEdge.id,
      source: cleanEdge.source,
      target: cleanEdge.target,
      sourceHandle: cleanEdge.sourceHandle,
      targetHandle: cleanEdge.targetHandle,
      type: cleanEdge.type, // Useful for conditional edges
      // Note: No 'data' object needed for basic edges
    };
    return rfEdge;
  });

  return { nodes, edges };
};
