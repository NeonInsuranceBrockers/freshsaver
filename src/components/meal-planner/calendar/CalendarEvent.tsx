// /src/components/meal-planner/calendar/CalendarEvent.tsx

"use client";

import React from "react";
import type { ScheduledMeal } from "@/types/meal-planner";

// Define the component's props
type CalendarEventProps = {
  meal: ScheduledMeal;
};

export default function CalendarEvent({ meal }: CalendarEventProps) {
  // In the future, this onClick could open a modal to view recipe details or unschedule the meal.
  const handleClick = () => {
    // For example: openViewMealModal(meal);
    console.log("Clicked meal:", meal);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-foreground p-1.5 rounded-md text-xs font-medium cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
    >
      <p className="truncate" title={meal.recipe.name}>
        {meal.recipe.name}
      </p>
    </div>
  );
}
