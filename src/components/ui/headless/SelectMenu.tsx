// src/components/ui/headless/SelectMenu.tsx
"use client";

import { Listbox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { NodeConfigField } from "@/config/flowNodeDefinitions";

interface SelectMenuProps {
  field: NodeConfigField;
  // The value should be managed by RHF, but we handle the selection UI here.
  // We accept the current value and the onChange handler from RHF's Controller/register logic.
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5 text-gray-400"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
      clipRule="evenodd"
    />
  </svg>
);

export const SelectMenu: React.FC<SelectMenuProps> = ({
  field,
  value,
  onChange,
  error = false,
}) => {
  const selectedOption = field.options?.find((o) => o.value === value) || {
    value: "",
    label: "Select an option",
  };

  const buttonClass = `relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 sm:text-sm sm:leading-6 transition ${
    error
      ? "ring-red-500"
      : "ring-gray-300 hover:ring-gray-400 focus:ring-green-500"
  }`;
  const optionsListClass =
    "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm";
  const optionBaseClass = ({ active }: { active: boolean }) =>
    `relative cursor-default select-none py-2 pl-3 pr-9 transition ${
      active ? "bg-green-100 text-green-900" : "text-gray-900"
    }`;

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        {/* Button */}
        <Listbox.Button className={buttonClass}>
          <span className="block truncate">{selectedOption.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon />
          </span>
        </Listbox.Button>

        {/* Transitioning Options */}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className={optionsListClass}>
            {field.options?.map((option) => (
              <Listbox.Option
                key={option.value}
                className={optionBaseClass}
                value={option.value}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                          active ? "text-green-600" : "text-green-600"
                        }`}
                      >
                        <CheckIcon />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
