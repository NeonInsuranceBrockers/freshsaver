// /app/(app)/admin/organizations/page.tsx

import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getAllOrganizationsAction } from "./actions";
import { OrgListClient } from "./OrgListClient";
import { Building2, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Organization Management | Super Admin",
};

export default async function OrganizationsPage() {
  const user = await getAuthenticatedUser();

  // 1. Strict Access Control
  if (user.role !== "SUPER_ADMIN") {
    // Option A: Redirect to dashboard
    // redirect("/dashboard");

    // Option B: Show Access Denied Message
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-6">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          This area is restricted to System Administrators only.
        </p>
      </div>
    );
  }

  // 2. Fetch Data
  const organizations = await getAllOrganizationsAction();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Tenant Organizations
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-1">
          Create and manage B2B tenants. Each organization gets its own isolated
          data environment.
        </p>
      </div>

      {/* 3. Render Client Component for Interactivity */}
      <OrgListClient initialOrgs={organizations} />
    </div>
  );
}
