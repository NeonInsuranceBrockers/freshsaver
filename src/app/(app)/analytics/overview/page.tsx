import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, TrendingUp, Users, DollarSign } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/auth/session";
import prisma from "@/lib/db/prisma";

export default async function AnalyticsOverviewPage() {
  const user = await getAuthenticatedUser();

  // Fetch the latest analytics snapshot for the user
  const latestSnapshot = await prisma.analyticsSnapshot.findFirst({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  // Fetch user count for the organization
  const activeUsers = await prisma.user.count({
    where: {
      organizationId: user.organizationId,
      status: "ACTIVE",
    },
  });

  // Use snapshot data or defaults
  const totalItems = latestSnapshot?.totalItems || 0;
  const moneySaved = latestSnapshot?.moneySaved || 0;
  const wasteReduction = latestSnapshot?.wasteReduction || 0;
  const itemsExpiringSoon = latestSnapshot?.itemsExpiringSoon || 0;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
        <p className="text-muted-foreground">
          Comprehensive view of your kitchen efficiency metrics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items Tracked</CardTitle>
            <AreaChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {itemsExpiringSoon > 0 ? `${itemsExpiringSoon} expiring soon` : "All items fresh"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${moneySaved.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">By reducing waste</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {user.organizationId ? "Organization members" : "Family members"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Reduction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wasteReduction.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Compared to baseline</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
          <CardDescription>Key findings from your kitchen data</CardDescription>
        </CardHeader>
        <CardContent>
          {latestSnapshot ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Current Performance</p>
                  <p className="text-sm text-muted-foreground">
                    Tracking {totalItems} items with ${moneySaved.toFixed(2)} saved through waste reduction.
                  </p>
                </div>
              </div>
              {itemsExpiringSoon > 0 && (
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg">
                    <AreaChart className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-medium">Attention Needed</p>
                    <p className="text-sm text-muted-foreground">
                      {itemsExpiringSoon} items are expiring soon. Check your inventory to prevent waste.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AreaChart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No analytics data available yet</p>
              <p className="text-sm">Start tracking inventory to see insights</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
