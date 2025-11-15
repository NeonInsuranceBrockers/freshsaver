// /src/components/dashboard/TodaysMealsWidget.tsx

"use client";

import React, { useState } from "react";
import type { ScheduledMeal } from "@/types/meal-planner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ConsumptionModal from "./ConsumptionModal";

type TodaysMealsWidgetProps = {
  todaysMeals: ScheduledMeal[];
};

export default function TodaysMealsWidget({
  todaysMeals,
}: TodaysMealsWidgetProps) {
  const [selectedMeal, setSelectedMeal] = useState<ScheduledMeal | null>(null);

  return (
    <>
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Today&apos;s Meals</CardTitle>
          <CardDescription>
            {todaysMeals.length > 0
              ? "Confirm when you've cooked a meal to update your inventory."
              : "No meals scheduled for today."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {todaysMeals.length > 0 ? (
            todaysMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    {meal.mealType}
                  </p>
                  <p className="font-semibold">{meal.recipe.name}</p>
                </div>
                <Button size="sm" onClick={() => setSelectedMeal(meal)}>
                  Mark as Cooked
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Plan a meal to see it here.
            </p>
          )}
        </CardContent>
      </Card>

      {/* The Modal */}
      <ConsumptionModal
        meal={selectedMeal}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedMeal(null);
          }
        }}
      />
    </>
  );
}
