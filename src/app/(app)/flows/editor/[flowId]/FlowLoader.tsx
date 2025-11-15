// /app/(app)/flows/editor/[flowId]/FlowLoader.tsx

"use client"; // This component is responsible for all client-side work

// import { getFlowDefinition } from "@/lib/api/flowEngineApi";
import { FlowDefinition } from "@/types/flow";
import FlowEditorContainer from "@/components/flows/FlowEditorContainer";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getFlowDefinitionAction } from "@/app/(app)/flows/actions";

// This component receives the flowId as a simple string prop
export default function FlowLoader({ flowId }: { flowId: string }) {
  // All the state management and data fetching logic now lives here
  const [flowData, setFlowData] = useState<FlowDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFlow = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch data from Dexie on the client
        const data = await getFlowDefinitionAction(flowId);
        setFlowData(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.message === "Flow Not Found") {
          notFound();
          return;
        }
        setError(`Unable to load flow ID: ${flowId}. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };

    loadFlow();
  }, [flowId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading Flow...
      </div>
    );
  }

  if (error) {
    // Let the nearest error.tsx boundary handle the error display
    throw new Error(error);
  }

  if (!flowData) {
    // This handles the notFound() case
    return notFound();
  }

  // Once data is loaded, render the main editor
  return (
    <div className="flex flex-1  flex-col h-full w-full">
      <FlowEditorContainer initialFlow={flowData} />
    </div>
  );
}
