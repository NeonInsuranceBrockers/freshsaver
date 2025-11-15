// /src/components/inventory/InventoryCard.tsx

"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { InventoryItem } from "@prisma/client";
import { differenceInDays } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { GripVertical } from "lucide-react";

// Define the component's props
type InventoryCardProps = {
  item: InventoryItem;
};

export default function InventoryCard({ item }: InventoryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  // CORRECTED: The style object now has only one 'transform' property
  // and includes the new 'opacity' property for the ghosting effect.
  const style = {
    transition,
    // The 'transform' property now correctly handles both states (dragging and not dragging)
    transform: isDragging
      ? `${CSS.Transform.toString(transform)} scale(1.05)` // Scale up when dragging
      : CSS.Transform.toString(transform), // Normal position otherwise
    boxShadow: isDragging
      ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
      : "none",
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.5 : 1, // Make the original card semi-transparent
  };

  // --- Helper logic for displaying expiration status ---
  const daysUntilExpiry = differenceInDays(
    new Date(item.expiration_date),
    new Date()
  );
  let expiryColor = "text-green-600 dark:text-green-400";
  let expiryText = `${daysUntilExpiry} days left`;

  if (daysUntilExpiry <= 0) {
    expiryColor = "text-red-600 dark:text-red-400";
    expiryText = `Expired ${Math.abs(daysUntilExpiry)} days ago`;
  } else if (daysUntilExpiry <= 3) {
    expiryColor = "text-yellow-600 dark:text-yellow-400";
  }
  if (daysUntilExpiry === 0) expiryText = "Expires today";
  if (daysUntilExpiry === 1) expiryText = "Expires tomorrow";

  return (
    <Card ref={setNodeRef} style={style} {...attributes} className="touch-none">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-base font-medium">{item.name}</CardTitle>
        <div {...listeners} className="cursor-grab p-1 text-muted-foreground">
          <GripVertical className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{item.category}</span>
          <span>{`${item.quantity} ${item.unit}`}</span>
        </div>
        <div className={`mt-2 text-sm font-semibold ${expiryColor}`}>
          {expiryText}
        </div>
      </CardContent>
    </Card>
  );
}
