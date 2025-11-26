"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";

export default function AnalyticsPage() {
  // Mock Data
  const wasteCost = 45.50;
  const savedCost = 120.00;
  const wasteTrend = -12; // 12% decrease
  const savedTrend = 8; // 8% increase

  const mostWastedItems = [
    { name: "Spinach", quantity: "2 bags", cost: 8.00 },
    { name: "Milk", quantity: "0.5 gal", cost: 3.50 },
    { name: "Bananas", quantity: "4 count", cost: 1.20 },
  ];

  const categoryBreakdown = [
    { name: "Produce", value: 60, color: "bg-green-500" },
    { name: "Dairy", value: 25, color: "bg-blue-500" },
    { name: "Meat", value: 15, color: "bg-red-500" },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your kitchen efficiency and waste reduction progress.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Waste Cost (Mo)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${wasteCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">{Math.abs(wasteTrend)}%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estimated Savings (Mo)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${savedCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">{savedTrend}%</span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Most Wasted Items */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Most Wasted Items</CardTitle>
            <CardDescription>
              Top items contributing to your waste cost this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mostWastedItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted/50 mr-4">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity}</p>
                  </div>
                  <div className="font-medium text-destructive">
                    -${item.cost.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown (Simple Bar Chart) */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Waste by Category</CardTitle>
            <CardDescription>
              Breakdown of waste sources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((category, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{category.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color}`}
                      style={{ width: `${category.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
