// /src/components/meal-planner/kanban/RecipeCard.tsx

"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { RecipeCardData } from "@/types/meal-planner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Import the Button component
import { GripVertical, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

// 1. Update the props definition to accept the onRecheck function
type RecipeCardProps = {
  card: RecipeCardData;
  onRecheck: (recipeId: string) => void;
};

export default function RecipeCard({ card, onRecheck }: RecipeCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  const hasAllIngredients = card.missingIngredients.length === 0;

  // 2. The onClick handler for our new button
  const handleRecheckClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent onClick events from firing
    onRecheck(card.id);
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} className="touch-none">
      <CardHeader className="flex flex-row items-center justify-between p-2">
        <div className="flex items-center gap-2">
          {hasAllIngredients ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <CardTitle className="text-sm font-medium leading-none">
            {card.recipe.name}
          </CardTitle>
        </div>
        <div
          {...listeners}
          className="cursor-grab p-1 text-muted-foreground rounded-sm hover:bg-accent"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      </CardHeader>

      {/* The content section is now more dynamic */}
      <CardContent className="p-2 pt-0">
        {/* Show missing ingredients if there are any */}
        {!hasAllIngredients && (
          <div className="mb-2">
            <p className="text-xs font-semibold text-red-500 mb-1">Missing:</p>
            <ul className="text-xs text-muted-foreground list-disc list-inside">
              {card.missingIngredients.map((ing) => (
                <li
                  key={ing.name}
                >{`${ing.quantity} ${ing.unit} ${ing.name}`}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 3. Conditionally render the "Re-check" button */}
        {/*    It only shows if the card is in the 'NEEDS_INGREDIENTS' column. */}
        {card.status === "NEEDS_INGREDIENTS" && (
          <Button
            variant="outline"
            size="sm" // A smaller button size
            className="w-full"
            onClick={handleRecheckClick}
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Re-check Inventory
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
