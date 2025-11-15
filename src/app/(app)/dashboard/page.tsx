// /src/app/(app)/dashboard/page.tsx

import prisma from "@/lib/db/prisma";
import { startOfDay, endOfDay, addDays } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import TodaysMealsWidget from "@/components/dashboard/TodaysMealsWidget"; // <-- IMPORT WIDGET
import ExpiringSoonWidget from "@/components/dashboard/ExpiringSoonWidget";

export default async function DashboardPage() {
  // 1. Get today's date boundaries
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  // 2. Get the date for 3 days from now
  const threeDaysFromNow = addDays(todayStart, 3);

  // 3. Fetch data in parallel
  const [expiringSoonItems, todaysMeals] = await Promise.all([
    // Query for items expiring within the next 3 days
    prisma.inventoryItem.findMany({
      where: {
        expiration_date: {
          gte: todayStart, // Greater than or equal to the start of today
          lte: threeDaysFromNow, // Less than or equal to 3 days from now
        },
      },
      orderBy: {
        expiration_date: "asc",
      },
      take: 5, // Limit to the top 5 most urgent items
    }),

    // Query for meals scheduled for today
    prisma.scheduledMeal.findMany({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        recipe: {
          include: {
            ingredients: true, // Crucial for the deduction logic
          },
        },
      },
    }),
  ]);

  return (
    <div className="flex-grow p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Welcome back! Here&apos;s a summary of your kitchen.
      </p>

      {/* Grid for Dashboard Widgets */}
      <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* --- USE THE NEW WIDGET --- */}
        <TodaysMealsWidget todaysMeals={todaysMeals} />

        {/* Placeholder for "Expiring Soon" Widget */}
        <ExpiringSoonWidget items={expiringSoonItems} />

        {/* Other widgets can go here */}
      </div>
    </div>
  );
}
