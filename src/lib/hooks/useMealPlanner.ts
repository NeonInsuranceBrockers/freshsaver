// /src/lib/hooks/useMealPlanner.ts

"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable"; // NEW: Import a helper for sorting arrays
import {
  scheduleMealAction,
  updateRecipeStatusAction,
} from "@/lib/actions/mealPlanner.actions";
import type { InventoryItem } from "@prisma/client";
import type {
  Recipe,
  ScheduledMeal,
  RecipeCardData,
  RecipeKanbanState,
  RecipeKanbanColumn,
  RecipeCardStatus,
} from "@/types/meal-planner";
import { getInventoryAction } from "@/lib/actions/inventory.actions";

type UseMealPlannerProps = {
  initialRecipes: Recipe[];
  initialScheduledMeals: ScheduledMeal[];
  initialInventory: InventoryItem[];
};

// ... (initialColumns and columnOrder constants remain the same)
const initialColumns: Record<string, RecipeKanbanColumn> = {
  BACKLOG: { id: "BACKLOG", title: "Recipe Backlog", cardIds: [] },
  IN_PLANNING: { id: "IN_PLANNING", title: "In Planning", cardIds: [] },
  NEEDS_INGREDIENTS: {
    id: "NEEDS_INGREDIENTS",
    title: "Needs Ingredients",
    cardIds: [],
  },
  READY_TO_PREP: { id: "READY_TO_PREP", title: "Ready to Prep", cardIds: [] },
};

const columnOrder: RecipeCardStatus[] = [
  "BACKLOG",
  "IN_PLANNING",
  "NEEDS_INGREDIENTS",
  "READY_TO_PREP",
];

