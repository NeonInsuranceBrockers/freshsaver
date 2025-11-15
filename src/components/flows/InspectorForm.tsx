// src/components/flows/InspectorForm.tsx
import React, { useCallback, useEffect, useMemo } from "react";
import { Node } from "reactflow";
import { useForm, SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { getNodeValidationSchema } from "@/lib/utils/nodeValidationSchema";
// import { ZodObject, ZodSchema } from "zod";

import { DynamicField } from "./DynamicFieldRenderer";
import { FlowNodeDefinition } from "@/config/flowNodeDefinitions";
import { NodeData } from "@/types/flow";
import { ZodType } from "zod";

interface InspectorFormProps {
  definition: FlowNodeDefinition;
  selectedNode: Node<NodeData>;
  selectedNodeId: string;
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeData>[]>>;
}

/**
 * Ensures all string/dropdown fields that are undefined are initialized to ''
 * to prevent RHF/Controller errors when reading 'control'.
 */
const getSafeDefaultValues = (data: NodeData): NodeData => {
  const safeData: NodeData = { ...data };

  // Iterate over all possible NodeData keys and initialize them if they are undefined
  // This is defensive programming against the 'reading control' error.
  for (const key in safeData) {
    // If the value is explicitly null or undefined, set it to an empty string.
    // We only target string-like fields here, as numbers/booleans are handled differently.
    if (safeData[key] === null || safeData[key] === undefined) {
      // We assume string/dropdown types need a default ''
      safeData[key] = "";
    }
  }
  return safeData;
};

const InspectorForm: React.FC<InspectorFormProps> = ({
  definition,
  selectedNode,
  selectedNodeId,
  setNodes,
}) => {
  // *** NEW: Generate Schema based on selected node definition ***
  const validationSchema: ZodType<NodeData> = useMemo(() => {
    // We remove the complex cast entirely. We rely on the TypeScript structure
    // of getNodeValidationSchema (which returns ZodObject<ZodRawShape>)
    // being compatible with ZodType<NodeData>.
    return getNodeValidationSchema(definition) as unknown as ZodType<NodeData>;
  }, [definition]);

  // 2. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    control,
  } = useForm<NodeData>({
    // *** FIX: Apply a direct 'as any' cast ONLY on the schema when passing it to zodResolver ***
    // This tells TypeScript to bypass the deep internal type checks the resolver tries to perform,
    // which are failing due to Zod's internal generic complexity.
    resolver: zodResolver(validationSchema as never),

    defaultValues: getSafeDefaultValues(selectedNode.data),
    mode: "onChange",
  });

  // 3. Update the form whenever the selected node changes
  useEffect(() => {
    if (selectedNode) {
      // Use the existing node data to populate the form fields
      reset(getSafeDefaultValues(selectedNode.data));
    }
  }, [selectedNode, reset]);

  // 4. Define the submission handler to push changes back to the React Flow state
  const onSubmit: SubmitHandler<NodeData> = useCallback(
    (data) => {
      if (!selectedNodeId) return;

      // Update the React Flow state (setNodes) with the new form data
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNodeId) {
            // Merge the new form data with any existing node data fields
            return {
              ...node,
              data: {
                ...node.data,
                ...data,
                // Ensure the label is updated if a specific field is meant to drive the label (optional)
                label: definition?.label || node.data.label,
              },
            };
          }
          return node;
        })
      );
      // console.log("Node Updated:", data);
    },
    [selectedNodeId, setNodes, definition]
  );

  // 5. Use watch to trigger save on every field change (auto-save behavior)
  const watchedFields = watch();

  useEffect(() => {
    // We auto-submit the form whenever a field changes to ensure the React Flow state
    // is immediately synchronized with the Inspector configuration.
    if (selectedNodeId) {
      // Use a slight debounce if performance becomes an issue
      const submissionTimeout = setTimeout(() => {
        handleSubmit(onSubmit)();
      }, 50); // Debounce time

      return () => clearTimeout(submissionTimeout);
    }
  }, [watchedFields, selectedNodeId, handleSubmit, onSubmit]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {definition.configFields.map((field) => (
        <div key={field.key as string} className="flow-config-field">
          <label
            htmlFor={`config-${field.key}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>

          <DynamicField
            field={field}
            register={register}
            errors={errors}
            watch={watch}
            control={control}
          />

          {/* Display Zod validation errors */}
          {errors[field.key] && (
            <p className="mt-1 text-xs text-red-500">
              {/* Show the specific Zod error message */}
              {(errors[field.key] as { message: string })?.message ||
                "This field is required."}
            </p>
          )}
        </div>
      ))}
      {/* (Optional submit button removed to reflect original intent) */}
    </form>
  );
};

export default InspectorForm;
