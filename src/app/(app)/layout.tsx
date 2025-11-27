// /src/app/(app)/layout.tsx

import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/session";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import NotificationToast from "@/components/ui/NotificationToast";
import Providers from "@/components/NProgressProvider";
import "@/lib/cron";

export const dynamic = "force-dynamic";

// This is a Server Component. It fetches data on the server.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch the User Role securely on the server
  // This function also handles redirects if the user is not authenticated/authorized
  const user = await getAuthenticatedUser();

  return (
    <>
      {/* 2. Pass the role to the Client Wrapper */}
      <ClientLayoutWrapper userRole={user.role}>
        <Providers>{children}</Providers>
      </ClientLayoutWrapper>

      {/* Global Toast Notification */}
      <NotificationToast />
    </>
  );
}
