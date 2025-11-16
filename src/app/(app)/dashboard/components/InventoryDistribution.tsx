// app/(app)/dashboard/components/InventoryDistribution.tsx
import React from "react";
import { DashboardData } from "@/types/dashboard";
import { LocationCategoryChart } from "./ui/LocationCategoryChart.client"; // Client Chart
import { CriticalExpiryList } from "./ui/CriticalExpiryList.client"; // Client List
import { Archive, AlertTriangle } from "lucide-react";

interface InventoryDistributionProps {
  data: DashboardData["inventoryOverview"];
}

/**
 * Server Component container for Stock & Inventory Distribution (Section V).
 * Manages the visualization and critical item list.
 */
export const InventoryDistribution: React.FC<InventoryDistributionProps> = ({
  data,
}) => {
  const {
    totalItems,
    itemsByCategory,
    itemsByLocation,
    criticalExpiryItems,
    nearExpiryCount,
  } = data;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold border-b pb-2 dark:border-gray-700">
        Stock & Inventory Distribution
      </h2>

      {/* Row 1: Visualization Panel (Location/Category Charts) */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
        <LocationCategoryChart
          itemsByLocation={itemsByLocation}
          itemsByCategory={itemsByCategory}
          totalItems={totalItems}
        />
      </div>

      {/* Row 2: Critical Expiry List & Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Column 1: Inventory Summary Table (KPI/Text Summary) */}
        <div className="lg:col-span-1 p-4 border rounded-xl bg-white dark:bg-gray-900 shadow">
          <h4 className="flex items-center text-lg font-semibold mb-3">
            <Archive className="w-5 h-5 mr-2 text-gray-500" />
            Inventory Summary
          </h4>

          <ul className="space-y-2 text-sm">
            <li className="flex justify-between border-b pb-1">
              <span className="font-medium">Total Unique Items:</span>
              <span className="font-bold text-lg">{totalItems}</span>
            </li>
            <li className="flex justify-between border-b pb-1">
              <span className="font-medium">NEAR_EXPIRY Items:</span>
              <span
                className={`font-bold ${
                  nearExpiryCount > 0 ? "text-yellow-600" : "text-green-600"
                }`}
              >
                {nearExpiryCount}
              </span>
            </li>

            {/* Show top category */}
            {itemsByCategory.length > 0 && (
              <li className="flex justify-between pt-1">
                <span className="font-medium text-gray-500">
                  Highest Stock Category:
                </span>
                <span className="font-semibold">
                  {itemsByCategory[0].category} ({itemsByCategory[0].count})
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Column 2/3: Critical Expiry List (Client Component) */}
        <div className="lg:col-span-2 p-4 border rounded-xl bg-white dark:bg-gray-900 shadow">
          <h4 className="flex items-center text-lg font-semibold mb-3">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            Critical Expiry Alerts (Top 5)
          </h4>
          <CriticalExpiryList items={criticalExpiryItems} />
        </div>
      </div>
    </section>
  );
};
