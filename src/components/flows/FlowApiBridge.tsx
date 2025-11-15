// src/components/flows/FlowApiBridge.tsx
"use client";

import React from "react";
import { useReactFlow } from "reactflow";
import { useFlowAPI } from "@/lib/hooks/useFlowAPI";
import FlowHeader from "./FlowHeader";
import { FlowExecutionDetails } from "@/lib/api/flowEngineApi";

interface FlowApiBridgeProps {
  flowId: string;
  flowName: string;
  hasUnsavedChanges: boolean;
  onSaveSuccess: () => void;
  setActiveTrace: React.Dispatch<React.SetStateAction<string[]>>;
  // NEW PROP: Callback function to send execution results back to the container
  onExecutionComplete: (details: FlowExecutionDetails | null) => void;
}

/**
 * Component to bridge the FlowHeader with the ReactFlow context.
 * MUST be rendered inside <ReactFlowProvider>.
 */
const FlowApiBridge: React.FC<FlowApiBridgeProps> = ({
  flowId,
  flowName,
  hasUnsavedChanges,
  onSaveSuccess,
  setActiveTrace,
  onExecutionComplete, // <-- NEW PROP
}) => {
  // CRITICAL: This hook ONLY works here, inside the provider
  const reactFlowInstance = useReactFlow();

  // Initialize API hook, passing the instance
  const flowApi = useFlowAPI(onSaveSuccess, reactFlowInstance, setActiveTrace);

  // Use useEffect to monitor changes in the execution details state from useFlowAPI
  // and pass them up to the parent via the callback prop.
  React.useEffect(() => {
    onExecutionComplete(flowApi.lastExecutionDetails);
  }, [flowApi.lastExecutionDetails, onExecutionComplete]);

  const executeTestHandler = (id: string) => {
    // It calls the hook's function with all the required parameters (id and name).
    return flowApi.handleExecuteTest(id, flowName);
  };

  return (
    <FlowHeader
      flowName={flowName}
      flowId={flowId}
      hasUnsavedChanges={hasUnsavedChanges}
      isSaving={flowApi.isSaving}
      isPublishing={flowApi.isPublishing}
      isRunningTest={flowApi.isRunningTest}
      // Pass actions
      onSave={flowApi.handleSave}
      onPublish={flowApi.handlePublish}
      onExecuteTest={executeTestHandler}
    />
  );
};

export default FlowApiBridge;
