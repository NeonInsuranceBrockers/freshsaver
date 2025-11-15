// app/sitemap.ts

import { MetadataRoute } from "next";
// import { allProducts } from '@/lib/mock-data'; // Import your product data

// !! REPLACE THIS with your production domain
const siteUrl = "https://tekjunction.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Pages
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const, // <-- CORRECTED
      priority: 1.0,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const, // <-- CORRECTED
      priority: 0.8,
    },
    {
      url: `${siteUrl}/sale`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const, // <-- CORRECTED
      priority: 0.8,
    },
  ];

  // 2. Dynamic Category Pages
  // const categories = [
  //   // ...new Set(allProducts.map((p) => p.category.toLowerCase())),
  // ];
  // const categoryRoutes = categories.map((category) => ({
  //   url: `${siteUrl}/categories/${category}`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly" as const, // <-- CORRECTED
  //   priority: 0.7,
  // }));

  // 3. Dynamic Product Pages
  // const productRoutes = allProducts.map((product) => ({
  //   url: `${siteUrl}/product/${product.id.toString()}`,
  //   lastModified: new Date(),
  //   changeFrequency: "monthly" as const, // <-- CORRECTED
  //   priority: 0.5,
  // }));

  // Combine all routes
  return [...staticRoutes /*...categoryRoutes,...productRoutes*/];
}
