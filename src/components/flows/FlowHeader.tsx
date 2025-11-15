// src/components/flows/FlowHeader.tsx
"use client";

import React, { useState } from "react";
import LastSavedStatusDisplay from "./LastSavedStatusDisplay"; // <-- IMPORTED

// --- Interface remains the same ---
interface FlowHeaderProps {
  flowName: string;
  flowId: string;
  hasUnsavedChanges: boolean;

  isSaving: boolean;
  isPublishing: boolean;
  isRunningTest: boolean;

  onSave: (flowId: string, flowName: string) => Promise<boolean>;
  onPublish: (flowId: string, flowName: string) => Promise<boolean>;
  onExecuteTest: (flowId: string) => Promise<void>;

  onSaveSuccess?: () => void;
}

// --- Main Component ---

export default function FlowHeader({
  flowName,
  flowId,
  hasUnsavedChanges = false,
  isSaving,
  isPublishing,
  isRunningTest,
  onSave,
  onPublish,
  onExecuteTest,
}: FlowHeaderProps) {
  // Initialize lastSaved to null (or to a server-provided timestamp if available).
  // Initializing with `new Date()` here caused the hydration error.
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = async () => {
    const success = await onSave(flowId, flowName);
    if (success) {
      // Set the date only after a successful client-side action
      setLastSaved(new Date());
    }
  };

  // Removed the useEffect block that previously handled time initialization.

  const handlePublish = async () => {
    if (hasUnsavedChanges) {
      await handleSave();
    }
    await onPublish(flowId, flowName);
  };

  const handleExecute = async () => {
    await onExecuteTest(flowId);
  };

  // --- Helper Classes (Tailwind v4 style) ---
  const buttonBase =
    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm";
  const primaryButton = `${buttonBase} bg-green-600 text-white hover:bg-green-700`;
  const secondaryButton = `${buttonBase} bg-gray-100 text-gray-700 hover:bg-gray-200`;

  return (
    <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm w-full z-20">
      {/* Left Section: Flow Name and Status */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-800">{flowName}</h1>
        <span className="text-xs text-gray-400 font-mono select-none">
          ID: {flowId.substring(0, 8)}...
        </span>

        {/* RENDER THE ISOLATED STATUS COMPONENT */}
        <LastSavedStatusDisplay
          lastSaved={lastSaved}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
        />
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center space-x-3">
        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving || !hasUnsavedChanges}
          className={`${secondaryButton} ${
            isSaving ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        {/* Execute Button (Test Run) */}
        <button
          onClick={handleExecute}
          disabled={isRunningTest || isSaving}
          className={`${secondaryButton} ${
            isRunningTest ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isRunningTest ? "Running Test..." : "Execute (Test)"}
        </button>

        {/* Publish Button (Deploy to Production Engine) */}
        <button
          onClick={handlePublish}
          disabled={isPublishing || isSaving}
          className={`${primaryButton} ${
            isPublishing ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </header>
  );
}
