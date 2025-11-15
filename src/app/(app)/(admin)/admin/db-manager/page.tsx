// /app/(app)/(admin)/admin/db-manager/page.tsx
"use client";

import React, {
  useState,
  useTransition,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Toaster, toast } from "sonner";

import {
  seedDatabaseAction,
  clearDatabaseAction,
  getTableDataAction,
  triggerCronAction,
} from "./actions";

import DbPageHeader from "./components/DbPageHeader";
import ActionCard from "./components/ActionCard";
import DataViewer from "./components/DataViewer";

export default function DbManagerPage() {
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<string>("Ready.");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tableData, setTableData] = useState<any[] | null>(null);
  const [viewingTable, setViewingTable] = useState<string | null>(null);

  // --- NEW: SCROLL CONTROL LOGIC ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Memoized function to check scroll position
  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      // Check if we can scroll left
      setCanScrollLeft(el.scrollLeft > 0);
      // Check if we can scroll right (with a small buffer for precision)
      const isScrollable = el.scrollWidth > el.clientWidth;
      setCanScrollRight(
        isScrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 1
      );
    }
  }, []);

  // Effect to add event listener and check scrollability on data change
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      // Check scrollability when table data changes
      checkScrollability();
      // Also listen for resize events on the window
      window.addEventListener("resize", checkScrollability);
    }
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScrollability);
    };
  }, [tableData, checkScrollability]); // Re-run when tableData changes

  const handleHorizontalScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8; // Scroll 80% of the visible width
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleSeed = () => {
    startTransition(async () => {
      // 1. Capture the toast ID
      const toastId = toast.loading("Initializing with mock data...");
      try {
        setStatusMessage("Seeding database...");
        const result = await seedDatabaseAction();
        setStatusMessage(result.message);
        // 2. Update the toast using its ID on success
        toast.success(result.message, { id: toastId });

        if (viewingTable) handleViewTable(viewingTable, true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setStatusMessage("Seeding failed.");
        // 3. Update the toast using its ID on error
        toast.error("An error occurred while seeding the database.", {
          id: toastId,
        });
      }
    });
  };

  const handleClear = () => {
    if (
      !confirm(
        "Are you sure you want to delete all data? This cannot be undone."
      )
    )
      return;

    startTransition(async () => {
      const toastId = toast.loading("Clearing database..."); // Using loading for consistency
      try {
        setStatusMessage("Clearing database...");
        const result = await clearDatabaseAction();
        setStatusMessage(result.message);
        toast.success(result.message, { id: toastId });

        setTableData(null);
        setViewingTable(null);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setStatusMessage("Clearing failed.");
        toast.error("An error occurred while clearing the database.", {
          id: toastId,
        });
      }
    });
  };

  const handleViewTable = (tableName: string, isRefresh = false) => {
    startTransition(async () => {
      let toastId: string | number | undefined;
      if (!isRefresh) {
        // Capture the toast ID only if it's not a silent refresh
        toastId = toast.loading(`Fetching data for "${tableName}"...`);
      }
      try {
        setViewingTable(tableName);
        setTableData(null);
        const data = await getTableDataAction(tableName);
        setTableData(data);
        if (!isRefresh) {
          // Update the toast using its ID
          toast.success(`Successfully loaded data for "${tableName}".`, {
            id: toastId,
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Update the toast using its ID
        toast.error(`Failed to fetch data for "${tableName}".`, {
          id: toastId,
        });
      }
    });
  };

  const handleRunCron = () => {
    startTransition(async () => {
      const toastId = toast.loading("Manually triggering cron job..."); // Using loading
      try {
        setStatusMessage("Running cron job...");
        const result = await triggerCronAction();
        setStatusMessage(result.message);
        toast.success(result.message, { id: toastId });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setStatusMessage("Cron job failed.");
        toast.error("An error occurred while running the cron job.", {
          id: toastId,
        });
      }
    });
  };

  const tableNames = [
    "flows",
    "inventory",
    "credentials",
    "notificationLogs",
    "recipes",
    "ingredients",
    "scheduledMeals",
  ];

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen font-sans">
        <DbPageHeader
          title="Database Manager"
          description="An admin dashboard to interact with the server-side database via Server Actions."
        />
        <main className="grid gap-6 mt-6 ">
          <ActionCard
            onSeed={handleSeed}
            onClear={handleClear}
            onRunCron={handleRunCron}
            isPending={isPending}
            statusMessage={statusMessage}
          />

          <div
            className="w-full overflow-auto"
            ref={scrollContainerRef}
            onScroll={checkScrollability}
          >
            <DataViewer
              tableNames={tableNames}
              onSelectTable={handleViewTable}
              tableData={tableData}
              viewingTable={viewingTable}
              isPending={isPending && tableData === null}
              // PASS NEW PROPS FOR SCROLLING
              onScrollLeft={() => handleHorizontalScroll("left")}
              onScrollRight={() => handleHorizontalScroll("right")}
              canScrollLeft={canScrollLeft}
              canScrollRight={canScrollRight}
            />
          </div>
        </main>
      </div>
    </>
  );
}
