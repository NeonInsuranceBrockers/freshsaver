// app/robots.ts

import { MetadataRoute } from 'next';

// !! REPLACE THIS with your production domain
const siteUrl = "https://tekjunction.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Applies to all search engines
      allow: '/',     // Allow crawling of all pages
      // disallow: '/private/', // Add any private pages here
    },
    sitemap: `${siteUrl}/sitemap.xml`, // Location of your sitemap
  };
}