export function useMealPlanner({
  initialRecipes,
  initialScheduledMeals,
  initialInventory,
}: UseMealPlannerProps) {
  const [kanbanState, setKanbanState] = useState<RecipeKanbanState | null>(
    null
  );
  const [scheduledMeals, setScheduledMeals] = useState(initialScheduledMeals);
  const [activeCard, setActiveCard] = useState<RecipeCardData | null>(null);

  const inventoryMap = useMemo(() => {
    const map = new Map<string, { quantity: number; unit: string }>();
    initialInventory.forEach((item) => {
      map.set(item.name.toLowerCase(), {
        quantity: item.quantity,
        unit: item.unit,
      });
    });
    return map;
  }, [initialInventory]);

  const checkRecipeStatus = useMemo(() => {
    return (recipe: Recipe) => {
      const missingIngredients: {
        name: string;
        quantity: number;
        unit: string;
      }[] = [];
      for (const ingredient of recipe.ingredients) {
        const inventoryItem = inventoryMap.get(ingredient.name.toLowerCase());
        if (!inventoryItem || inventoryItem.quantity < ingredient.quantity) {
          missingIngredients.push(ingredient);
        }
      }
      return { missingIngredients };
    };
  }, [inventoryMap]);

  useEffect(() => {
    // THIS LOGIC IS NOW CORRECTED TO RESPECT THE DATABASE STATUS
    const newColumns = JSON.parse(JSON.stringify(initialColumns)) as Record<
      string,
      RecipeKanbanColumn
    >;
    const initialCards = initialRecipes.reduce((acc, recipe) => {
      const { missingIngredients } = checkRecipeStatus(recipe);
      const status = (recipe.status as RecipeCardStatus) || "BACKLOG";

      acc[recipe.id] = {
        id: recipe.id,
        recipe,
        status,
        missingIngredients,
      };

      // Place card in its correct column from the database
      if (newColumns[status]) {
        newColumns[status].cardIds.push(recipe.id);
      }

      return acc;
    }, {} as Record<string, RecipeCardData>);

    setKanbanState({ cards: initialCards, columns: newColumns, columnOrder });
  }, [initialRecipes, checkRecipeStatus]);

  // --- NEW HANDLER FOR THE RE-CHECK BUTTON ---
  const handleRecheckCard = (recipeId: string) => {
    if (!kanbanState) return;

    const card = kanbanState.cards[recipeId];
    if (!card) return;

    // Re-run the check to get the latest status
    const { missingIngredients } = checkRecipeStatus(card.recipe);
    const hasAllIngredients = missingIngredients.length === 0;
    const newStatus: RecipeCardStatus = hasAllIngredients
      ? "READY_TO_PREP"
      : "NEEDS_INGREDIENTS";

    // Only update the state if the status has actually changed
    if (card.status !== newStatus) {
      setKanbanState((prev) => {
        if (!prev) return null;

        const newState = JSON.parse(JSON.stringify(prev)) as RecipeKanbanState;

        // 1. Update the card's status and missing ingredients list
        newState.cards[recipeId].status = newStatus;
        newState.cards[recipeId].missingIngredients = missingIngredients;

        // 2. Remove the card from its old column
        const oldColumnId = card.status;
        const oldColumn = newState.columns[oldColumnId];
        if (oldColumn) {
          oldColumn.cardIds = oldColumn.cardIds.filter((id) => id !== recipeId);
        }

        // 3. Add the card to its new, correct column
        const newColumn = newState.columns[newStatus];
        if (newColumn && !newColumn.cardIds.includes(recipeId)) {
          newColumn.cardIds.push(recipeId);
        }

        return newState;
      });
      toast.success(`"${card.recipe.name}" is now ready to prep!`);
    } else {
      toast.info(`"${card.recipe.name}" status unchanged.`);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (kanbanState) {
      const card = kanbanState.cards[event.active.id as string];
      if (card) setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;

    if (!over || !kanbanState) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const activeRecipeCard = kanbanState.cards[activeId];

    if (!activeRecipeCard) return;

    const isCalendarDrop = /^\d{4}-\d{2}-\d{2}$/.test(overId);

    // Check if the drop target is a Kanban column or a card within one
    let destinationColumnId: RecipeCardStatus | null = null;
    if (kanbanState.columns[overId]) {
      destinationColumnId = overId as RecipeCardStatus;
    } else if (kanbanState.cards[overId]) {
      destinationColumnId = kanbanState.cards[overId].status;
    }

    // --- CASE 1: Dropped on the CALENDAR ---
    if (isCalendarDrop) {
      // (This logic remains the same)
      const mealDate = new Date(overId);
      mealDate.setMinutes(mealDate.getMinutes() + mealDate.getTimezoneOffset());
      const mealType = "DINNER";
      setScheduledMeals((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          date: mealDate,
          mealType,
          recipeId: activeRecipeCard.id,
          recipe: activeRecipeCard.recipe,
          createdAt: new Date(),
        },
      ]);
      setKanbanState((prev) => {
        if (!prev) return null;
        const newCards = { ...prev.cards };
        delete newCards[activeId];
        const newColumns = JSON.parse(JSON.stringify(prev.columns));
        for (const colId in newColumns) {
          newColumns[colId].cardIds = newColumns[colId].cardIds.filter(
            (id: string) => id !== activeId
          );
        }
        return { ...prev, cards: newCards, columns: newColumns };
      });
      const toastId = toast.loading(
        `Scheduling "${activeRecipeCard.recipe.name}"...`
      );
      scheduleMealAction({
        recipeId: activeRecipeCard.id,
        date: mealDate,
        mealType,
      }).then((result) => {
        if (result.success) {
          toast.success(`"${activeRecipeCard.recipe.name}" scheduled!`, {
            id: toastId,
          });
        } else {
          toast.error(`Failed to schedule: ${result.message}`, { id: toastId });
        }
      });
    }
    // --- CASE 2: Dropped on the KANBAN BOARD ---
    else if (destinationColumnId) {
      const startColumnId = activeRecipeCard.status;

      // --- NEW SUB-CASE: Sorting within the SAME column ---
      if (startColumnId === destinationColumnId) {
        setKanbanState((prev) => {
          if (!prev) return null;
          const column = prev.columns[startColumnId];
          const oldIndex = column.cardIds.indexOf(activeId);
          const newIndex = column.cardIds.indexOf(overId);

          if (oldIndex === -1 || newIndex === -1) return prev; // Safety check

          const newCardIds = arrayMove(column.cardIds, oldIndex, newIndex);

          return {
            ...prev,
            columns: {
              ...prev.columns,
              [startColumnId]: {
                ...column,
                cardIds: newCardIds,
              },
            },
          };
        });
      }
      // --- SUB-CASE: Moving to a DIFFERENT column ---
      else {
        const newStatus = destinationColumnId;
        setKanbanState((prev) => {
          if (!prev) return null;
          const newState = JSON.parse(
            JSON.stringify(prev)
          ) as RecipeKanbanState;
          newState.cards[activeId].status = newStatus;
          const startColumn = newState.columns[startColumnId];
          if (startColumn) {
            startColumn.cardIds = startColumn.cardIds.filter(
              (id) => id !== activeId
            );
          }
          const endColumn = newState.columns[newStatus];
          if (endColumn && !endColumn.cardIds.includes(activeId)) {
            endColumn.cardIds.push(activeId);
          }
          return newState;
        });

        // Call the server action to persist the change
        updateRecipeStatusAction(activeId, newStatus).then((res) => {
          if (res.success) {
            toast.info(
              `"${activeRecipeCard.recipe.name}" moved to ${newStatus
                .replace("_", " ")
                .toLowerCase()}.`
            );
          } else {
            toast.error(res.message);
            // Optional: Add logic here to revert the optimistic update
          }
        });

        // const friendlyStatus = newStatus.replace("_", " ").toLowerCase();
        // toast.info(
        //   `"${activeRecipeCard.recipe.name}" moved to ${friendlyStatus}.`
        // );
      }
    }
  };

  return {
    kanbanState,
    scheduledMeals,
    activeCard,
    handleDragStart,
    handleDragEnd,
    handleRecheckCard,
  };
}
