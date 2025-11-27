import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Download } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";
import { format } from "date-fns";

export default async function ExportsPage() {
  const user = await getAuthenticatedUser();

  // Fetch exports for the current user
  const exports = await prisma.dataExport.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10, // Show last 10 exports
  });

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
          {exports.length > 0 ? (
            <div className="space-y-4">
              {exports.map((exp) => (
                <div key={exp.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{exp.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(exp.createdAt, "MMM d, yyyy")} • {exp.size} • {exp.format}
                    </p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                      exp.status === "COMPLETED" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : exp.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {exp.status}
                    </span>
                  </div>
                  {exp.downloadUrl && exp.status === "COMPLETED" ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={exp.downloadUrl} download>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <Download className="h-4 w-4 mr-2" />
                      {exp.status === "PENDING" ? "Processing..." : "Unavailable"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileDown className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No exports yet</p>
              <p className="text-sm">Create your first data export to get started</p>
            </div>
          )}
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
