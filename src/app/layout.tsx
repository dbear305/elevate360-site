import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

// Global metadata for the whole site
export const metadata: Metadata = {
  title: "Elevate360 Systems – Privacy-First Engineering Studio",
  description:
    "Elevate360 Systems is a privacy-first engineering studio focused on real-world operations, applied mathematics, and practical systems thinking. Built from experience. Engineered with discipline.",
  openGraph: {
    title: "Elevate360 Systems – Privacy-First Engineering Studio",
    description:
      "Elevate360 Systems is a privacy-first engineering studio focused on real-world operations, applied mathematics, and practical systems thinking.",
    url: "https://elevate360systems.com",
    siteName: "Elevate360 Systems",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elevate360 Systems – Privacy-First Engineering Studio",
    description:
      "Privacy-first engineering for real-world operations, trading, and field systems. Built from experience. Engineered with discipline.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
