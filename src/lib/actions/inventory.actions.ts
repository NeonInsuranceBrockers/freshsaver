// /src/lib/actions/inventory.actions.ts

"use server";

import prisma from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod"; // Import zod for validation

type ItemActionState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[] | undefined;
    category?: string[] | undefined;
    location?: string[] | undefined;
    quantity?: string[] | undefined;
    unit?: string[] | undefined;
    expiration_date?: string[] | undefined;
    status?: string[] | undefined;
  };
};

/**
 * Updates an inventory item's location and/or status in the database.
 * This is the core function called after a drag-and-drop operation.
 *
 * @param itemId - The ID of the inventory item to update.
 * @param newLocation - The new location value (e.g., "Fridge", "Pantry").
 * @param newStatus - The new freshness status (e.g., "FRESH", "NEAR_EXPIRY").
 */
export async function updateInventoryItemLocationAndStatus(
  itemId: string,
  newLocation: string,
  newStatus: string
) {
  // Basic validation
  if (!itemId || !newLocation || !newStatus) {
    return {
      success: false,
      message: "Invalid input: Missing required fields.",
    };
  }

  try {
    // 1. Find the item to ensure it exists before updating.
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return { success: false, message: "Item not found." };
    }

    // 2. Perform the update operation in the database.
    await prisma.inventoryItem.update({
      where: {
        id: itemId,
      },
      data: {
        location: newLocation,
        status: newStatus,
        // The `updatedAt` field will be automatically handled by Prisma.
      },
    });

    // 3. Revalidate the inventory page path.
    // This tells Next.js to purge its cache for this page, ensuring
    // that the next time a user visits, they get the fresh, updated data.
    revalidatePath("/inventory");
    revalidatePath("/meal-planner");

    return {
      success: true,
      message: `Successfully updated item: ${existingItem.name}.`,
    };
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return {
      success: false,
      message: "Database operation failed. See server logs for details.",
    };
  }
}

/**
 * Fetches the current state of the user's inventory.
 * This is a "getter" action used for dynamic updates on the client.
 */
export async function getInventoryAction() {
  try {
    const items = await prisma.inventoryItem.findMany();
    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return { success: false, data: [] };
  }
}

// 1. Define the schema for our form data using Zod.
const AddItemSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  location: z.string().min(1, { message: "Please select a location." }),
  quantity: z.coerce
    .number()
    .min(0, { message: "Quantity cannot be negative." }),
  unit: z.string().min(1, { message: "Please select a unit." }),
  expiration_date: z.coerce.date({ message: "Please enter a valid date." }),
  // We automatically set the status for new items to 'FRESH'
  status: z.string().default("FRESH"),
});

/**
 * Creates a new inventory item in the database based on form data.
 * @param formData - The FormData object from the form submission.
 */
export async function addInventoryItemAction(
  prevState: ItemActionState,
  formData: FormData
) {
  // 2. Convert the FormData to a plain object and validate it against our schema.
  const validatedFields = AddItemSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    location: formData.get("location"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    expiration_date: formData.get("expiration_date"),
  });

  // 3. If validation fails, we return the specific errors to the client.
  // This allows us to display user-friendly error messages on the form.
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed. Please check the form fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // 4. If validation is successful, we create the new item in the database.
    await prisma.inventoryItem.create({
      data: validatedFields.data,
    });

    // 5. CRITICAL: Revalidate the paths for both inventory and meal planner.
    // This tells Next.js to fetch fresh data for these pages.
    revalidatePath("/inventory");
    revalidatePath("/meal-planner");

    return {
      success: true,
      message: `Successfully added "${validatedFields.data.name}"!`,
    };
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return {
      success: false,
      message: "Database error: Failed to add item.",
    };
  }
}

// This is more complex as it involves an array of objects.
const DeductInventorySchema = z.object({
  scheduledMealId: z.string().min(1, "Scheduled meal ID is required."),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1),
        quantity: z.coerce
          .number()
          .gt(0, "Consumed quantity must be positive."),
        unit: z.string(), // We don't strictly need to validate the unit, but it's good to have.
      })
    )
    .min(1, "At least one ingredient must be consumed."),
});

/**
 * Deducts ingredient quantities from the inventory after a meal is cooked.
 * Deletes the scheduled meal event from the calendar.
 * This entire operation is performed within a single database transaction.
 */
export async function deductInventoryAction(payload: unknown) {
  // 2. Validate the incoming payload against our complex schema.
  const validatedFields = DeductInventorySchema.safeParse(payload);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid data provided.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { scheduledMealId, ingredients } = validatedFields.data;

  try {
    // 3. Use a Prisma transaction to ensure all database operations succeed or fail together.
    await prisma.$transaction(async (tx) => {
      // For each ingredient the user confirmed they used...
      for (const consumedIngredient of ingredients) {
        // Find the corresponding item in the inventory. We use `findFirst` as names are not unique.
        const inventoryItem = await tx.inventoryItem.findFirst({
          where: { name: consumedIngredient.name },
        });

        // If the item doesn't exist in the inventory, fail the entire transaction.
        if (!inventoryItem) {
          throw new Error(
            `Inventory item "${consumedIngredient.name}" not found.`
          );
        }

        const newQuantity =
          inventoryItem.quantity - consumedIngredient.quantity;

        // If the new quantity is positive, update the item.
        if (newQuantity > 0) {
          await tx.inventoryItem.update({
            where: { id: inventoryItem.id },
            data: { quantity: newQuantity },
          });
        }
        // Otherwise, the item is finished, so delete it.
        else {
          await tx.inventoryItem.delete({
            where: { id: inventoryItem.id },
          });
        }
      }

      // 4. After successfully processing all ingredients, delete the scheduled meal.
      await tx.scheduledMeal.delete({
        where: { id: scheduledMealId },
      });
    });

    // 5. Revalidate all relevant paths to ensure the UI updates everywhere.
    revalidatePath("/dashboard");
    revalidatePath("/inventory");
    revalidatePath("/meal-planner");

    return { success: true, message: "Inventory updated successfully!" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Transaction failed: ", error);
    return {
      success: false,
      // Provide a user-friendly error message from our transaction.
      message:
        error.message ||
        "Failed to update inventory. The operation was rolled back.",
    };
  }
}
