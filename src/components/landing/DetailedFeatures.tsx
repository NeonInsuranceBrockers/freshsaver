// components/landing/DetailedFeatures.tsx
import React from "react";
import { ShieldCheck, Brain, Calendar, ArrowRight } from "lucide-react";

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
      color: "text-green-500",
    },
    {
      id: 2,
      icon: Brain,
      title: "AI-Powered Recipe Generation",
      description:
        "Integrate our 'GenerateRecipe' node directly into your automation flows. Instantly suggest healthy, custom recipes tailored specifically to use up the ingredients that are about to expire, minimizing waste effortlessly.",
      imagePlaceholder: "Placeholder: AI Recipe Suggestion Output",
      reverse: true,
      color: "text-blue-500",
    },
    {
      id: 3,
      icon: Calendar,
      title: "Visual Meal Calendar & Preparation",
      description:
        "Drag-and-drop your saved recipes into your weekly calendar for breakfast, lunch, and dinner. The system automatically cross-references scheduled meals against your current inventory to build the perfect grocery list.",
      imagePlaceholder: "Placeholder: Meal Calendar View",
      reverse: false,
      color: "text-orange-500",
    },
  ];

  return (
    <section
      id="detailed-features"
      className="py-20 bg-gray-50 dark:bg-gray-800"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Designed for Effortless Efficiency
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
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
                <feature.icon className={`w-8 h-8 mb-4 ${feature.color}`} />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {feature.description}
                </p>
                <a
                  href="/signup"
                  className={`flex items-center font-semibold ${feature.color} hover:underline`}
                >
                  See it in action <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>

              {/* Conceptual Image Placeholder */}
              <div className="md:w-1/2 w-full h-80 bg-gray-200 dark:bg-gray-900 rounded-xl shadow-lg flex items-center justify-center border border-gray-300 dark:border-gray-700">
                <span className="text-gray-500 text-center p-4">
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
