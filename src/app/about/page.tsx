import React from "react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">About FreshSaver AI</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          FreshSaver AI is on a mission to reduce food waste in households across the globe. 
          We believe that with the right tools and automation, we can make sustainable living effortless and affordable.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
        <p className="mb-6">
          Founded in 2024, FreshSaver started as a simple idea: what if your kitchen could manage itself? 
          By combining smart inventory tracking with AI-powered recipe generation, we&apos;ve created a system that 
          not only saves you money but also helps the planet.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li><strong>Sustainability:</strong> Every feature we build is designed to minimize waste.</li>
          <li><strong>Simplicity:</strong> Technology should work for you, not the other way around.</li>
          <li><strong>Innovation:</strong> We constantly explore new ways to use AI for good.</li>
        </ul>
      </div>
    </div>
  );
}
