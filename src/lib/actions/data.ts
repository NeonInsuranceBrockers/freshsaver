// Server actions for fetching data from database with user-based access control
import prisma from "@/lib/db/prisma";
import { cache } from "react";
import { getCurrentUser, getUserIdForQuery, isAdmin } from "@/lib/auth/user";

// Analytics Actions
export const getLatestAnalytics = cache(async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const latest = await prisma.analyticsSnapshot.findFirst({
      where: user.role === "ADMIN" ? {} : { userId: user.id },
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
      where: user.role === "ADMIN" ? {} : { userId: user.id },
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
    if (!currentUser) return [];

    // Only admins can see all users
    if (currentUser.role !== "ADMIN") {
      return [currentUser];
    }

    const users = await prisma.user.findMany({
      include: {
        teamMemberships: {
          include: {
            team: true,
          },
        },
      },
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
    if (!currentUser) {
      return { totalMembers: 0, activeThisWeek: 0, pendingInvites: 0 };
    }

    // For admins, show all stats
    if (currentUser.role === "ADMIN") {
      const totalMembers = await prisma.user.count();
      const activeThisWeek = await prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });
      const pendingInvites = await prisma.user.count({
        where: { status: "PENDING" },
      });

      return { totalMembers, activeThisWeek, pendingInvites };
    }

    // For regular users, show limited stats
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
      where: user.role === "ADMIN" ? {} : { userId: user.id },
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
    const user = await getCurrentUser();
    return user;
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
    if (!user) return [];

    const recentItems = await prisma.inventoryItem.findMany({
      where: user.role === "ADMIN" ? {} : { userId: user.id },
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
    if (!user) return [];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const items = await prisma.inventoryItem.findMany({
      where: {
        ...(user.role === "ADMIN" ? {} : { userId: user.id }),
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
