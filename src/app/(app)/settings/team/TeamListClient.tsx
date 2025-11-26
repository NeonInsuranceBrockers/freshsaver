// /app/(app)/settings/team/TeamListClient.tsx
"use client";

import React, { useState } from "react";
import {
  TeamMemberDisplay,
  inviteMemberAction,
  removeMemberAction,
  updateMemberRoleAction,
} from "./actions";
import { Button } from "@/components/ui/button";
import { UserRole } from "@prisma/client";
import {
  Loader2,
  Plus,
  MoreVertical,
  Trash2,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { format } from "date-fns";

interface Props {
  initialMembers: TeamMemberDisplay[];
  currentUserId: string;
}

export function TeamListClient({ initialMembers, currentUserId }: Props) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // We rely on Server Actions to revalidatePath, so the page refreshes automatically.
  // However, for immediate feedback, you might use optimistic updates in a real app.
  // Here we'll rely on the standard refresh cycle.

  async function onInvite(formData: FormData) {
    setIsLoading(true);
    const result = await inviteMemberAction(formData);
    setIsLoading(false);

    if (result.success) {
      setIsInviteOpen(false);
      // Optional: Add a toast notification here
      alert("Invitation sent successfully!");
    } else {
      alert(result.message || "Failed to invite user.");
    }
  }

  async function onRemove(userId: string) {
    if (
      !confirm(
        "Are you sure you want to remove this user from the organization?"
      )
    )
      return;

    const result = await removeMemberAction(userId);
    if (!result.success) {
      alert(result.message);
    }
  }

  async function onRoleChange(userId: string, newRole: UserRole) {
    const result = await updateMemberRoleAction(userId, newRole);
    if (!result.success) {
      alert(result.message);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Organization Members ({initialMembers.length})
        </h3>
        <Button onClick={() => setIsInviteOpen(!isInviteOpen)} size="sm">
          {isInviteOpen ? (
            "Cancel"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> Invite Member
            </>
          )}
        </Button>
      </div>

      {/* Invite Form */}
      {isInviteOpen && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
          <form
            action={onInvite}
            className="flex flex-col sm:flex-row gap-3 items-end"
          >
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="colleague@company.com"
                className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                className="w-full p-2 border rounded text-sm bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="MEMBER">Member</option>
                <option value="ORG_ADMIN">Admin</option>
              </select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send Invite"
              )}
            </Button>
          </form>
        </div>
      )}

      {/* List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {initialMembers.map((member) => (
          <div
            key={member.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm">
                {member.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  member.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {member.name}
                  </p>
                  {member.id === currentUserId && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>

            {/* Meta Info & Actions */}
            <div className="flex items-center space-x-4">
              {/* Status Badge */}
              <div
                className={`px-2 py-1 text-xs rounded-full border ${
                  member.status === "ACTIVE"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                }`}
              >
                {member.status === "PENDING" ? "Pending Invite" : "Active"}
              </div>

              {/* Role Display / Control */}
              <div className="flex items-center">
                {member.role === "ORG_ADMIN" ||
                member.role === "SUPER_ADMIN" ? (
                  <ShieldCheck className="w-4 h-4 text-blue-500 mr-1" />
                ) : (
                  <div className="w-4 mr-1" />
                )}

                {/* Simplified Role Toggle (In real app, use a dropdown) */}
                <select
                  value={member.role}
                  onChange={(e) =>
                    onRoleChange(member.id, e.target.value as UserRole)
                  }
                  disabled={member.id === currentUserId} // Can't change own role
                  className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ORG_ADMIN">Admin</option>
                  <option value="SUPER_ADMIN" disabled>
                    Super Admin
                  </option>
                </select>
              </div>

              <div className="text-sm text-gray-400 hidden sm:block">
                Joined {format(member.joinedAt, "MMM d, yyyy")}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => onRemove(member.id)}
                disabled={member.id === currentUserId}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                title="Remove User"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {initialMembers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No members found. Invite someone to get started!
          </div>
        )}
      </div>
    </div>
  );
}
