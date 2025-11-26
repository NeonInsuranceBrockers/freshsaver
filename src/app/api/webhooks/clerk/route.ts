// /app/api/webhooks/clerk/route.ts

import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/db/prisma";
import { UserStatus, UserRole } from "@prisma/client";

export async function POST(req: Request) {
  // 1. Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // 2. Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 3. Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  let evt: WebhookEvent;

  // 4. Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", {
      status: 400,
    });
  }

  // 5. Handle the webhook events
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    if (!primaryEmail) {
      return new Response("No email found", { status: 400 });
    }

    try {
      // --- THE HANDSHAKE LOGIC ---

      // Step A: Check if a user with this email already exists in Prisma (Pre-provisioned by Admin)
      const existingUser = await prisma.user.findUnique({
        where: { email: primaryEmail },
      });

      if (existingUser) {
        // CASE 1: MATCH FOUND (Invited User)
        // The Admin created the email, now the User has claimed it via Clerk.
        // We update the record to link the Clerk ID and set status to ACTIVE.
        await prisma.user.update({
          where: { email: primaryEmail },
          data: {
            clerkId: id,
            name:
              `${first_name || ""} ${last_name || ""}`.trim() ||
              existingUser.name,
            avatarUrl: image_url || existingUser.avatarUrl,
            status: UserStatus.ACTIVE, // Activate the account
          },
        });
        console.log(
          `[Handshake] Linked Clerk ID to existing user: ${primaryEmail}`
        );
      } else {
        // CASE 2: NO MATCH (Stranger / Uninvited)
        // A random user signed up on Clerk. We create them in Prisma,
        // BUT we set them to UNAUTHORIZED so they can't access anything yet.
        await prisma.user.create({
          data: {
            clerkId: id,
            email: primaryEmail,
            name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
            role: UserRole.MEMBER, // Default role
            status: UserStatus.UNAUTHORIZED, // <--- CRITICAL: Blocks access
            avatarUrl: image_url || null,
            organizationId: null, // No organization yet
          },
        });
        console.log(`[New User] Created UNAUTHORIZED user: ${primaryEmail}`);
      }
    } catch (error) {
      console.error("Error syncing user to database:", error);
      return new Response("Error processing user.created", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;

    try {
      // Just update standard fields
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: primaryEmail,
          name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
          avatarUrl: image_url || null,
        },
      });
      console.log(`User updated: ${id}`);
    } catch (error) {
      // If user doesn't exist (edge case), we might want to create them or ignore
      console.error("Error updating user:", error);
      return new Response("Error updating user", { status: 500 });
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // If a user deletes their Clerk account, we delete from Prisma
      // Cascade delete in Schema ensures their owned data (if any) is cleaned up
      await prisma.user.delete({
        where: { clerkId: id },
      });
      console.log(`User deleted: ${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      return new Response("Error deleting user", { status: 500 });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
