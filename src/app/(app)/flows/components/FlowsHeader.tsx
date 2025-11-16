import React from "react";

// --- Utility UI Components (Self-contained for completeness) ---

/**
 * Basic loading spinner visual component.
 */
const LoadingSpinner: React.FC = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
);

/**
 * Basic button component with styling and disabled handling.
 */
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className={`flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed ${
      props.className || ""
    }`}
    disabled={props.disabled}
  >
    {children}
  </button>
);

// --- Component Props Interface ---

interface FlowsHeaderProps {
  /** Whether the flow creation process is currently pending (to show spinner/disable button). */
  isCreating: boolean;
  /** Handler function to execute the flow creation Server Action. */
  onCreateFlow: () => void;
}

// --- Main Component ---

/**
 * Renders the page title and the primary Call-to-Action button for creating a new flow.
 */
export const FlowsHeader: React.FC<FlowsHeaderProps> = ({
  isCreating,
  onCreateFlow,
}) => {
  return (
    <header className="flex justify-between items-center border-b border-gray-200 pb-4">
      <h1 className="text-3xl font-extrabold text-gray-900">
        Automation Flows
      </h1>
      <Button
        onClick={onCreateFlow}
        disabled={isCreating}
        aria-label="Create a new automation flow"
      >
        {isCreating ? (
          <>
            <LoadingSpinner />
            Creating Flow...
          </>
        ) : (
          "Create New Flow"
        )}
      </Button>
    </header>
  );
};
