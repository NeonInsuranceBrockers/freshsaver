// /src/lib/actions/mealPlanner.actions.ts

"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import type { RecipeCardStatus } from "@/types/meal-planner";
import { getAuthenticatedUser } from "@/lib/auth/session"; // <--- Import Auth

// --- Type Definition for Recipe Creation ---
type CreateRecipeInput = {
  name: string;
  instructions: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
};

/**
 * Creates a new recipe with its associated ingredients.
 * FIXED: Attaches userId and organizationId.
 */
export async function createRecipeAction(recipeData: CreateRecipeInput) {
  // 1. Auth Check
  const user = await getAuthenticatedUser();
  if (!user.organizationId) {
    return { success: false, message: "You must belong to an organization." };
  }

  // 2. Input Validation
  if (!recipeData.name || recipeData.ingredients.length === 0) {
    return {
      success: false,
      message: "Recipe name and at least one ingredient are required.",
    };
  }

  try {
    // 3. Create
    await prisma.recipe.create({
      data: {
        userId: user.id, // <--- FIXED: Creator
        organizationId: user.organizationId, // <--- FIXED: Ownership
        name: recipeData.name,
        instructions: recipeData.instructions,
        ingredients: {
          create: recipeData.ingredients,
        },
      },
    });

    revalidatePath("/meal-planner");
    return {
      success: true,
      message: `Recipe "${recipeData.name}" created successfully!`,
    };
  } catch (error) {
    console.error("Error creating recipe:", error);
    return { success: false, message: "Failed to create recipe." };
  }
}

/**
 * Schedules a recipe for a specific date and meal type.
 * SCOPED: Ensures the recipe belongs to the user's organization.
 */
export async function scheduleMealAction(data: {
  recipeId: string;
  date: Date;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
}) {
  const user = await getAuthenticatedUser();
  const { recipeId, date, mealType } = data;

  if (!recipeId || !date || !mealType) {
    return { success: false, message: "Missing required fields." };
  }

  try {
    // Verify Recipe Ownership
    const recipe = await prisma.recipe.findFirst({
      where: {
        id: recipeId,
        organizationId: user.organizationId,
      },
    });

    if (!recipe) {
      return { success: false, message: "Recipe not found or access denied." };
    }

    await prisma.scheduledMeal.create({
      data: {
        recipeId,
        date,
        mealType,
      },
    });

    revalidatePath("/meal-planner");
    return { success: true, message: "Meal scheduled successfully!" };
  } catch (error) {
    console.error("Error scheduling meal:", error);
    return { success: false, message: "Failed to schedule meal." };
  }
}

/**
 * Deletes a scheduled meal.
 * SCOPED: Ensures we only delete meals belonging to the organization.
 */
export async function unscheduleMealAction(mealId: string) {
  const user = await getAuthenticatedUser();

  if (!mealId) {
    return { success: false, message: "Meal ID is required." };
  }

  try {
    // Use deleteMany to filter by relation ownership
    // (A scheduled meal belongs to a Recipe, which belongs to an Org)
    const result = await prisma.scheduledMeal.deleteMany({
      where: {
        id: mealId,
        recipe: {
          organizationId: user.organizationId,
        },
      },
    });

    if (result.count === 0) {
      return { success: false, message: "Meal not found or access denied." };
    }

    revalidatePath("/meal-planner");
    return { success: true, message: "Meal removed from schedule." };
  } catch (error) {
    console.error("Error unscheduling meal:", error);
    return { success: false, message: "Failed to remove meal." };
  }
}

/**
 * Updates the status of a recipe.
 * SCOPED: Ensures ownership.
 */
export async function updateRecipeStatusAction(
  recipeId: string,
  newStatus: RecipeCardStatus
) {
  const user = await getAuthenticatedUser();

  if (!recipeId || !newStatus) {
    return { success: false, message: "Invalid input." };
  }

  try {
    // Use updateMany for safe scoping
    const result = await prisma.recipe.updateMany({
      where: {
        id: recipeId,
        organizationId: user.organizationId,
      },
      data: { status: newStatus },
    });

    if (result.count === 0) {
      return { success: false, message: "Recipe not found or access denied." };
    }

    revalidatePath("/meal-planner");
    return { success: true };
  } catch (error) {
    console.error("Error updating recipe status:", error);
    return { success: false, message: "Failed to update recipe status." };
  }
}
