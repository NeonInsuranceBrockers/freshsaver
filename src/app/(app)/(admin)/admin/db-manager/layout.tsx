// /app/(app)/(admin)/admin/layout.tsx

import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { UserRole } from "@prisma/client";
import { ShieldAlert } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch User securely
  const user = await getAuthenticatedUser();

  // 2. Strict Role Check
  // Only SUPER_ADMIN can access anything inside /admin
  if (user.role !== UserRole.SUPER_ADMIN) {
    // Log the attempt (optional)
    console.warn(
      `[Security] Unauthorized access attempt to /admin by ${user.email}`
    );

    // Redirect or show Access Denied
    // Using a return here allows us to show a nice UI instead of a hard redirect if preferred
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full mb-6">
          <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          System Admin Only
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg">
          You do not have the required permissions to access the System
          Administration area.
        </p>
        <div className="mt-8">
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // 3. Render children if authorized
  return <>{children}</>;
}
