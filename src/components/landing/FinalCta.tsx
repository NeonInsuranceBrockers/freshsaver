// components/landing/FinalCta.tsx
import React from "react";
import Link from "next/link";
import { Star, DollarSign, Leaf } from "lucide-react";

/**
 * Server Component for the Final Call-to-Action and Social Proof block.
 */
export const FinalCta: React.FC = () => {
  const stats = [
    {
      icon: DollarSign,
      value: "30%",
      label: "Average monthly savings on groceries",
    },
    {
      icon: Leaf,
      value: "1.2K+",
      label: "Tons of food waste prevented annually",
    },
    { icon: Star, value: "4.9/5", label: "Average user satisfaction rating" },
  ];

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Social Proof Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="p-4">
                <IconComponent className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="text-4xl font-extrabold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Testimonial Placeholder */}
        <div className="max-w-xl mx-auto mb-16 p-6 border-l-4 border-primary bg-muted/30 rounded-lg shadow-inner">
          <p className="italic text-lg text-muted-foreground">
            &quot;I used to waste hundreds a month. Now, FreshSaver AI
            proactively suggests meals and sends alerts. It&apos;s the easiest
            way I&apos;ve found to manage my budget and my time.&quot;
          </p>
          <p className="mt-4 font-semibold text-foreground">
            — Sarah K., Home Cook
          </p>
        </div>

        {/* Final CTA Block */}
        <div className="max-w-3xl mx-auto p-10 bg-primary/10 rounded-2xl border border-primary/20">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Ready to take control of your kitchen?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands already automating their grocery list and eliminating
            food waste.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-primary px-10 py-4 text-xl font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition duration-300 transform hover:scale-[1.05]"
          >
            Join Thousands of Happy Users
          </Link>
        </div>
      </div>
    </section>
  );
};
