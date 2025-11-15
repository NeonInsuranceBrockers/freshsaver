// /lib/cron.ts
"use server"; // Mark this as a server-only module

import cron from "node-cron";
import { findAndExecuteActiveFlows } from "@/lib/server/flowEngine";

console.log("[Cron] Setting up the background job...");

// Schedule a task to run every 5 minutes.
// You can change the schedule string as needed.
// Examples:
// '*/5 * * * *'  - Every 5 minutes
// '0 * * * *'    - Every hour, at the start of the hour
cron.schedule("*/5 * * * *", async () => {
  console.log(`[Cron] Running scheduled job at ${new Date().toISOString()}`);

  try {
    const result = await findAndExecuteActiveFlows();
    console.log(`[Cron] Job finished. ${result.message}`);
  } catch (error) {
    console.error("[Cron] An error occurred during the scheduled job:", error);
  }
});

console.log("[Cron] Background job scheduled successfully.");
