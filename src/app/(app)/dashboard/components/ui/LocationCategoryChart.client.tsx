// app/(app)/dashboard/components/ui/LocationCategoryChart.client.tsx
"use client";

import React, { useMemo } from "react";
import { AggregationCount, LocationCount } from "@/types/dashboard";
import { Refrigerator, CookingPot, Package, BarChart } from "lucide-react";

interface LocationCategoryChartProps {
  itemsByLocation: LocationCount[];
  itemsByCategory: AggregationCount[];
  totalItems: number;
}

// Simple color map for consistency
const CHART_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
];

/**
 * Renders a stylized horizontal bar chart for a given data set.
 */
const ChartRenderer: React.FC<{
  data: { name: string; count: number }[];
  total: number;
}> = ({ data, total }) => {
  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = total > 0 ? (item.count / total) * 100 : 0;
        const color = CHART_COLORS[index % CHART_COLORS.length];

        return (
          <div key={item.name} className="flex items-center space-x-2">
            <span className="w-20 text-sm font-medium truncate opacity-80">
              {item.name}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-3.5 dark:bg-gray-700">
              <div
                className={`${color} h-3.5 rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
                title={`${item.count} items (${percentage.toFixed(0)}%)`}
              ></div>
            </div>
            <span className="text-xs font-semibold">{item.count}</span>
          </div>
        );
      })}
    </div>
  );
};

export const LocationCategoryChart: React.FC<LocationCategoryChartProps> = ({
  itemsByLocation,
  itemsByCategory,
  totalItems,
}) => {
  // Sort and prepare data for display
  const sortedLocations = useMemo(
    () => itemsByLocation.sort((a, b) => b.count - a.count),
    [itemsByLocation]
  );

  const sortedCategories = useMemo(
    () => itemsByCategory.sort((a, b) => b.count - a.count),
    [itemsByCategory]
  );

  if (totalItems === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <BarChart className="w-8 h-8 mx-auto mb-2" />
        <p>No inventory data to visualize yet.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Location Breakdown */}
      <div className="border p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center mb-4 text-lg font-semibold">
          <Refrigerator className="w-5 h-5 mr-2 text-blue-600" />
          Location Breakdown
        </div>
        <ChartRenderer
          data={sortedLocations.map((l) => ({
            name: l.location,
            count: l.count,
          }))}
          total={totalItems}
        />
      </div>

      {/* Category Breakdown */}
      <div className="border p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center mb-4 text-lg font-semibold">
          <Package className="w-5 h-5 mr-2 text-green-600" />
          Items by Category
        </div>
        <ChartRenderer
          data={sortedCategories.map((c) => ({
            name: c.category,
            count: c.count,
          }))}
          total={totalItems}
        />
      </div>
    </div>
  );
};
