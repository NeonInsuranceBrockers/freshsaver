// /app/(app)/admin/users/actions.ts
"use server";

import prisma from "@/lib/db/prisma";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

// Type for the UI
export type GlobalUserDisplay = {
  id: string;
  email: string;
  name: string;
  clerkId: string | null;
  role: UserRole;
  status: UserStatus;
  organization: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
};

// Helper
async function requireSuperAdmin() {
  const user = await getAuthenticatedUser();
  if (user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized");
  }
}

/**
 * Fetch ALL users in the system.
 */
export async function getAllGlobalUsersAction(): Promise<GlobalUserDisplay[]> {
  await requireSuperAdmin();

  const users = await prisma.user.findMany({
    include: {
      organization: {
        select: { id: true, name: true },
      },
    },
    orderBy: [
      { status: "desc" }, // Put PENDING/UNAUTHORIZED first often
      { createdAt: "desc" },
    ],
  });

  return users;
}

/**
 * Fetch list of Organizations (for the dropdown assignment)
 */
export async function getOrgOptionsAction() {
  await requireSuperAdmin();
  return await prisma.organization.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

/**
 * Assign a user to an Organization (Accept/Activate them)
 */
export async function assignUserToOrgAction(
  userId: string,
  orgId: string,
  role: UserRole
) {
  await requireSuperAdmin();

  try {
    // 1. Fetch the user to get their email and check current status
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return { success: false, message: "User not found." };
    }

    let clerkIdToUpdate = targetUser.clerkId;

    // 2. If no Clerk ID is linked, try to find them in Clerk via Email
    if (!clerkIdToUpdate) {
      try {
        const client = await clerkClient();
        const clerkUsers = await client.users.getUserList({
          emailAddress: [targetUser.email],
          limit: 1,
        });

        if (clerkUsers.data.length > 0) {
          clerkIdToUpdate = clerkUsers.data[0].id;
          console.log(
            `[Admin] Found matching Clerk user for ${targetUser.email}: ${clerkIdToUpdate}`
          );
        }
      } catch (error) {
        console.error("[Admin] Failed to lookup user in Clerk:", error);
        // We continue even if Clerk lookup fails, to at least update the DB status
      }
    }

    // 3. Update the user in Prisma
    await prisma.user.update({
      where: { id: userId },
      data: {
        organizationId: orgId,
        role: role,
        status: "ACTIVE", // Automatically activate them
        clerkId: clerkIdToUpdate, // Link the Clerk ID if we found one
      },
    });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: clerkIdToUpdate
        ? "User assigned, linked to Clerk, and activated."
        : "User assigned and activated (No Clerk account found).",
    };
  } catch (error) {
    console.error("Error assigning user:", error);
    return { success: false, message: "Failed to update user." };
  }
}

/**
 * Deactivate/Ban a user
 */
export async function updateUserStatusAction(
  userId: string,
  status: UserStatus
) {
  await requireSuperAdmin();

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status },
    });
    revalidatePath("/admin/users");
    return { success: true, message: `User status updated to ${status}` };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Failed to update status." };
  }
}
