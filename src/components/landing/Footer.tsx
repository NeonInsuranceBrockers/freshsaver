// components/landing/Footer.tsx
import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

/**
 * Server Component for the Landing Page Footer.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-gray-100 dark:bg-gray-950 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Logo and Main Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b pb-8 dark:border-gray-700">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center space-x-2 font-bold text-lg text-blue-600 dark:text-blue-400"
            >
              <Zap className="w-5 h-5" />
              <span>FreshSaver AI</span>
            </Link>
            <p className="text-sm text-gray-500 mt-3">
              Automating efficiency, one kitchen at a time.
            </p>
          </div>

          {/* Features Column */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="#automation-flow"
                  className="hover:text-blue-600 transition"
                >
                  Automation Flows
                </Link>
              </li>
              <li>
                <Link
                  href="#inventory-control"
                  className="hover:text-blue-600 transition"
                >
                  Inventory Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="#meal-planning"
                  className="hover:text-blue-600 transition"
                >
                  Meal Planning
                </Link>
              </li>
              <li>
                <Link
                  href="#detailed-features"
                  className="hover:text-blue-600 transition"
                >
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/about" className="hover:text-blue-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-blue-600 transition"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-600 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-600 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-blue-600 transition"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} FreshSaver AI. All rights
            reserved.
          </p>
          <div className="mt-4 md:mt-0 space-x-4">
            {/* Placeholder for social links */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
