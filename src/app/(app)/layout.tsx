// src/app/(app)/layout.tsx
"use client"; // <-- Must be a client component to use useState

import React, { useState } from "react";
import NotificationToast from "@/components/ui/NotificationToast";
// Import the component that will be created next
import { AdvancedSidebar } from "@/components/layout/AdvancedSidebar";
import { SidebarState } from "@/types/navigation"; // Import the defined type
import { cn } from "@/lib/utils"; // Standard shadcn utility

import "@/lib/cron";

import Providers from "@/components/NProgressProvider";

// Mapping SidebarState to the corresponding margin class for the main content
const mainMarginClasses: Record<SidebarState, string> = {
  expanded: "ml-72", // For a standard wide sidebar (w-72)
  iconOnly: "ml-20", // For a minimized icon-only sidebar (w-20)
  hidden: "ml-0", // When the sidebar is completely hidden
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // 1. State Management for the sidebar size
  // We start 'expanded' by default
  const [sidebarState, setSidebarState] = useState<SidebarState>("expanded");

  const isHidden = sidebarState === "hidden";
  const marginClass = mainMarginClasses[sidebarState];

  return (
    <>
      {/* ✅ RENDER THE WRAPPER INSTEAD */}

      {/* 1. Sidebar Component (Will handle its own fixed positioning) */}
      <AdvancedSidebar
        sidebarState={sidebarState}
        setSidebarState={setSidebarState}
      />

      {/* 2. Main Content Wrapper */}
      {/* Apply dynamic margin and transition for smooth layout changes */}
      <div
        className={cn(
          "flex-1 min-h-screen transition-all duration-300 px-2",
          // Apply margin unless the sidebar is completely hidden
          !isHidden && marginClass
        )}
      >
        <main className="max-w-7xl h-screen mx-auto">
          <Providers>{children}</Providers>
        </main>
      </div>

      {/* Renders outside the main flow to ensure it's on top of everything */}
      <NotificationToast />
    </>
  );
}
