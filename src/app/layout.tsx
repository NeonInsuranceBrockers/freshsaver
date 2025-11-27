import type { Metadata, Viewport } from "next"; // <-- Import Viewport type
// import { Inter } from "next/font/google";
// import Footer from "@/components/footer";
// import Navbar from "@/components/header";
import "./globals.css";
import Providers from "@/components/NProgressProvider";
import { ClerkProvider } from "@clerk/nextjs";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

const siteUrl = "https://www.freshsaverai.com";

// --- SEO Metadata for CEDU ---
export const metadata: Metadata = {
  // --- Basic Metadata ---
  title: {
    template: "%s | FreshSaver AI",
    default: "FreshSaver AI | Stop Food Waste, Start Saving",
  },
  description:
    "Automate your kitchen inventory, reduce food waste, and simplify meal planning with custom, AI-powered flows. Gain perfect visibility into expiration dates and stock levels.",

  // --- Keywords & Author ---
  keywords: [
    "food waste reduction",
    "smart kitchen",
    "inventory management",
    "meal planning automation",
    "expiration tracking",
    "grocery list sync",
    "AI recipe generator",
    "home efficiency",
    "FreshSaver AI",
    "automation flows",
  ],
  authors: [{ name: "FreshSaver AI", url: siteUrl }],

  // --- Advanced SEO ---
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // --- Open Graph (for Facebook, LinkedIn, etc.) ---
  openGraph: {
    title: "FreshSaver AI | Automated Waste Reduction",
    description:
      "Automate expiry alerts, generate recipes from expiring stock, and save money by eliminating food waste.",
    url: siteUrl,
    siteName: "FreshSaver AI",
    images: [
      {
        url: "/images/freshsaver-og-image.png", // Ensure you update this asset path
        width: 1200,
        height: 630,
        alt: "FreshSaver AI - Automated Kitchen Command Center",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // --- Twitter Card (for Twitter) ---
  twitter: {
    card: "summary_large_image",
    title: "FreshSaver AI | Stop Food Waste, Start Saving",
    description:
      "Automate expiry alerts, generate recipes from expiring stock, and save money by eliminating food waste.",
    images: ["/images/freshsaver-og-image.png"],
  },

  // --- Other Tags ---
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

// ----------------------------------------------------
// ➡️ NEW EXPORT: viewport (Required for themeColor)
// ----------------------------------------------------
export const viewport: Viewport = {
  themeColor: "#f97316", // ✅ CORRECT: themeColor is now in 'viewport'
};
// ----------------------------------------------------

// --- Root Layout Component ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        // className={`${inter.variable} dark`}
        suppressHydrationWarning
      >
        <body className="min-h-screen flex flex-col">
          {/* <Navbar /> Use our Navbar component */}
          {/* ✅ RENDER THE WRAPPER INSTEAD */}
          <main className="grow">
            {/* <Providers>{children}</Providers> */}
            {children}
          </main>

          {/* <Footer /> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
