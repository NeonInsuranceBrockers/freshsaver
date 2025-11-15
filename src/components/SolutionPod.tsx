// components/SolutionPod.tsx
import React from "react";

interface SolutionPodProps {
  icon: React.ReactNode;
  label: string;
  className?: string; // For absolute positioning
  iconBgColor: string;
  iconTextColor: string;
}

export default function SolutionPod({
  icon,
  label,
  className,
  iconBgColor,
  iconTextColor,
}: SolutionPodProps) {
  let iconWithClasses = icon; // Default to the original icon

  // --- FIX ---
  // Type guard to ensure 'icon' is a valid React element
  // and that 'props' is an object we can safely access.
  if (
    React.isValidElement(icon) &&
    typeof icon.props === "object" &&
    icon.props !== null
  ) {
    // Safely get the existing className by casting props
    const existingClassName =
      (icon.props as { className?: string }).className || "";

    // Clone the element and merge the new responsive classes with any existing ones
    iconWithClasses = React.cloneElement(
      icon as React.ReactElement,
      {
        className: `h-4 w-4 md:h-5 md:w-5 ${existingClassName}`,
      } as { className: string }
    );
  }
  // --- END FIX ---

  return (
    // Responsive padding and gap
    <div
      className={`flex items-center gap-2 bg-card rounded-full py-2 px-3 md:py-3 md:px-5 shadow-lg ${
        className || ""
      }`}
    >
      {/* Responsive icon container */}
      <div
        className={`p-1.5 md:p-2 rounded-full ${iconBgColor} ${iconTextColor} bg-opacity-30`}
      >
        {iconWithClasses} {/* Use the new, type-safe icon */}
      </div>
      {/* Responsive font size */}
      <span className="font-medium text-foreground whitespace-nowrap text-xs md:text-sm">
        {label}
      </span>
    </div>
  );
}
