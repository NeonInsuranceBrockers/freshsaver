import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeData } from "@/types/flow";

/**
 * Custom Node component for interfacing with key FreshSaver partner APIs (Grocery Stores, Smart Fridges).
 */
const PartnerIntegrationNode: React.FC<NodeProps<NodeData>> = memo(
  ({ data, selected }) => {
    const {
      // label,
      integrationType,
      actionDetail, // Specific action like 'Place Order' or 'Update Light Status'
      credentialId, // ID referencing secure API keys
    } = data;

    const ACCESSIBLE_HANDLE_STYLE = {
      width: 16,
      height: 16,
      borderWidth: 2,
      backgroundColor: "oklch(70.5% 0.213 47.604)",
    };

    const nodeBaseClass = "p-4 rounded-xl shadow-lg border-2";
    const selectedClass = selected ? "border-orange-700" : "border-orange-400";
    const colorClass = "bg-orange-50 text-orange-800";

    // Determine display based on integration type
    let title, iconPath, primaryAction;

    switch (integrationType) {
      case "grocery-order":
        title = "Grocery Order Integration";
        primaryAction = actionDetail || "Place Order";
        iconPath = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-orange-600"
            viewBox="0 0 24 24"
          >
            <path d="M17.21 9l-4.32-4.32a.996.996 0 00-1.42 0L7.4 9H4v11h16V9h-2.79zM18 18H6v-7h12v7zM15 9h-2V7h-2v2H9l3-3 3 3z" />
          </svg>
        ); // Shopping basket icon
        break;
      case "smart-fridge-update":
        title = "Smart Fridge API Update";
        primaryAction = actionDetail || "Send Status";
        iconPath = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-orange-600"
            viewBox="0 0 24 24"
          >
            <path d="M19 8h-1V3H7v5H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-7 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM8 5h8v3H8V5z" />
          </svg>
        ); // Fridge icon
        break;
      default:
        title = "Unspecified Partner Integration";
        primaryAction = "Configure Action";
        iconPath = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 fill-orange-600"
            viewBox="0 0 24 24"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z" />
          </svg>
        ); // Security/Shield icon
    }

    return (
      <div className={`${nodeBaseClass} ${selectedClass} ${colorClass} w-64`}>
        {/* 
        INPUT HANDLE: Receives the data (e.g., the generated grocery list or item status change).
      */}
        <Handle
          type="target"
          position={Position.Left}
          id="input-payload"
          isConnectable={true}
          className="w-3 h-3 bg-orange-500 border-none"
          style={ACCESSIBLE_HANDLE_STYLE}
        />

        {/* Node Header */}
        <div className="flex items-center space-x-2 mb-2 border-b border-orange-200 pb-2">
          {iconPath}
          <h3 className="font-extrabold text-sm uppercase tracking-wider line-clamp-1">
            {title}
          </h3>
        </div>

        {/* Configuration Summary */}
        <div className="text-xs space-y-2 mt-3">
          <div className="flex justify-between items-center pb-1">
            <span className="font-medium">Action:</span>
            <span className="font-bold text-sm text-orange-700">
              {primaryAction}
            </span>
          </div>

          <div className="pt-1 border-t border-orange-200">
            <span className="font-medium block mb-1">Credentials Link:</span>
            <code className="text-gray-600 text-[10px] bg-orange-100 p-1 rounded font-mono inline-block">
              {credentialId
                ? `ID: ${credentialId.substring(0, 8)}...`
                : "NONE SELECTED"}
            </code>
          </div>

          <p className="text-[10px] text-orange-600 italic mt-2">
            Requires secure credential setup in Settings.
          </p>
        </div>

        {/* 
        OUTPUT HANDLE: Signals successful interaction with the partner API.
      */}
        <Handle
          type="source"
          position={Position.Right}
          id="output-success"
          isConnectable={true}
          className="w-3 h-3 bg-orange-500 border-none"
          style={ACCESSIBLE_HANDLE_STYLE}
        />
      </div>
    );
  }
);

PartnerIntegrationNode.displayName = "PartnerIntegrationNode";

export default PartnerIntegrationNode;
