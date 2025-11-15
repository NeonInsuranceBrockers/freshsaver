// Updated: /components/Navbar.tsx
'use client'; // This directive marks this as a Client Component

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// --- Icon Components (inlined for simplicity) ---
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
  <svg
    {...props}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

// --- The Main Navbar Component ---

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false); // <-- NEW state
  const menuRef = useRef<HTMLDivElement>(null);

  // Helper function to close all mobile menus
  const closeAllMenus = () => {
    setIsOpen(false);
    setIsPartnersOpen(false);
    setIsDestinationOpen(false);
  };

  // Close mobile menu if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeAllMenus();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <nav
      className="bg-background border-b border-border shadow-sm"
      ref={menuRef}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* MODIFIED: Layout is now 3 columns: Logo | Nav | Buttons */}
        <div className="flex h-16 items-center justify-between">
          {/* 1. Left Section (Logo) */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold"
              style={{ color: 'var(--primary)' }}
            >
              CEDU
            </Link>
          </div>

          {/* 2. Center Section (Desktop Nav Links) */}
          <div className="hidden sm:flex sm:flex-1 sm:justify-center">
            <div className="flex space-x-8">
              <Link
                href="/student"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-foreground hover:border-muted-foreground hover:text-muted-foreground"
              >
                Student
              </Link>

              {/* --- NEW: Destination Dropdown (Desktop) --- */}
              <div className="relative group inline-flex items-center">
                <button className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-foreground hover:text-muted-foreground focus:outline-none">
                  <span>Destination</span>
                  <ChevronDownIcon className="ml-1 h-5 w-5 text-muted-foreground transition-transform duration-150 group-hover:rotate-180" />
                </button>
                <div
                  className="absolute top-full left-1/2 z-10 mt-2 w-56 -translate-x-1/2 transform rounded-[--radius] bg-card py-1 shadow-lg ring-1 ring-border focus:outline-none
                               opacity-0 invisible transition-all duration-150 group-hover:opacity-100 group-hover:visible"
                >
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

              {/* Partners Dropdown (Desktop) */}
              <div className="relative group inline-flex items-center">
                <button className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-foreground hover:text-muted-foreground focus:outline-none">
                  <span>Partners</span>
                  <ChevronDownIcon className="ml-1 h-5 w-5 text-muted-foreground transition-transform duration-150 group-hover:rotate-180" />
                </button>

                <div
                  className="absolute top-full left-1/2 z-10 mt-2 w-56 -translate-x-1/2 transform rounded-[--radius] bg-card py-1 shadow-lg ring-1 ring-border focus:outline-none
                               opacity-0 invisible transition-all duration-150 group-hover:opacity-100 group-hover:visible"
                >
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

      {/* Mobile Menu, show/hide based on menu state. */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 pt-2 pb-3">
            <Link
              href="/student"
              onClick={closeAllMenus}
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-foreground hover:border-muted-foreground hover:bg-secondary"
            >
              Student
            </Link>

            {/* --- NEW: Mobile Destination Sub-menu --- */}
            <div className="pt-1">
              <button
                onClick={() => setIsDestinationOpen(!isDestinationOpen)}
                className="flex w-full items-center justify-between border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-foreground hover:border-muted-foreground hover:bg-secondary"
              >
                <span>Destination</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    isDestinationOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isDestinationOpen && (
                <div className="mt-1 space-y-1 pl-8">
                  <Link
                    href="/destination/usa"
                    onClick={closeAllMenus}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    United States
                  </Link>
                  <Link
                    href="/destination/canada"
                    onClick={closeAllMenus}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Canada
                  </Link>
                  <Link
                    href="/destination/uk"
                    onClick={closeAllMenus}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    United Kingdom
                  </Link>
                  <Link
                    href="/destination/australia"
                    onClick={closeAllMenus}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Australia
                  </Link>
                  <Link
                    href="/destination/nz"
                    onClick={closeAllMenus}
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
                onClick={() => setIsPartnersOpen(!isPartnersOpen)}
                className="flex w-full items-center justify-between border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-foreground hover:border-muted-foreground hover:bg-secondary"
              >
                <span>Partners</span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    isPartnersOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isPartnersOpen && (
                <div className="mt-1 space-y-1 pl-8">
                  <Link
                    href="/partners/institution"
                    onClick={closeAllMenus}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Institutions
                  </Link>
                  <Link
                    href="/partners/agent"
                    onClick={closeAllMenus}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Agent (Recruitment Partner)
                  </Link>
                  <Link
                    href="/partners/jobs"
                    onClick={closeAllMenus}
                    className="block py-2 pr-4 text-base font-medium text-muted-foreground hover:bg-secondary"
                  >
                    Job Opportunities
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
                onClick={closeAllMenus}
                className="btn btn-secondary w-full justify-center"
              >
                Register
              </Link>
              <Link
                href="/login"
                onClick={closeAllMenus}
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
}