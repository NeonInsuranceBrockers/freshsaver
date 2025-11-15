// /src/app/(app)/meal-planner/page.tsx

import prisma from "@/lib/db/prisma";
import MealPlannerContainer from "@/components/meal-planner/MealPlannerContainer";

// This is a Server Component, responsible for fetching all data needed for the feature.
export default async function MealPlannerPage() {
  // We need to fetch three sets of data in parallel for efficiency.
  const [recipes, scheduledMeals, inventoryItems] = await Promise.all([
    // 1. Get all user recipes, and be sure to include their ingredients.
    prisma.recipe.findMany({
      include: {
        ingredients: true, // This is crucial for the "Smart Check" feature
      },
      orderBy: {
        name: "asc",
      },
    }),

    // 2. Get all meals that are already scheduled on the calendar.
    prisma.scheduledMeal.findMany({
      // --- THIS IS THE CRITICAL UPDATE ---
      // We need to do a nested include to get the ingredients for the recipe
      // that is attached to the scheduled meal.
      include: {
        recipe: {
          include: {
            ingredients: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    }),

    // 3. Get the user's entire current inventory.
    prisma.inventoryItem.findMany(),
  ]);

  return (
    <div className="flex-grow p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Meal Planner
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Plan your meals for the week, discover recipes, and generate a smart
        grocery list.
      </p>

      <div className="mt-6">
        {/*
          The invocation of MealPlannerContainer itself does not change.
          What's important is that the data we pass into its props
          now has the correct and complete shape.
        */}
        <MealPlannerContainer
          initialRecipes={recipes}
          initialScheduledMeals={scheduledMeals}
          initialInventory={inventoryItems}
        />
      </div>
    </div>
  );
}
