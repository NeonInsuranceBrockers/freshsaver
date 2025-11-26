// Helper functions for user authentication and authorization
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db/prisma";
import { cache } from "react";

/**
 * Get the current authenticated user's ID from Clerk
 * Returns null if not authenticated
 */
export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const { userId } = await auth();
  return userId;
});

/**
 * Get the current authenticated user from Clerk
 * Returns null if not authenticated
 */
export const getCurrentClerkUser = cache(async () => {
  const user = await currentUser();
  return user;
});

/**
 * Get the current user from our database
 * Returns null if not found
 */
export const getCurrentUser = cache(async () => {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        settings: true,
        teamMemberships: {
          include: {
            team: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
});

/**
 * Get the current user or throw an error
 * Use this when user authentication is required
 */
export const getUserOrThrow = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }
  return user;
};

/**
 * Check if the current user is an admin
 */
export const isAdmin = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
});

/**
 * Check if the current user is a viewer (read-only)
 */
export const isViewer = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === "VIEWER";
});

/**
 * Check if the current user can access a resource
 * Admins can access everything, regular users can only access their own data
 */
export const canAccessResource = async (resourceUserId: string): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  
  // Admins can access everything
  if (user.role === "ADMIN") return true;
  
  // Regular users can only access their own data
  return user.id === resourceUserId;
};

/**
 * Require admin role or throw error
 */
export const requireAdmin = async () => {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Forbidden: Admin access required");
  }
};

/**
 * Require ownership of a resource or admin role
 */
export const requireOwnership = async (resourceUserId: string) => {
  const canAccess = await canAccessResource(resourceUserId);
  if (!canAccess) {
    throw new Error("Forbidden: You don't have permission to access this resource");
  }
};

/**
 * Get user ID for database queries
 * Returns the current user's ID for regular users
 * Returns undefined for admins (to allow querying all data)
 */
export const getUserIdForQuery = async (): Promise<string | undefined> => {
  const user = await getCurrentUser();
  if (!user) return undefined;
  
  // Admins can see all data
  if (user.role === "ADMIN") return undefined;
  
  // Regular users only see their own data
  return user.id;
};
