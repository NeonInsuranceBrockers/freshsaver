// src/lib/api/flowMocks.ts

import { FlowDefinition } from "@/types/flow";
import { getFlowById } from "@/lib/test/inMemoryFlowDB";

/**
 * --- 1. Mock Flow Fetcher Function ---
 * Retrieves the flow definition directly using the provided flowId.
 * No hardcoded ID translation is necessary.
 */
export const getMockFlow = (flowId: string): FlowDefinition | null => {
  // Directly use the provided flowId to query the in-memory database.
  const flow = getFlowById(flowId);

  // If the flow is null, the original API error handling in page.tsx
  // will catch it and trigger a 404.
  return flow;
};
