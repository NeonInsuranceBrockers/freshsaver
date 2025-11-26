// /app/(app)/dashboard/page.tsx

import { getAuthenticatedUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/data/dashboard.data";
import { getFlowsForAudit } from "@/lib/data/flow.data";
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { AutomationAudit } from "./components/AutomationAudit";
import { MealWorkbench } from "./components/MealWorkbench";
import { InventoryDistribution } from "./components/InventoryDistribution";

export default async function DashboardPage() {
  // 1. Secure the page & Identify the Organization
  const user = await getAuthenticatedUser();

  // Safety check: Although getAuthenticatedUser redirects UNAUTHORIZED users,
  // we ensure organizationId is present before querying.
  if (!user.organizationId) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Configuration Error</h2>
        <p>
          Your account is active but not linked to an Organization data store.
        </p>
      </div>
    );
  }

  // 2. Fetch Data Scoped to the User's Organization
  const [dashboardData, flowsForAudit] = await Promise.all([
    getDashboardData(user.organizationId),
    getFlowsForAudit(user.organizationId),
  ]);

  // 3. Destructure data into logical sections
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Command Center</h1>

        {/* Organization Context Indicator */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <span className="mr-2">🏢</span>
          Organization Mode
        </div>
      </div>

      {/* I. Executive Summary: Critical Status & Waste Risk */}
      <ExecutiveSummary data={executiveSummaryData} />

      {/* II. Automation & Performance Audit */}
      <AutomationAudit data={automationAuditData} flows={flowsForAudit} />

      {/* III. Meal Preparation Workbench */}
      <MealWorkbench data={mealPlanningSnapshot} />

      {/* IV. Stock & Inventory Distribution */}
      <InventoryDistribution data={inventoryOverview} />

      <div className="pt-10 text-center text-sm text-gray-500">
        Dashboard rendered for {user.email} at {new Date().toLocaleTimeString()}
        .
      </div>
    </div>
  );
}
