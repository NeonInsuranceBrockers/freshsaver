// /src/components/dashboard/ExpiringSoonWidget.tsx

"use client";

import React from "react";
import type { InventoryItem } from "@prisma/client";
import { differenceInDays } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, PartyPopper } from "lucide-react";

type ExpiringSoonWidgetProps = {
  items: InventoryItem[];
};

export default function ExpiringSoonWidget({ items }: ExpiringSoonWidgetProps) {
  const handleFindRecipes = (itemName: string) => {
    // For now, this is a placeholder. In the future, this could trigger a modal
    // or navigate to the meal planner with a pre-filled search.
    console.log(`Finding recipes for: ${itemName}`);
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Expiring Soon</CardTitle>
        <CardDescription>
          Use these items in the next 72 hours to prevent waste.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-4">
            {items.map((item) => {
              // Calculate days left and apply color coding for urgency
              const daysLeft = differenceInDays(
                new Date(item.expiration_date),
                new Date()
              );

              let expiryText: string;
              let expiryColor: string;

              if (daysLeft < 0) {
                // Should not happen with our query, but good to handle
                expiryText = "Expired";
                expiryColor = "text-red-600 dark:text-red-500";
              } else if (daysLeft === 0) {
                expiryText = "Expires today";
                expiryColor = "text-red-600 dark:text-red-500";
              } else if (daysLeft === 1) {
                expiryText = "Expires tomorrow";
                expiryColor = "text-orange-500 dark:text-orange-400";
              } else {
                expiryText = `${daysLeft} days left`;
                expiryColor = "text-yellow-600 dark:text-yellow-500";
              }

              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className={`text-sm font-medium ${expiryColor}`}>
                      {expiryText}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFindRecipes(item.name)}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Find Recipes
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          // A nice message for when the user has no expiring items
          <div className="flex flex-col items-center justify-center text-center py-8">
            <PartyPopper className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-sm text-muted-foreground">
              Great job! Nothing is expiring soon.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
