// src/components/flows/NodeInspectorPanel.tsx
"use client";

import React, { useMemo } from "react";
import { Node } from "reactflow";

// --- Components and Types Imports ---
import InspectorHeader from "./InspectorHeader";
import InspectorForm from "./InspectorForm";
import { flowNodeDefinitions } from "@/config/flowNodeDefinitions";
import { NodeData } from "@/types/flow";

// NOTE: The original RHF imports and the DynamicField definition were removed
// from this file and moved to InspectorForm.tsx and DynamicFieldRenderer.tsx
// to achieve separation, as requested.

interface NodeInspectorPanelProps {
  selectedNodeId: string | null;
  nodes: Node<NodeData>[]; // Nodes array including NodeData type
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>;
}

// --- Main Inspector Component ---

export default function NodeInspectorPanel({
  selectedNodeId,
  nodes,
  setNodes,
}: NodeInspectorPanelProps) {
  // 1. Memoize the selected node and its definition for efficient lookup
  const selectedNode = useMemo(() => {
    return selectedNodeId
      ? nodes.find((n) => n.id === selectedNodeId)
      : undefined;
  }, [selectedNodeId, nodes]);

  const definition = useMemo(() => {
    if (!selectedNode?.type) return undefined;
    return flowNodeDefinitions.find((d) => d.type === selectedNode.type);
  }, [selectedNode]);

  // --- Render ---

  if (!selectedNode || !definition) {
    return (
      <aside className="w-80 bg-white border-l p-4 shadow-lg overflow-y-auto shrink-0">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Inspector</h3>
        <p className="text-gray-500 text-sm">
          Select a node on the canvas to configure its settings.
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white border-l p-4 shadow-lg overflow-y-auto shrink-0">
      {/* Component 1: Header */}
      <InspectorHeader definition={definition} />

      {/* Component 2: Form */}
      <InspectorForm
        definition={definition}
        selectedNode={selectedNode}
        selectedNodeId={selectedNodeId as string}
        setNodes={setNodes}
      />

      {/* Note: The final submit button is effectively unnecessary because of the 
           auto-save behavior triggered by the useEffect/watch hook, 
           but it's left here for manual confirmation if needed. */}
      {/* <button type="submit" className="mt-4 w-full py-2 bg-green-600 text-white rounded-md">
        Apply Changes
      </button> */}
    </aside>
  );
}
