// components/landing/Header.tsx
import Link from "next/link";
import React from "react";
import { Zap, LogIn } from "lucide-react";

/**
 * Server Component for the Landing Page Header/Navigation Bar.
 */
export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-sm dark:bg-gray-900/90">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Branding */}
        <Link
          href="/"
          className="flex items-center space-x-2 font-bold text-xl text-blue-600 dark:text-blue-400"
        >
          <Zap className="w-6 h-6" />
          <span>FreshSaver AI</span>
        </Link>

        {/* Main Navigation Links (SC) */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="#features" className="hover:text-blue-600 transition">
            Features
          </Link>
          <Link href="#use-cases" className="hover:text-blue-600 transition">
            Use Cases
          </Link>
          <Link href="#pricing" className="hover:text-blue-600 transition">
            Pricing
          </Link>
        </nav>

        {/* Authentication CTAs (SC) */}
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="flex items-center text-sm font-medium hover:text-blue-600 transition"
          >
            <LogIn className="w-4 h-4 mr-1" />
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition duration-300"
          >
            Start for Free
          </Link>
        </div>
      </div>
    </header>
  );
};
