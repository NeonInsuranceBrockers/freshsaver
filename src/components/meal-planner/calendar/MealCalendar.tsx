// /src/components/meal-planner/calendar/MealCalendar.tsx

"use client";

import React, { useState, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ScheduledMeal } from "@/types/meal-planner";
import clsx from "clsx";
import CalendarEvent from "./CalendarEvent"; // UPDATED: Import the component

// A sub-component for each day cell in the calendar
function DayCell({ day, meals }: { day: Date; meals: ScheduledMeal[] }) {
  const { setNodeRef, isOver } = useDroppable({
    id: format(day, "yyyy-MM-dd"),
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg min-h-[120px]",
        isOver ? "bg-green-100 dark:bg-green-900/50" : "bg-background",
        isToday(day) && "border-2 border-primary"
      )}
    >
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          {format(day, "E")}
        </p>
        <p
          className={clsx("font-bold text-lg", isToday(day) && "text-primary")}
        >
          {format(day, "d")}
        </p>
      </div>
      <div className="p-2 flex flex-col gap-1.5 flex-grow">
        {meals.map((meal) => (
          <CalendarEvent key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
}

type MealCalendarProps = {
  scheduledMeals: ScheduledMeal[];
};
export default function MealCalendar({ scheduledMeals }: MealCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousWeek = () => setCurrentDate((prev) => subWeeks(prev, 1));
  const handleNextWeek = () => setCurrentDate((prev) => addWeeks(prev, 1));

  const daysInWeek = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {daysInWeek.map((day) => {
            const mealsForThisDay = scheduledMeals.filter((meal) =>
              isSameDay(new Date(meal.date), day)
            );
            return (
              <DayCell key={day.toString()} day={day} meals={mealsForThisDay} />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
