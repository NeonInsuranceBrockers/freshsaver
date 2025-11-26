// /app/unauthorized/page.tsx

import React from "react";
import Link from "next/link";
import { Lock, LogOut, Mail } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

export const metadata = {
  title: "Access Restricted | FreshSaver AI",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-6">
          <Lock className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Access Restricted
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You are signed in, but your account is not linked to an active
          Organization yet.
        </p>

        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-8 text-left space-y-2">
          <p className="font-semibold">What should I do?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Contact your Organization Administrator to invite you.</li>
            <li>Ask them to use the email address you signed in with.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <Link
            href="mailto:support@freshsaver.com"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Link>

          {/* Clerk Logout Button */}
          <SignOutButton>
            <button className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </SignOutButton>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          User ID: {`Pending Assignment`}
        </p>
      </div>
    </div>
  );
}
