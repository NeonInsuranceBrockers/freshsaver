// components/landing/Footer.tsx
import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

/**
 * Server Component for the Landing Page Footer.
 */
export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section: Logo and Main Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-border pb-8">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center space-x-2 font-bold text-lg text-primary"
            >
              <Zap className="w-5 h-5" />
              <span>FreshSaver AI</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-3">
              Automating efficiency, one kitchen at a time.
            </p>
          </div>

          {/* Features Column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#automation-flow"
                  className="hover:text-primary transition"
                >
                  Automation Flows
                </Link>
              </li>
              <li>
                <Link
                  href="#inventory-control"
                  className="hover:text-primary transition"
                >
                  Inventory Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="#meal-planning"
                  className="hover:text-primary transition"
                >
                  Meal Planning
                </Link>
              </li>
              <li>
                <Link
                  href="#detailed-features"
                  className="hover:text-primary transition"
                >
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-primary transition"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-primary transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-primary transition"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
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
              className="hover:text-primary"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
