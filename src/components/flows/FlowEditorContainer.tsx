// src/components/flows/FlowEditorContainer.tsx
"use client";

import React, { useCallback, useState } from "react";
import { ReactFlowProvider, Node } from "reactflow";
import "reactflow/dist/style.css";
import FlowApiBridge from "./FlowApiBridge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FlowSidePanel from "./FlowSidePanel";
import NodeInspectorPanel from "./NodeInspectorPanel";
import { FlowDefinition, NodeData } from "@/types/flow";
import FlowCanvas from "./canvas/FlowCanvas";
import { useFlowGraphState } from "@/lib/hooks/useFlowGraphState";
import { TraceProvider } from "./TraceProvider";
import { FlowExecutionDetails } from "@/lib/api/flowEngineApi";
import ExecutionDetailsPanel from "./ExecutionDetailsPanel";
import { cn } from "@/lib/utils";

interface FlowEditorContainerProps {
  initialFlow: FlowDefinition;
}

export default function FlowEditorContainer({
  initialFlow,
}: FlowEditorContainerProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDeleteElements,
    selectedNodeId,
    setSelectedNodeId,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    setNodes,
    activeTrace,
    setActiveTrace,
  } = useFlowGraphState(initialFlow);

  const [lastExecutionDetails, setLastExecutionDetails] =
    useState<FlowExecutionDetails | null>(null);

  // --- SIMPLIFIED COLLAPSE STATE ---
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false); // One state for the whole right side

  const handleExecutionComplete = useCallback(
    (details: FlowExecutionDetails | null) => {
      setLastExecutionDetails(details);
      // If we received new details, automatically open the right panel to show them
      if (details) {
        setIsRightPanelCollapsed(false);
      }
    },
    []
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNodeId(node.id);
      // Automatically open the right panel to show the inspector when a node is clicked
      setIsRightPanelCollapsed(false);
    },
    [setSelectedNodeId]
  );

  const handleSaveSuccess = useCallback(
    () => setHasUnsavedChanges(false),
    [setHasUnsavedChanges]
  );

  return (
    <div className="h-full  flex flex-col bg-gray-100">
      <ReactFlowProvider>
        <FlowApiBridge
          flowName={initialFlow.name}
          flowId={initialFlow.id}
          hasUnsavedChanges={hasUnsavedChanges}
          onSaveSuccess={handleSaveSuccess}
          setActiveTrace={setActiveTrace}
          onExecutionComplete={handleExecutionComplete}
        />

        <div className="flex flex-1 overflow-hidden relative">
          {/* --- LEFT PANEL & TOGGLE --- */}
          {/* Wrapper controls width and transition */}
          <div
            className={cn(
              "transition-all duration-300 bg-gray-50 border-r shrink-0",
              isLeftPanelCollapsed ? "w-0" : "w-72"
            )}
          >
            {/* Inner component is only rendered when not collapsed to prevent layout shifts */}
            {!isLeftPanelCollapsed && <FlowSidePanel />}
          </div>

          <button
            onClick={() => setIsLeftPanelCollapsed((v) => !v)}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-30 p-1 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-lg transition-all duration-300",
              // When collapsed, button sits at left: 1rem. When open, it sits just outside the panel.
              isLeftPanelCollapsed ? "left-1" : "left-72 -translate-x-1/2"
            )}
            title={
              isLeftPanelCollapsed ? "Show Node Library" : "Hide Node Library"
            }
          >
            {isLeftPanelCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>

          {/* --- CANVAS --- */}
          <div className="flex-1 min-w-0 h-full">
            <TraceProvider activeTrace={activeTrace}>
              <FlowCanvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                setNodes={setNodes}
                setHasUnsavedChanges={setHasUnsavedChanges}
                onDeleteElements={onDeleteElements}
              />
            </TraceProvider>
          </div>

          {/* --- RIGHT PANEL GROUP & TOGGLE --- */}
          {/* This wrapper controls the total width of the right-side panels */}
          <div
            className={cn(
              "transition-all duration-300 flex shrink-0",
              isRightPanelCollapsed ? "w-0" : "w-auto"
            )}
          >
            {/* The individual panels live inside the collapsible group */}
            {!isRightPanelCollapsed && (
              <>
                <NodeInspectorPanel
                  selectedNodeId={selectedNodeId}
                  nodes={nodes}
                  setNodes={setNodes}
                />
                <ExecutionDetailsPanel details={lastExecutionDetails} />
              </>
            )}
          </div>

          <button
            onClick={() => setIsRightPanelCollapsed((v) => !v)}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-30 p-1 bg-gray-700 hover:bg-gray-600 text-white rounded-full shadow-lg transition-all duration-300",
              // When collapsed, button is at right: 1rem. When open, it's just outside the combined panel width.
              // Combined width = 320px (Inspector) + 384px (Execution) = 704px.
              // 704px is approx 44rem.
              isRightPanelCollapsed
                ? "right-1"
                : "right-[44rem] -translate-x-1/2"
            )}
            title={isRightPanelCollapsed ? "Show Panels" : "Hide Panels"}
          >
            {isRightPanelCollapsed ? (
              <ChevronLeft size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
