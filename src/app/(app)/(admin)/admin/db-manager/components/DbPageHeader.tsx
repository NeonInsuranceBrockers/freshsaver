// /src/app/(app)/(admin)/admin/db-manager/components/DbPageHeader.tsx

import React from "react";
import { Database } from "lucide-react";

interface DbPageHeaderProps {
  title: string;
  description: string;
}

const DbPageHeader: React.FC<DbPageHeaderProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-2 mb-8 border-b pb-6 border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
          <Database className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl ml-1">
        {description}
      </p>
    </div>
  );
};

export default DbPageHeader;
