// app/(app)/dashboard/components/MealWorkbench.tsx (CORRECTED)
import React from "react";
import { DashboardData, ScheduledMealWithRecipe } from "@/types/dashboard";
import { KpiCard } from "./ui/KpiCard"; // Client Component
import { PendingGroceryList } from "./ui/PendingGroceryList.client"; // Client Component
import Link from "next/link";
import { Utensils, ClipboardList, BookOpen, CalendarCheck } from "lucide-react";
import { format } from "date-fns";

interface MealWorkbenchProps {
  data: DashboardData["mealPlanningSnapshot"];
}

/**
 * Server Component container for the Meal Planning & Grocery Snapshot (Section IV).
 */
export const MealWorkbench: React.FC<MealWorkbenchProps> = ({ data }) => {
  const {
    totalRecipes,
    recipesInBacklog,
    mealsThisWeek,
    incompleteGroceryCount,
    topIncompleteGroceryItems,
  } = data;

  // Filter meals for today and tomorrow for the snapshot
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const snapshotMeals = mealsThisWeek
    .filter((meal) => {
      const mealDate = new Date(meal.date);
      // Ensure we are comparing just the date parts
      const isToday = mealDate.toDateString() === today.toDateString();
      const isTomorrow = mealDate.toDateString() === tomorrow.toDateString();
      return isToday || isTomorrow;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Mock data remains (as real data fetching for backlog recipes was excluded for simplicity)
  const backlogRecipesMock = [
    { id: "r1", name: "Spicy Lentil Soup" },
    { id: "r2", name: "Chicken Curry" },
    { id: "r3", name: "Quick Tofu Scramble" },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold border-b pb-2 dark:border-gray-700">
        Meal Planning & Preparation
      </h2>

      {/* Row 1: Key Recipe KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <KpiCard
          title="Total Recipes"
          value={totalRecipes}
          description="Saved recipes in your library."
          icon="Recipes"
          color="blue"
          // FIXED: Use href instead of onClick
          href="/recipes"
        />
        <KpiCard
          title="Meals This Week"
          value={mealsThisWeek.length}
          description={`Scheduled meals since ${format(
            mealsThisWeek[0]?.date || new Date(),
            "MMM d"
          )}.`}
          icon="Meals"
          color="purple"
          // FIXED: Use href instead of onClick
          href="/meal-planner/calendar"
        />
        <KpiCard
          title="Recipe Backlog"
          value={recipesInBacklog}
          description="Recipes waiting to be scheduled."
          icon="Recipes"
          color={recipesInBacklog > 0 ? "yellow" : "green"}
          // FIXED: Use href instead of onClick
          href="/recipes?status=backlog"
        />
      </div>

      {/* Row 2: Actionable Lists (Grocery & Schedule) */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Column 1: Pending Grocery List (Client Component) */}
        <div className="lg:col-span-1">
          <PendingGroceryList
            initialItems={topIncompleteGroceryItems}
            totalIncompleteCount={incompleteGroceryCount}
          />
        </div>

        {/* Column 2: Immediate Schedule Snapshot */}
        <div className="lg:col-span-1 p-4 border rounded-xl bg-white dark:bg-gray-900 shadow">
          <h4 className="flex items-center text-lg font-semibold mb-3">
            <CalendarCheck className="w-5 h-5 mr-2 text-blue-500" />
            Today/Tomorrow Meals
          </h4>

          {snapshotMeals.length > 0 ? (
            <ul className="space-y-3">
              {snapshotMeals.map((meal) => (
                <li key={meal.id} className="border-l-4 border-blue-400 pl-3">
                  <span className="text-xs font-semibold uppercase text-blue-600">
                    {format(meal.date, "eee")} | {meal.mealType}
                  </span>
                  <Link
                    href={`/recipes/${meal.recipeId}`}
                    className="block font-medium hover:text-blue-600 truncate"
                  >
                    {meal.recipe.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No meals scheduled for the next 48 hours.
            </p>
          )}
        </div>

        {/* Column 3: Backlog Recipes */}
        <div className="lg:col-span-1 p-4 border rounded-xl bg-white dark:bg-gray-900 shadow">
          <h4 className="flex items-center text-lg font-semibold mb-3">
            <BookOpen className="w-5 h-5 mr-2 text-yellow-500" />
            Backlog Inspiration
          </h4>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {recipesInBacklog} recipes waiting. Schedule one now!
          </p>

          <div className="space-y-2">
            {backlogRecipesMock.map((recipe) => (
              <div
                key={recipe.id}
                className="flex justify-between items-center text-sm p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded"
              >
                <span className="truncate">{recipe.name}</span>
                <Link
                  href={`/recipes/${recipe.id}?action=schedule`}
                  className="text-xs text-yellow-700 hover:underline"
                >
                  Schedule
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
