// components/landing/DetailedFeatures.tsx
import React from "react";
import { ShieldCheck, Brain, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Server Component for the Detailed Features section (Deep Dive).
 * Highlights specific model-backed features like Credential security, AI, and Scheduling.
 */
export const DetailedFeatures: React.FC = () => {
  const features = [
    {
      id: 1,
      icon: ShieldCheck,
      title: "Secure Integrations via Credential Vault",
      description:
        "Connect your smart fridge, favorite grocery partners, or custom APIs securely. Our encrypted credential vault ensures your sensitive API keys and tokens are never exposed, enabling seamless automation flows.",
      imagePlaceholder: "Placeholder: Credential Manager Screen",
      reverse: false,
    },
    {
      id: 2,
      icon: Brain,
      title: "AI-Powered Recipe Generation",
      description:
        "Integrate our 'GenerateRecipe' node directly into your automation flows. Instantly suggest healthy, custom recipes tailored specifically to use up the ingredients that are about to expire, minimizing waste effortlessly.",
      imagePlaceholder: "Placeholder: AI Recipe Suggestion Output",
      reverse: true,
    },
    {
      id: 3,
      icon: Calendar,
      title: "Visual Meal Calendar & Preparation",
      description:
        "Drag-and-drop your saved recipes into your weekly calendar for breakfast, lunch, and dinner. The system automatically cross-references scheduled meals against your current inventory to build the perfect grocery list.",
      imagePlaceholder: "Placeholder: Meal Calendar View",
      reverse: false,
    },
  ];

  return (
    <section
      id="detailed-features"
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Designed for Effortless Efficiency
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A deep dive into the technology that saves you time and money.
          </p>
        </header>

        <div className="space-y-24">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                feature.reverse ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Feature Text Content */}
              <div className="md:w-1/2">
                <feature.icon className={`w-8 h-8 mb-4 text-primary`} />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <Link
                  href="/signup"
                  className={`flex items-center font-semibold text-primary hover:underline`}
                >
                  See it in action <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* Conceptual Image Placeholder */}
              <div className="md:w-1/2 w-full h-80 bg-muted rounded-xl shadow-lg flex items-center justify-center border border-border">
                <span className="text-muted-foreground text-center p-4">
                  {feature.imagePlaceholder}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
