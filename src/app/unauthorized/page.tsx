// /app/unauthorized/page.tsx

import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import UnauthorizedClient from "./UnauthorizedClient";

export const metadata = {
  title: "Access Restricted | FreshSaver AI",
};

export default async function UnauthorizedPage() {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress || "Unknown Email";
  const userId = user?.id || "Unknown ID";

  return <UnauthorizedClient email={email} userId={userId} />;
}
