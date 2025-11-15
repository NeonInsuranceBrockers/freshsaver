// src/config/node-triggers.ts

import { FlowNodeDefinition } from "./node-interfaces"; // Import FlowNodeDefinition

export const TriggerNodeDefinitions: FlowNodeDefinition[] = [
  // --- 1. TRIGGER NODES ---
  {
    type: "ExpirationTrigger",
    label: "Expiration Time Reached",
    category: "Triggers",
    description: "Starts flow based on days remaining before expiration.",
    color: "bg-green-100 border-green-400",
    isTrigger: true,
    configFields: [
      {
        key: "timeOffset",
        label: "Trigger X Days Before",
        type: "number",
        required: true,
        defaultValue: 3,
        placeholder: "e.g., 3 days",
      },
      {
        key: "filterCategory",
        label: "Only For Category",
        type: "dropdown",
        required: false,
        options: [
          { value: "all", label: "All Categories" },
          { value: "dairy", label: "Dairy" },
          { value: "produce", label: "Produce" },
        ],
      },
    ],
  },
  {
    type: "InventoryStatusTrigger",
    label: "Inventory Status Change",
    category: "Triggers",
    description:
      'Starts flow when an item is manually moved in the Kanban (e.g., to "Near Expiration").',
    color: "bg-green-100 border-green-400",
    isTrigger: true,
    configFields: [
      {
        key: "targetStatus",
        label: "When Item Changes To",
        type: "dropdown",
        required: true,
        options: [
          { value: "near_expiry", label: "Near Expiration" },
          { value: "expired", label: "Expired" },
        ],
      },
    ],
  },
];
