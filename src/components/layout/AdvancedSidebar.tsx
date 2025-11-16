// src/components/layout/AdvancedSidebar.tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  Menu,
  LogOut,
  LucideIcon,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarItem,
  NavCollapsibleItem,
  NavItem,
  NAV_ITEMS,
  SidebarState,
} from "@/types/navigation";
import { getLucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

// Utility to manage fixed width classes for the sidebar container
const widthClasses: Record<SidebarState, string> = {
  expanded: "w-72 px-4",
  iconOnly: "w-20 px-2",
  hidden: "w-0 p-0",
};

// --- Component 1: Individual Link Item ---

interface SidebarLinkProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  IconComponent: LucideIcon;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  item,
  isActive,
  isExpanded,
  IconComponent,
}) => {
  // All hooks (if any) are called here unconditionally. None needed for this link.

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center space-x-3 py-2.5 rounded-lg transition-colors duration-200 group relative",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        // Styling based on expansion state
        isExpanded ? "px-3" : "justify-center w-full px-0"
      )}
      // Add title for better accessibility in icon-only mode
      title={item.name}
    >
      <IconComponent
        className={cn("h-5 w-5 flex-shrink-0", isExpanded ? "" : "mx-auto")}
      />
      {isExpanded && (
        <span className="font-medium whitespace-nowrap text-sm truncate">
          {item.name}
        </span>
      )}

      {/* ADVANCED: Tooltip for iconOnly state */}
      {!isExpanded && (
        <span
          className="absolute left-full ml-4 hidden group-hover:block px-3 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg z-50 whitespace-nowrap dark:bg-gray-700"
          role="tooltip"
        >
          {item.name}
        </span>
      )}
    </Link>
  );
};

// --- Component 2: Collapsible Menu Item ---

interface SidebarCollapsibleProps {
  item: NavCollapsibleItem;
  currentPath: string;
  isExpanded: boolean;
}

