import React from "react";

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">Cookie Policy</h1>
      <div className="prose dark:prose-invert max-w-none text-muted-foreground">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. What Are Cookies</h2>
        <p className="mb-4">
          Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How FreshSaver AI Uses Cookies</h2>
        <p className="mb-4">
          We use cookies for the following purposes: to enable certain functions of the Service, to provide analytics, to store your preferences, and to enable advertisements delivery, including behavioral advertising.
        </p>
        
        <p className="mt-8 italic">
          (This is a placeholder Cookie Policy. Please consult with a legal professional for actual legal documents.)
        </p>
      </div>
    </div>
  );
}
