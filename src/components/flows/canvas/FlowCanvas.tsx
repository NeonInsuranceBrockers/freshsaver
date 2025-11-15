// src/components/flows/canvas/FlowCanvas.tsx
"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  useReactFlow, // Crucial hook for utility access
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
} from "reactflow";
import { NodeData } from "@/types/flow";
import { customNodeTypes } from "../nodes"; // Custom nodes map
import CustomEdge from "./CustomEdge"; // Placeholder for custom edge
import { useNodeDragAndDrop } from "@/lib/hooks/useNodeDragAndDrop";

interface FlowCanvasProps {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection | Edge) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteElements: (nodesToRemove: Node[], edgesToRemove: Edge[]) => void;
}

// Define custom types for React Flow
const nodeTypes = customNodeTypes;
const edgeTypes = {
  "custom-edge": CustomEdge, // Assuming a custom edge type for conditional lines
};

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  setNodes,
  setHasUnsavedChanges,
  onDeleteElements,
}) => {
  // Access the React Flow instance methods
  const reactFlowInstance: ReactFlowInstance | null = useReactFlow();

  const { onDragOver, onDrop } = useNodeDragAndDrop(
    setNodes,
    setHasUnsavedChanges
  );
  // Handler for calculating position when dropping a node

  // Save/Restore functionality (optional but highly recommended)
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      // Logic to serialize and send to backend
      const flowObject = reactFlowInstance.toObject();
      console.log("Canvas State Saved:", flowObject);
    }
  }, [reactFlowInstance]);

  const onNodesDelete = useCallback(
    (nodesToRemove: Node[]) => {
      onDeleteElements(nodesToRemove, []);
    },
    [onDeleteElements]
  );

  const onEdgesDelete = useCallback(
    (edgesToRemove: Edge[]) => {
      onDeleteElements([], edgesToRemove);
    },
    [onDeleteElements]
  );

  return (
    <div
      className="w-full h-full relative"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes} // Apply custom edge types
        fitView // Fit the view to the elements on load
        className="bg-gray-50"
      >
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Controls showZoom={false} showFitView={false} />

        {/* Example: Custom keybind for saving */}
        <button
          onClick={onSave}
          className="absolute bottom-5 left-5 z-10 p-2 bg-white rounded shadow text-xs"
        >
          Save Snapshot
        </button>
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;

// NOTE: The FlowEditorContainer must be updated to use this component
// AND adjust its onNodesChange wrapper to properly handle node additions
// if we use the reactflow change object for new nodes.
