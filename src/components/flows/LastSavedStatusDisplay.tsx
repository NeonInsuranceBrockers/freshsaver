// src/components/flows/LastSavedStatusDisplay.tsx
"use client";

import React, { useEffect, useState } from "react";

interface LastSavedStatusDisplayProps {
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

/**
 * Handles the display of the flow's saved status.
 * Uses client-side rendering detection (isClient) to prevent hydration errors
 * caused by using time-dependent functions (toLocaleTimeString).
 */
export default function LastSavedStatusDisplay({
  lastSaved,
  hasUnsavedChanges,
  isSaving,
}: LastSavedStatusDisplayProps) {
  // State to track if the component has mounted on the client
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true only after mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const unsavedIndicator = hasUnsavedChanges
    ? "text-red-500 font-medium"
    : "text-gray-500";

  let content: React.ReactNode;

  if (isSaving) {
    content = "Saving...";
  } else if (hasUnsavedChanges) {
    content = "Unsaved Changes";
  } else if (isClient && lastSaved) {
    // CRITICAL FIX: Only calculate localized time if mounted on the client.
    // During SSR, this path is skipped, rendering 'Ready to Save' or 'Unsaved Changes'.
    content = `Saved ${lastSaved.toLocaleTimeString("en-US")}`;
  } else {
    // Renders a stable, non-time-dependent value during SSR
    content = "Ready to Save";
  }

  return <div className={`text-sm ${unsavedIndicator}`}>{content}</div>;
}
