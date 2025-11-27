import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import GeneralSettingsClient from "./GeneralSettingsClient";

export default async function GeneralSettingsPage() {
  const user = await getAuthenticatedUser();

  // Fetch or create user settings
  let userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  // If no settings exist, create default ones
  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
      },
    });
  }

  return (
    <GeneralSettingsClient 
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
      }}
      settings={userSettings}
    />
  );
}
