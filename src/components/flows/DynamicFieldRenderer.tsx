// src/components/flows/DynamicFieldRenderer.tsx
import React from "react";
import {
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
  Controller,
  Control,
} from "react-hook-form";
import { NodeConfigField } from "@/config/flowNodeDefinitions";
import { NodeData } from "@/types/flow";
import { SelectMenu } from "@/components/ui/headless/SelectMenu";
import TemplateVariablePicker from "@/components/ui/headless/TemplateVariablePicker";

import VariablePicker from "@/components/ui/headless/VariablePicker";
import { INVENTORY_FIELD_MANIFEST } from "@/config/inventoryFieldManifest";

interface DynamicFieldProps {
  field: NodeConfigField;
  register: UseFormRegister<NodeData>;
  errors: FieldErrors<NodeData>;
  watch: UseFormWatch<NodeData>;
  control: Control<NodeData>;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  register,
  errors,
  control,
}) => {
  const inputId = `config-${field.key}`;
  const error = errors[field.key];

  // Basic input class
  const inputClass =
    "w-full border border-gray-300 p-2 rounded-md text-sm focus:border-green-500 focus:ring-green-500";
  const errorClass = error ? "border-red-500" : "border-gray-300";

  switch (field.type) {
    case "text":
    case "number":
      return (
        <input
          id={inputId}
          type={field.type}
          placeholder={field.placeholder}
          className={`text-black ${inputClass} ${errorClass} `}
          {...register(field.key as string, {
            required: field.required,
            valueAsNumber: field.type === "number",
          })}
        />
      );

    // case "textarea":
    //   return (
    //     <textarea
    //       id={inputId}
    //       rows={3}
    //       placeholder={field.placeholder}
    //       className={`text-black ${inputClass} ${errorClass}`}
    //       {...register(field.key as string, { required: field.required })}
    //     />
    //   );
    case "textarea":
      return (
        <Controller
          name={field.key as string}
          control={control}
          rules={{ required: field.required }}
          render={({ field: controllerField }) => (
            <TemplateVariablePicker
              value={(controllerField.value as string) || ""}
              onChange={controllerField.onChange}
              onBlur={controllerField.onBlur}
              rhfRef={controllerField.ref}
              placeholder={field.placeholder || "Enter text and variables..."}
              error={!!error}
            />
          )}
        />
      );

    case "dropdown":
      return (
        <Controller
          name={field.key as string} // The name of the field in the NodeData object
          // Required for RHF validation rules
          control={control}
          rules={{
            required: field.required
              ? "This dropdown selection is required."
              : false,
          }}
          render={({ field: controllerField }) => (
            <SelectMenu
              field={field}
              value={(controllerField.value as string) || ""}
              onChange={controllerField.onChange}
              error={!!error}
            />
          )}
        />
      );

    case "boolean":
      return (
        <div className="flex items-center space-x-2">
          <input
            id={inputId}
            type="checkbox"
            className="h-4 w-4 text-green-600 border-gray-300 rounded"
            {...register(field.key as string)}
          />
          <label htmlFor={inputId} className="text-gray-700">
            {field.label}
          </label>
        </div>
      );

    case "variable-picker":
      // Placeholder for a complex component that lets the user select a variable from the flow payload
      // const rhfProps = register(field.key as string, {
      //   required: field.required,
      // });

      return (
        <Controller
          control={control}
          name={field.key as keyof NodeData as string}
          rules={{
            required: field.required ? "This field is required." : false,
          }}
          render={({ field: controllerField }) => (
            <VariablePicker
              value={(controllerField.value as string) || ""} // Passed value from RHF state
              onChange={controllerField.onChange} // Passed RHF change handler
              onBlur={controllerField.onBlur}
              rhfRef={controllerField.ref}
              placeholder={
                field.placeholder || "Select variable or type text..."
              }
              error={!!errors[field.key]}
              insertionMode={false}
              multiline={false}
              options={INVENTORY_FIELD_MANIFEST}
            />
          )}
        />
      );

    default:
      return null;
  }
};
