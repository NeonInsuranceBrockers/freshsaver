// /src/components/meal-planner/MealPlannerContainer.tsx

"use client";

import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { createPortal } from "react-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { Toaster } from "sonner";
import type { InventoryItem } from "@prisma/client";
import type { Recipe, ScheduledMeal } from "@/types/meal-planner";
import { useMealPlanner } from "@/lib/hooks/useMealPlanner";
import MealCalendar from "./calendar/MealCalendar";
import RecipeKanbanBoard from "./kanban/RecipeKanbanBoard";
import RecipeCard from "./kanban/RecipeCard";

type MealPlannerContainerProps = {
  initialRecipes: Recipe[];
  initialScheduledMeals: ScheduledMeal[];
  initialInventory: InventoryItem[];
};

export default function MealPlannerContainer({
  initialRecipes,
  initialScheduledMeals,
  initialInventory,
}: MealPlannerContainerProps) {
  // --- THIS IS THE FIX ---
  const [isMounted, setIsMounted] = useState(false);

  // useEffect only runs on the client, after the component has mounted.
  useEffect(() => {
    setIsMounted(true);
  }, []); // The empty dependency array ensures this runs only once.
  // --- END OF FIX ---

  const {
    kanbanState,
    scheduledMeals,
    activeCard,
    handleDragStart,
    handleDragEnd,
    handleRecheckCard,
  } = useMealPlanner({
    initialRecipes,
    initialScheduledMeals,
    initialInventory,
  });

  return (
    <>
      <Toaster position="top-right" richColors />
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <RecipeKanbanBoard
            kanbanState={kanbanState}
            onRecheckCard={handleRecheckCard}
          />
          <MealCalendar scheduledMeals={scheduledMeals} />
        </div>

        {/* 
          Conditionally render the portal ONLY when the component is mounted.
          On the server, `isMounted` will be `false`, so this code is never executed.
          On the client, the component mounts, `isMounted` becomes `true`, and the portal is created.
        */}
        {isMounted
          ? createPortal(
              <DragOverlay>
                {activeCard ? (
                  <RecipeCard card={activeCard} onRecheck={handleRecheckCard} />
                ) : null}
              </DragOverlay>,
              document.body
            )
          : null}
      </DndContext>
    </>
  );
}
