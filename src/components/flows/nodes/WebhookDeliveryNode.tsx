import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeData } from "@/types/flow";

/**
 * Custom Node component for sending structured data via webhook to external services.
 */
const WebhookDeliveryNode: React.FC<NodeProps<NodeData>> = memo(
  ({ data, selected }) => {
    const ACCESSIBLE_HANDLE_STYLE = {
      width: 16,
      height: 16,
      borderWidth: 2,
      backgroundColor: "oklch(62.7% 0.265 303.9)",
    };
    // Destructure relevant configuration data
    const { label, targetUrl, httpMethod = "POST", payloadTemplate } = data;

    const nodeBaseClass = "p-4 rounded-xl shadow-lg border-2";
    const selectedClass = selected ? "border-purple-700" : "border-purple-400";
    const colorClass = "bg-purple-50 text-purple-800";

    // Shorten URL for display
    const displayUrl = targetUrl
      ? targetUrl.replace(/^(https?:\/\/)/, "").substring(0, 30) +
        (targetUrl.length > 30 ? "..." : "")
      : "Not Configured";

    return (
      <div className={`${nodeBaseClass} ${selectedClass} ${colorClass} w-72`}>
        {/* 
        INPUT HANDLE: Receives the data payload from the previous node.
      */}
        <Handle
          type="target"
          position={Position.Left}
          id="input-payload"
          isConnectable={true}
          className="w-3 h-3 bg-purple-500 border-none"
          style={ACCESSIBLE_HANDLE_STYLE}
        />

        {/* Node Header */}
        <div className="flex items-center space-x-2 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-purple-600"
            viewBox="0 0 24 24"
          >
            <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2c-1.22-1.63-2.12-3.32-2.75-5.06l1.4-1.4L12 6zM17.25 10c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.38 18c-2.64 0-5.09-1.03-6.93-2.73l2.84-2.84c1.23.68 2.58 1.05 3.88 1.05V20z" />
          </svg>
          <h3 className="font-extrabold text-sm uppercase tracking-wider">
            {label || "Webhook Delivery"}
          </h3>
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-purple-200 text-purple-800">
            {httpMethod}
          </span>
        </div>

        {/* Configuration Summary */}
        <div className="text-xs space-y-2 mt-3">
          <div className="pb-1 border-b border-purple-200">
            <span className="font-medium block">Target URL:</span>
            <code className="text-gray-600 break-words font-mono text-[10px] bg-purple-100 p-1 rounded inline-block mt-0.5">
              {displayUrl}
            </code>
          </div>

          <div className="pt-1">
            <span className="font-medium block mb-1">Payload Template:</span>
            <p className="italic text-gray-600 line-clamp-2 bg-purple-100 p-2 rounded text-xs">
              {payloadTemplate || "Default flow payload (Full JSON)"}
            </p>
          </div>

          {/* Placeholder for security info, ensuring users know credentials are used */}
          <div className="text-[10px] text-purple-600 italic mt-2">
            Uses configured credentials if required.
          </div>
        </div>

        {/* 
        OUTPUT HANDLE: Terminates the flow, optionally signaling success/failure.
      */}
        <Handle
          type="source"
          position={Position.Right}
          id="output-delivery-success"
          isConnectable={true}
          className="w-3 h-3 bg-purple-500 border-none"
          style={ACCESSIBLE_HANDLE_STYLE}
        />
      </div>
    );
  }
);

WebhookDeliveryNode.displayName = "WebhookDeliveryNode";

export default WebhookDeliveryNode;
