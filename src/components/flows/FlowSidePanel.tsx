// src/components/flows/FlowSidePanel.tsx
"use client";

import React, { useMemo } from "react";
// Import the defined structure from the config file
import {
  flowNodeDefinitions,
  FlowNodeDefinition,
} from "@/config/flowNodeDefinitions";

// Define the shape for grouping nodes by category
interface NodeCategory {
  title: string;
  nodes: FlowNodeDefinition[];
}

/**
 * Utility hook to categorize the flat list of node definitions.
 */
const useCategorizedNodes = () => {
  // useMemo ensures this grouping logic only runs when the definitions change (which they shouldn't)
  // or on initial render, optimizing performance.
  return useMemo(() => {
    const categoriesMap = new Map<string, NodeCategory>();

    flowNodeDefinitions.forEach((node) => {
      const categoryTitle = node.category;

      if (!categoriesMap.has(categoryTitle)) {
        categoriesMap.set(categoryTitle, { title: categoryTitle, nodes: [] });
      }
      categoriesMap.get(categoryTitle)!.nodes.push(node);
    });

    return Array.from(categoriesMap.values());
  }, []);
};

// --- Components ---

/**
 * Handles the drag start event, setting the node type data for the canvas to read.
 */
const onDragStart = (event: React.DragEvent, nodeType: string) => {
  // Key convention required by React Flow for drag and drop
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
};

/**
 * Renders an individual draggable node item using the FlowNodeDefinition structure.
 */
const DraggableNodeItem: React.FC<{ item: FlowNodeDefinition }> = ({
  item,
}) => (
  <div
    // Use item.color directly from the config for styling
    className={`p-3 mb-2 rounded-lg shadow-sm cursor-grab border text-sm transition-all hover:shadow-md active:cursor-grabbing ${item.color}`}
    onDragStart={(event) => onDragStart(event, item.type)}
    draggable
    title={item.description}
  >
    <div className="font-semibold text-gray-800">{item.label}</div>
    <div className="text-xs text-gray-600 mt-1">{item.description}</div>
  </div>
);

/**
 * Main Flow Side Panel component.
 */
export default function FlowSidePanel() {
  const categorizedNodes = useCategorizedNodes();

  return (
    <aside className="w-72 bg-gray-50 border-r p-4 overflow-y-auto shrink-0">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Node Library</h2>

      {categorizedNodes.map((category) => (
        <section key={category.title} className="mb-6">
          <h3 className="font-semibold text-gray-600 border-b pb-1 mb-3">
            {category.title}
          </h3>
          {category.nodes.map((item) => (
            <DraggableNodeItem key={item.type} item={item} />
          ))}
        </section>
      ))}

      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Drag nodes onto the canvas to build your automation flow.
        </p>
      </div>
    </aside>
  );
}
