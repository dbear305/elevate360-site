import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.elevate360systems.com"),
  title: "Elevate360 Systems™",
  description:
    "Privacy-first engineering for real-world systems. Secure software, automation, applied mathematics, cybersecurity, and infrastructure — built with clarity and discipline.",
  alternates: {
    canonical: "https://www.elevate360systems.com",
  },
  openGraph: {
    title: "Elevate360 Systems™",
    description: "Engineering real-world systems.",
    url: "https://www.elevate360systems.com",
    siteName: "Elevate360 Systems™",
    type: "website",
    images: [
      {
        url: "https://www.elevate360systems.com/og.jpg",
        width: 1200,
        height: 630,
        alt: "Elevate360 Systems™",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elevate360 Systems™",
    description: "Engineering real-world systems.",
    images: ["https://www.elevate360systems.com/og.jpg"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* LocalBusiness schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Elevate360 Systems™",
              legalName: "Elevate360 Systems LLC",
              url: "https://www.elevate360systems.com",
              logo: "https://www.elevate360systems.com/og.jpg",
              image: "https://www.elevate360systems.com/og.jpg",
              description:
                "Privacy-first engineering studio specializing in secure software, automation, applied mathematics, cybersecurity, and resilient infrastructure.",
              telephone: "+1-305-209-0418",
              email: "contact@elevate360systems.com",
              address: {
                "@type": "PostalAddress",
                addressRegion: "FL",
                addressCountry: "US",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "06:00",
                  closes: "18:00",
                },
              ],
            }),
          }}
        />

        {/* WebSite schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Elevate360 Systems™",
              url: "https://www.elevate360systems.com",
            }),
          }}
        />

        {/* Organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Elevate360 Systems™",
              url: "https://www.elevate360systems.com",
              logo: "https://www.elevate360systems.com/og.jpg",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+1-305-209-0418",
                  contactType: "customer service",
                },
              ],
            }),
          }}
        />
      </head>

      <body className="bg-slate-950 text-slate-50 antialiased">
        {/* NAVBAR */}
        <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Elevate360 Systems Logo"
                width={40}
                height={40}
                priority
                className="h-10 w-auto select-none"
              />
              <div className="flex flex-col leading-none">
                <span className="text-base font-semibold tracking-wide text-slate-100">
                  Elevate360 Systems™
                </span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-slate-400">
                  Predicting Tomorrow Today
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#services" className="hover:text-sky-400 transition">
                Services
              </a>
              <a href="#platforms" className="hover:text-sky-400 transition">
                Platforms
              </a>
              <a href="#about" className="hover:text-sky-400 transition">
                About
              </a>
              <a href="#contact" className="hover:text-sky-400 transition">
                Contact
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* FOOTER */}
        <footer className="border-t border-slate-800 mt-28 py-12 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between gap-10">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Elevate360 Systems Logo"
                height={46}
                width={46}
                priority
                className="h-11 w-auto select-none"
              />
              <div className="flex flex-col leading-none">
                <span className="text-base font-semibold tracking-wide text-slate-100">
                  Elevate360 Systems™
                </span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-slate-400 mt-[2px]">
                  Predicting Tomorrow Today
                </span>
              </div>
            </div>

            <nav className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-slate-400">
              <a href="#services" className="hover:text-sky-400 transition">
                Services
              </a>
              <a href="#platforms" className="hover:text-sky-400 transition">
                Platforms
              </a>
              <a href="#about" className="hover:text-sky-400 transition">
                About
              </a>
              <a href="#contact" className="hover:text-sky-400 transition">
                Contact
              </a>
            </nav>
          </div>

          <div className="text-center mt-10 text-xs text-slate-500">
            © {new Date().getFullYear()} Elevate360 Systems™ — All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
