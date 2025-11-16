// app/(app)/dashboard/components/ExecutiveSummary.tsx
import React from "react";
import { KpiCard } from "./ui/KpiCard"; // Client Component
import { DashboardData } from "@/types/dashboard";
import { ShieldAlert, Zap, Package, Link } from "lucide-react";

interface ExecutiveSummaryProps {
  data: DashboardData["systemHealth"] & DashboardData["inventoryOverview"];
}

/**
 * Server Component container for the Critical Status and KPI section (Top Row).
 * Fetches required data slices from props and passes them to client-side KPI cards.
 */
export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data }) => {
  const {
    totalFlows,
    activeFlows,
    connectedCredentials,
    recentNotificationsCount,
    criticalExpiryItems,
    totalItems,
  } = data;

  // Determine the health status message for flows
  const flowHealthRatio =
    totalFlows > 0 ? `${activeFlows}/${totalFlows}` : "0/0";
  const flowHealthDesc =
    activeFlows === totalFlows && totalFlows > 0
      ? "All automations are running smoothly."
      : `${totalFlows - activeFlows} flow(s) are currently inactive.`;

  // Determine the waste risk level
  const criticalRiskCount = criticalExpiryItems.length;
  const wasteRiskDesc =
    criticalRiskCount === 0
      ? "No items expiring in the next 72 hours."
      : `${criticalRiskCount} item(s) require immediate attention.`;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. Critical Waste Risk */}
      <KpiCard
        title="Critical Waste Risk"
        value={criticalRiskCount}
        description={wasteRiskDesc}
        icon="WasteRisk"
        color={criticalRiskCount > 0 ? "red" : "green"}
        // FIXED: Passing serializable string URL instead of a function
        href={
          criticalRiskCount > 0
            ? "/inventory?status=critical-expiry"
            : undefined
        }
      />

      {/* 2. Automation Health (Active Flows) */}
      <KpiCard
        title="Automation Health"
        value={flowHealthRatio}
        description={flowHealthDesc}
        icon="Flows"
        color={
          activeFlows > 0
            ? activeFlows === totalFlows
              ? "blue"
              : "yellow"
            : "red"
        }
        // FIXED: Passing serializable string URL instead of a function
        href="/flows"
      />

      {/* 3. Connection Status */}
      <KpiCard
        title="Connection Status"
        value={connectedCredentials}
        description={`Tracking ${totalItems} inventory item(s).`}
        icon="Connections"
        color={connectedCredentials > 0 ? "green" : "red"}
        // FIXED: Passing serializable string URL instead of a function
        href="/settings/credentials"
      />
      {/* 4. Proactive Interventions (Recent Notifications) */}
      <KpiCard
        title="Recent Interventions"
        value={recentNotificationsCount}
        description={`Alerts sent in the last 24 hours.`}
        icon="Alerts"
        color={recentNotificationsCount > 0 ? "purple" : "gray"}
        // FIXED: Passing serializable string URL instead of a function
        href="/logs/notifications"
      />
    </section>
  );
};
