// /src/lib/auth/user.ts

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db/prisma";
import { cache } from "react";
import { UserRole } from "@prisma/client";

/**
 * Get the current authenticated user's ID from Clerk
 */
export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const { userId } = await auth();
  return userId;
});

/**
 * Get the current authenticated user from Clerk
 */
export const getCurrentClerkUser = cache(async () => {
  const user = await currentUser();
  return user;
});

/**
 * Get the current user from our database
 * Includes Settings and Organization details.
 */
export const getCurrentUser = cache(async () => {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        settings: true,
        organization: true, // <--- REPLACED teamMemberships with organization
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
 */
export const getUserOrThrow = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }
  return user;
};

/**
 * Check if the current user is an Admin (either Super or Org Admin)
 */
export const isAdmin = cache(async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return (
    user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.ORG_ADMIN
  );
});

/**
 * Check if the current user is a viewer (Not strictly defined in new schema, assuming MEMBER logic)
 * If you need strict 'VIEWER', you'd add it to the Enum. For now, we return false.
 */
export const isViewer = cache(async (): Promise<boolean> => {
  // const user = await getCurrentUser();
  // return user?.role === "VIEWER";
  return false; // Role doesn't exist in new schema yet
});

/**
 * Check if the current user can access a resource owned by another user.
 *
 * Logic:
 * 1. Super Admin: Access everything.
 * 2. Org Admin: Access resources of users within THEIR Organization.
 * 3. Member: Access only their own resources.
 */
export const canAccessResource = async (
  resourceUserId: string
): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  // 1. Own data
  if (user.id === resourceUserId) return true;

  // 2. Super Admin
  if (user.role === UserRole.SUPER_ADMIN) return true;

  // 3. Org Admin
  if (user.role === UserRole.ORG_ADMIN && user.organizationId) {
    // Check if the resourceOwner belongs to the same Org
    const resourceOwner = await prisma.user.findUnique({
      where: { id: resourceUserId },
      select: { organizationId: true },
    });

    return resourceOwner?.organizationId === user.organizationId;
  }

  return false;
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
    throw new Error(
      "Forbidden: You don't have permission to access this resource"
    );
  }
};

/**
 * Get user ID for database queries (Legacy Helper)
 *
 * NOTE: With the new B2B architecture, filtering by `userId` is often insufficient.
 * You usually want to filter by `organizationId`.
 *
 * This function returns `undefined` for Super Admins (fetch all),
 * or the ID for Members (fetch own).
 */
export const getUserIdForQuery = async (): Promise<string | undefined> => {
  const user = await getCurrentUser();
  if (!user) return undefined;

  // Super Admins can see all data (globally)
  if (user.role === UserRole.SUPER_ADMIN) return undefined;

  // Regular users/Org Admins should generally see data scoped to their ID or Org.
  // This helper is simplistic; prefer explicit Prisma queries using user.organizationId.
  return user.id;
};
