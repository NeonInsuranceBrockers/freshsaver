// components/auth/LoginForm.client.tsx
"use client";

import React, { useState } from "react";
import { Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter

// Helper function to get the redirect parameter from the URL
const getRedirectPath = () => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    return params.get("redirect") || "/dashboard";
  }
  return "/dashboard";
};

// Placeholder for Server Action handling login
async function authenticateUser(formData: FormData) {
  console.log("Authenticating user...");
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

  const email = formData.get("email");
  if (email === "test@freshsaver.com") {
    // --- SIMULATE COOKIE SETTING (Development only) ---
    // In a production app, the Server Action or API route sets an HTTP-only cookie.
    // For testing client-side flow & middleware activation:
    if (typeof document !== "undefined") {
      document.cookie = "freshsaver-session=valid-token; path=/; max-age=3600"; // Set a mock session cookie
    }
    // ----------------------------------------------------
    return { success: true, message: "Login successful!" };
  } else {
    return {
      success: false,
      message: "Invalid credentials or user not found.",
    };
  }
}

export const LoginForm: React.FC = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter(); // Initialize router

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const result = await authenticateUser(formData);

    if (result.success) {
      setSuccess(result.message);

      // Get the path the user originally intended to go to
      const redirectPath = getRedirectPath();

      // In a real app, redirection happens after the cookie is set by the server.
      // We wait briefly for the success message to show, then redirect.
      setTimeout(() => {
        router.push(redirectPath);
      }, 500); // Wait 0.5s before redirecting
    } else {
      setError(result.message);
      setIsPending(false); // Only stop pending if login failed, success handles redirect
    }

    // We only set isPending to false on failure, because on success,
    // the redirect will handle the state cleanup/navigation.
    if (!result.success) {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
        Welcome Back
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-400">
        Log in to your FreshSaver AI Command Center.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Error/Success Message */}
        {error && (
          <p className="text-sm text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            {success}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            "Log In"
          )}
        </button>
      </form>

      {/* Link to Signup */}
      <div className="text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign Up Now
          </Link>
        </p>
      </div>
    </div>
  );
};
