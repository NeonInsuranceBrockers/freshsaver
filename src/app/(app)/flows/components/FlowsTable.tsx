import React from "react";
import { useRouter } from "next/navigation";

// --- Re-defining Types for Scope (These should ideally be imported from a common types file) ---

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

// --- Utility UI Components (Self-contained for completeness) ---

const LoadingSpinner: React.FC = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500 mx-auto inline-block"></div>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className={`px-3 py-1 text-sm font-medium rounded-md shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
      props.className || ""
    }`}
    disabled={props.disabled}
  >
    {children}
  </button>
);

const Table: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
    <table className="min-w-full divide-y divide-gray-200">{children}</table>
  </div>
);
const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50">{children}</thead>
);
const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled,
}) => (
  <label
    className={`relative inline-flex items-center cursor-pointer ${
      disabled ? "opacity-50" : ""
    }`}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onChange(!checked)}
      className="sr-only peer"
      disabled={disabled}
    />
    {/* Visual track */}
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
  </label>
);

// --- Helper Functions ---

const getSortIndicator = (key: SortKey, sortConfig: SortConfig) => {
  if (sortConfig.key !== key) return null;
  return sortConfig.direction === "ascending" ? " ▲" : " ▼";
};

// Formats date nicely
const formatDate = (date: Date | null | undefined): string => {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// --- Component Props Interface ---

interface FlowsTableProps {
  flows: FlowListItem[];
  searchTerm: string;
  sortConfig: SortConfig;
  requestSort: (key: SortKey) => void;
  mutationLoadingId: string | null;
  handleToggleActive: (flowId: string, currentStatus: boolean) => void;
  handleDelete: (flowId: string, flowName: string) => void;
}

// --- Main Component ---

/**
 * Displays the list of flows in a sortable, functional table.
 */
export const FlowsTable: React.FC<FlowsTableProps> = ({
  flows,
  searchTerm,
  sortConfig,
  requestSort,
  mutationLoadingId,
  handleToggleActive,
  handleDelete,
}) => {
  const router = useRouter();

  if (flows.length === 0) {
    return (
      <div className="text-center p-10 border border-gray-200 rounded-lg text-gray-500 bg-white">
        <p className="text-lg">
          {searchTerm
            ? `No flows matching search term "${searchTerm}".`
            : "There are no flows defined yet."}
        </p>
        <p className="mt-2 text-sm">
          Use the &apos;Create New Flow&apos; button to begin automation.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <tr>
          {/* Define headers and sortability */}
          {[
            { key: "name", label: "Flow Name", sortable: true },
            { key: "isActive", label: "Status", sortable: true },
            { key: "lastPublished", label: "Last Published", sortable: false },
            { key: "updatedAt", label: "Last Modified", sortable: true },
          ].map(({ key, label, sortable }) => (
            <th
              key={key}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                sortable ? "cursor-pointer hover:bg-gray-100" : ""
              }`}
              onClick={() => sortable && requestSort(key as SortKey)}
            >
              {label} {sortable && getSortIndicator(key as SortKey, sortConfig)}
            </th>
          ))}
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </TableHeader>
      <TableBody>
        {flows.map((flow) => {
          const isLoading = mutationLoadingId === flow.id;
          return (
            <tr
              key={flow.id}
              className="hover:bg-indigo-50/50 transition duration-150"
            >
              {/* Flow Name (Link) */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <a
                  onClick={() => router.push(`/flows/editor/${flow.id}`)}
                  className="text-indigo-600 hover:text-indigo-800 cursor-pointer transition duration-150"
                >
                  {flow.name}
                </a>
              </td>
              {/* Status Toggle */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center space-x-3">
                  <span
                    className={`font-semibold text-sm ${
                      flow.isActive ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {flow.isActive ? "Active" : "Draft"}
                  </span>
                  <ToggleSwitch
                    checked={flow.isActive}
                    disabled={isLoading}
                    onChange={() => handleToggleActive(flow.id, flow.isActive)}
                  />
                </div>
              </td>
              {/* Last Published */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(flow.lastPublished)}
              </td>
              {/* Last Modified */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(flow.updatedAt)}
              </td>
              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {isLoading ? (
                  <div className="flex justify-end pr-3">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-x-2">
                    <Button
                      onClick={() => router.push(`/flows/editor/${flow.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 bg-transparent hover:bg-indigo-50 border border-indigo-200 p-1"
                      title="Edit Flow"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(flow.id, flow.name)}
                      className="text-red-600 hover:text-red-900 bg-transparent hover:bg-red-50 p-1"
                      title="Delete Flow"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </TableBody>
    </Table>
  );
};
