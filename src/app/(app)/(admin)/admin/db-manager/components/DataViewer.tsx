// /app/(app)/(admin)/admin/db-manager/components/DataViewer.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust path if your alias is different
import { Button } from "@/components/ui/button";
import { Loader2, Table2, ChevronLeft, ChevronRight } from "lucide-react";
import DataTable from "./DataTable"; // Import the DataTable component

// Define the types for the component's props
type DataViewerProps = {
  tableNames: string[];
  onSelectTable: (tableName: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: any[] | null;
  viewingTable: string | null;
  isPending: boolean;
  // New props for scrolling
  onScrollLeft: () => void;
  onScrollRight: () => void;
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

// A helper function to capitalize the first letter of a string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function DataViewer({
  tableNames,
  onSelectTable,
  tableData,
  viewingTable,
  isPending,
  onScrollLeft,
  onScrollRight,
  canScrollLeft,
  canScrollRight,
}: DataViewerProps) {
  // This function determines which content to show below the buttons
  const renderContent = () => {
    // 1. If we are in a pending state (fetching data), show a loading spinner.
    if (isPending) {
      return (
        <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Loading Data...</p>
        </div>
      );
    }

    // 2. If a table is selected and we have data, render the DataTable component.
    if (viewingTable && tableData) {
      return <DataTable data={tableData} />;
    }

    // 3. If no table is selected yet, show a placeholder message.
    return (
      <div className="flex flex-col items-center justify-center text-muted-foreground p-8">
        <Table2 className="h-8 w-8 mb-2" />
        <p>Select a table above to view its content.</p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Data Viewer</CardTitle>
          <CardDescription className="mt-1">
            Select a table to inspect its records. Use the arrows to scroll if
            needed.
          </CardDescription>
        </div>
        {/* NEW: SCROLL BUTTONS */}
        {tableData && tableData.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onScrollLeft}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Scroll Left</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onScrollRight}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Scroll Right</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Button Bar for Table Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tableNames.map((name) => (
            <Button
              key={name}
              onClick={() => onSelectTable(name)}
              // The `variant` changes to highlight the active table
              variant={viewingTable === name ? "default" : "outline"}
              // Disable buttons while an action is in progress to prevent race conditions
              disabled={isPending}
            >
              {`View ${capitalize(name)}`}
            </Button>
          ))}
        </div>

        {/* Conditional Content Area */}
        <div className="min-h-[200px]">{renderContent()}</div>
      </CardContent>
    </Card>
  );
}
