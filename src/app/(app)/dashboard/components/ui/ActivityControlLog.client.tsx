// app/(app)/dashboard/components/ui/ActivityControlLog.client.tsx
"use client";

import React, { useTransition } from "react";
import { Flow } from "@prisma/client";
import { Zap, Plug, Bell, Activity, Pause, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { deactivateFlowAction } from "@/app/(app)/flows/actions";

// Define the base type for a generic activity entry (as provided by the SC)
export type ActivityEntry = {
  id: string;
  type: "FLOW" | "CREDENTIAL" | "NOTIFICATION";
  timestamp: Date;
  description: string;
  flowId?: string; // Only present if type is 'FLOW'
  // flowStatus is original status, not current one. We get current from allFlows.
};

// Define the type for the merged activity feed used inside the component
type MergedFlowActivity = Omit<ActivityEntry, "flowId"> & {
  flowId: string;
  currentStatus: boolean | undefined;
  name: string;
};

// Type guard to narrow the activity type for flow-specific access
const isFlowActivity = (
  activity: ActivityEntry | MergedFlowActivity
): activity is MergedFlowActivity => {
  return activity.type === "FLOW" && "flowId" in activity;
};

interface ActivityControlLogProps {
  activities: ActivityEntry[];
  // We only need the ID, name, and current status from all flows to update the activity feed's status
  allFlows: Pick<Flow, "id" | "name" | "isActive">[];
}

// Map activity types to icons
const getActivityIcon = (type: ActivityEntry["type"]) => {
  switch (type) {
    case "FLOW":
      return { icon: Zap, color: "text-purple-500" };
    case "CREDENTIAL":
      return { icon: Plug, color: "text-green-500" };
    case "NOTIFICATION":
      return { icon: Bell, color: "text-blue-500" };
    default:
      return { icon: Activity, color: "text-gray-500" };
  }
};

export const ActivityControlLog: React.FC<ActivityControlLogProps> = ({
  activities,
  allFlows,
}) => {
  const [isPending, startTransition] = useTransition();
  const [disabledFlowId, setDisabledFlowId] = React.useState<string | null>(
    null
  );

  const handleDeactivateFlow = (flowId: string) => {
    setDisabledFlowId(flowId);
    startTransition(async () => {
      const result = await deactivateFlowAction(flowId);
      setDisabledFlowId(null);
      if (!result.success) {
        console.error(`Failed to deactivate flow: ${result.message}`);
        // Simple error handling
      }
      // revalidatePath in the action handles UI refresh
    });
  };

  // --- Data Transformation & Merging ---
  const mergedActivityFeed = activities.slice(0, 5).map((activity) => {
    if (activity.type === "FLOW" && activity.flowId) {
      const currentFlow = allFlows.find((f) => f.id === activity.flowId);

      // Return the refined Flow type
      return {
        ...activity,
        currentStatus: currentFlow?.isActive,
        name: currentFlow?.name || "Unknown Flow",
      } as MergedFlowActivity;
    }
    // Return generic activity type
    return activity;
  });

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-gray-900 shadow">
      <h4 className="flex items-center text-lg font-semibold mb-3">
        <Activity className="w-5 h-5 mr-2 text-gray-500" />
        Recent System Activity
      </h4>

      <ul className="space-y-3">
        {mergedActivityFeed.map((activity, index) => {
          const { icon: Icon, color } = getActivityIcon(activity.type);

          // Check if it's a flow activity that has flow-specific properties
          const isFlow = isFlowActivity(activity);
          const isActive = isFlow ? activity.currentStatus : false;
          const flowId = isFlow ? activity.flowId : undefined;
          const isProcessing = flowId === disabledFlowId && isPending;

          return (
            <li
              key={activity.id || index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-start">
                <Icon className={`w-4 h-4 mt-1 mr-2 ${color}`} />
                <div className="flex flex-col">
                  <span className="font-medium">{activity.description}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(activity.timestamp, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Flow Control Action */}
              {isFlow &&
                flowId && ( // Use flowId check to narrow type to string
                  <button
                    // flowId is now guaranteed to be a string here
                    onClick={() => handleDeactivateFlow(flowId)}
                    disabled={!isActive || isProcessing}
                    title={isActive ? "Deactivate Flow" : "Flow is Inactive"}
                    className={`p-1 rounded-full transition text-white w-7 h-7 flex items-center justify-center 
                                        ${
                                          isActive && !isProcessing
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-gray-400 cursor-not-allowed"
                                        }`}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </button>
                )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
