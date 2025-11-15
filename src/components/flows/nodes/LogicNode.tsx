import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeData } from "@/types/flow";

/**
 * Custom Node component for handling conditional logic (branching) and simple data updates.
 */
const LogicNode: React.FC<NodeProps<NodeData>> = memo(({ data, selected }) => {
  const {
    label,
    type, // e.g., 'ConditionalBranch' or 'UpdateData'
    checkField,
    operator,
    checkValue,
  } = data;

  const ACCESSIBLE_HANDLE_STYLE = {
    width: 16,
    height: 16,
    borderWidth: 2,
    backgroundColor: "oklch(79.5% 0.184 86.047)",
  };

  const nodeBaseClass = "p-4 rounded-xl shadow-lg border-2";
  const selectedClass = selected ? "border-yellow-700" : "border-yellow-400";
  const colorClass = "bg-yellow-50 text-yellow-800";

  let configSummary;

  if (type === "ConditionalBranch") {
    configSummary = (
      <>
        <span className="font-semibold block text-center mb-1">Condition:</span>
        <div className="bg-yellow-100 p-2 rounded text-xs font-mono break-words text-center">
          {checkField
            ? `${checkField} ${operator || "??"} ${checkValue || "??"}`
            : "Unconfigured Check"}
        </div>
        <div className="mt-3 flex justify-between text-xs font-bold text-gray-700">
          <span className="text-left text-green-600">TRUE</span>
          <span className="text-right text-red-600">FALSE</span>
        </div>
      </>
    );
  } else if (type === "UpdateData") {
    configSummary = (
      <>
        <span className="font-semibold block mb-1">Data Action:</span>
        <p className="text-xs text-gray-700">
          Modifies item properties (e.g., setting the inventory status).
        </p>
        {/* Placeholder: Real implementation would show fields being updated */}
        <p className="text-xs italic mt-2">
          Target Field:{" "}
          <span className="font-mono text-xs">{checkField || "..."}</span>
        </p>
      </>
    );
  }

  return (
    <div className={`${nodeBaseClass} ${selectedClass} ${colorClass} w-64`}>
      {/* 
        INPUT HANDLE: Receives the data payload from the preceding node.
      */}
      <Handle
        type="target"
        position={Position.Left}
        id="input-payload"
        isConnectable={true}
        className="w-3 h-3 bg-yellow-500 border-none"
        style={ACCESSIBLE_HANDLE_STYLE}
      />

      {/* Node Header */}
      <div className="flex items-center space-x-2 mb-2 border-b border-yellow-200 pb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-yellow-600"
          viewBox="0 0 24 24"
        >
          <path d="M12 4.5L19.5 9l-7.5 4.5L4.5 9 12 4.5zm0 13.91l7.5-4.5V9.91l-7.5 4.5-7.5-4.5v4.5l7.5 4.5zm0 0l7.5-4.5v-4.5L12 13.91l-7.5-4.5v4.5l7.5 4.5z" />
        </svg>
        <h3 className="font-extrabold text-sm uppercase tracking-wider">
          {label || "Logic Block"}
        </h3>
      </div>

      {/* Configuration Summary */}
      <div className="text-xs space-y-2 mt-3">{configSummary}</div>

      {/* 
        OUTPUT HANDLES: 
        Conditional Branching requires distinct handles for True and False paths.
        UpdateData uses a single main output handle.
      */}

      {type === "ConditionalBranch" ? (
        <>
          {/* True Output */}
          <Handle
            type="source"
            position={Position.Right}
            id="output-true"
            isConnectable={true}
            className="w-3 h-3 bg-green-600 border-2 border-green-900 absolute top-[70%] -right-1.5"
            style={{
              ...ACCESSIBLE_HANDLE_STYLE,
              backgroundColor: "oklch(62.7% 0.194 149.214)",
              top: "65%",
            }} // Positioned to align with "TRUE" label
            title="Condition True Path"
          />
          {/* False Output */}
          <Handle
            type="source"
            position={Position.Right}
            id="output-false"
            isConnectable={true}
            className="w-3 h-3 bg-red-600 border-2 border-red-900 absolute top-[35%] -right-1.5"
            style={{
              ...ACCESSIBLE_HANDLE_STYLE,
              backgroundColor: "oklch(57.7% 0.245 27.325)",
              top: "35%",
            }} // Positioned to align with "FALSE" label
            title="Condition False Path"
          />
        </>
      ) : (
        /* Single Output for UpdateData node */
        <Handle
          type="source"
          position={Position.Right}
          id="output-payload"
          isConnectable={true}
          className="w-3 h-3 bg-yellow-500 border-none"
          style={ACCESSIBLE_HANDLE_STYLE}
        />
      )}
    </div>
  );
});

LogicNode.displayName = "LogicNode";

export default LogicNode;
