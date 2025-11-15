import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeData } from "@/types/flow";

/**
 * Custom Node component for sending notifications (Push, SMS, Email).
 */
const ResultDeliveryNode: React.FC<NodeProps<NodeData>> = memo(
  ({ data, selected }) => {
    // Destructure relevant configuration data
    const {
      label,
      channel = "push",
      messageBody = "Your item is expiring soon!",
    } = data;
    const ACCESSIBLE_HANDLE_STYLE = {
      width: 16,
      height: 16,
      borderWidth: 2,
      backgroundColor: "oklch(63.7% 0.237 25.331)",
    };

    const nodeBaseClass = "p-4 rounded-xl shadow-lg border-2";
    const selectedClass = selected ? "border-red-700" : "border-red-400";
    const colorClass = "bg-red-50 text-red-800";

    // Helper to determine the icon based on the channel
    const getIcon = (deliveryChannel: string) => {
      switch (deliveryChannel) {
        case "sms":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-red-600"
              viewBox="0 0 24 24"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          ); // Chat icon
        case "email":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-red-600"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          ); // Email icon
        case "push":
        default:
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-red-600"
              viewBox="0 0 24 24"
            >
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z" />
            </svg>
          ); // Notification icon
      }
    };

    return (
      <div className={`${nodeBaseClass} ${selectedClass} ${colorClass} w-64`}>
        {/* 
        INPUT HANDLE: Receives the final processed payload (e.g., inventory item + recipe link).
      */}
        <Handle
          type="target"
          position={Position.Left}
          id="input-final-payload"
          isConnectable={true}
          className="w-3 h-3 bg-red-500 border-none"
          style={ACCESSIBLE_HANDLE_STYLE}
        />

        {/* Node Header */}
        <div className="flex items-center space-x-2 mb-2">
          {getIcon(channel)}
          <h3 className="font-extrabold text-sm uppercase tracking-wider">
            {label || "Result Delivery"}
          </h3>
        </div>

        {/* Configuration Summary */}
        <div className="text-xs space-y-2 mt-3">
          <div className="flex justify-between items-center pb-1 border-b border-red-200">
            <span className="font-medium">Channel:</span>
            <span className="font-bold text-sm uppercase">{channel}</span>
          </div>

          <div className="pt-1">
            <span className="font-medium block mb-1">Content Preview:</span>
            <p className="italic text-gray-600 line-clamp-2 bg-red-100 p-2 rounded text-xs">
              {messageBody}
            </p>
          </div>
        </div>

        {/* 
        OUTPUT HANDLE (Optional): Some flows might need to track successful delivery, 
        but typically delivery nodes are flow terminators. We include a passive output handle.
      */}
        <Handle
          type="source"
          position={Position.Right}
          id="output-delivery-success"
          isConnectable={true}
          className="w-3 h-3 bg-red-500 border-none"
          style={ACCESSIBLE_HANDLE_STYLE}
        />
      </div>
    );
  }
);

ResultDeliveryNode.displayName = "ResultDeliveryNode";

export default ResultDeliveryNode;
