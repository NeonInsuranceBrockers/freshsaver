// /src/app/(app)/(admin)/admin/db-manager/components/DataViewer.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Database,
  SearchX,
} from "lucide-react";

interface DataViewerProps {
  tableNames: string[];
  onSelectTable: (tableName: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: any[] | null;
  viewingTable: string | null;
  isPending: boolean;

  // Scroll Controls
  onScrollLeft: () => void;
  onScrollRight: () => void;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

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
  // Helper to extract headers dynamically from the first object
  const headers =
    tableData && tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <Card className="flex flex-col h-full shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          Data Inspector
        </CardTitle>
        <CardDescription>
          Select a table to view raw records from the server.
        </CardDescription>

        {/* Table Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-4">
          {tableNames.map((name) => (
            <Button
              key={name}
              variant={viewingTable === name ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectTable(name)}
              className="capitalize"
            >
              {name}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 relative min-h-[400px]">
        {/* Loading State */}
        {isPending && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10 backdrop-blur-sm transition-all duration-300">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-2" />
            <p className="text-sm font-medium text-gray-500">
              Fetching data...
            </p>
          </div>
        )}

        {/* Data Display */}
        {tableData ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                Showing {tableData.length} records for{" "}
                <span className="font-bold text-gray-900 dark:text-gray-100 capitalize">
                  {viewingTable}
                </span>
              </span>

              {/* Scroll Controls */}
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onScrollLeft}
                  disabled={!canScrollLeft}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onScrollRight}
                  disabled={!canScrollRight}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border relative">
              {tableData.length > 0 ? (
                <Table>
                  <TableHeader className="bg-gray-50 dark:bg-gray-800">
                    <TableRow>
                      {headers.map((header) => (
                        <TableHead
                          key={header}
                          className="whitespace-nowrap font-bold"
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, idx) => (
                      <TableRow key={idx}>
                        {headers.map((header) => {
                          const val = row[header];
                          let displayVal = val;

                          // Format Date objects
                          if (
                            typeof val === "string" &&
                            !isNaN(Date.parse(val)) &&
                            val.length > 10 &&
                            (val.includes("T") || val.includes("-"))
                          ) {
                            try {
                              displayVal = new Date(val).toLocaleString();
                            } catch { }
                          }
                          // Handle objects/arrays
                          if (typeof val === "object" && val !== null) {
                            displayVal =
                              JSON.stringify(val).substring(0, 50) +
                              (JSON.stringify(val).length > 50 ? "..." : "");
                          }
                          // Handle booleans
                          if (typeof val === "boolean") {
                            displayVal = val ? "True" : "False";
                          }

                          return (
                            <TableCell
                              key={`${idx}-${header}`}
                              className="whitespace-nowrap max-w-[200px] truncate"
                              title={String(val)}
                            >
                              {String(displayVal ?? "")}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <SearchX className="h-10 w-10 mb-2 opacity-50" />
                  <p>No records found in this table.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          // Empty State (Initial)
          <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed rounded-xl m-4">
            <Database className="h-12 w-12 mb-3 opacity-20" />
            <p>Select a table above to view data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
