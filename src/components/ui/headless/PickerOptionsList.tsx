// src/components/ui/headless/PickerOptionsList.tsx
import React, { Fragment } from "react";
import { Transition, Combobox } from "@headlessui/react";
import { FieldOption } from "@/config/inventoryFieldManifest"; // Assuming FieldOption is needed

interface PickerOptionsListProps {
  filteredFields: FieldOption[];
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const PickerOptionsList: React.FC<PickerOptionsListProps> = ({
  filteredFields,
  query,
  setQuery,
}) => {
  const optionsListClass =
    "absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm";

  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={() => setQuery("")}
    >
      <Combobox.Options className={optionsListClass}>
        {filteredFields.length === 0 && query !== "" ? (
          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
            Nothing found.
          </div>
        ) : (
          filteredFields.map((field) => (
            <Combobox.Option
              key={field.path}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 transition ${
                  active ? "bg-green-600 text-white" : "text-gray-900"
                }`
              }
              value={field} // Pass the entire field object for insertion
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
                    className={`text-xs text-right block ${
                      active ? "text-green-200" : "text-gray-500"
                    }`}
                  >
                    {field.group}
                  </span>
                </>
              )}
            </Combobox.Option>
          ))
        )}
      </Combobox.Options>
    </Transition>
  );
};

export default PickerOptionsList;
