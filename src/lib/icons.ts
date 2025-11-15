// src/lib/icons.ts

import * as LucideIcons from "lucide-react";
import { IconName } from "@/types/navigation";

// LucideIcons.Waypoints

// Use the entire set of Lucide icons as the map source
const IconMap: Record<IconName, LucideIcons.LucideIcon | undefined> =
  LucideIcons as never;

// Create a small, internal cache for frequently requested icons
// This prevents repeated lookups in the large IconMap object.
const iconCache = new Map<IconName, LucideIcons.LucideIcon>();

/**
 * Dynamically retrieves a Lucide React component by its name.
 * Utilizes a cache for improved performance on repeated lookups.
 * @param name - The string name of the Lucide icon (e.g., "LayoutDashboard").
 * @returns The LucideIcon component or null if not found.
 */
export const getLucideIcon = (
  name: IconName
): LucideIcons.LucideIcon | null => {
  // 1. Check the cache first
  if (iconCache.has(name)) {
    return iconCache.get(name)!;
  }

  // 2. Look up the component in the main map
  const IconComponent = IconMap[name];

  if (IconComponent) {
    // 3. Store in cache and return
    iconCache.set(name, IconComponent);
    return IconComponent;
  }

  // 4. Handle missing icon
  if (process.env.NODE_ENV !== "production") {
    // Only warn in development to keep production console clean
    console.warn(
      `Icon "${name}" not found in LucideIcons. Check the spelling in the NAV_ITEMS data.`
    );
  }

  return null;
};
