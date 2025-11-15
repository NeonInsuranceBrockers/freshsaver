// src/components/ui/headless/VariablePicker.tsx
"use client";

import React, { useState, useMemo, Fragment, useRef, useCallback } from "react";
import {
  Combobox,
  Transition,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";

import { FieldOption } from "@/config/inventoryFieldManifest";

interface VariablePickerProps {
  value: string;
  onChange: (
    value: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur: () => void;
  rhfRef: React.Ref<unknown>;
  placeholder: string;
  error: boolean;
  insertionMode: boolean; // True: Text insertion ({{var}}), False: Pure selection (replace value)
  multiline: boolean; // True: Use textarea, False: Use standard input
  options: FieldOption[];
}

const VariablePicker: React.FC<VariablePickerProps> = ({
  value,
  onChange,
  onBlur,
  rhfRef,
  placeholder,
  error,
  insertionMode,
  multiline, // Use multiline prop
  options,
}) => {
  // --- STATE MANAGEMENT ---
  const [localQuery, setLocalQuery] = useState(value || "");
  const currentText = insertionMode ? localQuery : value;

  React.useEffect(() => {
    if (insertionMode && value !== localQuery) {
      setLocalQuery(value || "");
    }
  }, [value, insertionMode, localQuery]);

  // --- REF MANAGEMENT ---
  const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
    null
  );

  const mergedRef = useCallback(
    (node: HTMLInputElement | HTMLTextAreaElement | null) => {
      internalRef.current = node;

      if (rhfRef) {
        if (typeof rhfRef === "function") {
          rhfRef(node);
        } else if (typeof rhfRef === "object" && "current" in rhfRef) {
          (rhfRef as React.MutableRefObject<unknown>).current = node;
        }
      }
    },
    [rhfRef]
  );

  // --- CONDITIONAL FILTERING LOGIC (Simplified: only filter if insertion mode) ---
  const filteredFields = useMemo(() => {
    // If not inserting, we just show all options (assuming selection is based on the list)
    if (!insertionMode) {
      return options;
    }

    // const queryText = currentText.toLowerCase();

    // If in insertion mode, we don't necessarily want filtering unless the user types something
    // If we decide filtering is unnecessary for insertion, we can simply return the full list here too.
    // Based on your instruction ("i do not think filtering is necessary"):
    return options;

    /* 
    // If we wanted filtering back:
    return queryText === "" 
      ? INVENTORY_FIELD_MANIFEST 
      : INVENTORY_FIELD_MANIFEST.filter(...) 
    */
  }, [insertionMode, options]);

  // --- HANDLERS ---

  // Insertion Mode Handler (Token insertion)
  const handleInsertionSelection = (field: FieldOption) => {
    if (!field) return;

    const variableString = `{{${field.path}}}`;
    const inputElement = internalRef.current;

    if (!inputElement) {
      console.error("Input element reference failed for insertion.");
      return;
    }

    // Use current cursor position to insert
    const start = inputElement.selectionStart || 0;
    const end = inputElement.selectionEnd || 0;

    // Calculate the new total value
    const newValue = value.slice(0, start) + variableString + value.slice(end);

    // 1. Update RHF state with the full string
    onChange(newValue);

    // 2. Update the local query state (used for display)
    setLocalQuery(newValue);

    // 3. Focus and set cursor position (UX cleanup)
    inputElement.focus();
    inputElement.selectionEnd = start + variableString.length;
  };

  // Selection Mode Handler (Full replacement)
  const handleSelectionOnly = (field: FieldOption) => {
    if (!field) return;
    const newValue = field.path;
    onChange(newValue);
  };

  const handleComboboxChange = insertionMode
    ? handleInsertionSelection
    : handleSelectionOnly;

  const inputClass = `w-full border p-2 rounded-md text-sm transition focus:ring-2 ${
    error ? "border-red-500" : "border-gray-300 focus:border-green-500"
  } ${multiline ? "min-h-[80px]" : ""}`; // Add height for textarea

  return (
    <Combobox
      value={value}
      onChange={(value) =>
        handleComboboxChange(value as unknown as FieldOption)
      }
      nullable
    >
      <div className="relative">
        <ComboboxInput
          // --- Conditionally render as textarea ---
          as={multiline ? "textarea" : "input"}
          //   rows={multiline ? 3 : undefined}
          // ----------------------------------------
          className={inputClass}
          placeholder={placeholder}
          ref={mergedRef}
          // Use currentText for display. If insertionMode is false, this defaults to RHF 'value'.
          value={currentText}
          onChange={(event) => {
            const newValue = event.target.value;

            onChange(newValue);

            if (insertionMode) {
              setLocalQuery(newValue);
            }
          }}
          onBlur={onBlur}
          displayValue={(item) =>
            typeof item === "string"
              ? item
              : (item as FieldOption)?.path || value
          }
        />

        <ComboboxButton
          className={`absolute ${
            multiline ? "top-2 right-2" : "inset-y-0 right-0"
          } flex items-center pr-2 text-gray-500`}
        >
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

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setLocalQuery(value)}
        >
          <ComboboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {/* Since filtering is disabled, we just check if the list is empty, which it shouldn't be */}
            {filteredFields.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                No variables available.
              </div>
            ) : (
              filteredFields.map((field) => (
                <ComboboxOption
                  key={field.path}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 transition ${
                      active ? "bg-green-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={field}
                >
                  {/* ... (Option display logic remains the same) */}
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {field.label}
                      </span>
                      <span
                        className={`text-xs text-right block ${
                          active ? "text-green-200" : "text-gray-500"
                        }`}
                      >
                        {field.group}
                      </span>
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
};

export default VariablePicker;
