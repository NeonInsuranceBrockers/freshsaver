// src/components/flows/TraceProvider.tsx
"use client";

import React, { createContext, useContext } from "react";

// Define the shape of the context data required by the nodes
interface TraceContextProps {
  activeTrace: string[];
}

const TraceContext = createContext<TraceContextProps | undefined>(undefined);

// Provider Component
export const TraceProvider: React.FC<{
  activeTrace: string[];
  children: React.ReactNode;
}> = ({ activeTrace, children }) => {
  const value = { activeTrace };
  return (
    <TraceContext.Provider value={value}>{children}</TraceContext.Provider>
  );
};

// Custom Hook to consume the state in nodes
export const useTraceContext = (): TraceContextProps => {
  const context = useContext(TraceContext);
  if (context === undefined) {
    // This error should guide the user if they render a node outside the provider
    throw new Error("useTraceContext must be used within a TraceProvider.");
  }
  return context;
};
