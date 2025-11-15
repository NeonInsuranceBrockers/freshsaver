import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeData } from "@/types/flow";
import { useTraceContext } from "@/components/flows/TraceProvider";

// Assuming the NodeData for this node includes:
// data.label: 'AI Recipe Suggestion'
// data.minUsage: number (e.g., 50)
// data.prompt: string (the user's instruction to the AI)

/**
 * Custom Node component for generating AI-powered recipe suggestions.
 */
const AIProcessingNode: React.FC<NodeProps<NodeData>> = memo(
  ({ data, selected, id }) => {
    // Destructure relevant configuration data
    const { label, minUsage = 50, prompt } = data;
    const ACCESSIBLE_HANDLE_STYLE = {
      width: 16,
      height: 16,
      borderWidth: 2,
      backgroundColor: "rgb(59, 130, 246)",
    };
    //  style={ACCESSIBLE_HANDLE_STYLE}

    const { activeTrace } = useTraceContext();
    const isActive = activeTrace.includes(id);

    const nodeBaseClass = "p-4 rounded-xl shadow-lg border-2";
    const selectedClass = selected ? "border-blue-700" : "border-blue-400";
    const colorClass = "bg-blue-50 text-blue-800";

    const traceClass = isActive
      ? "ring-4 ring-offset-2 ring-blue-500/80 scale-[1.02]"
      : "";

    return (
      <div
        className={`${nodeBaseClass} ${selectedClass} ${colorClass} ${traceClass} w-60`}
      >
        {/* 
        INPUT HANDLE: Receives the inventory item payload from the previous node (Trigger or Logic).
      */}
        <Handle
          type="target"
          position={Position.Left}
          id="input-payload"
          isConnectable={true}
          className="w-4 h-4 bg-blue-500 border-none"
          style={ACCESSIBLE_HANDLE_STYLE}
        />

        {/* Node Header */}
        <div className="flex items-center space-x-2 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-blue-600"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.43-.22-4.57-1.42-6.14-3.14L11 14.88c.84.4 1.76.64 2.7.67v3.38zm5.55-3.66l-1.35-1.35C15.82 14.8 14.8 15.82 13.66 16.99l1.35 1.35c.95-.95 1.6-2.14 1.76-3.41zM20 12c0 4.41-3.59 8-8 8V4c4.41 0 8 3.59 8 8zm-8-9c-2.47 0-4.73 1.13-6.25 2.92l1.44 1.44c1.1-.64 2.37-1.02 3.65-1.02V3z" />
          </svg>
          <h3 className="font-extrabold text-sm uppercase tracking-wider">
            {label}
          </h3>
        </div>

        {/* Configuration Summary */}
        <div className="text-xs space-y-2 mt-3">
          <div className="flex justify-between">
            <span className="font-medium">Min Usage Target:</span>
            <span className="font-bold text-base">{minUsage}%</span>
          </div>

          {prompt && (
            <div>
              <span className="font-medium block">AI Prompt:</span>
              <p className="italic text-gray-600 line-clamp-2">
                &quot;{prompt}&quot;
              </p>
            </div>
          )}
        </div>

        {/* 
        OUTPUT HANDLE: Sends the payload, now enriched with the generated recipe data.
      */}
        <Handle
          type="source"
          position={Position.Right}
          id="output-recipe-payload"
          isConnectable={true}
          className="w-3 h-3 bg-blue-500 border-none"
          style={ACCESSIBLE_HANDLE_STYLE}
        />
      </div>
    );
  }
);

// For better performance in React Flow
AIProcessingNode.displayName = "AIProcessingNode";

export default AIProcessingNode;
