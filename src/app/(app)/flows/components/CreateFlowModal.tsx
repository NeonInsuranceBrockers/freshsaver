// app/(app)/flows/components/CreateFlowModal.tsx
import React, { useState } from "react";

// --- Utility UI Components ---

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
const LoadingSpinner: React.FC = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2 inline-block"></div>
);

// --- Component Props Interface ---

interface CreateFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Function to call the server action and handle state updates. */
  onCreate: (name: string) => Promise<void>;
  isSubmitting: boolean;
}

// --- Main Component ---

export const CreateFlowModal: React.FC<CreateFlowModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  isSubmitting,
}) => {
  const [flowName, setFlowName] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = flowName.trim();

    if (!trimmedName) {
      setError("Flow name cannot be empty.");
      return;
    }
    if (trimmedName.length > 100) {
      setError("Flow name is too long.");
      return;
    }

    setError(null);
    await onCreate(trimmedName);

    // Only clear the name if creation was successful and navigation happens,
    // but since navigation is handled by parent, we rely on parent closing us.
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          Create New Flow
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="flowName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Flow Name
            </label>
            <Input
              id="flowName"
              value={flowName}
              onChange={(e) => {
                setFlowName(e.target.value);
                if (error) setError(null); // Clear error on change
              }}
              placeholder="e.g., Expiration Alert for Dairy"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => {
                onClose();
                setFlowName("");
                setError(null);
              }}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={isSubmitting || !flowName.trim()}
            >
              {isSubmitting ? <LoadingSpinner /> : "Create and Edit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
