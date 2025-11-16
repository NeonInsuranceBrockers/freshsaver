// app/(app)/dashboard/components/ui/PendingGroceryList.client.tsx
"use client";

import React, { useTransition, useState } from "react";
import { GroceryListItem } from "@prisma/client";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { toggleGroceryItemAction } from "@/lib/actions/grocery.actions"; // Import the action

interface PendingGroceryListProps {
  initialItems: GroceryListItem[];
  totalIncompleteCount: number;
}

export const PendingGroceryList: React.FC<PendingGroceryListProps> = ({
  initialItems,
  totalIncompleteCount,
}) => {
  // We use client state to optimistically update the list display
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCheckOff = (itemId: string, itemIndex: number) => {
    // Optimistic update: remove the item instantly from the client view
    const itemToToggle = items[itemIndex];
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    startTransition(async () => {
      const result = await toggleGroceryItemAction(itemId, true);

      if (!result.success) {
        // If the action fails, revert the optimistic update
        setItems((prev) =>
          [...prev, itemToToggle].sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          )
        );
        setStatusMessage(`Error: ${result.message}`);
      } else {
        // The revalidatePath call in the action handles the server cache update
        setStatusMessage(result.message);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg text-center bg-gray-50 dark:bg-gray-800">
        <Check className="w-5 h-5 mx-auto mb-2 text-green-500" />
        <p className="text-sm font-medium">Grocery list complete!</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-gray-900 shadow">
      <h4 className="text-lg font-semibold mb-3 flex items-center">
        <ShoppingCart className="w-5 h-5 mr-2 text-orange-500" />
        Pending Shopping ({totalIncompleteCount})
      </h4>

      {statusMessage && (
        <div className="text-xs p-2 mb-2 bg-green-100 text-green-700 rounded transition-all">
          {statusMessage}
        </div>
      )}

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center justify-between p-2 border-b last:border-b-0"
          >
            {/* Item Details */}
            <div className="flex flex-col">
              <span className="font-medium text-sm">{item.name}</span>
              {item.quantity && item.unit && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.quantity} {item.unit}
                </span>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={() => handleCheckOff(item.id, index)}
              disabled={isPending}
              className={`p-1.5 rounded-full text-white transition 
                                ${
                                  isPending
                                    ? "bg-gray-400"
                                    : "bg-green-500 hover:bg-green-600"
                                }`}
              title="Check off (Purchased)"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Show remainder count if truncated */}
      {totalIncompleteCount > items.length && (
        <div className="pt-3 text-center text-sm text-gray-500">
          + {totalIncompleteCount - items.length} more item(s) pending.
        </div>
      )}
    </div>
  );
};
