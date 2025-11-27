// /app/(app)/admin/organizations/OrgListClient.tsx
"use client";

import React, { useState } from "react";
import {
  OrganizationListDisplay,
  createOrganizationAction,
  deleteOrganizationAction,
} from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Building, Trash2, Users } from "lucide-react";
import { format } from "date-fns";

interface Props {
  initialOrgs: OrganizationListDisplay[];
}

export function OrgListClient({ initialOrgs }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Form Submission
  async function onCreate(formData: FormData) {
    setIsLoading(true);
    const result = await createOrganizationAction(formData);
    setIsLoading(false);

    if (result.success) {
      setIsCreateOpen(false);
      alert(result.message);
    } else {
      alert(result.message);
    }
  }

  // Handle Deletion
  async function onDelete(orgId: string, orgName: string) {
    const confirmMessage = `WARNING: This will permanently delete "${orgName}" and ALL its data (Users, Inventory, Recipes).\n\nAre you sure?`;
    if (!confirm(confirmMessage)) return;

    const result = await deleteOrganizationAction(orgId);
    if (!result.success) {
      alert(result.message);
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateOpen(!isCreateOpen)}>
          {isCreateOpen ? (
            "Cancel"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" /> New Organization
            </>
          )}
        </Button>
      </div>

      {/* Create Tenant Form */}
      {isCreateOpen && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm animate-in fade-in slide-in-from-top-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-500" />
            Provision New Tenant
          </h3>

          <form action={onCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organization Details */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Name</label>
                <input
                  name="orgName"
                  required
                  placeholder="Acme Corp"
                  className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
                />
                <p className="text-xs text-gray-500">
                  The name of the company/household.
                </p>
              </div>

              {/* First Admin Details */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Initial Admin Email
                </label>
                <input
                  name="adminEmail"
                  type="email"
                  required
                  placeholder="admin@acme.com"
                  className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Name</label>
                <input
                  name="adminName"
                  required
                  placeholder="Alice Smith"
                  className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  "Provision Tenant"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialOrgs.map((org) => (
          <div
            key={org.id}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-md transition-shadow relative"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-lg leading-none">
                    {org.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Created {format(org.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(org.id, org.name)}
                title="Delete Organization"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-2 opacity-70" />
                <span>{org._count.users} Users</span>
              </div>

              <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                Active
              </span>
            </div>
          </div>
        ))}

        {initialOrgs.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300">
            <Building className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-lg font-medium">No Organizations Found</p>
            <p className="text-sm">
              Click &quot;New Organization&quot; to create your first tenant.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
