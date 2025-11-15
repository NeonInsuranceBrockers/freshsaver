// /src/components/dashboard/ConsumptionModal.tsx

"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import { deductInventoryAction } from "@/lib/actions/inventory.actions";
import type { ScheduledMeal } from "@/types/meal-planner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type ConsumedIngredient = {
  name: string;
  quantity: number;
  unit: string;
};

type ConsumptionModalProps = {
  meal: ScheduledMeal | null;
  onOpenChange: (isOpen: boolean) => void;
};

// A separate component for the submit button to handle pending state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Confirm & Update Inventory
    </Button>
  );
}

export default function ConsumptionModal({
  meal,
  onOpenChange,
}: ConsumptionModalProps) {
  const [ingredients, setIngredients] = useState<ConsumedIngredient[]>(
    meal?.recipe.ingredients || []
  );

  const handleQuantityChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].quantity = parseFloat(value) || 0;
    setIngredients(newIngredients);
  };

  const handleFormAction = async () => {
    if (!meal) return;

    const payload = {
      scheduledMealId: meal.id,
      ingredients: ingredients.filter((ing) => ing.quantity > 0), // Only send ingredients that were actually used
    };

    const result = await deductInventoryAction(payload);

    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={!!meal} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Consumption</DialogTitle>
          <DialogDescription>
            Confirm or adjust the ingredients used for &quot;{meal?.recipe.name}
            &quot;. This will update your inventory.
          </DialogDescription>
        </DialogHeader>
        <form action={handleFormAction} className="space-y-4 py-4">
          {ingredients.map((ing, index) => (
            <div key={index} className="grid grid-cols-3 items-center gap-4">
              <Label
                htmlFor={`ingredient-${index}`}
                className="col-span-1 truncate"
                title={ing.name}
              >
                {ing.name}
              </Label>
              <Input
                id={`ingredient-${index}`}
                name={`ingredient-${index}-quantity`}
                type="number"
                step="0.1"
                value={ing.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                className="col-span-1"
              />
              <span className="col-span-1 text-sm text-muted-foreground">
                {ing.unit}
              </span>
            </div>
          ))}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
