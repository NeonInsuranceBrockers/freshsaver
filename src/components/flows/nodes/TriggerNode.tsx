import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeData } from "@/types/flow";

// Assuming NodeData for triggers includes:
// data.label: 'Expiration Time Reached' or 'Inventory Status Change'
// data.timeOffset: number (for ExpirationTrigger)
// data.filterCategory: string (optional category filter)
// data.targetStatus: string (for InventoryStatusTrigger, e.g., 'expired')

/**
 * Custom Node component representing the start point of a workflow (Trigger).
 */
const TriggerNode: React.FC<NodeProps<NodeData>> = memo(
  ({ data, selected }) => {
    const {
      label,
      timeOffset,
      filterCategory,
      targetStatus,
      type, // Passed from React Flow, usually matches 'type' in flowNodeDefinitions
    } = data;

    const nodeBaseClass = "p-4 rounded-xl shadow-lg border-2";
    const selectedClass = selected ? "border-green-700" : "border-green-400";
    const colorClass = "bg-green-50 text-green-800";
    const ACCESSIBLE_HANDLE_STYLE = {
      width: 16,
      height: 16,
      borderWidth: 2,
      backgroundColor: "oklch(72.3% 0.219 149.579)",
    };

    // Determine specific configuration display based on the node's internal type
    let configDetail;

    if (type === "ExpirationTrigger") {
      configDetail = (
        <>
          <div className="flex justify-between">
            <span className="font-medium">Trigger Before:</span>
            <span className="font-bold text-base">{timeOffset} days</span>
          </div>
          {filterCategory && filterCategory !== "all" && (
            <div className="flex justify-between text-xs">
              <span>Category Filter:</span>
              <span className="font-semibold uppercase">{filterCategory}</span>
            </div>
          )}
        </>
      );
    } else if (type === "InventoryStatusTrigger") {
      configDetail = (
        <>
          <div className="flex justify-between">
            <span className="font-medium">Status Change To:</span>
            <span
              className={`font-bold text-base uppercase ${
                targetStatus === "expired" ? "text-red-600" : "text-orange-600"
              }`}
            >
              {targetStatus?.replace("_", " ") || "Any Status"}
            </span>
          </div>
        </>
      );
    } else {
      configDetail = (
        <p className="text-xs italic text-gray-600">Unspecified Trigger Type</p>
      );
    }

    return (
      <div className={`${nodeBaseClass} ${selectedClass} ${colorClass} w-60`}>
        {/* Node Header */}
        <div className="flex items-center space-x-2 mb-2 border-b border-green-200 pb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-green-600"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          <h3 className="font-extrabold text-sm uppercase tracking-wider">
            {label || "Start Event"}
          </h3>
          <span className="text-xs font-mono px-1 py-0 bg-green-200 text-green-800 rounded">
            START
          </span>
        </div>

        {/* Configuration Summary */}
        <div className="text-xs space-y-2 mt-3">{configDetail}</div>

        {/* 
        OUTPUT HANDLE: Sends the initial data payload forward.
      */}
        <Handle
          type="source"
          position={Position.Right}
          id="output-payload"
          isConnectable={true}
          className="w-3 h-3 bg-green-500 border-none"
          style={ACCESSIBLE_HANDLE_STYLE}
        />
      </div>
    );
  }
);

TriggerNode.displayName = "TriggerNode";

export default TriggerNode;
