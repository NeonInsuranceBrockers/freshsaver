"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Zap, LogIn, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderClientProps {
  isSignedIn: boolean;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ isSignedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center space-x-2 font-bold text-xl text-primary"
        >
          <Zap className="w-6 h-6" />
          <span>FreshSaver AI</span>
        </Link>

        <nav className="hidden md:flex space-x-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition">
            Features
          </Link>
          <Link href="#use-cases" className="hover:text-primary transition">
            Use Cases
          </Link>
          <Link href="#pricing" className="hover:text-primary transition">
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isSignedIn ? (
            <Button asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </Link>
              <Button asChild>
                <Link href="/signup">Start for Free</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-muted-foreground hover:text-primary focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              href="#features"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#use-cases"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Use Cases
            </Link>
            <Link
              href="#pricing"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="mt-4 flex flex-col space-y-2">
              {isSignedIn ? (
                <Button asChild className="w-full">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                  <Button asChild className="w-full">
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Start for Free
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
