// components/landing/HeroSection.tsx
import Link from "next/link";
import React from "react";
import { Play, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";

/**
 * Server Component for the Hero Section.
 * Contains the main headline, subheadline, and primary CTAs.
 */
export const HeroSection: React.FC = async () => {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <section className="bg-muted/30 pt-20 pb-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline and Subheadline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6">
          Stop Food Waste, <span className="text-primary">Start Saving.</span>
        </h1>

        <p className="max-w-3xl mx-auto text-xl text-muted-foreground mb-10">
          Use powerful, custom flows to track expiry dates, suggest recipes, and
          build smart grocery lists automatically. Take control of your kitchen
          inventory with AI-powered efficiency.
        </p>

        {/* Primary CTAs */}
        <div className="flex justify-center space-x-4 mb-16">
          {isSignedIn ? (
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/dashboard">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/signup">Start for Free</Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-6 py-6"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>

        {/* Conceptual Visual Mockup (Placeholder Image) */}
        <div className="relative mx-auto w-full max-w-6xl shadow-2xl rounded-xl border border-border overflow-hidden">
          {/* Placeholder for a complex dashboard screenshot */}
          <div className="flex items-center justify-center h-96 bg-muted text-muted-foreground">
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
