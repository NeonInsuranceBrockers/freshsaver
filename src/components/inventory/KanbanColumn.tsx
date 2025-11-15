// /src/components/inventory/KanbanColumn.tsx

"use client";

import React from "react";
import type { KanbanColumn as KanbanColumnType } from "@/types/inventory";
import type { InventoryItem } from "@prisma/client";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import InventoryCard from "./InventoryCard";

// Define the component's props
type KanbanColumnProps = {
  column: KanbanColumnType;
  items: InventoryItem[];
};

export default function KanbanColumn({ column, items }: KanbanColumnProps) {
  // 1. Make this component a droppable area using dnd-kit's useDroppable hook.
  //    We give it a unique ID that matches the column's ID.
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    // 2. The `ref` from `setNodeRef` is attached to the main div.
    //    This tells dnd-kit that this specific DOM element is a drop zone.
    <div
      ref={setNodeRef}
      className="flex h-full min-h-[300px] w-80 flex-shrink-0 flex-col rounded-lg bg-gray-100 dark:bg-gray-800"
    >
      <div className="border-b border-gray-300 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-lg">{column.title}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/*
        3. The SortableContext is a wrapper for all draggable items within this column.
           It helps dnd-kit optimize how it handles dragging within and between lists.
      */}
      <div className="flex flex-grow flex-col gap-2 overflow-y-auto p-2">
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {/* 4. Map over the items and render an InventoryCard for each one. */}
          {items.map((item) => (
            <InventoryCard key={item.id} item={item} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
