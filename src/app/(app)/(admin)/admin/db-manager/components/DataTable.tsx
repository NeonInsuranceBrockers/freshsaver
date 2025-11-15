// /app/(app)/(admin)/admin/db-manager/components/DataTable.tsx
"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";

type DataTableProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] | null;
};

const formatHeader = (header: string) => {
  const result = header.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default function DataTable({ data }: DataTableProps) {
  if (!data) {
    return null;
  }

  if (data.length === 0) {
    return (
      <div className="mt-4 rounded-lg border">
        <Table>
          <TableCaption>No records found in this table.</TableCaption>
        </Table>
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    // MODIFIED: This is the container that will have the scrollbar.
    // `overflow-x-auto` specifically enables horizontal scrolling.
    // `max-h-[60vh]` is for vertical scrolling on long tables.
    <div className="mt-4 rounded-lg border w-full overflow-x-auto max-h-[60vh]">
      {/* MODIFIED: The table is now forced to have a minimum width. */}
      {/* This is the key to forcing the overflow on small screens. */}
      {/* Adjust `min-w-[800px]` as needed for your data. */}
      <Table className="min-w-[800px]">
        <TableCaption>A list of records from the selected table.</TableCaption>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{formatHeader(header)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header) => {
                const value = row[header];
                let displayValue;

                if (typeof value === "boolean") {
                  displayValue = value ? "Yes" : "No";
                } else if (value instanceof Date) {
                  displayValue = value.toLocaleString();
                } else if (typeof value === "object" && value !== null) {
                  displayValue = (
                    <pre className="text-xs bg-muted p-2 rounded max-w-full overflow-auto">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  );
                } else {
                  // Ensure null/undefined values are displayed as empty strings
                  displayValue = value ?? "";
                }

                // We can still use truncate for better scanning, but it's optional
                const isString = typeof value === "string" && value.length > 50;

                return (
                  <TableCell
                    key={header}
                    className={isString ? "max-w-[250px] truncate" : ""}
                    title={typeof value === "string" ? value : undefined}
                  >
                    {displayValue}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
