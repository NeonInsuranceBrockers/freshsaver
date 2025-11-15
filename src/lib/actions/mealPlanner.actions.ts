// /src/lib/actions/mealPlanner.actions.ts

"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import type { RecipeCardStatus } from "@/types/meal-planner";

// --- Type Definition for Recipe Creation ---
// This defines the shape of the data we expect from the client when creating a recipe.
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
 * @param recipeData - The structured data for the new recipe.
 */
export async function createRecipeAction(recipeData: CreateRecipeInput) {
  // Basic validation
  if (!recipeData.name || recipeData.ingredients.length === 0) {
    return {
      success: false,
      message: "Recipe name and at least one ingredient are required.",
    };
  }

  try {
    await prisma.recipe.create({
      data: {
        name: recipeData.name,
        instructions: recipeData.instructions,
        // Use a nested 'create' to add all ingredients in the same transaction.
        ingredients: {
          create: recipeData.ingredients,
        },
      },
    });

    // Revalidate the meal planner page to show the new recipe in the backlog.
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
 * @param data - Contains the recipe ID, date, and meal type.
 */
export async function scheduleMealAction(data: {
  recipeId: string;
  date: Date;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
}) {
  const { recipeId, date, mealType } = data;

  if (!recipeId || !date || !mealType) {
    return {
      success: false,
      message: "Missing required fields to schedule a meal.",
    };
  }

  try {
    await prisma.scheduledMeal.create({
      data: {
        recipeId,
        date,
        mealType,
      },
    });

    // Revalidate the page to show the meal on the calendar.
    revalidatePath("/meal-planner");
    return { success: true, message: "Meal scheduled successfully!" };
  } catch (error) {
    console.error("Error scheduling meal:", error);
    return { success: false, message: "Failed to schedule meal." };
  }
}

/**
 * Deletes a scheduled meal from the calendar.
 * @param mealId - The unique ID of the scheduled meal to delete.
 */
export async function unscheduleMealAction(mealId: string) {
  if (!mealId) {
    return { success: false, message: "Meal ID is required." };
  }

  try {
    await prisma.scheduledMeal.delete({
      where: { id: mealId },
    });

    // Revalidate the page to remove the meal from the calendar.
    revalidatePath("/meal-planner");
    return { success: true, message: "Meal removed from schedule." };
  } catch (error) {
    console.error("Error unscheduling meal:", error);
    return { success: false, message: "Failed to remove meal." };
  }
}

/**
 * Updates the status of a recipe in the database.
 * @param recipeId - The ID of the recipe to update.
 * @param newStatus - The new status (e.g., "IN_PLANNING").
 */
export async function updateRecipeStatusAction(
  recipeId: string,
  newStatus: RecipeCardStatus
) {
  if (!recipeId || !newStatus) {
    return {
      success: false,
      message: "Recipe ID and new status are required.",
    };
  }

  try {
    await prisma.recipe.update({
      where: { id: recipeId },
      data: { status: newStatus },
    });

    revalidatePath("/meal-planner");
    return { success: true };
  } catch (error) {
    console.error("Error updating recipe status:", error);
    return { success: false, message: "Failed to update recipe status." };
  }
}
