// /app/(app)/(admin)/admin/db-manager/components/DbPageHeader.tsx
"use client";

import React from "react";

// Define the types for the component's props
type DbPageHeaderProps = {
  title: string;
  description: string;
};

export default function DbPageHeader({
  title,
  description,
}: DbPageHeaderProps) {
  return (
    <header className="pb-4 border-b">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {title}
      </h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </header>
  );
}
