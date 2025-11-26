import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ===============================
//        GLOBAL METADATA
// ===============================
export const metadata: Metadata = {
  metadataBase: new URL("https://elevate360systems.com"),
  title: {
    default:
      "Elevate360 Systems – Privacy-First Engineering, Analytics & Field Operations",
    template: "%s | Elevate360 Systems",
  },
  description:
    "Elevate360 Systems™ is a privacy-first engineering studio focused on real-world operations, applied mathematics, and practical systems thinking. Built from experience. Engineered with discipline.",
  keywords: [
    "Elevate360 Systems",
    "privacy-first engineering",
    "field operations analytics",
    "elevator systems",
    "field payroll logic",
    "predictive maintenance",
    "operational analytics",
    "systems engineering studio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://elevate360systems.com/",
    siteName: "Elevate360 Systems",
    title:
      "Elevate360 Systems – Built from experience. Engineered with discipline.",
    description:
      "Elevate360 Systems™ builds transparent, understandable systems for field operations, analytics, payroll, and infrastructure—grounded in physics, constraints, and real-world experience.",
    images: [
      {
        url: "https://elevate360systems.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Elevate360 Systems – Privacy-First Engineering Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Elevate360 Systems – Privacy-First Engineering, Analytics & Field Operations",
    description:
      "Engineering studio focused on field operations, systems thinking, analytics, and secure infrastructure. Predicting tomorrow, today.",
    images: ["https://elevate360systems.com/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

// ===============================
//         ROOT LAYOUT
// ===============================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Elevate360 Systems",
    url: "https://elevate360systems.com",
    description:
      "Elevate360 Systems™ is a privacy-first engineering studio focused on real-world operations, applied mathematics, and practical systems thinking.",
    slogan: "Predicting tomorrow, today.",
    logo: "https://elevate360systems.com/favicon-32x32.png",
  };

  return (
    <html lang="en">
      <head>
        {/* FAVICONS – guaranteed setup */}
        <link
          rel="icon"
          href="/favicon.ico?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=1"
        />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
