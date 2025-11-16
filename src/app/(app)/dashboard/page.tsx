// app/(app)/dashboard/page.tsx
import { getDashboardData } from "@/lib/data/dashboard.data";
import { getFlowsForAudit } from "@/lib/data/flow.data"; // NEW IMPORT
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { AutomationAudit } from "./components/AutomationAudit";
import { MealWorkbench } from "./components/MealWorkbench";
import { InventoryDistribution } from "./components/InventoryDistribution";
// No need to import Flow from @prisma/client anymore here

export default async function DashboardPage() {
  // 1. Fetch ALL required data concurrently
  // Use Promise.all for truly concurrent execution of all independent data fetches
  const [dashboardData, flowsForAudit] = await Promise.all([
    getDashboardData(),
    getFlowsForAudit(),
  ]);

  // 2. Destructure data into logical sections for passing to children
  const {
    systemHealth,
    inventoryOverview,
    automationPerformance,
    mealPlanningSnapshot,
  } = dashboardData;

  // Combine health and inventory data for the Executive Summary
  const executiveSummaryData = {
    ...systemHealth,
    ...inventoryOverview,
  };

  // Combine performance and current near expiry count for the Audit
  const automationAuditData = {
    ...automationPerformance,
    nearExpiryCount: inventoryOverview.nearExpiryCount,
  };

  return (
    <div className="space-y-10 py-6">
      <h1 className="text-3xl font-bold">Automated Kitchen Command Center</h1>

      {/* I. Executive Summary: Critical Status & Waste Risk */}
      <ExecutiveSummary data={executiveSummaryData} />

      {/* II. Automation & Performance Audit */}
      <AutomationAudit
        data={automationAuditData}
        flows={flowsForAudit} // Use the robustly fetched flow data
      />

      {/* III. Meal Preparation Workbench */}
      <MealWorkbench data={mealPlanningSnapshot} />

      {/* IV. Stock & Inventory Distribution */}
      <InventoryDistribution data={inventoryOverview} />

      <div className="pt-10 text-center text-sm text-gray-500">
        Dashboard rendered as a Server Component at{" "}
        {new Date().toLocaleTimeString()}.
      </div>
    </div>
  );
}
