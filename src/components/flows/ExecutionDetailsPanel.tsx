// src/components/flows/ExecutionDetailsPanel.tsx
"use client";

import React from "react";
import { FlowExecutionDetails } from "@/lib/api/flowEngineApi";
import { cn } from "@/lib/utils"; // Assuming this utility is available

interface ExecutionDetailsPanelProps {
  details: FlowExecutionDetails | null;
}

const ExecutionDetailsPanel: React.FC<ExecutionDetailsPanelProps> = ({
  details,
}) => {
  if (!details) {
    return (
      <aside className="w-80 bg-gray-50 border-l p-4 shadow-inner overflow-y-auto shrink-0 text-sm text-gray-500">
        <h3 className="text-lg font-bold mb-4 text-gray-700">Execution Log</h3>
        <p>
          Run a test execution (top right) to view the trace log and final data
          payload.
        </p>
      </aside>
    );
  }

  const { log, finalPayload } = details;

  return (
    <aside className="w-96 bg-white border-l p-4 shadow-lg overflow-y-auto shrink-0">
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
        Test Execution Results
      </h3>

      {/* --- Execution Trace Log --- */}
      <section className="mb-6">
        <h4 className="font-semibold text-lg mb-2 text-green-700">
          Execution Log ({log.length} Steps)
        </h4>
        <div className="bg-gray-50 p-3 rounded-md max-h-60 overflow-y-auto text-xs font-mono border">
          {log.map((entry, index) => (
            <p
              key={index}
              // Use cn utility for conditional styling
              className={cn(
                "whitespace-pre-wrap leading-relaxed py-0.5",
                // Highlight important steps (node execution)
                entry.startsWith("-> Executing Node")
                  ? "text-blue-700 font-semibold"
                  : "text-gray-700",
                // Highlight critical actions or warnings
                entry.includes("[Action] FAILED")
                  ? "text-red-500 font-bold"
                  : "",
                entry.includes("[Logic] Condition evaluated to: TRUE")
                  ? "text-green-600"
                  : ""
              )}
            >
              {entry}
            </p>
          ))}
        </div>
      </section>

      {/* --- Final Payload --- */}
      <section>
        <h4 className="font-semibold text-lg mb-2 text-gray-700">
          Final Payload
        </h4>
        <pre className="bg-gray-800 text-white p-3 rounded-md overflow-x-auto text-xs leading-snug max-h-60">
          {JSON.stringify(finalPayload, null, 2)}
        </pre>
      </section>
    </aside>
  );
};

export default ExecutionDetailsPanel;
