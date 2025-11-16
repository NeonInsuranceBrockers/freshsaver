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
    <section className="bg-white dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Social Proof Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="p-4">
                <IconComponent className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Testimonial Placeholder */}
        <div className="max-w-xl mx-auto mb-16 p-6 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
          <p className="italic text-lg text-gray-700 dark:text-gray-300">
            &quot;I used to waste hundreds a month. Now, FreshSaver AI
            proactively suggests meals and sends alerts. It&apos;s the easiest
            way I&apos;ve found to manage my budget and my time.&quot;
          </p>
          <p className="mt-4 font-semibold text-gray-900 dark:text-white">
            — Sarah K., Home Cook
          </p>
        </div>

        {/* Final CTA Block */}
        <div className="max-w-3xl mx-auto p-10 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to take control of your kitchen?
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Join thousands already automating their grocery list and eliminating
            food waste.
          </p>
          <Link
            href="/signup"
            className="inline-block rounded-lg bg-blue-600 px-10 py-4 text-xl font-semibold text-white shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.05]"
          >
            Join Thousands of Happy Users
          </Link>
        </div>
      </div>
    </section>
  );
};
