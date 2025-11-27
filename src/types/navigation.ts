// /src/types/navigation.ts

import * as LucideIcons from "lucide-react";
import { UserRole } from "@prisma/client";

// Utility type to ensure the icon name is a valid Lucide icon string
export type IconName = keyof typeof LucideIcons;

// --- Interfaces for Navigation Data ---

interface BaseNavItem {
  name: string;
  href: string;
  icon: IconName;
  description?: string;
  separator?: boolean;
  // NEW: Optional array of roles allowed to view this item.
  // If undefined, all roles can view it.
  roles?: UserRole[];
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

// --- Navigation Data with Role-Based Access ---

export const NAV_ITEMS: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    name: "Meal Planner",
    href: "/meal-planner",
    icon: "Utensils",
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: "Box",
  },
  {
    name: "Automation",
    href: "/flows",
    icon: "Waypoints",
  },

  // Analytics: Available to everyone (scoped to their access),
  // but we might restrict Export History to Admins if desired later.
  {
    name: "Analytics",
    href: "/analytics",
    icon: "BarChart3",
    collapsible: true,
    subItems: [
      { name: "Overview", href: "/analytics/overview", icon: "AreaChart" },
      { name: "Export History", href: "/analytics/exports", icon: "FileDown" },
    ],
  },

  // Settings: Profile & Credentials for everyone, Team & Billing restricted
  {
    name: "Settings",
    href: "/settings",
    icon: "Settings",
    collapsible: true,
    separator: true,
    subItems: [
      {
        name: "Profile",
        href: "/settings/profile",
        icon: "User",
      },
      {
        name: "Credentials",
        href: "/settings/credentials",
        icon: "Key",
      },
      {
        name: "Team Management",
        href: "/settings/team",
        icon: "Users",
        roles: ["SUPER_ADMIN", "ORG_ADMIN"], // <--- Restricted
      },
      {
        name: "Billing",
        href: "/settings/billing",
        icon: "CreditCard",
        roles: ["SUPER_ADMIN", "ORG_ADMIN"], // <--- Restricted
      },
    ],
  },

  // --- NEW SUPER ADMIN SECTION ---
  {
    name: "System Admin",
    href: "/admin",
    icon: "ShieldAlert",
    separator: true,
    collapsible: true,
    roles: ["SUPER_ADMIN"], // <--- Highly Restricted
    subItems: [
      {
        name: "Organizations",
        href: "/admin/organizations",
        icon: "Building2",
        roles: ["SUPER_ADMIN"],
      },
      {
        name: "DB Manager",
        href: "/admin/db-manager",
        icon: "Database",
        roles: ["SUPER_ADMIN"],
      },
    ],
  },
];

export type SidebarState = "expanded" | "iconOnly" | "hidden";
