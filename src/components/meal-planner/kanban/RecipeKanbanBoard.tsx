// /src/components/meal-planner/kanban/RecipeKanbanBoard.tsx

"use client";

import React from "react";
import type { RecipeKanbanState } from "@/types/meal-planner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import RecipeColumn from "./RecipeColumn";

// 1. Update the props definition to include the new handler function
type RecipeKanbanBoardProps = {
  kanbanState: RecipeKanbanState | null;
  onRecheckCard: (recipeId: string) => void;
};

export default function RecipeKanbanBoard({
  kanbanState,
  onRecheckCard, // Destructure the new prop
}: RecipeKanbanBoardProps) {
  if (!kanbanState) {
    return (
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Recipe Ideas</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Recipe Ideas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {kanbanState.columnOrder.map((columnId) => {
          const column = kanbanState.columns[columnId];
          const cards = column.cardIds
            .map((cardId) => kanbanState.cards[cardId])
            .filter(Boolean);

          return (
            <RecipeColumn
              key={column.id}
              column={column}
              cards={cards}
              onRecheckCard={onRecheckCard} // 2. Pass the function down to each column
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
