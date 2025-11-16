// src/lib/actions/grocery.actions.ts
"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

/**
 * SERVER ACTION: Toggles the 'isChecked' status of a single GroceryListItem.
 * Typically used to mark an item as purchased/completed.
 *
 * @param itemId - The ID of the grocery list item.
 * @param isChecked - The new status (true for checked, false for unchecked).
 */
export async function toggleGroceryItemAction(
  itemId: string,
  isChecked: boolean
): Promise<{ success: boolean; message: string }> {
  if (!itemId) {
    return { success: false, message: "Grocery Item ID is required." };
  }

  try {
    await prisma.groceryListItem.update({
      where: { id: itemId },
      data: { isChecked: isChecked },
    });

    // Revalidate paths that display the grocery list items, including the dashboard
    revalidatePath("/dashboard");
    revalidatePath("/meal-planner");

    return {
      success: true,
      message: isChecked
        ? "Item checked off successfully."
        : "Item restored successfully.",
    };
  } catch (error) {
    console.error("Error toggling grocery item status:", error);
    return {
      success: false,
      message: "Failed to update grocery list item.",
    };
  }
}

/**
 * SERVER ACTION: Deletes a specific grocery list item.
 */
export async function deleteGroceryItemAction(
  itemId: string
): Promise<{ success: boolean; message: string }> {
  if (!itemId) {
    return { success: false, message: "Grocery Item ID is required." };
  }

  try {
    await prisma.groceryListItem.delete({
      where: { id: itemId },
    });

    // Revalidate paths
    revalidatePath("/dashboard");
    revalidatePath("/meal-planner");

    return { success: true, message: "Item deleted successfully." };
  } catch (error) {
    console.error("Error deleting grocery item:", error);
    return { success: false, message: "Failed to delete item." };
  }
}
