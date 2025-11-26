// /src/app/(app)/inventory/page.tsx

import prisma from "@/lib/db/prisma";
import InventoryKanbanBoard from "@/components/inventory/InventoryKanbanBoard";
import { getAuthenticatedUser } from "@/lib/auth/session";

// This is an async Server Component
export default async function InventoryPage() {
  // 1. Secure the page and get the current user context
  const user = await getAuthenticatedUser();

  // 2. Fetch inventory items SCOPED to the Organization.
  // This ensures Company A cannot see Company B's inventory.
  const initialItems = await prisma.inventoryItem.findMany({
    where: {
      organizationId: user.organizationId,
    },
    orderBy: {
      expiration_date: "asc", // Sort by expiration date, oldest first
    },
  });

  // 3. Render the main client-side Kanban board component.
  return (
    <div className="grow p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Inventory Management
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Drag and drop items to update their location or status.
      </p>

      <div className="mt-6">
        <InventoryKanbanBoard initialItems={initialItems} />
      </div>
    </div>
  );
}
