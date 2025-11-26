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
//        SITE METADATA
// ===============================
export const metadata: Metadata = {
  title: "Elevate360 Systems – Privacy-First Engineering, Analytics & Field Operations",
  description:
    "Elevate360 Systems™ is a privacy-first engineering studio focused on real-world operations, applied mathematics, and practical systems thinking.",
};

// ===============================
//          ROOT LAYOUT
// ===============================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Your working 32x32 favicon */}
        <link rel="icon" href="/favicon.png" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
