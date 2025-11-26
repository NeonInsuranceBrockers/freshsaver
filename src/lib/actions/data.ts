// /src/lib/actions/data.ts

import prisma from "@/lib/db/prisma";
import { cache } from "react";
// Ensure getCurrentUser is the one from @/lib/auth/session that returns the Prisma User
import { getAuthenticatedUser } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";

// --- HELPERS ---
// Reusing our session logic to ensure consistency
const getCurrentUser = async () => {
  try {
    return await getAuthenticatedUser();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};

const isAtLeastOrgAdmin = (role: UserRole) => {
  return role === UserRole.ORG_ADMIN || role === UserRole.SUPER_ADMIN;
};

// --- ACTIONS ---

// Analytics Actions
export const getLatestAnalytics = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return null;

    // Org Admins see analytics for the Org (via filtering related users or specific snapshot logic)
    // Note: AnalyticsSnapshot currently has userId. If we want Org analytics, we might need to aggregate.
    // For now, let's show the user's own analytics, or if Admin, arguably they want to see Org stats.
    // Let's stick to simple ownership for now to fix the build error.

    const latest = await prisma.analyticsSnapshot.findFirst({
      where: { userId: user.id }, // Keeping it personal for now until Analytics schema is upgraded
      orderBy: { date: "desc" },
    });
    return latest;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
});

export const getAnalyticsHistory = cache(async (days: number = 30) => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const history = await prisma.analyticsSnapshot.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: days,
    });
    return history;
  } catch (error) {
    console.error("Error fetching analytics history:", error);
    return [];
  }
});

// Users & Teams Actions
export const getAllUsers = cache(async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.organizationId) return [];

    // Only admins can see all users IN THEIR ORG
    if (!isAtLeastOrgAdmin(currentUser.role)) {
      return [currentUser];
    }

    const users = await prisma.user.findMany({
      where: {
        organizationId: currentUser.organizationId, // Scope to Org
      },
      // Removed 'teamMemberships' include as we deprecated that model in favor of 'Organization'
      orderBy: { createdAt: "desc" },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
});

export const getTeamStats = cache(async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.organizationId) {
      return { totalMembers: 0, activeThisWeek: 0, pendingInvites: 0 };
    }

    // For Org Admins, show stats for THEIR organization
    if (isAtLeastOrgAdmin(currentUser.role)) {
      const orgFilter = { organizationId: currentUser.organizationId };

      const totalMembers = await prisma.user.count({ where: orgFilter });

      const activeThisWeek = await prisma.user.count({
        where: {
          ...orgFilter,
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      const pendingInvites = await prisma.user.count({
        where: {
          ...orgFilter,
          status: "PENDING",
        },
      });

      return { totalMembers, activeThisWeek, pendingInvites };
    }

    // For regular users
    return { totalMembers: 1, activeThisWeek: 1, pendingInvites: 0 };
  } catch (error) {
    console.error("Error fetching team stats:", error);
    return { totalMembers: 0, activeThisWeek: 0, pendingInvites: 0 };
  }
});

// API Keys Actions
export const getUserApiKeys = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return apiKeys;
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return [];
  }
});

// Data Exports Actions
export const getDataExports = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const exports = await prisma.dataExport.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return exports;
  } catch (error) {
    console.error("Error fetching data exports:", error);
    return [];
  }
});

// User Settings Actions
export const getUserSettings = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const settings = await prisma.userSettings.findUnique({
      where: { userId: user.id },
    });
    return settings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
});

export const getUser = cache(async () => {
  try {
    return await getCurrentUser();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
});

// Subscription & Billing Actions
export const getUserSubscription = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });
    return subscription;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
});

export const getUserInvoices = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
});

// Real-time Data Actions
export const getRecentInventoryActivity = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return [];

    // Admins see Org activity, Users see their own (or also Org activity?)
    // In a team app, usually everyone sees Org activity.
    // We'll scope to Organization for everyone.
    const recentItems = await prisma.inventoryItem.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });
    return recentItems;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
});

export const getExpiringSoonItems = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.organizationId) return [];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const items = await prisma.inventoryItem.findMany({
      where: {
        organizationId: user.organizationId, // Scope to Org
        expiration_date: {
          lte: tomorrow,
          gte: new Date(),
        },
      },
      orderBy: { expiration_date: "asc" },
    });
    return items;
  } catch (error) {
    console.error("Error fetching expiring items:", error);
    return [];
  }
});
