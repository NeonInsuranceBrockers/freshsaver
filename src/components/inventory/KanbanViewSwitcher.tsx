// /src/components/inventory/KanbanViewSwitcher.tsx

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";
import type { KanbanViewType } from "@/types/inventory";

// Define the component's props
type KanbanViewSwitcherProps = {
  activeView: KanbanViewType;
  onViewChange: (view: KanbanViewType) => void;
};

export default function KanbanViewSwitcher({
  activeView,
  onViewChange,
}: KanbanViewSwitcherProps) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-gray-100 dark:bg-gray-800 p-1">
      <Button
        variant={activeView === "location" ? "default" : "ghost"}
        size="sm"
        className="w-full"
        onClick={() => onViewChange("location")}
      >
        <MapPin className="mr-2 h-4 w-4" />
        View by Location
      </Button>
      <Button
        variant={activeView === "freshness" ? "default" : "ghost"}
        size="sm"
        className="w-full"
        onClick={() => onViewChange("freshness")}
      >
        <Clock className="mr-2 h-4 w-4" />
        View by Freshness
      </Button>
    </div>
  );
}
