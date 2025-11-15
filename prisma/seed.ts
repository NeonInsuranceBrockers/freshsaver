// /prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// We will copy our mock data structures here.
// Note: Prisma's Json type expects a specific format.

const getFutureDate = (daysFromNow: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

async function main() {
  console.log("Start seeding...");

  // 1. Clear existing data
  await prisma.notificationLog.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.flow.deleteMany();
  console.log("Cleared existing data.");

  // 2. Seed Flows
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

  await prisma.flow.create({
    data: {
      id: "empty-456",
      name: "New Empty Flow Template",
      nodes: [],
      edges: [],
    },
  });
  console.log("Seeded flows.");

  // 3. Seed Inventory
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
  console.log("Seeded inventory items.");

  // 4. Seed Credentials
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
  console.log("Seeded credentials.");

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
