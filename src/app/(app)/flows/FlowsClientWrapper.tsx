// /app/(app)/flows/FlowsClientWrapper.tsx (UPDATED)
"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createEmptyFlowAction,
  publishFlowAction,
  deactivateFlowAction,
  deleteFlowAction,
} from "./actions";

// Import components
import { FlowsHeader } from "./components/FlowsHeader";
import { FlowsTableControls } from "./components/FlowsTableControls";
import { FlowsTable } from "./components/FlowsTable";
import { CreateFlowModal } from "./components/CreateFlowModal"; // NEW IMPORT

// --- Defining Types (Sourced from flow.ts) ---
interface FlowListItem {
  id: string;
  name: string;
  isActive: boolean;
  lastPublished: Date | null;
  updatedAt: Date;
}
type SortKey = "updatedAt" | "name" | "isActive";
interface SortConfig {
  key: SortKey;
  direction: "ascending" | "descending";
}

// --- Utility UI Components (For Confirmation Modal) ---
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    {...props}
    className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
  />
);
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
      props.className || ""
    }`}
    disabled={props.disabled}
  >
    {children}
  </button>
);

const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  flowName: string;
}> = ({ isOpen, onClose, onConfirm, flowName }) => {
  // 1. Call useState unconditionally at the top level
  const [confirmationInput, setConfirmationInput] = useState("");

  // 2. Call useEffect unconditionally at the top level
  useEffect(() => {
    // Reset the input whenever the modal transitions from closed to open
    if (isOpen) {
      setConfirmationInput("");
    }
  }, [isOpen]);

  // If the modal is not open, return null immediately after hooks are called.
  if (!isOpen) return null;

  // The confirmation requirement: input must exactly match the flow name
  const isConfirmed = confirmationInput.trim() === flowName.trim();

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      // Input state will be reset by the useEffect hook when isOpen becomes false
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          Confirm Flow Deletion
        </h3>
        <p className="mb-4 text-gray-700">
          To confirm permanent deletion of the flow named{" "}
          <span className="font-semibold text-red-600">
            &quot;{flowName}&quot;
          </span>
          , please type its name exactly below.
        </p>

        {/* Confirmation Input Field */}
        <div className="mb-6">
          <Input
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={`Type "${flowName}" to confirm`}
            aria-label="Confirm flow name for deletion"
          />
          {confirmationInput && !isConfirmed && (
            <p className="mt-1 text-sm text-red-500">
              Input does not match the flow name.
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose} // onClose will handle closing the parent state
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
            disabled={!isConfirmed}
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function FlowsClientWrapper({
  initialFlows,
}: {
  initialFlows: FlowListItem[];
}) {
  const router = useRouter();

  // --- State Management ---
  const [flows, setFlows] = useState(initialFlows);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "updatedAt",
    direction: "descending",
  });

  // New state for modal visibility and loading
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mutationLoadingId, setMutationLoadingId] = useState<string | null>(
    null
  );

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    flowId: string | null;
    flowName: string;
  }>({ isOpen: false, flowId: null, flowName: "" });

  // --- Sorting & Filtering Logic (Unchanged) ---

  const requestSort = useCallback((key: SortKey) => {
    setSortConfig((prevConfig) => {
      let direction: SortConfig["direction"] = "ascending";
      if (prevConfig.key === key && prevConfig.direction === "ascending") {
        direction = "descending";
      }
      return { key, direction };
    });
  }, []);

  const sortedAndFilteredFlows = useMemo(() => {
    const computedFlows = flows.filter((flow) =>
      flow.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    computedFlows.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      let comparison = 0;
      if (typeof aValue === "string") {
        comparison = aValue.localeCompare(bValue as string);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else if (typeof aValue === "boolean") {
        comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
      } else {
        if (aValue === null) comparison = -1;
        if (bValue === null) comparison = 1;
        if (aValue !== null && bValue !== null)
          comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }

      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });

    return computedFlows;
  }, [flows, searchTerm, sortConfig]);

  // --- Server Action Handlers ---

  /**
   * Called by the CreateFlowModal upon form submission.
   */
  const handleModalCreateFlow = useCallback(
    async (name: string) => {
      setIsSubmitting(true);
      try {
        // 1. Call the Server Action with the user-provided name
        const newFlowId = await createEmptyFlowAction(name);

        // 2. Optimistically update local state (Crucial for avoiding refresh)
        const newFlowItem: FlowListItem = {
          id: newFlowId,
          name: name,
          isActive: false,
          lastPublished: null,
          // Since we don't fetch the creation date immediately, we use current time
          updatedAt: new Date(),
        };

        setFlows((prev) => [newFlowItem, ...prev]);

        // 3. Navigate the user to the editor
        router.push(`/flows/editor/${newFlowId}`);

        setIsModalOpen(false); // Close modal before redirection finishes
      } catch (error) {
        console.error("Failed to create flow:", error);
        alert("Error creating flow. Please try again.");
        // Do not navigate if creation fails
      } finally {
        setIsSubmitting(false);
      }
    },
    [router]
  );

  const handleToggleActive = useCallback(
    async (flowId: string, currentStatus: boolean) => {
      setMutationLoadingId(flowId);
      try {
        const action = currentStatus ? deactivateFlowAction : publishFlowAction;
        const result = await action(flowId);

        if (result.success) {
          // Update local state instead of refreshing the whole page
          setFlows((prev) =>
            prev.map((f) =>
              f.id === flowId
                ? {
                    ...f,
                    isActive: !currentStatus,
                    // Update lastPublished if activating
                    lastPublished: !currentStatus
                      ? new Date()
                      : f.lastPublished,
                    updatedAt: new Date(),
                  }
                : f
            )
          );
        } else {
          alert(`Failed to change status: ${result.message}`);
        }
      } catch (error) {
        console.error("Toggle failed:", error);
        alert("An unexpected error occurred while updating the flow status.");
      } finally {
        setMutationLoadingId(null);
      }
    },
    [] // No external dependencies needed for this state manipulation
  );

  const handleDelete = useCallback((flowId: string, flowName: string) => {
    setDeleteModal({ isOpen: true, flowId, flowName });
  }, []);

  const handleDeleteConfirmed = useCallback(async () => {
    const idToDelete = deleteModal.flowId;
    if (!idToDelete) return;

    setMutationLoadingId(idToDelete);
    setDeleteModal({ ...deleteModal, isOpen: false });

    try {
      const result = await deleteFlowAction(idToDelete);

      if (result.success) {
        // Update local state immediately
        setFlows((prev) => prev.filter((f) => f.id !== idToDelete));
      } else {
        alert("Failed to delete flow: " + result.message);
      }
    } catch (error) {
      console.error("Deletion failed:", error);
      alert("An unexpected error occurred during deletion.");
    } finally {
      setMutationLoadingId(null);
      setDeleteModal({ isOpen: false, flowId: null, flowName: "" });
    }
  }, [deleteModal]);

  // --- Render ---

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      {/* 1. Header and Create CTA */}
      <FlowsHeader
        isCreating={isSubmitting} // Use modal submitting state for button loading
        onCreateFlow={() => setIsModalOpen(true)} // Open the modal
      />

      {/* 2. Search and Sort Controls */}
      <FlowsTableControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortConfig={sortConfig}
        requestSort={requestSort}
      />

      {/* 3. Flow List Table */}
      <FlowsTable
        flows={sortedAndFilteredFlows}
        searchTerm={searchTerm}
        sortConfig={sortConfig}
        requestSort={requestSort}
        mutationLoadingId={mutationLoadingId}
        handleToggleActive={handleToggleActive}
        handleDelete={handleDelete}
      />

      {/* 4. Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, flowId: null, flowName: "" })
        }
        onConfirm={handleDeleteConfirmed}
        flowName={deleteModal.flowName}
      />

      {/* 5. Create Flow Input Modal (NEW) */}
      <CreateFlowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleModalCreateFlow}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
