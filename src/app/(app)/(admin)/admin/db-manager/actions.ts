// /app/(app)/(admin)/admin/db-manager/actions.ts
"use server";

import prisma from "@/lib/db/prisma";
import { findAndExecuteActiveFlows } from "@/lib/server/flowEngine";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { Prisma } from "@prisma/client";

// --- Data Seeding Action ---
const getFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

export async function seedDatabaseAction() {
  try {
    // 1. Get Context (Who is running this seed?)
    const user = await getAuthenticatedUser();
    const orgId = user.organizationId;

    if (!orgId) {
      return {
        success: false,
        message: "You must be part of an Organization to seed data.",
      };
    }

    // 2. Clear ONLY this Organization's data
    // We rely on Cascade deletes in the schema for relations (e.g. Recipe -> Ingredient)
    await prisma.$transaction([
      prisma.notificationLog.deleteMany({
        where: { user: { organizationId: orgId } },
      }),
      prisma.credential.deleteMany({ where: { organizationId: orgId } }),
      prisma.inventoryItem.deleteMany({ where: { organizationId: orgId } }),
      prisma.flow.deleteMany({ where: { organizationId: orgId } }),
      prisma.scheduledMeal.deleteMany({
        where: { recipe: { organizationId: orgId } },
      }),
      // Deleting recipes will cascade delete ingredients
      prisma.recipe.deleteMany({ where: { organizationId: orgId } }),
    ]);

    // 3. Create Flow (Linked to User & Org)
    await prisma.flow.create({
      data: {
        id: "complex-123",
        userId: user.id, // <--- REQUIRED FIX
        organizationId: orgId, // <--- REQUIRED FIX
        name: "Full Waste Reduction Pipeline",
        isActive: false,
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
        ] as unknown as Prisma.InputJsonValue, // Explicit cast for JSON
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
        ] as unknown as Prisma.InputJsonValue, // Explicit cast for JSON
      },
    });

    // 4. Create Inventory Items (Linked to User & Org)
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
      ].map((item) => ({
        ...item,
        userId: user.id, // <--- REQUIRED FIX
        organizationId: orgId, // <--- REQUIRED FIX
      })),
    });

    // 5. Create Credentials (Linked to User & Org)
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
      ].map((cred) => ({
        ...cred,
        userId: user.id, // <--- REQUIRED FIX
        organizationId: orgId, // <--- REQUIRED FIX
      })),
    });

    // 6. Create Recipes (Linked to User & Org)
    await prisma.recipe.create({
      data: {
        id: "recipe-omelette",
        userId: user.id, // <--- REQUIRED FIX
        organizationId: orgId, // <--- REQUIRED FIX
        name: "Cheese Omelette",
        instructions:
          "Whisk eggs and milk. Pour into a hot pan. Add cheese, fold, and serve.",
        ingredients: {
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
        userId: user.id,
        organizationId: orgId,
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
        userId: user.id,
        organizationId: orgId,
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
          date: new Date(),
          mealType: "BREAKFAST",
        },
        {
          recipeId: "recipe-spaghetti",
          date: getFutureDate(1),
          mealType: "DINNER",
        },
      ],
    });

    return { success: true, message: "Database seeded successfully!" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: `Seeding failed: ${error.message}` };
  }
}

// --- Data Clearing Action ---
export async function clearDatabaseAction() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.organizationId;

    if (!orgId) return { success: false, message: "No organization found." };

    await prisma.$transaction([
      prisma.notificationLog.deleteMany({
        where: { user: { organizationId: orgId } },
      }),
      prisma.credential.deleteMany({ where: { organizationId: orgId } }),
      prisma.inventoryItem.deleteMany({ where: { organizationId: orgId } }),
      prisma.flow.deleteMany({ where: { organizationId: orgId } }),
      prisma.scheduledMeal.deleteMany({
        where: { recipe: { organizationId: orgId } },
      }),
      prisma.recipe.deleteMany({ where: { organizationId: orgId } }),
    ]);
    return {
      success: true,
      message: "Organization data cleared successfully!",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: `Clearing failed: ${error.message}` };
  }
}

// --- Data Fetching Action ---
export async function getTableDataAction(tableName: string) {
  const user = await getAuthenticatedUser();
  const orgId = user.organizationId;

  if (!orgId) return [];

  const orgFilter = { organizationId: orgId };
  const userOrgFilter = { user: { organizationId: orgId } };

  switch (tableName) {
    case "flows":
      return prisma.flow.findMany({ where: orgFilter });
    case "inventory":
      return prisma.inventoryItem.findMany({ where: orgFilter });
    case "credentials":
      return prisma.credential.findMany({ where: orgFilter });
    case "notificationLogs":
      return prisma.notificationLog.findMany({ where: userOrgFilter });
    case "recipes":
      return prisma.recipe.findMany({
        where: orgFilter,
        include: { ingredients: true },
      });
    case "ingredients":
      // Ingredients don't have direct orgId, link via recipe
      return prisma.ingredient.findMany({
        where: { recipe: { organizationId: orgId } },
      });
    case "scheduledMeals":
      return prisma.scheduledMeal.findMany({
        where: { recipe: { organizationId: orgId } },
        include: { recipe: true },
      });
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
