import React from "react";

// --- Re-defining Types for Scope ---

// Assuming these types come from a common source
type SortKey = "updatedAt" | "name" | "isActive";
interface SortConfig {
  key: SortKey;
  direction: "ascending" | "descending";
}

// --- Utility UI Components (Self-contained for completeness) ---

/**
 * Basic input component with styling.
 */
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props
) => (
  <input
    {...props}
    className="border border-gray-300 p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition w-full"
  />
);

// --- Component Props Interface ---

interface FlowsTableControlsProps {
  /** The current value of the search input field. */
  searchTerm: string;
  /** Function to update the search term state in the parent component. */
  setSearchTerm: (term: string) => void;
  /** The current sorting configuration. */
  sortConfig: SortConfig;
  /** Function to request a change in sorting key and direction. */
  requestSort: (key: SortKey) => void;
}

// --- Main Component ---

/**
 * Provides controls for filtering and sorting the list of flows.
 */
export const FlowsTableControls: React.FC<FlowsTableControlsProps> = ({
  searchTerm,
  setSearchTerm,
  sortConfig,
  requestSort,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Search Input */}
      <div className="grow w-full sm:w-auto">
        <Input
          type="text"
          placeholder="Search flows by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search flows"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="w-full sm:w-auto">
        <select
          value={sortConfig.key}
          onChange={(e) => requestSort(e.target.value as SortKey)}
          className="w-full border border-gray-300 bg-white p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
          aria-label="Sort flows by"
        >
          <option value="updatedAt">Sort by Last Modified</option>
          <option value="name">Sort by Name (A-Z)</option>
          <option value="isActive">Sort by Status (Active First)</option>
        </select>
      </div>
    </div>
  );
};
