// /app/(app)/admin/users/page.tsx

import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getAllGlobalUsersAction, getOrgOptionsAction } from "./actions";
import { GlobalUserListClient } from "./GlobalUserListClient";
import { Users, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Global User Management | Super Admin",
};

export default async function GlobalUsersPage() {
  const user = await getAuthenticatedUser();

  // 1. Strict Access Control
  if (user.role !== "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-6">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Only System Administrators can access global user management.
        </p>
      </div>
    );
  }

  // 2. Fetch Data in Parallel
  const [users, orgOptions] = await Promise.all([
    getAllGlobalUsersAction(),
    getOrgOptionsAction(),
  ]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Global User Management
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-1">
          View all registered users across the system. Assign
          &quot;Unauthorized&quot; users to organizations here.
        </p>
      </div>

      {/* 3. Client Component for Search, Filtering, and Actions */}
      <GlobalUserListClient initialUsers={users} orgOptions={orgOptions} />
    </div>
  );
}
