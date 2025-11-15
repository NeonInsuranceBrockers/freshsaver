// src/lib/api/inventoryMocks.ts

import { InventoryPayload } from "@/types/flow";

export interface InventoryItemDB {
  id: string;
  name: string;
  category: string;
  location: string;
  status: "FRESH" | "NEAR_EXPIRY" | "CONSUMED" | "EXPIRED";
  quantity: number;
  unit: string;
  expiration_date: string;
}

export const MOCK_INVENTORY_DB: InventoryItemDB[] = [
  // 1. Expiring Dairy Item (Matches flow n1 trigger)
  {
    id: "item-101",
    name: "Milk (Gallon)",
    category: "Dairy",
    location: "Fridge",
    status: "NEAR_EXPIRY",
    quantity: 1200,
    unit: "ml",
    expiration_date: "2024-11-20",
  },
  // 2. Staple Item
  {
    id: "item-102",
    name: "Eggs",
    category: "Protein",
    location: "Fridge",
    status: "FRESH",
    quantity: 6,
    unit: "unit",
    expiration_date: "2024-12-15",
  },
  // 3. Pantry Item
  {
    id: "item-103",
    name: "All-Purpose Flour",
    category: "Baking",
    location: "Pantry",
    status: "FRESH",
    quantity: 50,
    unit: "g",
    expiration_date: "2025-06-01",
  },
];

/**
 * Defines the constant test payload used for client-side condition evaluation.
 * This simulates the data packet created when the 'ExpirationTrigger' fires.
 */
export const TEST_PAYLOAD_NEAR_EXPIRY: InventoryPayload = {
  trigger_event: "EXPIRATION_TRIGGER",
  timestamp: new Date(),
  user_id: "test-user",
  inventory_item: {
    id: "item-101",
    name: "Milk (Gallon)",
    category: "Dairy",
    location: "Fridge",
    status: "NEAR_EXPIRY",
    remaining_days: 2,
    quantity: 1200,
    // The unit and date should be present but are not strictly needed for this mock trace
  },
  related_data: {
    dietary_restriction: "None",
    cook_time_limit: 30,
  },
};
