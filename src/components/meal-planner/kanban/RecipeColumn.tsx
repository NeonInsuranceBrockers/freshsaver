// /src/components/meal-planner/kanban/RecipeColumn.tsx

"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
// import { SortableContext, verticalListSortingStrategy } from "@d-kit/sortable";
import type { RecipeKanbanColumn, RecipeCardData } from "@/types/meal-planner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RecipeCard from "./RecipeCard";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// 1. Update the props definition
type RecipeColumnProps = {
  column: RecipeKanbanColumn;
  cards: RecipeCardData[];
  onRecheckCard: (recipeId: string) => void;
};

export default function RecipeColumn({
  column,
  cards,
  onRecheckCard, // Destructure the prop
}: RecipeColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={column.id === "BACKLOG" ? "item-1" : ""}
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="p-2 bg-muted/50 rounded-md hover:no-underline">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">{column.title}</h4>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {cards.length}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <div ref={setNodeRef} className="flex flex-col gap-2 min-h-[50px]">
            <SortableContext
              items={cards.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {cards.length > 0 ? (
                cards.map((card) => (
                  // 2. Pass the function down to each RecipeCard
                  <RecipeCard
                    key={card.id}
                    card={card}
                    onRecheck={onRecheckCard}
                  />
                ))
              ) : (
                <div className="text-xs text-muted-foreground text-center p-4">
                  No recipes in this stage.
                </div>
              )}
            </SortableContext>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
