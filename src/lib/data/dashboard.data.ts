// /src/lib/data/dashboard.data.ts

import prisma from "@/lib/db/prisma";
import { DashboardData, ScheduledMealWithRecipe } from "@/types/dashboard";
import { InventoryItem, GroceryListItem, Prisma } from "@prisma/client";

// --- Internal Type Definitions for Prisma Aggregations ---

// Extract the exact return type for InventoryItem.groupBy with the new filter
type InventoryGroupByResult = Prisma.GetInventoryItemGroupByPayload<{
  by: ["category"];
  _count: { id: true };
  where: { organizationId: string };
}>;

type LocationGroupByResult = Prisma.GetInventoryItemGroupByPayload<{
  by: ["location"];
  _count: { id: true };
  where: { organizationId: string };
}>;

// Extract the exact return type for NotificationLog.groupBy
// Note: NotificationLog connects to User, so we filter via User -> Organization
type DeduplicationGroupByResult = Prisma.GetNotificationLogGroupByPayload<{
  by: ["deduplicationKey"];
  where: { user: { organizationId: string } };
}>;

// Type definition for NotificationLog.findMany for trend chart data
type NotificationLogSentAt = { sentAt: Date }[];

// Helper functions
const getStartOfWeek = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek;
  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const getThreeDaysFromNow = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date;
};

/**
 * Fetches all necessary aggregate data for the dashboard in parallel using a transaction.
 * @param organizationId - The ID of the organization to scope the data to.
 * @returns DashboardData object
 */
export async function getDashboardData(
  organizationId: string
): Promise<DashboardData> {
  const threeDaysFromNow = getThreeDaysFromNow();
  const startOfWeek = getStartOfWeek();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // 1. Define Filter Scopes
  // Most items have a direct organizationId
  const orgFilter = { organizationId };
  // Items like Logs or GroceryLists might be linked via User
  const userOrgFilter = { user: { organizationId } };

  const queries = [
    // 1-4: System Health
    prisma.flow.count({ where: orgFilter }),
    prisma.flow.count({ where: { ...orgFilter, isActive: true } }),
    prisma.credential.count({ where: orgFilter }),
    prisma.notificationLog.count({
      where: { ...userOrgFilter, sentAt: { gte: yesterday } },
    }),

    // 5-9: Inventory
    prisma.inventoryItem.count({ where: orgFilter }),
    prisma.inventoryItem.findMany({
      where: { ...orgFilter, expiration_date: { lte: threeDaysFromNow } },
      orderBy: { expiration_date: "asc" },
      take: 5,
    }),
    prisma.inventoryItem.count({
      where: { ...orgFilter, status: "NEAR_EXPIRY" },
    }),

    // Group By queries with Org Filter
    prisma.inventoryItem.groupBy({
      by: ["category"],
      _count: { id: true },
      where: orgFilter,
    }),
    prisma.inventoryItem.groupBy({
      by: ["location"],
      _count: { id: true },
      where: orgFilter,
    }),

    // 10-12: Automation Performance
    prisma.notificationLog.count({
      where: { ...userOrgFilter, sentAt: { gte: thirtyDaysAgo } },
    }),

    prisma.notificationLog.groupBy({
      by: ["deduplicationKey"],
      where: userOrgFilter,
    }),

    prisma.notificationLog.findMany({
      where: { ...userOrgFilter, sentAt: { gte: thirtyDaysAgo } },
      select: { sentAt: true },
    }) as Prisma.PrismaPromise<NotificationLogSentAt>,

    // 13-17: Meal Planning & Grocery
    prisma.recipe.count({ where: orgFilter }),
    prisma.recipe.count({ where: { ...orgFilter, status: "BACKLOG" } }),

    // Scheduled Meals are linked to Recipes, which have OrgId
    prisma.scheduledMeal.findMany({
      where: {
        date: { gte: startOfWeek },
        recipe: { organizationId }, // Filter by recipe's org
      },
      include: { recipe: true },
    }) as Prisma.PrismaPromise<ScheduledMealWithRecipe[]>,

    prisma.groceryListItem.count({
      where: { ...userOrgFilter, isChecked: false },
    }),

    prisma.groceryListItem.findMany({
      where: { ...userOrgFilter, isChecked: false },
      orderBy: { createdAt: "asc" },
      take: 5,
    }) as Prisma.PrismaPromise<GroceryListItem[]>,
  ];

  // Explicitly type the result tuple to resolve all union type errors
  const [
    totalFlows,
    activeFlows,
    connectedCredentials,
    recentNotificationsCount,
    totalItems,
    criticalExpiryItems,
    nearExpiryCount,
    itemsByCategoryGroup,
    itemsByLocationGroup,
    notificationsLast30Days,
    uniqueNotificationsGroup,
    allNotificationLogs,
    totalRecipes,
    recipesInBacklog,
    mealsThisWeek,
    incompleteGroceryCount,
    topIncompleteGroceryItems,
  ] = (await prisma.$transaction(queries)) as [
    number,
    number,
    number,
    number,
    number,
    InventoryItem[],
    number,
    InventoryGroupByResult,
    LocationGroupByResult,
    number,
    DeduplicationGroupByResult,
    NotificationLogSentAt,
    number,
    number,
    ScheduledMealWithRecipe[],
    number,
    GroceryListItem[]
  ];

  // --- Data Mapping & Transformation ---

  const itemsByCategory = (await itemsByCategoryGroup).map((g) => ({
    category: g.category,
    count: g._count.id,
  }));

  const itemsByLocation = (await itemsByLocationGroup).map((g) => ({
    location: g.location,
    count: g._count.id,
  }));

  const uniqueNotificationsCount = (await uniqueNotificationsGroup).length;

  return {
    systemHealth: {
      totalFlows,
      activeFlows,
      connectedCredentials,
      recentNotificationsCount,
    },
    inventoryOverview: {
      totalItems,
      criticalExpiryItems,
      nearExpiryCount,
      itemsByCategory,
      itemsByLocation,
    },
    automationPerformance: {
      notificationsLast30Days,
      uniqueNotificationsCount,
      allNotificationLogs,
    },
    mealPlanningSnapshot: {
      totalRecipes,
      recipesInBacklog,
      mealsThisWeek,
      incompleteGroceryCount,
      topIncompleteGroceryItems,
    },
  };
}
