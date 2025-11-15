// src/lib/hooks/useFlowAPI.ts

import { useState, useCallback } from "react";
import { Node, Edge } from "reactflow";
import { NodeData } from "@/types/flow";
import { flowSerializer } from "@/lib/utils/flowSerializer";
import { useNotificationStore } from "@/lib/providers/useNotificationStore";
// --- 1. IMPORT THE SERVER ACTIONS ---
import {
  saveFlowAction,
  publishFlowAction,
  executeFlowAction,
  FlowExecutionDetails,
} from "@/app/(app)/flows/actions";

interface FlowAPIState {
  isSaving: boolean;
  isPublishing: boolean;
  isRunningTest: boolean;
}

interface PassedReactFlowInstance {
  toObject: () => { nodes: Node[]; edges: Edge[] };
}

interface FlowAPIActions {
  handleSave: (flowId: string, flowName: string) => Promise<boolean>;
  handlePublish: (flowId: string, flowName: string) => Promise<boolean>;
  handleExecuteTest: (flowId: string, flowName: string) => Promise<void>;
  setActiveTrace: React.Dispatch<React.SetStateAction<string[]>>;
}

interface FlowAPIHook extends FlowAPIState, FlowAPIActions {
  lastExecutionDetails: FlowExecutionDetails | null; // <-- EXPOSED STATE
}

/**
 * Custom hook to manage all external interactions (API calls) related to the flow definition.
 *
 * @param onSaveSuccess Callback function to run after a successful save operation.
 * @returns State and Action handlers for flow management.
 */
export const useFlowAPI = (
  onSaveSuccess: () => void,
  reactFlowInstance: PassedReactFlowInstance | null,
  setActiveTrace: React.Dispatch<React.SetStateAction<string[]>>
): FlowAPIHook => {
  const { showNotification } = useNotificationStore();

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [lastExecutionDetails, setLastExecutionDetails] =
    useState<FlowExecutionDetails | null>(null); // <-- NEW STATE

  /**
   * Serializes the current flow state and sends it to the backend for drafting.
   */
  const handleSave = useCallback(
    async (flowId: string, flowName: string): Promise<boolean> => {
      if (isSaving || !reactFlowInstance) return false;

      setIsSaving(true);

      try {
        // 1. Serialize the current canvas state
        const flowStructure = reactFlowInstance.toObject();
        const definitionToSave = flowSerializer(
          flowId,
          flowName,
          flowStructure.nodes as Node[],
          flowStructure.edges as Edge[]
        );

        // --- 2. CALL THE SERVER ACTION ---
        const result = await saveFlowAction(definitionToSave);

        if (result.success) {
          onSaveSuccess();
          showNotification(`Flow "${flowName}" saved successfully.`, "success");
          return true;
        } else {
          throw new Error(result.message || "Unknown save error");
        }

        // // 3. Call the API
        // const success = await saveFlow(definitionToSave);

        // if (success) {
        //   onSaveSuccess(); // Notify parent container to reset hasUnsavedChanges
        //   showNotification(`Flow "${flowName}" saved successfully.`, "success");
        //   return true;
        // }
        // return false;
      } catch (error) {
        showNotification(
          `Error saving flow: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          "error"
        );
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [isSaving, reactFlowInstance, onSaveSuccess, showNotification]
  );

  /**
   * Publishes the current flow, activating it in the production flow engine.
   */
  const handlePublish = useCallback(
    async (flowId: string, flowName: string): Promise<boolean> => {
      if (isPublishing) return false;
      setIsPublishing(true);

      try {
        // --- 3. CALL THE SERVER ACTION ---
        const result = await publishFlowAction(flowId);
        if (result.success) {
          showNotification(
            `Flow "${flowName}" published and is now active!`,
            "success"
          );
          return true;
        } else {
          throw new Error(result.message || "Unknown publish error");
        }

        // await publishFlow(flowId);
        // showNotification(
        //   `Flow "${flowName}" published and activated!`,
        //   "success"
        // );
        // return true;
      } catch (error) {
        showNotification(
          `Error publishing flow: ${
            error instanceof Error ? error.message : "Validation failed"
          }`,
          "error"
        );
        return false;
      } finally {
        setIsPublishing(false);
      }
    },
    [isPublishing, showNotification]
  );

  /**
   * Triggers a non-destructive test run of the current flow definition.
   */
  const handleExecuteTest = useCallback(
    async (flowId: string, flowName: string): Promise<void> => {
      if (isRunningTest || !reactFlowInstance) return;
      setIsRunningTest(true);
      setActiveTrace([]);
      setLastExecutionDetails(null); // Clear previous details

      try {
        // 1. Get the current state from the canvas instance
        // const { nodes, edges } = reactFlowInstance.toObject();

        // 2. Serialize the live state into a backend-ready FlowDefinition object
        const liveFlowDefinition = flowSerializer(
          flowId,
          flowName,
          reactFlowInstance.toObject().nodes as Node<NodeData>[],
          reactFlowInstance.toObject().edges as Edge[]
        );

        // --- 4. CALL THE SERVER ACTION ---
        const details = await executeFlowAction(liveFlowDefinition);

        if (details) {
          setLastExecutionDetails(details);
          setActiveTrace(details.trace);

          // --- NEW LOGIC: CHECK FOR AND DISPLAY NOTIFICATION ---

          // Find the first log entry that indicates a notification was sent.
          const notificationLogEntry = details.log.find((entry) =>
            entry.includes("[Action] Notification Sent via")
          );

          if (notificationLogEntry) {
            const message =
              notificationLogEntry.split(': "')[1]?.slice(0, -1) ||
              "Test notification sent!";
            showNotification(message, "info");
          } else {
            showNotification(
              `Test run complete. Traced ${details.trace.length} step(s).`,
              "success"
            );
          }
        } else {
          showNotification(
            `Test finished. The flow's trigger did not match the test item.`,
            "warning"
          );
        }
      } catch (error) {
        showNotification(
          `Test execution failed: ${
            error instanceof Error ? error.message : "Connection error"
          }`,
          "error"
        );
      } finally {
        setIsRunningTest(false);
        setTimeout(() => setActiveTrace([]), 5000);
      }
    },
    [isRunningTest, showNotification, setActiveTrace, reactFlowInstance]
  );

  return {
    isSaving,
    isPublishing,
    isRunningTest,
    handleSave,
    handlePublish,
    handleExecuteTest,
    setActiveTrace,
    lastExecutionDetails, // <-- EXPOSE NEW STATE
  };
};
