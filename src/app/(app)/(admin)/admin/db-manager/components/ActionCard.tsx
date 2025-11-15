// /app/(app)/(admin)/admin/db-manager/components/ActionCard.tsx
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust path if your alias is different
import { Button } from "@/components/ui/button"; // Adjust path
import {
  DatabaseZap,
  Trash2,
  PlayCircle,
  Loader2,
  Terminal,
} from "lucide-react";

// Define the types for the component's props for type safety and clarity
type ActionCardProps = {
  onSeed: () => void;
  onClear: () => void;
  onRunCron: () => void;
  isPending: boolean;
  statusMessage: string;
};

export default function ActionCard({
  onSeed,
  onClear,
  onRunCron,
  isPending,
  statusMessage,
}: ActionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Actions</CardTitle>
        <CardDescription>
          Perform high-level operations on the database. These actions can be
          destructive.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Seed Database Button */}
          <Button onClick={onSeed} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <DatabaseZap className="mr-2 h-4 w-4" />
            )}
            Initialize with Mock Data
          </Button>

          {/* Trigger Cron Job Button */}
          <Button onClick={onRunCron} disabled={isPending} variant="outline">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            Manually Trigger Cron Job
          </Button>

          {/* Clear Database Button */}
          <Button onClick={onClear} disabled={isPending} variant="destructive">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Clear Database
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center text-sm text-muted-foreground">
          <Terminal className="mr-2 h-4 w-4" />
          <p>
            <span className="font-semibold">Status:</span> {statusMessage}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
