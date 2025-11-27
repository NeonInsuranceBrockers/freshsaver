// /components/Navbar.tsx
"use client";

import React, { useState, useEffect, useRef, forwardRef } from "react";
import Link from "next/link";
// Assuming your utility classes like 'btn-primary' are custom or defined elsewhere

// --- Icon Components (Cleaned up) ---
const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.08z"
      clipRule="evenodd"
    />
  </svg>
);
// --- END Icons ---

// ForwardRef is not necessary here unless the parent component needs to access the DOM node.
// We will use a standard function component and useRef internally for click outside detection.
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu visibility
  const [isDestinationOpen, setIsDestinationOpen] = useState(false); // Mobile Submenu 1
  const [isPartnersOpen, setIsPartnersOpen] = useState(false); // Mobile Submenu 2
  const [isCompanyOpen, setIsCompanyOpen] = useState(false); // Mobile Submenu 3

  const menuRef = useRef<HTMLElement>(null);

  const closeAllMenus = () => {
    setIsOpen(false);
    setIsDestinationOpen(false);
    setIsPartnersOpen(false);
    setIsCompanyOpen(false);
  };

  // Logic to close mobile menus when navigation link is clicked
  const handleLinkClick = () => {
    // This is called when any mobile link is clicked, closing the main menu
    closeAllMenus();
  };

  // Logic to close dropdowns when clicking outside (Desktop only, as mobile uses handleLinkClick)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // If the main mobile menu is open, we close it, but desktop dropdowns are CSS driven.
        if (isOpen) {
          setIsOpen(false);
          // Also reset mobile submenu states
          setIsDestinationOpen(false);
          setIsPartnersOpen(false);
          setIsCompanyOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Toggle handlers for mobile submenus
  const toggleDestination = () => setIsDestinationOpen((prev) => !prev);
  const togglePartners = () => setIsPartnersOpen((prev) => !prev);
  const toggleCompany = () => setIsCompanyOpen((prev) => !prev);

  return (
    <nav
      className="bg-background border-b border-border shadow-sm"
      ref={menuRef}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 1. Left Section (Logo) */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              CEDU
            </Link>
          </div>

          {/* 2. Center Section (Desktop Nav Links) - Uses CSS group-hover for dropdowns */}
          <div className="hidden sm:flex sm:flex-1 sm:justify-center">
            <div className="flex space-x-8">
              <Link
                href="/student"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-foreground hover:border-muted-foreground hover:text-muted-foreground"
              >
                Student
              </Link>

              {/* Destination Dropdown */}
              <div className="relative group inline-flex items-center">
                <button className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-foreground hover:text-muted-foreground focus:outline-none">
                  <span>Destination</span>
                  <ChevronDownIcon className="ml-1 h-5 w-5 text-muted-foreground transition-transform duration-150 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 z-10 mt-2 w-56 -translate-x-1/2 transform rounded-[--radius] bg-card py-1 shadow-lg ring-1 ring-border focus:outline-none opacity-0 invisible transition-all duration-150 group-hover:opacity-100 group-hover:visible">
                  <Link
                    href="/destination/usa"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    United States
                  </Link>
                  <Link
                    href="/destination/canada"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    Canada
                  </Link>
                  <Link
                    href="/destination/uk"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    United Kingdom
                  </Link>
                  <Link
                    href="/destination/australia"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    Australia
                  </Link>
                  <Link
                    href="/destination/nz"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    New Zealand
                  </Link>
                </div>
              </div>

              {/* Partners Dropdown */}
              <div className="relative group inline-flex items-center">
                <button className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-foreground hover:text-muted-foreground focus:outline-none">
                  <span>Partners</span>
                  <ChevronDownIcon className="ml-1 h-5 w-5 text-muted-foreground transition-transform duration-150 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 z-10 mt-2 w-56 -translate-x-1/2 transform rounded-[--radius] bg-card py-1 shadow-lg ring-1 ring-border focus:outline-none opacity-0 invisible transition-all duration-150 group-hover:opacity-100 group-hover:visible">
                  <Link
                    href="/partners/institution"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    Institutions
                  </Link>
                  <Link
                    href="/partners/agent"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    Agent (Recruitment Partner)
                  </Link>
                  <Link
                    href="/partners/jobs"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    Job Opportunities
                  </Link>
                </div>
              </div>

              {/* Company Dropdown */}
              <div className="relative group inline-flex items-center">
                <button className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-foreground hover:text-muted-foreground focus:outline-none">
                  <span>Company</span>
                  <ChevronDownIcon className="ml-1 h-5 w-5 text-muted-foreground transition-transform duration-150 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-1/2 z-10 mt-2 w-56 -translate-x-1/2 transform rounded-[--radius] bg-card py-1 shadow-lg ring-1 ring-border focus:outline-none opacity-0 invisible transition-all duration-150 group-hover:opacity-100 group-hover:visible">
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/careers"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    Careers
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    Contact
                  </Link>
                  <div className="border-t border-border my-1"></div>
                  <Link
                    href="/privacy"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/cookies"
                    className="block px-4 py-2 text-sm text-card-foreground hover:bg-secondary"
                  >
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Right Section (Buttons + Mobile Hamburger) */}
          <div className="flex items-center">
            {/* Desktop Action Buttons */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-3">
              <Link href="/register" className="btn btn-secondary">
                Register
              </Link>
              <Link href="/login" className="btn btn-primary">
                Log In
              </Link>
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <div className="ml-4 -mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-background p-2 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <XIcon className="block h-6 w-6" />
                ) : (
                  <MenuIcon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden border-t border-border" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* Static Link */}
            <Link
              href="/student"
              onClick={handleLinkClick}
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-foreground hover:border-muted-foreground hover:bg-secondary"
            >
              Student
            </Link>

            {/* Mobile Destination Sub-menu */}
            <div className="pt-1">
              <button
                onClick={toggleDestination}
                className="flex w-full items-center justify-between border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-foreground hover:border-muted-foreground hover:bg-secondary"
              >
                <span>Destination</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    isDestinationOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isDestinationOpen && (
                <div className="mt-1 space-y-1 pl-8">
                  <Link
                    href="/destination/usa"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    United States
                  </Link>
                  <Link
                    href="/destination/canada"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Canada
                  </Link>
                  <Link
                    href="/destination/uk"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    United Kingdom
                  </Link>
                  <Link
                    href="/destination/australia"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Australia
                  </Link>
                  <Link
                    href="/destination/nz"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    New Zealand
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Partners Sub-menu */}
            <div className="pt-1">
              <button
                onClick={togglePartners}
                className="flex w-full items-center justify-between border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-foreground hover:border-muted-foreground hover:bg-secondary"
              >
                <span>Partners</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    isPartnersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isPartnersOpen && (
                <div className="mt-1 space-y-1 pl-8">
                  <Link
                    href="/partners/institution"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Institutions
                  </Link>
                  <Link
                    href="/partners/agent"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Agent (Recruitment Partner)
                  </Link>
                  <Link
                    href="/partners/jobs"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Job Opportunities
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Company Sub-menu */}
            <div className="pt-1">
              <button
                onClick={toggleCompany}
                className="flex w-full items-center justify-between border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-foreground hover:border-muted-foreground hover:bg-secondary"
              >
                <span>Company</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    isCompanyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isCompanyOpen && (
                <div className="mt-1 space-y-1 pl-8">
                  <Link
                    href="/about"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/careers"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Careers
                  </Link>
                  <Link
                    href="/contact"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/cookies"
                    onClick={handleLinkClick}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Cookie Policy
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="border-t border-border pt-4 pb-3">
            <div className="flex flex-col space-y-3 px-4">
              <Link
                href="/register"
                onClick={handleLinkClick}
                className="btn btn-secondary w-full justify-center"
              >
                Register
              </Link>
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="btn btn-primary w-full justify-center"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
