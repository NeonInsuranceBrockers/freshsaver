// components/landing/FeatureSummary.tsx
import React from "react";
import { Zap, Package, Utensils } from "lucide-react";

/**
 * Server Component for the Feature Summary section ("The Three Pillars").
 */
export const FeatureSummary: React.FC = () => {
  // Define the data for the three feature cards
  const features = [
    {
      icon: Zap,
      title: "Automate",
      headline: "Build Smart Workflows",
      description:
        "Create custom IF/THEN pipelines that monitor your inventory 24/7. Get alerts before milk expires, or trigger a recipe generator when meat is defrosted.",
      anchor: "automation-flow",
    },
    {
      icon: Package,
      title: "Control",
      headline: "Perfect Inventory Visibility",
      description:
        "Know exactly what you have, where it is, and when it expires. Organize items by category and location (Fridge, Pantry) to eliminate unnecessary purchases and reduce food waste.",
      anchor: "inventory-control",
    },
    {
      icon: Utensils,
      title: "Plan",
      headline: "Seamless Meal Integration",
      description:
        "Turn expiring ingredients into scheduled meals. Automatically populate your shareable grocery list with missing items required for planned recipes.",
      anchor: "meal-planning",
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            The FreshSaver Difference
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
            Three Pillars of Kitchen Efficiency
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={feature.title}
                className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-border"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">
                  {feature.headline}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
