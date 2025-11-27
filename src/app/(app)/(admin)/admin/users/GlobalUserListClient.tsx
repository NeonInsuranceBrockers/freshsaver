// /app/(app)/admin/users/GlobalUserListClient.tsx
"use client";

import React, { useState } from "react";
import {
  GlobalUserDisplay,
  assignUserToOrgAction,
  updateUserStatusAction,
} from "./actions";
import { UserRole, UserStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  CheckCircle,
  Lock,
  Building,
} from "lucide-react";

interface OrgOption {
  id: string;
  name: string;
}

interface Props {
  initialUsers: GlobalUserDisplay[];
  orgOptions: OrgOption[];
}

// Map UserStatus to Tailwind classes
const statusMap: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  UNAUTHORIZED: "bg-red-100 text-red-800 border-red-200",
  INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
};

// Map UserRole to Tailwind classes
const roleMap: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-800 border-purple-200",
  ORG_ADMIN: "bg-blue-100 text-blue-800 border-blue-200",
  MEMBER: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

export function GlobalUserListClient({ initialUsers, orgOptions }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // --- Handlers ---

  const handleAssignment = async (
    userId: string,
    orgId: string,
    role: UserRole
  ) => {
    setLoadingId(userId);
    const result = await assignUserToOrgAction(userId, orgId, role);
    setLoadingId(null);

    if (result.success) {
      // Optimistic update (or fetch fresh data if complex)
      setUsers(
        users.map((u) =>
          u.id === userId
            ? {
              ...u,
              organization: orgOptions.find((o) => o.id === orgId) || null,
              role: role,
              status: UserStatus.ACTIVE, // Assume assignment means activation
            }
            : u
        )
      );
    } else {
      alert(result.message);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    if (
      newStatus === UserStatus.INACTIVE &&
      !confirm(
        "Are you sure you want to deactivate this user? They will be locked out."
      )
    )
      return;

    setLoadingId(userId);
    const result = await updateUserStatusAction(userId, newStatus);
    setLoadingId(null);

    if (result.success) {
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-700/50">
            <TableHead>User</TableHead>
            <TableHead>Clerk ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className={
                user.status === UserStatus.UNAUTHORIZED ||
                  user.status === UserStatus.PENDING
                  ? "bg-red-50/30 dark:bg-red-900/10 hover:bg-red-50/50"
                  : ""
              }
            >
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </TableCell>

              <TableCell className="text-xs font-mono">
                {user.clerkId ? (
                  user.clerkId.slice(0, 10) + "..."
                ) : (
                  <span className="text-red-500">MISSING</span>
                )}
              </TableCell>

              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full border ${statusMap[user.status]
                    }`}
                >
                  {user.status}
                </span>
              </TableCell>

              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full border ${roleMap[user.role]
                    }`}
                >
                  {user.role}
                </span>
              </TableCell>

              <TableCell>
                {user.organization ? (
                  <span className="flex items-center text-sm">
                    <Building className="w-3 h-3 mr-1 text-gray-500" />
                    {user.organization.name}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 italic">
                    Unassigned
                  </span>
                )}
              </TableCell>

              <TableCell className="text-right w-64">
                {/* --- Action Buttons --- */}
                {user.status === UserStatus.UNAUTHORIZED ||
                  user.status === UserStatus.PENDING ? (
                  // ASSIGNMENT FORM FOR UNAUTHORIZED/PENDING USERS
                  <AssignmentForm
                    userId={user.id}
                    orgOptions={orgOptions}
                    onAssign={handleAssignment}
                    isLoading={loadingId === user.id}
                  />
                ) : (
                  // STATUS CONTROL FOR ACTIVE/INACTIVE USERS
                  <StatusControl
                    userId={user.id}
                    currentStatus={user.status}
                    onStatusChange={handleStatusChange}
                    isLoading={loadingId === user.id}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No users found in the system.
        </div>
      )}
    </div>
  );
}

// --- Sub-Component: Assignment Form ---
interface AssignmentFormProps {
  userId: string;
  orgOptions: OrgOption[];
  onAssign: (userId: string, orgId: string, role: UserRole) => void;
  isLoading: boolean;
}

function AssignmentForm({
  userId,
  orgOptions,
  onAssign,
  isLoading,
}: AssignmentFormProps) {
  const [selectedOrgId, setSelectedOrgId] = useState(orgOptions[0]?.id || "");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.MEMBER);

  if (orgOptions.length === 0) {
    return <span className="text-sm text-red-500">No Orgs Available</span>;
  }

  return (
    <div className="flex gap-2 items-center">
      <select
        value={selectedOrgId}
        onChange={(e) => setSelectedOrgId(e.target.value)}
        className="p-1 border rounded-md text-sm dark:bg-gray-900"
      >
        {orgOptions.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
        className="p-1 border rounded-md text-sm dark:bg-gray-900 w-24"
      >
        <option value={UserRole.MEMBER}>Member</option>
        <option value={UserRole.ORG_ADMIN}>Admin</option>
        {/* SUPER_ADMIN cannot be assigned this way, reserved for system use */}
      </select>
      <Button
        size="sm"
        disabled={isLoading || !selectedOrgId}
        onClick={() => onAssign(userId, selectedOrgId, selectedRole)}
        className="w-20"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign"}
      </Button>
    </div>
  );
}

// --- Sub-Component: Status Control ---
interface StatusControlProps {
  userId: string;
  currentStatus: UserStatus;
  onStatusChange: (userId: string, newStatus: UserStatus) => void;
  isLoading: boolean;
}

function StatusControl({
  userId,
  currentStatus,
  onStatusChange,
  isLoading,
}: StatusControlProps) {
  const isInactive = currentStatus === UserStatus.INACTIVE;

  const handleToggle = () => {
    if (isInactive) {
      onStatusChange(userId, UserStatus.ACTIVE);
    } else {
      onStatusChange(userId, UserStatus.INACTIVE);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button
        size="sm"
        variant={isInactive ? "default" : "secondary"}
        onClick={handleToggle}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isInactive ? (
          <CheckCircle className="h-4 w-4 mr-1" />
        ) : (
          <Lock className="h-4 w-4 mr-1" />
        )}
        {isInactive ? "Activate" : "Deactivate"}
      </Button>
    </div>
  );
}
