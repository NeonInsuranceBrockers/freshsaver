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
  // We start 'expanded' by default. On mobile, we might want to start 'hidden' ideally,
  // but we can handle that with CSS media queries or a useEffect if needed.
  const [sidebarState, setSidebarState] = useState<SidebarState>("expanded");

  const isHidden = sidebarState === "hidden";
  
  // Dynamic margin classes based on sidebar state, ONLY applied on desktop (md:)
  // On mobile, the sidebar will be an overlay, so no margin is needed.
  const marginClass = {
    expanded: "md:ml-72",
    iconOnly: "md:ml-20",
    hidden: "ml-0",
  }[sidebarState];

  return (
    <>
      {/* 1. Sidebar Component */}
      <AdvancedSidebar
        sidebarState={sidebarState}
        setSidebarState={setSidebarState}
      />

      {/* 2. Main Content Wrapper */}
      {/* 
          - On mobile (default): No margin (sidebar is overlay).
          - On desktop (md:): Apply margin based on sidebar state.
      */}
      <div
        className={cn(
          "flex-1 min-h-screen transition-all duration-300 px-2 pt-16 md:pt-0", // Added pt-16 for mobile header space if needed, or just general padding
          !isHidden && marginClass
        )}
      >
        <main className="max-w-7xl h-screen mx-auto p-4 md:p-6">
          <Providers>{children}</Providers>
        </main>
      </div>

      {/* Renders outside the main flow to ensure it's on top of everything */}
      <NotificationToast />
    </>
  );
}
