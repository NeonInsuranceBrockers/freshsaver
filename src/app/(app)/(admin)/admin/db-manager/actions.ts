// /app/(app)/(admin)/admin/db-manager/actions.ts
"use server";

import prisma from "@/lib/db/prisma";
import { findAndExecuteActiveFlows } from "@/lib/server/flowEngine";
// import { Prisma } from "@prisma/client";

// --- Data Seeding Action ---
// We will copy the logic from our old prisma/seed.ts here
const getFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

export async function seedDatabaseAction() {
  try {
    await prisma.$transaction([
      prisma.notificationLog.deleteMany(),
      prisma.credential.deleteMany(),
      prisma.inventoryItem.deleteMany(),
      prisma.flow.deleteMany(),
      prisma.scheduledMeal.deleteMany(),
      prisma.ingredient.deleteMany(),
      prisma.recipe.deleteMany(),
    ]);

    await prisma.flow.create({
      data: {
        id: "complex-123",
        name: "Full Waste Reduction Pipeline",
        isActive: false, // Start as inactive
        nodes: [
          {
            id: "n1",
            type: "ExpirationTrigger",
            position: { x: 50, y: 150 },
            config: {
              label: "Dairy Expiration Check",
              type: "ExpirationTrigger",
              timeOffset: 2,
              filterCategory: "dairy",
            },
          },
          {
            id: "n2",
            type: "ConditionalBranch",
            position: { x: 300, y: 100 },
            config: {
              label: "Check If Fridge",
              type: "ConditionalBranch",
              checkField: "inventory_item.location",
              operator: "==",
              checkValue: "Fridge",
            },
          },
          {
            id: "n3",
            type: "SendNotification",
            position: { x: 550, y: 50 },
            config: {
              label: "Push Alert (True)",
              type: "SendNotification",
              channel: "push",
              messageBody: "Dairy expiring in 2 days: {{inventory_item.name}}",
            },
          },
          {
            id: "n4",
            type: "GenerateRecipe",
            position: { x: 550, y: 250 },
            config: {
              label: "Generate Leftover Recipe",
              type: "GenerateRecipe",
              prompt: "Suggest a healthy dish...",
              minUsage: 75,
            },
          },
          {
            id: "n5",
            type: "WebhookDelivery",
            position: { x: 800, y: 250 },
            config: {
              label: "Log Waste Reduction",
              type: "WebhookDelivery",
              targetUrl: "https://api.analytics.com/log",
              httpMethod: "POST",
            },
          },
        ],
        edges: [
          {
            id: "e1",
            source: "n1",
            target: "n2",
            sourceHandle: "output-payload",
            targetHandle: "input-payload",
          },
          {
            id: "e2",
            source: "n2",
            target: "n3",
            sourceHandle: "output-true",
            targetHandle: "input-final-payload",
            type: "custom-edge",
          },
          {
            id: "e3",
            source: "n2",
            target: "n4",
            sourceHandle: "output-false",
            targetHandle: "input-payload",
            type: "custom-edge",
          },
          {
            id: "e4",
            source: "n4",
            target: "n5",
            sourceHandle: "output-recipe-payload",
            targetHandle: "input-payload",
          },
        ],
      },
    });

    await prisma.inventoryItem.createMany({
      data: [
        {
          id: "item-101",
          name: "Milk (Gallon)",
          category: "Dairy",
          location: "Fridge",
          status: "NEAR_EXPIRY",
          quantity: 1200,
          unit: "ml",
          expiration_date: getFutureDate(1),
        },
        {
          id: "item-104",
          name: "Cheese Block",
          category: "Dairy",
          location: "Pantry",
          status: "NEAR_EXPIRY",
          quantity: 500,
          unit: "g",
          expiration_date: getFutureDate(1),
        },
        {
          id: "item-106",
          name: "Chicken",
          category: "Meat",
          location: "Freezer",
          status: "FRESH",
          quantity: 1000,
          unit: "g",
          expiration_date: getFutureDate(60),
        },
      ],
    });

    await prisma.credential.createMany({
      data: [
        {
          id: "cred-alpha-100",
          name: "Grocery Partner API Key",
          type: "API_KEY",
          secret: "ENCRYPTED_SECRET_XYZ",
          metadata: { partner: "GroceryMart" },
        },
        {
          id: "cred-beta-200",
          name: "Smart Fridge Token",
          type: "OAUTH",
          secret: "ENCRYPTED_OAUTH_ABC",
          metadata: { device: "FSR-4000" },
        },
      ],
    });

    await prisma.recipe.create({
      data: {
        id: "recipe-omelette", // Use static ID for easy reference
        name: "Cheese Omelette",
        instructions:
          "Whisk eggs and milk. Pour into a hot pan. Add cheese, fold, and serve.",
        ingredients: {
          // This nested 'create' is only valid in prisma.recipe.create
          create: [
            { name: "Eggs", quantity: 3, unit: "unit" },
            { name: "Cheese Block", quantity: 50, unit: "g" },
            { name: "Milk (Gallon)", quantity: 50, unit: "ml" },
          ],
        },
      },
    });

    await prisma.recipe.create({
      data: {
        id: "recipe-spaghetti",
        name: "Simple Spaghetti",
        instructions: "Boil spaghetti. Heat sauce. Combine and serve.",
        ingredients: {
          create: [
            { name: "Spaghetti", quantity: 200, unit: "g" },
            { name: "Tomato Sauce", quantity: 1, unit: "can" },
          ],
        },
      },
    });

    await prisma.recipe.create({
      data: {
        id: "recipe-stir-fry",
        name: "Chicken Stir-Fry",
        instructions:
          "Slice chicken and vegetables. Stir-fry chicken until cooked. Add vegetables, then sauce. Serve over rice.",
        ingredients: {
          create: [
            { name: "Chicken", quantity: 250, unit: "g" },
            { name: "Bell Pepper", quantity: 1, unit: "unit" },
            { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
          ],
        },
      },
    });

    await prisma.scheduledMeal.createMany({
      data: [
        {
          recipeId: "recipe-omelette",
          date: new Date(), // Today
          mealType: "BREAKFAST",
        },
        {
          recipeId: "recipe-spaghetti",
          date: getFutureDate(1), // Tomorrow
          mealType: "DINNER",
        },
      ],
    });

    // ... add credentials seeding if needed

    return { success: true, message: "Database seeded successfully!" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: `Seeding failed: ${error.message}` };
  }
}

// --- Data Clearing Action ---
export async function clearDatabaseAction() {
  try {
    await prisma.$transaction([
      prisma.notificationLog.deleteMany(),
      prisma.credential.deleteMany(),
      prisma.inventoryItem.deleteMany(),
      prisma.flow.deleteMany(),
      prisma.scheduledMeal.deleteMany(),
      prisma.ingredient.deleteMany(),
      prisma.recipe.deleteMany(),
    ]);
    return { success: true, message: "Database cleared successfully!" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: `Clearing failed: ${error.message}` };
  }
}

// --- Data Fetching Action ---
export async function getTableDataAction(tableName: string) {
  switch (tableName) {
    case "flows":
      return prisma.flow.findMany();
    case "inventory":
      return prisma.inventoryItem.findMany();
    case "credentials":
      return prisma.credential.findMany();
    case "notificationLogs":
      return prisma.notificationLog.findMany();
    case "recipes":
      return prisma.recipe.findMany({ include: { ingredients: true } });
    case "ingredients":
      return prisma.ingredient.findMany();
    case "scheduledMeals":
      return prisma.scheduledMeal.findMany({ include: { recipe: true } });
    default:
      return [];
  }
}

// --- Cron Trigger Action ---
export async function triggerCronAction() {
  try {
    const result = await findAndExecuteActiveFlows();
    return { success: true, message: result.message };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: `Cron job failed: ${error.message}` };
  }
}
