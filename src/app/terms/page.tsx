import React from "react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none text-muted-foreground">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using FreshSaver AI, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily download one copy of the materials (information or software) on FreshSaver AI&apos;s website for personal, non-commercial transitory viewing only.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Disclaimer</h2>
        <p className="mb-4">
          The materials on FreshSaver AI&apos;s website are provided on an &apos;as is&apos; basis. FreshSaver AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
        
        <p className="mt-8 italic">
          (This is a placeholder Terms of Service. Please consult with a legal professional for actual legal documents.)
        </p>
      </div>
    </div>
  );
}
