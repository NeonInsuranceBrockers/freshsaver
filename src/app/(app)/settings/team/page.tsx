// /app/(app)/settings/team/page.tsx

import React from "react";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getTeamMembersAction } from "./actions";
import { TeamListClient } from "./TeamListClient";
import { Users, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Team Management | FreshSaver AI",
};

export default async function TeamSettingsPage() {
  const user = await getAuthenticatedUser();

  // Security Check: Only ORG_ADMIN or SUPER_ADMIN can access this page
  // Standard members shouldn't be managing users.
  if (user.role === "MEMBER") {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-6">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Only Organization Administrators can manage team settings. Please
          contact your administrator if you need to invite new members.
        </p>
      </div>
    );
  }

  // Fetch the members via the Server Action
  const members = await getTeamMembersAction();

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Team Management
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 ml-1">
          Manage access to your organization. Invite new members via email and
          assign roles.
        </p>
      </div>

      {/* 
        We pass the initial data to a Client Component.
        This component will handle the "Invite" form and the "Remove/Promote" buttons.
      */}
      <TeamListClient initialMembers={members} currentUserId={user.id} />
    </div>
  );
}
