// /prisma/seed.ts

import { PrismaClient, UserRole, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

// --- CONFIGURATION ---
// REPLACE THIS WITH YOUR REAL CLERK EMAIL TO GET SUPER ADMIN ACCESS IMMEDIATELY
const SUPER_ADMIN_EMAIL = "markmae840@gmail.com";
const SUPER_ADMIN_CLERK_ID = null;

const getFutureDate = (daysFromNow: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const getPastDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

async function main() {
  console.log("Start seeding...");

  // 1. Clear existing data (Order matters due to Foreign Keys)
  // We delete child data first, then parents.
  await prisma.invoice.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.dataExport.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.apiKey.deleteMany();

  // Data tied to Orgs/Users
  await prisma.notificationLog.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.groceryListItem.deleteMany();
  await prisma.scheduledMeal.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.flow.deleteMany();

  // Users and Orgs
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  console.log("Cleared existing data.");

  // 2. Create the FIRST Organization (e.g., A demo company)
  const org1 = await prisma.organization.create({
    data: {
      name: "Acme Foods Inc.",
      description: "Demo organization for testing B2B features.",
    },
  });

  console.log(`Created Organization: ${org1.name}`);

  // 3. Seed Users

  // A. THE SUPER ADMIN (System Owner)
  // This user usually doesn't belong to a specific tenant (orgId is null),
  // OR they belong to a specific "System Admin" org.
  // For simplicity, we'll keep them outside standard orgs or assign to Org1 if you prefer.
  // Let's keep them organization-agnostic for now (Global Admin).
  const superAdmin = await prisma.user.create({
    data: {
      email: SUPER_ADMIN_EMAIL,
      clerkId: SUPER_ADMIN_CLERK_ID, // Matches Clerk if you have it, else placeholder
      name: "System Super Admin",
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      // organizationId: null, // Super Admins might not need an org, or can join one later
    },
  });

  // B. The Organization Admin (The customer who bought the SaaS)
  const orgAdmin = await prisma.user.create({
    data: {
      email: "manager@acmefoods.com",
      // clerkId is null -> simulating an "Invite" that hasn't been claimed yet
      // OR simulate they already signed up:
      clerkId: "clerk_org_admin_1",
      name: "Alice Manager",
      role: UserRole.ORG_ADMIN,
      status: UserStatus.ACTIVE,
      organizationId: org1.id,
    },
  });

  // C. A Standard Member (Employee)
  const memberUser = await prisma.user.create({
    data: {
      email: "employee@acmefoods.com",
      clerkId: "clerk_employee_1",
      name: "Bob Worker",
      role: UserRole.MEMBER,
      status: UserStatus.ACTIVE,
      organizationId: org1.id,
    },
  });

  // D. A Pending User (Invited by Admin, but hasn't signed up in Clerk yet)
  const pendingUser = await prisma.user.create({
    data: {
      email: "newhire@acmefoods.com",
      clerkId: null, // No Clerk ID yet!
      name: "Charlie Newhire",
      role: UserRole.MEMBER,
      status: UserStatus.PENDING,
      organizationId: org1.id,
    },
  });

  console.log("Seeded Users.");

  // 4. Seed Inventory (Linked to Org and Creator)
  await prisma.inventoryItem.createMany({
    data: [
      {
        userId: orgAdmin.id,
        organizationId: org1.id, // CRITICAL: Data belongs to Org
        name: "Industrial Milk Supply",
        category: "Dairy",
        location: "Walk-in Fridge",
        status: "NEAR_EXPIRY",
        quantity: 50,
        unit: "gallons",
        expiration_date: getFutureDate(2),
      },
      {
        userId: memberUser.id,
        organizationId: org1.id,
        name: "Cheddar Cheese",
        category: "Dairy",
        location: "Pantry A",
        status: "FRESH",
        quantity: 20,
        unit: "blocks",
        expiration_date: getFutureDate(30),
      },
    ],
  });

  console.log("Seeded Inventory.");

  // 5. Seed Flows (Linked to Org)
  await prisma.flow.create({
    data: {
      userId: orgAdmin.id,
      organizationId: org1.id,
      name: "Acme Waste Alert Protocol",
      isActive: true,
      nodes: [], // Empty JSON for demo
      edges: [],
    },
  });

  console.log("Seeded Flows.");

  // 6. Seed Analytics (Linked to User who generated them)
  // Note: Analytics usually track User performance, but dashboard aggregates by Org.
  await prisma.analyticsSnapshot.create({
    data: {
      userId: orgAdmin.id,
      date: new Date(),
      totalItems: 70,
      moneySaved: 500.0,
      wasteReduction: 15,
      activeUsers: 3, // Calculated at runtime usually
    },
  });

  console.log("Seeding finished successfully!");
  console.log("-------------------------------------");
  console.log(`SUPER ADMIN: ${superAdmin.email}`);
  console.log(`ORG ADMIN:   ${orgAdmin.email} (Org: ${org1.name})`);
  console.log(`MEMBER:      ${memberUser.email}`);
  console.log(`PENDING:     ${pendingUser.email} (Simulating Invite)`);
  console.log("-------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
