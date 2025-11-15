// /src/lib/hooks/useInventoryKanban.ts

"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { updateInventoryItemLocationAndStatus } from "@/lib/actions/inventory.actions";
import type {
  InventoryItem,
  KanbanBoardState,
  KanbanColumn,
  KanbanViewType,
} from "@/types/inventory";

const initialColumns: Record<KanbanViewType, Record<string, KanbanColumn>> = {
  location: {
    Fridge: { id: "Fridge", title: "Fridge", itemIds: [] },
    Pantry: { id: "Pantry", title: "Pantry", itemIds: [] },
    Freezer: { id: "Freezer", title: "Freezer", itemIds: [] },
  },
  freshness: {
    FRESH: { id: "FRESH", title: "Fresh", itemIds: [] },
    NEAR_EXPIRY: { id: "NEAR_EXPIRY", title: "Near Expiry", itemIds: [] },
    EXPIRED: { id: "EXPIRED", title: "Expired", itemIds: [] },
  },
};

const columnOrderByView: Record<KanbanViewType, string[]> = {
  location: ["Fridge", "Pantry", "Freezer"],
  freshness: ["FRESH", "NEAR_EXPIRY", "EXPIRED"],
};

export function useInventoryKanban(initialItems: InventoryItem[]) {
  const [boardState, setBoardState] = useState<KanbanBoardState | null>(null);
  const [activeView, setActiveView] = useState<KanbanViewType>("location");
  const [activeItem, setActiveItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const newItems = initialItems.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as Record<string, InventoryItem>);
    const newColumns = JSON.parse(
      JSON.stringify(initialColumns[activeView])
    ) as Record<string, KanbanColumn>;
    initialItems.forEach((item) => {
      const columnKey = activeView === "location" ? item.location : item.status;
      if (newColumns[columnKey]) {
        newColumns[columnKey].itemIds.push(item.id);
      }
    });
    setBoardState({
      items: newItems,
      columns: newColumns,
      columnOrder: columnOrderByView[activeView],
    });
  }, [activeView, initialItems]);

  const handleViewChange = (view: KanbanViewType) => {
    if (!boardState) return;
    const newColumns = JSON.parse(
      JSON.stringify(initialColumns[view])
    ) as Record<string, KanbanColumn>;
    Object.values(boardState.items).forEach((item) => {
      const columnKey = view === "location" ? item.location : item.status;
      if (newColumns[columnKey]) {
        newColumns[columnKey].itemIds.push(item.id);
      }
    });
    setBoardState((prev) =>
      prev
        ? { ...prev, columns: newColumns, columnOrder: columnOrderByView[view] }
        : null
    );
    setActiveView(view);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (boardState) {
      setActiveItem(boardState.items[active.id as string] || null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;

    if (!over || !boardState) return;

    const activeItemId = active.id.toString();
    const overId = over.id.toString();

    // --- THIS IS THE NEW, ROBUST LOGIC ---
    let destinationColumnId = "";

    // Case 1: The drop target is a column itself (e.g., dropping on the background).
    // We check if the 'overId' is a valid column ID in our state.
    if (boardState.columns[overId]) {
      destinationColumnId = overId;
    } else {
      // Case 2: The drop target is another item.
      // We look up that item in our state to find which column it belongs to.
      const parentItem = boardState.items[overId];
      if (parentItem) {
        destinationColumnId =
          activeView === "location" ? parentItem.location : parentItem.status;
      }
    }

    // If we couldn't find a valid destination, abort the operation.
    if (!destinationColumnId) {
      console.error(
        "Could not determine a valid destination column for the drop."
      );
      return;
    }
    // --- END OF NEW LOGIC ---

    const activeItem = boardState.items[activeItemId];
    if (!activeItem) return;

    const startColumnId =
      activeView === "location" ? activeItem.location : activeItem.status;

    // Only proceed if the item was moved to a different column.
    if (startColumnId !== destinationColumnId) {
      setBoardState((prev) => {
        if (!prev) return null;
        const newState = JSON.parse(JSON.stringify(prev)) as KanbanBoardState;

        const startColumn = newState.columns[startColumnId];
        if (startColumn) {
          startColumn.itemIds = startColumn.itemIds.filter(
            (id) => id !== activeItemId
          );
        }

        const endColumn = newState.columns[destinationColumnId];
        if (endColumn) {
          endColumn.itemIds.push(activeItemId);
        }

        if (activeView === "location") {
          newState.items[activeItemId].location = destinationColumnId;
        } else {
          newState.items[activeItemId].status = destinationColumnId;
        }
        return newState;
      });

      const toastId = toast.loading(`Moving "${activeItem.name}"...`);
      updateInventoryItemLocationAndStatus(
        activeItemId,
        activeView === "freshness" ? activeItem.location : destinationColumnId,
        activeView === "location" ? activeItem.status : destinationColumnId
      ).then((result) => {
        if (result.success) {
          toast.success(`"${activeItem.name}" moved successfully.`, {
            id: toastId,
          });
        } else {
          toast.error(
            `Failed to move "${activeItem.name}": ${result.message}`,
            { id: toastId }
          );
        }
      });
    }
  };

  return {
    boardState,
    activeView,
    activeItem,
    handleDragStart,
    handleDragEnd,
    handleViewChange,
  };
}
