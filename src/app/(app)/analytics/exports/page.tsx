import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Download } from "lucide-react";

export default function ExportsPage() {
  const exports = [
    { id: 1, name: "Inventory Report - January 2025", date: "2025-01-15", size: "2.4 MB", format: "CSV" },
    { id: 2, name: "Waste Analysis - Q4 2024", date: "2024-12-31", size: "1.8 MB", format: "PDF" },
    { id: 3, name: "Recipe History - 2024", date: "2024-12-01", size: "3.2 MB", format: "JSON" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Export History</h1>
          <p className="text-muted-foreground">
            Download and manage your exported data files.
          </p>
        </div>
        <Button>
          <FileDown className="h-4 w-4 mr-2" />
          New Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
          <CardDescription>Your exported data files from the last 90 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {exports.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{exp.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {exp.date} • {exp.size} • {exp.format}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Available data export formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">CSV</h3>
              <p className="text-sm text-muted-foreground">Spreadsheet-compatible format for data analysis</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">PDF</h3>
              <p className="text-sm text-muted-foreground">Formatted reports ready for printing</p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-semibold mb-2">JSON</h3>
              <p className="text-sm text-muted-foreground">Raw data for API integration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
