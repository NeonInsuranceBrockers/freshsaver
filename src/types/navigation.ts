// src/types/navigation.ts

import * as LucideIcons from "lucide-react";

// Utility type to ensure the icon name is a valid Lucide icon string
export type IconName = keyof typeof LucideIcons;

// --- Interfaces for Navigation Data ---

interface BaseNavItem {
  name: string;
  href: string;
  icon: IconName;
  description?: string; // Optional advanced property
  separator?: boolean; // Optional visual separator
}

// 1. Regular Nav Item
export interface NavItem extends BaseNavItem {
  collapsible?: false;
}

// 2. Collapsible Group (Menu)
export interface NavCollapsibleItem extends BaseNavItem {
  collapsible: true;
  subItems: NavItem[];
}

export type SidebarItem = NavItem | NavCollapsibleItem;

// --- Example Navigation Data ---

export const NAV_ITEMS: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: "Box",
  },
  {
    name: "MealPlanner",
    href: "/meal-planner",
    icon: "Soup",
  },
  {
    name: "Flows",
    href: "/flows",
    icon: "Waypoints",
  },
  {
    name: "Analytics & Reports",
    href: "/analytics",
    icon: "BarChart3",
    collapsible: true,
    subItems: [
      { name: "Overview", href: "/analytics/overview", icon: "AreaChart" },
      { name: "Real-time Data", href: "/analytics/realtime", icon: "Activity" },
      { name: "Export History", href: "/analytics/exports", icon: "FileDown" },
    ],
  },
  {
    name: "Users & Teams",
    href: "/users",
    icon: "Users",
  },
  {
    name: "API Keys",
    href: "/api",
    icon: "Key",
    separator: true, // Separator added before this item
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "Settings",
    collapsible: true,
    subItems: [
      { name: "General", href: "/settings/general", icon: "Wrench" },
      { name: "Billing", href: "/settings/billing", icon: "CreditCard" },
      { name: "Notifications", href: "/settings/notifications", icon: "Bell" },
    ],
  },
];

// --- Sidebar State Management Type ---
export type SidebarState = "expanded" | "iconOnly" | "hidden";
