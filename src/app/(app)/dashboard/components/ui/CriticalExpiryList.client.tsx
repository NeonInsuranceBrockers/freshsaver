// app/(app)/dashboard/components/ui/CriticalExpiryList.client.tsx
"use client";

import React from "react";
import { InventoryItem } from "@prisma/client";
import { differenceInDays, formatDistanceToNow, isPast } from "date-fns";
import { CheckCircle, Clock, ExternalLink, Utensils } from "lucide-react";
import Link from "next/link";

interface CriticalExpiryListProps {
  items: InventoryItem[];
}

/**
 * Calculates the status text based on the expiration date.
 */
const getExpiryStatus = (date: Date): { text: string; color: string } => {
  const days = differenceInDays(date, new Date());

  if (isPast(date)) {
    return { text: "Expired!", color: "text-red-600" };
  }
  if (days <= 1) {
    return {
      text: formatDistanceToNow(date, { addSuffix: true }),
      color: "text-red-500",
    };
  }
  if (days <= 3) {
    return {
      text: formatDistanceToNow(date, { addSuffix: true }),
      color: "text-yellow-500",
    };
  }
  return {
    text: formatDistanceToNow(date, { addSuffix: true }),
    color: "text-gray-500",
  };
};

export const CriticalExpiryList: React.FC<CriticalExpiryListProps> = ({
  items,
}) => {
  if (items.length === 0) {
    return (
      <div className="p-4 bg-green-50 rounded-lg text-center text-green-700">
        <CheckCircle className="w-5 h-5 mx-auto mb-2" />
        <p className="text-sm font-medium">No critical expiry risk detected.</p>
      </div>
    );
  }

  // NOTE: In a real app, the Quick Plan button would route to a meal planner
  // endpoint that accepts an item ID for automatic recipe generation/suggestion.
  const handleQuickPlan = (itemId: string) => {
    // Placeholder for navigation:
    // router.push(`/meal-planner/suggest?inventoryId=${itemId}`);
    console.log(`Triggering Quick Plan for item ID: ${itemId}`);
    alert(`Navigating to Meal Planner to use item: ${itemId}`);
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const { text, color } = getExpiryStatus(item.expiration_date);

        return (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-gray-800 shadow-sm transition hover:shadow-md"
          >
            {/* Item Info */}
            <div className="flex flex-col min-w-0 flex-1 mr-4">
              <Link
                href={`/inventory/${item.id}`}
                className="font-semibold text-sm hover:text-blue-600 truncate"
              >
                {item.name}
              </Link>
              <span className={`flex items-center text-xs ${color}`}>
                <Clock className="w-3 h-3 mr-1" />
                Expires: {text}
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleQuickPlan(item.id)}
                title="Quick Plan: Use in a meal immediately"
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
              >
                <Utensils className="w-4 h-4" />
              </button>
              <Link
                href={`/inventory/${item.id}`}
                title="View Item Details"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};
