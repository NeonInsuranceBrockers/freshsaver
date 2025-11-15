import React, { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from "reactflow";

// Define the expected properties for our custom edge
interface CustomEdgeData {
  // We use the sourceHandle to determine if this is a True or False path
  sourceHandle: "output-true" | "output-false" | string | null;
}

const CustomEdge: React.FC<EdgeProps<CustomEdgeData>> = memo((props) => {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    style = {}, // Ensure style is present
    markerEnd,
  } = props;

  // 1. Calculate the path geometry
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // 2. Determine Style based on sourceHandle ID (Crucial for ConditionalBranch)
  let edgeColor = "#555";
  let edgeLabel = "";

  // Check the sourceHandle ID to assign meaning and color
  if (data?.sourceHandle === "output-true") {
    edgeColor = "#10B981"; // Tailwind Green-500
    edgeLabel = "TRUE";
  } else if (data?.sourceHandle === "output-false") {
    edgeColor = "#EF4444"; // Tailwind Red-500
    edgeLabel = "FALSE";
  } else {
    // Default or single path action
    edgeColor = "#3B82F6"; // Tailwind Blue-500
  }

  const combinedStyle = {
    ...style,
    strokeWidth: 2,
    stroke: edgeColor,
  };

  return (
    <>
      {/* 1. The Base Path */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={combinedStyle}
        markerEnd={markerEnd}
      />

      {/* 2. Edge Label (Used primarily for ConditionalBranch visualization) */}
      {edgeLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className={`
              absolute px-2 py-0.5 text-xs font-bold rounded-full 
              ${
                edgeLabel === "TRUE"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              } 
              pointer-events-none
            `}
          >
            {edgeLabel}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

CustomEdge.displayName = "CustomEdge";

export default CustomEdge;