const SidebarCollapsible: React.FC<SidebarCollapsibleProps> = ({
  item,
  currentPath,
  isExpanded,
}) => {
  // Hook 1: Determine if the group contains the active route
  const isGroupActive = useMemo(
    () => item.subItems.some((sub) => currentPath.startsWith(sub.href)),
    [currentPath, item.subItems]
  );

  // Hook 2: Manage the collapsible open state (MUST be called unconditionally)
  const [isOpen, setIsOpen] = useState(isGroupActive);

  // Hook 3: Ensure collapsible state syncs if a subitem becomes active (e.g., direct link navigation)
  React.useEffect(() => {
    if (isGroupActive) {
      setIsOpen(true);
    }
  }, [isGroupActive]);

  const IconComponent = getLucideIcon(item.icon);
  if (!IconComponent) return null; // Safe early return

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-1 group"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex w-full items-center justify-between py-2.5 transition-colors duration-200 h-auto",
            isExpanded ? "px-3" : "justify-center w-full h-10",
            isGroupActive
              ? "bg-accent/70 text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/50"
          )}
          // Disable trigger interaction when minimized (rely on tooltip for label)
          disabled={!isExpanded}
          title={item.name}
        >
          <div
            className={cn(
              "flex items-center space-x-3",
              isExpanded ? "" : "mx-auto"
            )}
          >
            <IconComponent className="h-5 w-5 flex-shrink-0" />
            {isExpanded && (
              <span className="font-medium text-sm truncate">{item.name}</span>
            )}
          </div>

          {isExpanded && (
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "-rotate-90"
              )}
            />
          )}

          {/* ADVANCED: Tooltip for iconOnly state */}
          {!isExpanded && (
            <span
              className="absolute left-full ml-4 hidden group-hover:block px-3 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg z-50 whitespace-nowrap dark:bg-gray-700"
              role="tooltip"
            >
              {item.name}
            </span>
          )}
        </Button>
      </CollapsibleTrigger>

      {/* ADVANCED: Only render Collapsible Content when Expanded */}
      {isExpanded && (
        <CollapsibleContent className="pl-6 space-y-1 mt-1">
          {item.subItems.map((subItem) => {
            const SubIcon = getLucideIcon(subItem.icon) as LucideIcon;
            return (
              <SidebarLink
                key={subItem.name}
                item={subItem}
                isActive={currentPath === subItem.href}
                isExpanded={true} // Sub-links are always fully labeled
                IconComponent={SubIcon}
              />
            );
          })}
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

// --- Component 3: Main Advanced Sidebar ---

interface AdvancedSidebarProps {
  sidebarState: SidebarState;
  setSidebarState: React.Dispatch<React.SetStateAction<SidebarState>>;
}

export function AdvancedSidebar({
  sidebarState,
  setSidebarState,
}: AdvancedSidebarProps) {
  // Hooks called unconditionally (NONE NEEDED INTERNALLY, state is from props)
  const pathname = usePathname();

  const isExpanded = sidebarState === "expanded";
  const isIconOnly = sidebarState === "iconOnly";
  const isHidden = sidebarState === "hidden";

  // State Cycling Logic: Expanded -> IconOnly -> Hidden -> Expanded
  const cycleState = () => {
    if (isExpanded) setSidebarState("iconOnly");
    else if (isIconOnly) setSidebarState("hidden");
    else setSidebarState("expanded"); // From hidden state
  };

  // --- Conditional Rendering for the 'Hidden' State ---
  // We return early here. Since no hooks were called above, this is safe.
  if (isHidden) {
    return (
      <div className="fixed top-4 left-4 z-[100] transition-all duration-300">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setSidebarState("expanded")}
          className="rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90"
          title="Open Sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  // --- Render for 'Expanded' or 'IconOnly' State ---
  /**
   * Handles the client-side logout process by destroying the authentication cookie.
   *
   * NOTE: This relies on client-side JavaScript access to delete the cookie.
   * In production, it is generally safer to trigger a server action/API route
   * to handle cookie deletion with secure headers (as shown in the previous answer).
   */
  function handleLogout() {
    // 1. Set the cookie's expiration date to a time in the past, effectively deleting it.
    // We use 'freshsaver-session' to match the middleware.
    // The 'path=/' and domain must match the original cookie that was set.
    document.cookie =
      "freshsaver-session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC";

    // 2. Refresh or redirect the user.
    // We use window.location.href to force a full page refresh, which triggers the middleware.
    window.location.href = "/login";
  }
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen bg-card border-r shadow-2xl transition-all duration-300 z-40 flex flex-col",
        widthClasses[sidebarState],
        // ADVANCED: Allows hover scrolling when iconOnly without constant scrollbar
        isIconOnly && "overflow-y-hidden hover:overflow-y-auto"
      )}
    >
      {/* Header/Logo Section */}
      <div
        className={cn(
          "h-16 flex items-center border-b",
          isExpanded ? "justify-start px-3" : "justify-center"
        )}
      >
        {isExpanded ? (
          <h1 className="text-xl font-bold tracking-tight text-primary">
            SaaS App
          </h1>
        ) : (
          <span className="text-xl font-bold text-primary">S</span>
        )}
      </div>

      {/* Navigation Links (Scrollable) */}
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            if (item.collapsible) {
              return (
                <React.Fragment key={item.name}>
                  {item.separator && (
                    <div className="h-px bg-border my-4 mx-2" />
                  )}
                  <SidebarCollapsible
                    item={item as NavCollapsibleItem}
                    currentPath={pathname}
                    isExpanded={isExpanded}
                  />
                </React.Fragment>
              );
            }

            const IconComponent = getLucideIcon(item.icon);
            if (!IconComponent) return null;

            return (
              <React.Fragment key={item.name}>
                {item.separator && <div className="h-px bg-border my-4 mx-2" />}
                <SidebarLink
                  item={item as NavItem}
                  isActive={pathname === item.href}
                  isExpanded={isExpanded}
                  IconComponent={IconComponent}
                />
              </React.Fragment>
            );
          })}
        </div>
        {/* Padding for scroll area bottom */}
        <div className="h-10" />
      </ScrollArea>

      {/* Footer / Logout / Retraction Control */}
      <div
        className={cn(
          "p-4 border-t sticky bottom-0 bg-card z-50 transition-all duration-300",
          isExpanded ? "space-y-2" : "flex flex-col items-center space-y-3"
        )}
      >
        {/* User/Logout Action */}
        <Button
          variant="ghost"
          className={cn(
            "w-full transition-colors h-10",
            isExpanded
              ? "justify-start px-3"
              : "justify-center w-10 p-0 rounded-full"
          )}
          title={isExpanded ? "Logout" : "Logout"}
          onClick={() => handleLogout()}
        >
          <LogOut className="h-5 w-5" />
          {isExpanded && <span className="ml-3 text-sm">Logout</span>}
        </Button>

        {/* Retraction Control Button */}
        <Button
          variant="secondary"
          className={cn(
            "mt-3 transition-all duration-300 shadow-md",
            isExpanded ? "w-full justify-end" : "w-10 h-10 p-0 rounded-full"
          )}
          onClick={cycleState}
          title={
            isExpanded
              ? "Minimize Menu"
              : isIconOnly
              ? "Hide Menu"
              : "Expand Menu"
          }
        >
          {isExpanded ? (
            <>
              <span className="mr-2 text-sm font-medium">Minimize</span>
              <ChevronLeft className="h-5 w-5" />
            </>
          ) : isIconOnly ? (
            <ChevronLeft className="h-5 w-5" /> // Cycles to Hidden
          ) : (
            <ChevronRight className="h-5 w-5" /> // Should not run here, handled by early return
          )}
        </Button>
      </div>
    </aside>
  );
}
