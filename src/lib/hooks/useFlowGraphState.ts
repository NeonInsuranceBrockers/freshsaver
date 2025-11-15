import {
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  OnNodesChange,
  OnEdgesChange,
} from "reactflow";
import { useCallback, useState } from "react";
import { FlowDefinition, NodeData } from "@/types/flow";
import { flowDeserializer } from "@/lib/utils/flowDeserializer";

// Initial state helpers (as defined previously)
const initialNodes: Node<NodeData>[] = [
  {
    id: "start-1",
    type: "ExpirationTrigger",
    position: { x: 50, y: 50 },
    data: {
      label: "Initial Expiration Trigger",
      type: "ExpirationTrigger",
      timeOffset: 3,
    },
  },
];
const initialEdges: Edge[] = [];

interface FlowGraphState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection | Edge) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>; // Expose setNodes for inspector
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>; // Expose setEdges for manipulation
  onDeleteElements: (nodesToRemove: Node[], edgesToRemove: Edge[]) => void;
  activeTrace: string[]; // Array of Node IDs currently being executed/have executed
  setActiveTrace: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Custom hook to manage the full state lifecycle of the React Flow graph.
 * Encapsulates node/edge state, change handlers, and unsaved changes tracking.
 *
 * @param initialFlow The FlowDefinition loaded from the backend.
 * @returns FlowGraphState object.
 */
export const useFlowGraphState = (
  initialFlow: FlowDefinition
): FlowGraphState => {
  // 1. Core React Flow State
  const { nodes: deserializedNodes, edges: deserializedEdges } =
    flowDeserializer(initialFlow);

  const [nodes, setNodes, onReactFlowNodesChange] = useNodesState(
    deserializedNodes.length > 0 ? deserializedNodes : initialNodes
  );

  const [edges, setEdges, onReactFlowEdgesChange] = useEdgesState(
    deserializedEdges.length > 0 ? deserializedEdges : initialEdges
  );

  // 3. UI/Meta State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // NEW STATE: Tracks which nodes were part of the last execution run
  const [activeTrace, setActiveTrace] = useState<string[]>([]);

  // 4. Wrapper Handlers (Update React Flow State AND Unsaved Changes)

  const onDeleteElements = useCallback(
    (nodesToRemove: Node[], edgesToRemove: Edge[]) => {
      // Remove nodes and update the edge list by filtering out edges connected to removed nodes
      const nodeIdsToRemove = new Set(nodesToRemove.map((n) => n.id));
      const remainingNodes = nodes.filter((n) => !nodeIdsToRemove.has(n.id));
      setNodes(remainingNodes);

      // Filter out explicitly removed edges AND edges connected to removed nodes
      const remainingEdges = edges.filter(
        (edge) =>
          !nodeIdsToRemove.has(edge.source) &&
          !nodeIdsToRemove.has(edge.target) &&
          !edgesToRemove.some((e) => e.id === edge.id)
      );
      setEdges(remainingEdges);

      setHasUnsavedChanges(true);
      setSelectedNodeId(null); // Deselect everything after deletion
    },
    [nodes, edges, setNodes, setEdges, setHasUnsavedChanges]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onReactFlowNodesChange(changes);
      setHasUnsavedChanges(true);
    },
    [onReactFlowNodesChange]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onReactFlowEdgesChange(changes);
      setHasUnsavedChanges(true);
    },
    [onReactFlowEdgesChange]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge(params, eds));
      setHasUnsavedChanges(true);
    },
    [setEdges]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectedNodeId,
    setSelectedNodeId,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    setNodes: setNodes as React.Dispatch<
      React.SetStateAction<Node<NodeData>[]>
    >, // Explicitly cast generic setNodes
    setEdges,
    onDeleteElements,
    activeTrace,
    setActiveTrace,
  };
};
