// app/(app)/dashboard/components/ui/KpiCard.tsx
"use client";

import {
  AlertTriangle,
  CheckCircle,
  Zap,
  Package,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import React from "react";

// Define the available icons and their corresponding visual styles
const IconMap = {
  // System & Flow
  Flows: Zap,
  Connections: CheckCircle,
  Alerts: AlertTriangle,

  // Inventory
  Inventory: Package,
  WasteRisk: AlertTriangle,

  // Meal Planning
  Recipes: Utensils,
  Meals: Utensils,
  Grocery: Package,
} as const;

type KpiIcon = keyof typeof IconMap;

interface KpiCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: KpiIcon;
  color?: "green" | "red" | "blue" | "yellow" | "purple" | "gray";
  // Optional click handler for navigating when a KPI is clicked
  href?: string;
}

// Map color prop to Tailwind classes
const colorClasses = {
  green: "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500",
  red: "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500",
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500",
  yellow:
    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500",
  purple:
    "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500",
  gray: "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500",
};

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  description,
  icon,
  color = "blue",
  href, // Use href instead of onClick
}) => {
  const IconComponent = IconMap[icon];
  const baseColorClass = colorClasses[color];

  const content = (
    <div className="flex flex-col p-4 border rounded-xl shadow-sm h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        <IconComponent className="w-5 h-5 opacity-60" />
      </div>

      <div className="grow">
        <p className="text-4xl font-bold">{value}</p>
      </div>

      <p className="text-xs mt-2 opacity-70 truncate">{description}</p>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="cursor-pointer transition-shadow hover:shadow-lg block h-full"
      >
        {content}
      </Link>
    );
  }

  return content;
};
