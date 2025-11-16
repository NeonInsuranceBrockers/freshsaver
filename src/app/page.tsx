// app/page.tsx
import React from "react";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureSummary } from "@/components/landing/FeatureSummary";
import { DetailedFeatures } from "@/components/landing/DetailedFeatures";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

// Define metadata for SEO (optional, but good practice for a public page)
export const metadata = {
  title:
    "FreshSaver AI | Automated Waste Reduction, Inventory, and Meal Planning",
  description:
    "Use custom automation flows to track food expiry, suggest recipes, and build smart grocery lists automatically. Stop food waste, start saving.",
};

/**
 * Main Landing Page (Root Server Component).
 * This component acts as the layout assembler for the public-facing marketing page.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Header (Navigation) */}
      <Header />

      <main className="grow">
        {/* 2. Hero */}
        <HeroSection />

        {/* 3. Feature Summary (The "Three Pillars") */}
        <FeatureSummary />

        {/* 4. Detailed Features (Deep Dive) */}
        <DetailedFeatures />

        {/* 5. Social Proof / CTA */}
        <FinalCta />
      </main>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}
