// src/components/flows/InspectorHeader.tsx
import React from "react";
import { FlowNodeDefinition } from "@/config/flowNodeDefinitions";

interface InspectorHeaderProps {
  definition: FlowNodeDefinition;
}

const InspectorHeader: React.FC<InspectorHeaderProps> = ({ definition }) => {
  return (
    <>
      <h3
        className="text-lg font-bold mb-1"
        style={{
          color: definition.color
            .replace("bg-", "text-")
            .replace("-100", "-600"),
        }}
      >
        {definition.label}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{definition.description}</p>
    </>
  );
};

export default InspectorHeader;
