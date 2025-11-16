// src/types/dashboard.ts

import {
  InventoryItem,
  Recipe,
  ScheduledMeal,
  GroceryListItem,
} from "@prisma/client";

// --- Helper Types for Nested Data ---

/**
 * Scheduled Meal enhanced with its associated Recipe data.
 */
export interface ScheduledMealWithRecipe extends ScheduledMeal {
  recipe: Recipe;
}

/**
 * Custom structure for Inventory grouping by Category.
 */
export type AggregationCount = {
  category: string;
  count: number;
};

/**
 * Custom structure for Inventory grouping by Location.
 */
export type LocationCount = {
  location: string;
  count: number;
};

// --- Main Dashboard Data Structure ---
/**
 * The final, aggregated data object fetched by the Server Component.
 */
export interface DashboardData {
  // Section 1: System Health
  systemHealth: {
    totalFlows: number;
    activeFlows: number;
    connectedCredentials: number;
    recentNotificationsCount: number; // Last 24h
  };

  // Section 2 & 5: Inventory Overview
  inventoryOverview: {
    totalItems: number;
    itemsByCategory: AggregationCount[];
    itemsByLocation: LocationCount[];
    criticalExpiryItems: InventoryItem[]; // Items expiring in < 3 days (Plan: 72 hours)
    nearExpiryCount: number; // Items currently tagged with status: NEAR_EXPIRY (Plan: KPI)
  };

  // Section 3: Automation Performance
  automationPerformance: {
    notificationsLast30Days: number;
    // The count of unique deduplication keys used in the last 30 days (Plan: Efficiency Metric)
    uniqueNotificationsCount: number;
    // Subset of logs (just the date) for the trend chart visualization (Plan: Timeline/Chart)
    allNotificationLogs: { sentAt: Date }[];
  };

  // Section 4: Meal Planning & Grocery
  mealPlanningSnapshot: {
    totalRecipes: number;
    recipesInBacklog: number;
    mealsThisWeek: ScheduledMealWithRecipe[]; // Meals scheduled from start of week
    incompleteGroceryCount: number;
    topIncompleteGroceryItems: GroceryListItem[];
  };
}
