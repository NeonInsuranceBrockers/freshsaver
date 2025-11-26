// /lib/auth/session.ts

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

/**
 * Retrieves the currently authenticated user from the database.
 * Enforces access control:
 * 1. Must be logged in via Clerk.
 * 2. Must exist in Prisma.
 * 3. Must NOT have status 'UNAUTHORIZED'.
 *
 * @returns The full User object from Prisma.
 */
export async function getAuthenticatedUser(): Promise<User> {
  const { userId: clerkId } = await auth();

  // 1. Check if logged in with Clerk
  if (!clerkId) {
    redirect("/login");
  }

  // 2. Fetch User from Prisma
  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  // 3. Handle Edge Case: Webhook hasn't fired yet or failed
  if (!user) {
    // Ideally, we might show a "Setting up your account..." spinner here.
    // For now, we treat it as unauthorized to be safe.
    console.warn(`[Auth] User ${clerkId} exists in Clerk but not DB.`);
    redirect("/unauthorized");
  }

  // 4. Enforce "Handshake" Status
  // If the admin hasn't assigned them to an Org, or explicitly disabled them.
  if (user.status === "UNAUTHORIZED" || user.status === "INACTIVE") {
    console.warn(
      `[Auth] User ${user.email} attempted access with status ${user.status}`
    );
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Optional: Helper to ensure the user is an Admin of their Organization.
 */
export async function requireOrgAdmin(): Promise<User> {
  const user = await getAuthenticatedUser();

  if (user.role !== "ORG_ADMIN" && user.role !== "SUPER_ADMIN") {
    // You might want a specific "Forbidden" page, or just redirect to dashboard
    redirect("/dashboard");
  }

  return user;
}

/**
 * Optional: Helper to ensure the user is the System Super Admin.
 */
export async function requireSuperAdmin(): Promise<User> {
  const user = await getAuthenticatedUser();

  if (user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return user;
}
