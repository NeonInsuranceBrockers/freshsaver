// src/lib/data/dashboard.data.ts
import prisma from "@/lib/db/prisma";
import { DashboardData, ScheduledMealWithRecipe } from "@/types/dashboard";
import { InventoryItem, GroceryListItem, Prisma } from "@prisma/client";

// --- Internal Type Definitions for Prisma Aggregations ---

// Extract the exact return type for InventoryItem.groupBy
type InventoryGroupByResult = Prisma.GetInventoryItemGroupByPayload<{
  by: ["category"];
  _count: { id: true };
}>;

type LocationGroupByResult = Prisma.GetInventoryItemGroupByPayload<{
  by: ["location"];
  _count: { id: true };
}>;

// Extract the exact return type for NotificationLog.groupBy
type DeduplicationGroupByResult = Prisma.GetNotificationLogGroupByPayload<{
  by: ["deduplicationKey"];
}>;

// Type definition for NotificationLog.findMany for trend chart data
type NotificationLogSentAt = { sentAt: Date }[];

// Helper functions (omitted for brevity, assume they are the same)
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
 * @returns DashboardData object
 */
export async function getDashboardData(): Promise<DashboardData> {
  const threeDaysFromNow = getThreeDaysFromNow();
  const startOfWeek = getStartOfWeek();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const queries = [
    // 1-4: System Health
    prisma.flow.count(),
    prisma.flow.count({ where: { isActive: true } }),
    prisma.credential.count(),
    prisma.notificationLog.count({ where: { sentAt: { gte: yesterday } } }),

    // 5-9: Inventory
    prisma.inventoryItem.count(),
    prisma.inventoryItem.findMany({
      where: { expiration_date: { lte: threeDaysFromNow } },
      orderBy: { expiration_date: "asc" },
      take: 5,
    }),
    prisma.inventoryItem.count({ where: { status: "NEAR_EXPIRY" } }),

    // No explicit cast required here, the result tuple cast handles the return type
    prisma.inventoryItem.groupBy({ by: ["category"], _count: { id: true } }),
    prisma.inventoryItem.groupBy({ by: ["location"], _count: { id: true } }),

    // 10-12: Automation Performance
    prisma.notificationLog.count({ where: { sentAt: { gte: thirtyDaysAgo } } }),

    // No explicit cast required here
    prisma.notificationLog.groupBy({ by: ["deduplicationKey"] }),

    // We cast the promise result here as we know its exact shape
    prisma.notificationLog.findMany({
      where: { sentAt: { gte: thirtyDaysAgo } },
      select: { sentAt: true },
    }) as Prisma.PrismaPromise<NotificationLogSentAt>,

    // 13-17: Meal Planning & Grocery
    prisma.recipe.count(),
    prisma.recipe.count({ where: { status: "BACKLOG" } }),

    // Cast the findMany result to include the Recipe relation
    prisma.scheduledMeal.findMany({
      where: { date: { gte: startOfWeek } },
      include: { recipe: true },
    }) as Prisma.PrismaPromise<ScheduledMealWithRecipe[]>,

    prisma.groceryListItem.count({ where: { isChecked: false } }),

    // Cast the findMany result
    prisma.groceryListItem.findMany({
      where: { isChecked: false },
      orderBy: { createdAt: "asc" },
      take: 5,
    }) as Prisma.PrismaPromise<GroceryListItem[]>,
  ];

  // Explicitly type the result tuple to resolve all union type errors (ts(2339)).
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

  // --- Data Mapping & Transformation (Now safe due to explicit tuple typing) ---

  // Map Prisma's groupBy output for categories
  const itemsByCategory = (await itemsByCategoryGroup).map((g) => ({
    category: g.category,
    count: g._count.id,
  }));

  // Map Prisma's groupBy output for locations
  const itemsByLocation = (await itemsByLocationGroup).map((g) => ({
    location: g.location,
    count: g._count.id,
  }));

  // The unique count is simply the length of the groupBy result array
  const uniqueNotificationsCount = (await uniqueNotificationsGroup).length;

  // Return the final structured object
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
