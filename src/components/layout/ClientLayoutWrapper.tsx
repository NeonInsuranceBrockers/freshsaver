// /src/components/layout/ClientLayoutWrapper.tsx
"use client";

import React, { useState, useEffect } from "react";
import { AdvancedSidebar } from "@/components/layout/AdvancedSidebar";
import { SidebarState } from "@/types/navigation";
import { cn } from "@/lib/utils";

// Utility to match the margin-left of the main content with the sidebar width
const marginClasses: Record<SidebarState, string> = {
  expanded: "md:ml-72",
  iconOnly: "md:ml-20",
  hidden: "md:ml-0",
};

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  userRole?: string; // NEW PROP: Role passed from server layout
}

export default function ClientLayoutWrapper({
  children,
  userRole,
}: ClientLayoutWrapperProps) {
  // Initialize sidebar state from local storage or default to 'expanded'
  const [sidebarState, setSidebarState] = useState<SidebarState>("expanded");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Optional: Load saved state from localStorage here
    const savedState = localStorage.getItem("sidebarState") as SidebarState;
    if (savedState) setSidebarState(savedState);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("sidebarState", sidebarState);
    }
  }, [sidebarState, isMounted]);

  // Prevent hydration mismatch by rendering a consistent initial state or nothing until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* 1. Pass the userRole to the Sidebar */}
      <AdvancedSidebar
        sidebarState={sidebarState}
        setSidebarState={setSidebarState}
        userRole={userRole}
      />

      {/* 2. Adjust Main Content Margin based on Sidebar State */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out p-4 md:p-8 overflow-x-hidden w-full",
          marginClasses[sidebarState]
        )}
      >
        <div className="max-w-7xl mx-auto h-full flex flex-col">{children}</div>
      </main>
    </div>
  );
}
