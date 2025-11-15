// src/components/ui/headless/components/VariableOptionsList.tsx
"use client";

import React, { Fragment } from "react";
import { Transition, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import { TemplateDictionary } from "@/config/templateSources";
// Assuming TemplateDictionary and FieldOption are available via shared imports or props
// import { FieldOption, TemplateDictionary } from "./types"; // Conceptual import

interface VariableOptionsListProps {
  groupedVariables: TemplateDictionary[];
  onTransitionLeave: () => void;
}

export const VariableOptionsList: React.FC<VariableOptionsListProps> = ({
  groupedVariables,
  onTransitionLeave,
}) => {
  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={onTransitionLeave}
    >
      <ComboboxOptions className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {groupedVariables.map((dict) => (
          <Fragment key={dict.key}>
            {/* Dictionary Label (Group Header) */}
            <li className="px-3 py-2 text-xs font-semibold uppercase text-gray-500 bg-gray-50 sticky top-0">
              {dict.label}
            </li>

            {dict.variables.length === 0 ? (
              <li className="relative cursor-default select-none py-2 px-4 text-gray-700 text-sm">
                No variables in this group.
              </li>
            ) : (
              dict.variables.map((field) => (
                <ComboboxOption
                  key={field.path}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-4 transition text-sm ${
                      active ? "bg-green-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={field}
                >
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
                        className={`text-xs block ${
                          active ? "text-green-200" : "text-gray-500"
                        }`}
                      >
                        {field.path}
                      </span>
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </Fragment>
        ))}
      </ComboboxOptions>
    </Transition>
  );
};
