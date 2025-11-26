import React from "react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none text-muted-foreground">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide directly to us, such as when you create an account, update your inventory, or communicate with us. This may include your name, email address, and kitchen inventory data.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to provide, maintain, and improve our services, such as generating personalized recipes and sending expiration alerts.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Data Security</h2>
        <p className="mb-4">
          We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
        </p>
        
        <p className="mt-8 italic">
          (This is a placeholder Privacy Policy. Please consult with a legal professional for actual legal documents.)
        </p>
      </div>
    </div>
  );
}
