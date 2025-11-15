import type { Metadata, Viewport } from "next"; // <-- Import Viewport type
// import { Inter } from "next/font/google";
// import Footer from "@/components/footer";
// import Navbar from "@/components/header";
import "./globals.css";
import Providers from "@/components/NProgressProvider";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

const siteUrl = "https://cedu.app"; // Example production domain

// --- SEO Metadata for CEDU ---
export const metadata: Metadata = {
  // --- Basic Metadata ---
  title: {
    template: "%s | CEDU",
    default: "CEDU | Your Future Goes Beyond Borders",
  },
  description:
    "Explore 1,500+ global universities and colleges. Submit your best possible application with a 95% success rate. Unlock your full potential with CEDU!",

  // --- Keywords & Author ---
  keywords: [
    "study abroad",
    "university application",
    "international students",
    "find university",
    "college search",
    "CEDU",
    "education partners",
    "student recruitment",
    "study in Canada",
    "study in UK",
    "study in USA",
    "study in Australia",
    "education consultant",
    "university admissions",
  ],
  authors: [{ name: "CEDU", url: siteUrl }],

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
    title: "CEDU | Your Future Goes Beyond Borders",
    description:
      "Explore global universities and apply with a 95% success rate.",
    url: siteUrl,
    siteName: "CEDU",
    images: [
      {
        url: "/images/cedu-og-image.png",
        width: 1200,
        height: 630,
        alt: "CEDU - Study Abroad Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // --- Twitter Card (for Twitter) ---
  twitter: {
    card: "summary_large_image",
    title: "CEDU | Your Future Goes Beyond Borders",
    description:
      "Explore global universities and apply with a 95% success rate.",
    images: ["/images/cedu-og-image.png"],
  },

  // --- Other Tags ---
  // themeColor: "#f97316", // ❌ REMOVED: Moved to the 'viewport' export below
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
    <html
      lang="en"
      // className={`${inter.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        {/* <Navbar /> Use our Navbar component */}
        {/* ✅ RENDER THE WRAPPER INSTEAD */}
        <main className="grow">
          <Providers>{children}</Providers>
        </main>

        {/* <Footer /> */}
      </body>
    </html>
  );
}
