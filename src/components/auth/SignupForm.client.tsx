// components/auth/SignupForm.client.tsx
"use client";

import React, { useState } from "react";
import { Loader2, Mail, Lock, User, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter

// Placeholder for Server Action handling signup
async function registerUser(formData: FormData) {
  console.log("Registering new user...");
  await new Promise((resolve) => setTimeout(resolve, 1800)); // Simulate API delay

  const email = formData.get("email");
  if (email && (email as string).includes("@")) {
    // --- SIMULATE COOKIE SETTING (Development only) ---
    // In a real scenario, this might redirect to a verification page,
    // but for middleware testing, we simulate instant login post-signup.
    if (typeof document !== "undefined") {
      document.cookie =
        "freshsaver-session=valid-token-signup; path=/; max-age=3600"; // Set a mock session cookie
    }
    // ----------------------------------------------------
    return {
      success: true,
      message: "Registration successful! Redirecting you to the dashboard...",
    };
  } else {
    return {
      success: false,
      message: "Registration failed. Please check input fields.",
    };
  }
}

export const SignupForm: React.FC = () => {
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

    // Basic client-side password match validation
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Passwords do not match.");
      setIsPending(false);
      return;
    }

    const result = await registerUser(formData);

    if (result.success) {
      setSuccess(result.message);

      // Redirect to dashboard after successful session setup
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setError(result.message);
      setIsPending(false);
    }

    if (!result.success) {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
        Start Your Free Trial
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-400">
        Automate your kitchen and stop food waste today.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Jane Doe"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

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
        <div className="grid grid-cols-2 gap-4">
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
                minLength={8}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Terms checkbox (Conceptual) */}
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="terms"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            I agree to the{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>
          </label>
        </div>

        {/* Error/Success Message */}
        {error && (
          <p className="text-sm text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {success}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Link to Login */}
      <div className="text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};
