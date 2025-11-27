// /app/(app)/admin/organizations/actions.ts
"use server";

import prisma from "@/lib/db/prisma";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { UserRole, UserStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

// --- Types ---
export type OrganizationListDisplay = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count: {
    users: number;
  };
  users: {
    clerkId: string | null;
    email: string;
    name: string;
  }[];
};

// --- Helpers ---
async function requireSuperAdmin() {
  const user = await getAuthenticatedUser();
  if (user.role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: Super Admin access required.");
  }
  return user;
}

/**
 * Fetch all organizations with user counts and admin details.
 */
export async function getAllOrganizationsAction(): Promise<
  OrganizationListDisplay[]
> {
  await requireSuperAdmin();

  const orgs = await prisma.organization.findMany({
    include: {
      _count: {
        select: { users: true },
      },
      users: {
        where: { role: "ORG_ADMIN" },
        take: 1,
        select: {
          clerkId: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orgs;
}

/**
 * Create a new Organization and its first Admin user.
 * This is the "Tenant Creation" flow.
 */
export async function createOrganizationAction(formData: FormData) {
  await requireSuperAdmin();

  const orgName = formData.get("orgName") as string;
  const adminEmail = formData.get("adminEmail") as string;
  const adminName = formData.get("adminName") as string;

  if (!orgName || !adminEmail || !adminName) {
    return { success: false, message: "All fields are required." };
  }

  try {
    // Transaction: Create Org -> Create User -> Link them
    await prisma.$transaction(async (tx) => {
      // 1. Create the Organization
      const newOrg = await tx.organization.create({
        data: {
          name: orgName,
          description: `Created by Super Admin on ${new Date().toLocaleDateString()}`,
        },
      });

      // 2. Check if user exists (Pre-provisioning check)
      const existingUser = await tx.user.findUnique({
        where: { email: adminEmail },
      });

      if (existingUser) {
        // Edge Case: If user exists, we might want to fail OR just add them to this org?
        // For a rigid multi-tenant system, a user usually belongs to ONE org.
        // We will fail if they already exist to prevent hijacking accounts.
        throw new Error(`User ${adminEmail} already exists in the system.`);
      }

      // 3. Create the Org Admin User
      await tx.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          role: UserRole.ORG_ADMIN,
          status: UserStatus.PENDING, // Handshake flow
          organizationId: newOrg.id,
          clerkId: null,
        },
      });
    });

    revalidatePath("/admin/organizations");
    return {
      success: true,
      message: `Organization "${orgName}" created successfully.`,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Create Org Failed:", error);
    return {
      success: false,
      message: error.message || "Failed to create organization.",
    };
  }
}

/**
 * Delete an organization and all its data.
 * DANGER ZONE.
 */
export async function deleteOrganizationAction(orgId: string) {
  await requireSuperAdmin();

  try {
    // Cascade delete in Prisma schema handles the child data (Inventory, Flows, etc.)
    await prisma.organization.delete({
      where: { id: orgId },
    });

    revalidatePath("/admin/organizations");
    return { success: true, message: "Organization deleted." };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return { success: false, message: "Failed to delete organization." };
  }
}
