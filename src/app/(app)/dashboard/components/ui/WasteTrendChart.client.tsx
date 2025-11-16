// app/(app)/dashboard/components/ui/WasteTrendChart.client.tsx
"use client";

import React, { useMemo } from "react";
import { LineChart, BarChart, TrendingUp, Bell } from "lucide-react";
import { format } from "date-fns";

interface WasteTrendChartProps {
  notificationsLast30Days: number;
  // Array of objects containing just the timestamp for plotting the trend
  allNotificationLogs: { sentAt: Date }[];
  nearExpiryCount: number; // Current critical KPI for context
}

// Map the raw logs into daily counts for the last 30 days
const processLogData = (logs: { sentAt: Date }[]): Record<string, number> => {
  const today = new Date();
  const data: Record<string, number> = {};

  // Initialize the last 30 days with a count of 0
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data[format(date, "yyyy-MM-dd")] = 0;
  }

  // Populate counts based on logs
  logs.forEach((log) => {
    const key = format(new Date(log.sentAt), "yyyy-MM-dd");
    if (data.hasOwnProperty(key)) {
      data[key] += 1;
    }
  });

  return data;
};

export const WasteTrendChart: React.FC<WasteTrendChartProps> = ({
  notificationsLast30Days,
  allNotificationLogs,
  nearExpiryCount,
}) => {
  const dailyData = useMemo(
    () => processLogData(allNotificationLogs),
    [allNotificationLogs]
  );
  const chartData = useMemo(() => {
    // Convert map to array for display, sorted oldest to newest
    return Object.keys(dailyData)
      .sort()
      .map((date) => ({
        date: format(new Date(date), "MMM d"),
        count: dailyData[date],
      }));
  }, [dailyData]);

  const maxCount = Math.max(...chartData.map((d) => d.count), 1); // Avoid division by zero

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-gray-900 shadow">
      <h4 className="flex items-center text-lg font-semibold mb-3">
        <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
        Waste Reduction Intervention Trend
      </h4>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <p>
          <span className="text-2xl font-bold block text-blue-600">
            {notificationsLast30Days}
          </span>
          Total Alerts Sent (30 Days)
        </p>
        <p>
          <span
            className={`text-2xl font-bold block ${
              nearExpiryCount > 5 ? "text-red-500" : "text-green-500"
            }`}
          >
            {nearExpiryCount}
          </span>
          Items Currently NEAR_EXPIRY
        </p>
      </div>

      {/* Simplified Chart Area */}
      <div className="relative h-40 flex items-end border-b border-l pb-1">
        {chartData.map((day, index) => {
          // Calculate bar height based on max count
          const heightPercent = (day.count / maxCount) * 95; // 95% to leave some margin

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end h-full w-1/30 px-px"
              title={`Date: ${day.date}, Alerts: ${day.count}`}
            >
              <div
                className="w-full bg-purple-400 hover:bg-purple-600 transition-colors duration-150 rounded-t-sm"
                style={{ height: `${heightPercent}%` }}
              ></div>
            </div>
          );
        })}
      </div>

      {/* X-Axis Labels (Only show first, middle, last for clarity) */}
      <div className="flex justify-between text-xs text-gray-500 pt-1">
        <span>{chartData[0]?.date || "30 Days Ago"}</span>
        <span>{chartData[Math.floor(chartData.length / 2)]?.date}</span>
        <span>Today</span>
      </div>
    </div>
  );
};
