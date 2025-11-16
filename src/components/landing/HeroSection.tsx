// components/landing/HeroSection.tsx
"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Server Component for the Hero Section.
 * Contains the main headline, subheadline, and primary CTAs.
 */
export const HeroSection: React.FC = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 pt-20 pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline and Subheadline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
          Stop Food Waste, <span className="text-blue-600">Start Saving.</span>
        </h1>

        <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10">
          Use powerful, custom flows to track expiry dates, suggest recipes, and
          build smart grocery lists automatically. Take control of your kitchen
          inventory with AI-powered efficiency.
        </p>

        {/* Primary CTAs */}
        <div className="flex justify-center space-x-4 mb-16">
          <Link
            href="/signup"
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-xl hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]"
          >
            Start for Free
          </Link>
          <button
            // Note: This button is conceptually interactive, but since the parent is SC,
            // we must use a Client Component Wrapper if we needed actual interaction
            // (like opening a modal). Here, we keep it simple or link to a demo page.
            onClick={() => console.log("Simulating demo button click")}
            className="flex items-center rounded-lg border border-gray-300 px-6 py-3 text-lg font-medium text-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </button>
        </div>

        {/* Conceptual Visual Mockup (Placeholder Image) */}
        <div className="relative mx-auto w-full max-w-6xl shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Placeholder for a complex dashboard screenshot */}
          <div className="flex items-center justify-center h-96 bg-gray-200 dark:bg-gray-900/70 text-gray-500">
            <span className="text-xl">
              Conceptual Dashboard & Flow Editor Screenshot
            </span>
          </div>
          {/* In a real app, use Image component: */}
          {/* <Image 
                        src="/mockup-dashboard.png" 
                        alt="FreshSaver AI Dashboard Mockup" 
                        layout="responsive" 
                        width={1200} 
                        height={600}
                        priority
                    /> */}
        </div>
      </div>
    </section>
  );
};
