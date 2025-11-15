// /src/app/(app)/inventory/page.tsx

import prisma from "@/lib/db/prisma";
import InventoryKanbanBoard from "@/components/inventory/InventoryKanbanBoard";

// This is an async Server Component
export default async function InventoryPage() {
  // 1. Fetch all inventory items directly from the database.
  // This is a server-side operation and will not be exposed to the client.
  const initialItems = await prisma.inventoryItem.findMany({
    orderBy: {
      expiration_date: "asc", // Sort by expiration date, oldest first
    },
  });

  // 2. Render the main client-side Kanban board component.
  // We pass the fetched data as a prop. Next.js handles the serialization.
  return (
    <div className="flex-grow p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Inventory Management
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Drag and drop items to update their location or status.
      </p>

      <div className="mt-6">
        {/*
          The InventoryKanbanBoard will be a client component that
          handles all the interactivity (drag & drop, state management).
        */}
        <InventoryKanbanBoard initialItems={initialItems} />
      </div>
    </div>
  );
}
