// src/components/ui/headless/PickerInputAndButton.tsx
import React from "react";
import { Combobox } from "@headlessui/react";
import { UseFormRegisterReturn } from "react-hook-form";

interface PickerInputAndButtonProps {
  rhfProps: UseFormRegisterReturn;
  placeholder: string;
  error: boolean;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const PickerInputAndButton: React.FC<PickerInputAndButtonProps> = ({
  rhfProps,
  placeholder,
  error,
  setQuery,
}) => {
  const inputClass = `w-full border p-2 rounded-md text-sm transition focus:ring-2 ${
    error ? "border-red-500" : "border-gray-300 focus:border-green-500"
  }`;

  return (
    <>
      {/* Text Input Area (must accept RHF props) */}
      <Combobox.Input
        className={inputClass}
        placeholder={placeholder}
        onChange={(event) => {
          setQuery(event.target.value);
          // RHF should still manage the base text input value here
          rhfProps.onChange(event);
        }}
        onBlur={rhfProps.onBlur}
        ref={rhfProps.ref}
        // NOTE: displayValue is omitted here as we rely on the parent Combobox value prop to manage input text
      />

      {/* Dropdown Button (to show all options) */}
      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500">
        {/* Icon indicating variable selection */}
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
      </Combobox.Button>
    </>
  );
};

export default PickerInputAndButton;
