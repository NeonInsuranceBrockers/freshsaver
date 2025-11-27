// /src/components/layout/AdvancedSidebar.tsx
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
  NavCollapsibleItem,
  NavItem,
  NAV_ITEMS,
  SidebarState,
  SidebarItem,
} from "@/types/navigation";
import { getLucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { UserRole } from "@prisma/client";

// Utility to manage fixed width classes for the sidebar container
const widthClasses: Record<SidebarState, string> = {
  expanded: "w-72 px-4",
  iconOnly: "w-20 px-2",
  hidden: "w-0 p-0",
};

/**
 * RECURSIVE FILTER:
 * 1. Checks if the item requires specific roles.
 * 2. If it's a group, recursively filters its sub-items.
 * 3. If a group ends up empty after filtering, it is removed entirely.
 */
function filterNavItems(
  items: SidebarItem[],
  userRole?: string
): SidebarItem[] {
  return items
    .filter((item) => {
      // If roles are defined on the item, check if user has one of them
      if (item.roles && item.roles.length > 0) {
        if (!userRole) return false;
        if (!item.roles.includes(userRole as UserRole)) return false;
      }
      return true;
    })
    .map((item) => {
      // If it is a collapsible item, recurse into subItems
      if (item.collapsible) {
        const filteredSubItems = filterNavItems(
          item.subItems,
          userRole
        ) as NavItem[];
        return { ...item, subItems: filteredSubItems };
      }
      return item;
    })
    .filter((item) => {
      // Remove groups that became empty after filtering sub-items
      if (item.collapsible && item.subItems.length === 0) {
        return false;
      }
      return true;
    });
}

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
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center space-x-3 py-2.5 rounded-lg transition-colors duration-200 group relative",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        isExpanded ? "px-3" : "justify-center w-full px-0"
      )}
      title={item.name}
    >
      <IconComponent
        className={cn("h-5 w-5 shrink-0", isExpanded ? "" : "mx-auto")}
      />
      {isExpanded && (
        <span className="font-medium whitespace-nowrap text-sm truncate">
          {item.name}
        </span>
      )}
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
  const isGroupActive = useMemo(
    () => item.subItems.some((sub) => currentPath.startsWith(sub.href)),
    [currentPath, item.subItems]
  );

  const [isOpen, setIsOpen] = useState(isGroupActive);

  React.useEffect(() => {
    if (isGroupActive) {
      setIsOpen(true);
    }
  }, [isGroupActive]);

  const IconComponent = getLucideIcon(item.icon);
  if (!IconComponent) return null;

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

      {isExpanded && (
        <CollapsibleContent className="pl-6 space-y-1 mt-1">
          {item.subItems.map((subItem) => {
            const SubIcon = getLucideIcon(subItem.icon) as LucideIcon;
            return (
              <SidebarLink
                key={subItem.name}
                item={subItem}
                isActive={currentPath === subItem.href}
                isExpanded={true}
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
  userRole?: string; // NEW PROP: Role string (e.g., "SUPER_ADMIN")
}

export function AdvancedSidebar({
  sidebarState,
  setSidebarState,
  userRole,
}: AdvancedSidebarProps) {
  const pathname = usePathname();

  const isExpanded = sidebarState === "expanded";
  const isIconOnly = sidebarState === "iconOnly";
  const isHidden = sidebarState === "hidden";

  // Filter Items based on Role using useMemo for performance
  const filteredItems = useMemo(
    () => filterNavItems(NAV_ITEMS, userRole),
    [userRole]
  );

  const cycleState = () => {
    if (isExpanded) setSidebarState("iconOnly");
    else if (isIconOnly) setSidebarState("hidden");
    else setSidebarState("expanded");
  };

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

  function handleLogout() {
    // Basic clearing of fallback session cookie.
    // In a real Clerk app, utilize <SignOutButton> or useClerk().signOut()
    document.cookie =
      "freshsaver-session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    window.location.href = "/login";
  }

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300",
          isHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        onClick={() => setSidebarState("hidden")}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border shadow-2xl transition-all duration-300 z-40 flex flex-col",
          widthClasses[sidebarState],
          "md:translate-x-0",
          isIconOnly && "overflow-y-hidden hover:overflow-y-auto"
        )}
      >
        <div
          className={cn(
            "h-16 flex items-center border-b border-sidebar-border bg-sidebar",
            isExpanded ? "justify-between px-4" : "justify-center"
          )}
        >
          {isExpanded ? (
            <>
              <Link href="/dashboard" className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-primary">
                  FreshSaver
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarState("hidden")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <span className="text-xl font-bold text-primary">FS</span>
          )}
        </div>

        <ScrollArea className="flex-1 py-4">
          <div className="space-y-1 px-2">
            {filteredItems.map((item) => {
              if (item.collapsible) {
                return (
                  <React.Fragment key={item.name}>
                    {item.separator && (
                      <div className="h-px bg-sidebar-border my-4 mx-2" />
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
                  {item.separator && (
                    <div className="h-px bg-sidebar-border my-4 mx-2" />
                  )}
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
          <div className="h-10" />
        </ScrollArea>

        <div
          className={cn(
            "p-4 border-t border-sidebar-border sticky bottom-0 bg-sidebar z-50 transition-all duration-300",
            isExpanded ? "space-y-2" : "flex flex-col items-center space-y-3"
          )}
        >
          <Button
            variant="ghost"
            className={cn(
              "w-full transition-colors h-10 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isExpanded
                ? "justify-start px-3"
                : "justify-center w-10 p-0 rounded-full"
            )}
            title="Logout"
            onClick={() => handleLogout()}
          >
            <LogOut className="h-5 w-5" />
            {isExpanded && <span className="ml-3 text-sm">Logout</span>}
          </Button>

          <Button
            variant="secondary"
            className={cn(
              "mt-3 transition-all duration-300 shadow-sm hidden md:flex",
              isExpanded ? "w-full justify-end" : "w-10 h-10 p-0 rounded-full"
            )}
            onClick={cycleState}
            title={isExpanded ? "Minimize" : "Expand"}
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5" />
            ) : isIconOnly ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
