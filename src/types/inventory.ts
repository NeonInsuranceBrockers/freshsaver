// /src/types/inventory.ts

import type { InventoryItem as PrismaInventoryItem } from "@prisma/client";

// The base data type for an inventory item, directly from our database schema.
// We re-export it to have a single source of truth for item types.
export type InventoryItem = PrismaInventoryItem;

// Defines the two ways we can view the Kanban board.
// This provides type safety for our view switcher.
export type KanbanViewType = "location" | "freshness";

// Represents a single vertical column on our Kanban board (e.g., "Fridge").
export type KanbanColumn = {
  id: string; // e.g., "fridge"
  title: string; // e.g., "Fridge"
  itemIds: string[]; // An ordered array of InventoryItem IDs that belong in this column
};

// The main client-side state object for the entire Kanban board.
// This structure is optimized for easy lookups and manipulation by dnd-kit.
export type KanbanBoardState = {
  // A dictionary (or map) of all items, keyed by their ID for fast access.
  items: Record<string, InventoryItem>;

  // A dictionary of all columns, keyed by their ID.
  columns: Record<string, KanbanColumn>;

  // An array of column IDs that defines the order in which they appear.
  columnOrder: string[];
};
