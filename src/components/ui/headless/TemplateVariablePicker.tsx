// src/components/ui/headless/TemplateVariablePicker.tsx
"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { Combobox } from "@headlessui/react";

// --- IMPORT SUB-COMPONENTS ---
import { VariableInsertionInput } from "./components/VariableInsertionInput";
import { VariableOptionsList } from "./components/VariableOptionsList";

// --- IMPORT ALL DATA AND TYPES (kept locally as they are highly specific) ---
import {
  FieldOption,
  INVENTORY_FIELD_MANIFEST,
  CATEGORY_OPTIONS,
  LOCATION_OPTIONS,
  UNIT_OPTIONS,
} from "@/config/inventoryFieldManifest";

// --- TYPE DEFINITIONS ---
interface TemplateDictionary {
  label: string;
  key: string;
  variables: FieldOption[];
}
type StaticGroup = "Static Categories" | "Static Locations" | "Static Units";

// --- UTILITY FUNCTION (Kept locally) ---
const transformStaticOptions = (
  options: { value: string; label: string }[],
  dictionaryKey: StaticGroup,
  dataType: "string" | "number" = "string"
): FieldOption[] => {
  return options.map((opt) => ({
    path: opt.value,
    label: opt.label,
    group: dictionaryKey,
    dataType: dataType,
  })) as FieldOption[];
};

// --- COMPONENT START ---

interface TemplateVariablePickerProps {
  value: string;
  onChange: (
    value: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur: () => void;
  rhfRef: React.Ref<unknown>;
  placeholder: string;
  error: boolean;
}

export const TemplateVariablePicker: React.FC<TemplateVariablePickerProps> = ({
  value,
  onChange,
  onBlur,
  rhfRef,
  placeholder,
  error,
}) => {
  const [localQuery, setLocalQuery] = useState(value || "");
  const internalRef = useRef<HTMLTextAreaElement | null>(null);

  // --- STATE SYNC ---
  React.useEffect(() => {
    if (value !== localQuery) {
      setLocalQuery(value || "");
    }
  }, [localQuery, value]);

  // --- DATA TRANSFORMATION AND GROUPING LOGIC (Memoized) ---
  const groupedVariables: TemplateDictionary[] = useMemo(() => {
    // 1. DYNAMIC DATA: Group INVENTORY_FIELD_MANIFEST by its inherent 'group' property
    const dynamicGroups = new Map<string, FieldOption[]>();
    INVENTORY_FIELD_MANIFEST.forEach((field) => {
      const groupName = field.group;
      if (!dynamicGroups.has(groupName)) {
        dynamicGroups.set(groupName, []);
      }
      dynamicGroups.get(groupName)!.push(field);
    });
    const dynamicDictionaries = Array.from(dynamicGroups.entries()).map(
      ([key, variables]) => ({ label: key, key: key, variables: variables })
    );

    // 2. STATIC DATA: Transform static options into dictionaries
    const staticDictionaries: TemplateDictionary[] = [
      {
        label: "Static Categories (Values)",
        key: "static_categories",
        variables: transformStaticOptions(
          CATEGORY_OPTIONS,
          "Static Categories"
        ),
      },
      {
        label: "Static Locations (Values)",
        key: "static_locations",
        variables: transformStaticOptions(LOCATION_OPTIONS, "Static Locations"),
      },
      {
        label: "Static Units (Values)",
        key: "static_units",
        variables: transformStaticOptions(UNIT_OPTIONS, "Static Units"),
      },
    ];

    return [...dynamicDictionaries, ...staticDictionaries];
  }, []);

  // --- REF MANAGEMENT (Merged RHF + Internal) ---
  const mergedRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
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

  // --- HANDLER: Inserts the variable token at the cursor position ---
  const handleVariableInsertion = (field: FieldOption) => {
    if (!field) return;

    const variableString = `{{${field.path}}}`;
    const inputElement = internalRef.current;

    if (!inputElement) {
      console.error("Textarea element reference failed.");
      return;
    }

    const start = inputElement.selectionStart || 0;
    const end = inputElement.selectionEnd || 0;

    const currentRHFValue = value;
    const newValue =
      currentRHFValue.slice(0, start) +
      variableString +
      currentRHFValue.slice(end);

    // 1. Update RHF state
    onChange(newValue);
    // 2. Update the local query state (display)
    setLocalQuery(newValue);

    // 3. Focus and set cursor position (UX cleanup)
    inputElement.focus();
    inputElement.selectionEnd = start + variableString.length;
  };

  // Logic to re-sync local query after options close
  const handleTransitionLeave = () => setLocalQuery(value);

  return (
    <Combobox
      value={value}
      onChange={(value) =>
        handleVariableInsertion(value as unknown as FieldOption)
      }
      nullable
    >
      <div className="relative">
        {/* RENDER INPUT AND BUTTON */}
        <VariableInsertionInput
          value={value}
          localQuery={localQuery}
          onChange={onChange}
          setLocalQuery={setLocalQuery}
          onBlur={onBlur}
          mergedRef={mergedRef}
          placeholder={placeholder}
          error={error}
        />

        {/* RENDER OPTIONS LIST */}
        <VariableOptionsList
          groupedVariables={groupedVariables}
          onTransitionLeave={handleTransitionLeave}
        />
      </div>
    </Combobox>
  );
};

export default TemplateVariablePicker;

// import { useTemplateVariables } from "./hooks/useTemplateVariables";
// import { TemplateInput } from "./TemplateInput";
// import { VariableOptionList } from "./VariableOptionList";
