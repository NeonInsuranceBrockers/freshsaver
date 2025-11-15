// /src/components/inventory/InventoryKanbanBoard.tsx

"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import type { InventoryItem } from "@/types/inventory";
import { useInventoryKanban } from "@/lib/hooks/useInventoryKanban";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Toaster } from "sonner";
import { Loader2, PlusCircle } from "lucide-react";
import KanbanColumn from "./KanbanColumn";
import KanbanViewSwitcher from "./KanbanViewSwitcher";
import InventoryCard from "./InventoryCard"; // Import InventoryCard for the overlay
import AddItemModal from "./AddItemModal"; // Import the new modal
import { Button } from "@/components/ui/button"; // Import the button

type InventoryKanbanBoardProps = {
  initialItems: InventoryItem[];
};

export default function InventoryKanbanBoard({
  initialItems,
}: InventoryKanbanBoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    boardState,
    activeView,
    activeItem,
    handleDragStart,
    handleDragEnd,
    handleViewChange,
  } = useInventoryKanban(initialItems);

  if (!boardState) {
    // ... loading state remains the same
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Drag and drop items to update their location or status.
          </p>
        </div>
        {/* The "Add New Item" Button */}
        <Button onClick={() => setIsModalOpen(true)} className="mt-4 sm:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      <Toaster position="top-right" richColors />

      <div className="mb-4 max-w-md">
        <KanbanViewSwitcher
          activeView={activeView}
          onViewChange={handleViewChange}
        />
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex w-full items-start gap-4 overflow-x-auto rounded-lg bg-gray-200/50 dark:bg-gray-900/50 p-2">
          {boardState.columnOrder.map((columnId) => {
            const column = boardState.columns[columnId];
            const items = column.itemIds
              .map((itemId) => boardState.items[itemId])
              .filter(Boolean);
            return (
              <KanbanColumn key={column.id} column={column} items={items} />
            );
          })}
        </div>

        {/* Drag Overlay Portal */}
        {createPortal(
          <DragOverlay>
            {activeItem ? <InventoryCard item={activeItem} /> : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      {/* The Modal Component */}
      <AddItemModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
