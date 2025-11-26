// /src/app/(app)/meal-planner/page.tsx

import prisma from "@/lib/db/prisma";
import MealPlannerContainer from "@/components/meal-planner/MealPlannerContainer";
import { getAuthenticatedUser } from "@/lib/auth/session";

// This is a Server Component, responsible for fetching all data needed for the feature.
export default async function MealPlannerPage() {
  // 1. Secure the page and get the current user context
  // This automatically redirects if the user is unauthorized
  const user = await getAuthenticatedUser();

  // 2. We need to fetch three sets of data in parallel, SCOPED to the Organization.
  const [recipes, scheduledMeals, inventoryItems] = await Promise.all([
    // A. Get recipes belonging to the user's organization
    prisma.recipe.findMany({
      where: {
        organizationId: user.organizationId,
      },
      include: {
        ingredients: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    // B. Get scheduled meals.
    // Since ScheduledMeal doesn't have an orgId, we filter by the related Recipe's orgId.
    prisma.scheduledMeal.findMany({
      where: {
        recipe: {
          organizationId: user.organizationId,
        },
      },
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

    // C. Get inventory items for the organization
    prisma.inventoryItem.findMany({
      where: {
        organizationId: user.organizationId,
      },
    }),
  ]);

  return (
    <div className="grow p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Meal Planner
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Plan your meals for the week, discover recipes, and generate a smart
        grocery list.
      </p>

      <div className="mt-6">
        <MealPlannerContainer
          initialRecipes={recipes}
          initialScheduledMeals={scheduledMeals}
          initialInventory={inventoryItems}
        />
      </div>
    </div>
  );
}
