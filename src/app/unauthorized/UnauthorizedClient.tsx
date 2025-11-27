"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, LogOut, Mail, Copy, Check } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

interface Props {
  email: string;
  userId: string;
}

export default function UnauthorizedClient({ email, userId }: Props) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const copyToClipboard = async (text: string, type: "email" | "id") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const copyBothDetails = async () => {
    const details = `Email: ${email}\nClerk ID: ${userId}`;
    try {
      await navigator.clipboard.writeText(details);
      setCopiedEmail(true);
      setCopiedId(true);
      setTimeout(() => {
        setCopiedEmail(false);
        setCopiedId(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

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
          Your account is not linked to an active Organization yet.
        </p>

        {/* User Details Card */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Share these details with your administrator:
          </p>
          
          {/* Email */}
          <div className="bg-white dark:bg-gray-800 rounded-md p-3 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                  {email}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(email, "email")}
                className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Copy email"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Clerk ID */}
          <div className="bg-white dark:bg-gray-800 rounded-md p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Clerk ID</p>
                <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                  {userId}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(userId, "id")}
                className="ml-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Copy Clerk ID"
              >
                {copiedId ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Copy Both Button */}
          <button
            onClick={copyBothDetails}
            className="w-full px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 rounded-md transition-colors flex items-center justify-center"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Both Details
          </button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6 text-left space-y-2">
          <p className="font-semibold">What should I do?</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Copy your details using the buttons above</li>
            <li>Contact your Organization Administrator</li>
            <li>Share your email and Clerk ID with them</li>
            <li>Wait for them to add you to the organization</li>
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
      </div>
    </div>
  );
}
