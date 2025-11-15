// src/components/ui/headless/components/VariableInsertionInput.tsx
"use client";

import React from "react";
import { ComboboxInput, ComboboxButton } from "@headlessui/react";

interface VariableInsertionInputProps {
  value: string;
  localQuery: string;
  onChange: (
    value: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  setLocalQuery: React.Dispatch<React.SetStateAction<string>>;
  onBlur: () => void;
  mergedRef: (node: HTMLTextAreaElement | null) => void;
  placeholder: string;
  error: boolean;
}

export const VariableInsertionInput: React.FC<VariableInsertionInputProps> = ({
  value,
  localQuery,
  onChange,
  setLocalQuery,
  onBlur,
  mergedRef,
  placeholder,
  error,
}) => {
  const inputClass = `w-full border p-2 rounded-md text-sm transition focus:ring-2 min-h-[120px] resize-y ${
    error ? "border-red-500" : "border-gray-300 focus:border-green-500"
  }`;

  return (
    <>
      {/* 1. INPUT AREA: Rendered as a Textarea */}
      <ComboboxInput
        as="textarea"
        rows={5}
        className={inputClass}
        placeholder={placeholder}
        ref={mergedRef as React.Ref<HTMLInputElement>}
        value={localQuery}
        onChange={(event) => {
          const newValue = event.target.value;
          // Update RHF state
          onChange(newValue);
          // Update local state for display
          setLocalQuery(newValue);
        }}
        onBlur={onBlur}
        // This is necessary for Headless UI to correctly manage display when an item is selected
        displayValue={(item: { path: string }) =>
          typeof item === "string" ? item : item.path || value
        }
      />

      {/* 2. Dropdown Button */}
      <ComboboxButton
        className="absolute top-2 right-2 flex items-center pr-2 text-gray-500 hover:text-green-600 z-10"
        title="Insert Variable"
      >
        <span className="text-xs mr-1 text-gray-600 hidden sm:inline">
          Insert Variable
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z"
            clipRule="evenodd"
          />
        </svg>
      </ComboboxButton>
    </>
  );
};
