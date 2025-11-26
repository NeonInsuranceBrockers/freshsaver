// /app/(app)/settings/team/actions.ts
"use server";

import prisma from "@/lib/db/prisma";
import { getAuthenticatedUser, requireOrgAdmin } from "@/lib/auth/session";
import { UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

/**
 * Type definition for the member list in the UI
 */
export type TeamMemberDisplay = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string | null;
  joinedAt: Date;
};

/**
 * Fetches all members of the current user's organization.
 */
export async function getTeamMembersAction(): Promise<TeamMemberDisplay[]> {
  const user = await getAuthenticatedUser();

  if (!user.organizationId) return [];

  const members = await prisma.user.findMany({
    where: {
      organizationId: user.organizationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      avatarUrl: true,
      createdAt: true, // using createdAt as joinedAt
    },
  });

  return members.map((m) => ({
    ...m,
    joinedAt: m.createdAt,
  }));
}

/**
 * Invites a new user by Email.
 * Creates a PENDING record in Prisma. When they sign up via Clerk with this email,
 * the Webhook will link them and set them to ACTIVE.
 */
export async function inviteMemberAction(formData: FormData) {
  // 1. Enforce Admin Rights (Only Org Admins can invite)
  const currentUser = await requireOrgAdmin();

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const role = (formData.get("role") as UserRole) || "MEMBER";

  if (!email || !currentUser.organizationId) {
    return { success: false, message: "Email is required." };
  }

  try {
    // 2. Check if user already exists in the system
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists in the system.",
      };
    }

    // 3. Create the Pre-provisioned User
    await prisma.user.create({
      data: {
        email,
        name: name || "New Member",
        role: role,
        status: "PENDING", // <--- Key for the handshake flow
        organizationId: currentUser.organizationId,
        clerkId: null, // Will be filled by Webhook later
      },
    });

    revalidatePath("/settings/team");
    return {
      success: true,
      message: "Invitation sent (User pre-provisioned).",
    };
  } catch (error) {
    console.error("Invite failed:", error);
    return { success: false, message: "Failed to invite user." };
  }
}

/**
 * Updates a member's role (e.g. Promote to Admin).
 */
export async function updateMemberRoleAction(
  targetUserId: string,
  newRole: UserRole
) {
  const currentUser = await requireOrgAdmin();

  // Prevent modifying yourself to lock yourself out?
  // (Optional logic, usually good to prevent demoting the last admin)
  if (targetUserId === currentUser.id) {
    return { success: false, message: "You cannot change your own role." };
  }

  try {
    await prisma.user.update({
      where: {
        id: targetUserId,
        organizationId: currentUser.organizationId, // Security scope
      },
      data: {
        role: newRole,
      },
    });

    revalidatePath("/settings/team");
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Failed to update role." };
  }
}

/**
 * Removes a member from the organization.
 */
export async function removeMemberAction(targetUserId: string) {
  const currentUser = await requireOrgAdmin();

  if (targetUserId === currentUser.id) {
    return { success: false, message: "You cannot remove yourself." };
  }

  try {
    // We can either delete them or set status to INACTIVE.
    // Deleting might cascade and lose data (recipes created by them).
    // Safer to set organizationId to null or status INACTIVE.

    // Approach: Unlink from Organization and set UNAUTHORIZED
    await prisma.user.update({
      where: {
        id: targetUserId,
        organizationId: currentUser.organizationId,
      },
      data: {
        organizationId: null,
        status: "UNAUTHORIZED",
      },
    });

    revalidatePath("/settings/team");
    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Failed to remove user." };
  }
}
