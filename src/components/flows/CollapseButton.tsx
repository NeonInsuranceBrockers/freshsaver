// src/components/flows/CollapseButton.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
  panelPosition: "left" | "right" | "far-right";
}

const CollapseButton: React.FC<CollapseButtonProps> = ({
  isCollapsed,
  onToggle,
  panelPosition,
}) => {
  let Icon;
  let label;

  if (panelPosition === "left") {
    Icon = isCollapsed ? ChevronRight : ChevronLeft;
    label = isCollapsed ? "Show Library" : "Hide Library";
  } else {
    // Inspector/Execution panels use the same logic (collapsing towards the right)
    Icon = isCollapsed ? ChevronLeft : ChevronRight;
    label = isCollapsed ? "Show Panel" : "Hide Panel";
  }

  const baseClass = `absolute top-1/2 -translate-y-1/2 p-1 rounded-full text-white shadow-lg z-30 transition-all duration-200 
                     bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`;

  let positionClass;
  if (panelPosition === "left") {
    positionClass = isCollapsed ? "-left-2" : "left-[17rem]"; // Positioned next to the FlowSidePanel
  } else if (panelPosition === "right") {
    positionClass = isCollapsed ? "right-[20rem]" : "right-[20rem]"; // Positioning needs adjustment in container
  } else if (panelPosition === "far-right") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    positionClass = isCollapsed ? "right-[0.5rem]" : "right-[24.5rem]"; // Positioned next to the ExecutionDetailsPanel
  }

  // NOTE: Positioning needs to be fine-tuned in the FlowEditorContainer where the button is rendered.
  // For simplicity, we define the button and let the container control the exact absolute position.

  return (
    <button onClick={onToggle} className={`${baseClass}`} title={label}>
      <Icon className="h-4 w-4" />
    </button>
  );
};

export default CollapseButton;
