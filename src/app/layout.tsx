import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "Elevate360 Systems™",
  description:
    "Privacy-first engineering for real-world systems. Secure software, automation, applied mathematics, and infrastructure — built with clarity, discipline, and real-world experience.",
  metadataBase: new URL("https://elevate360systems.com"),
  alternates: {
    canonical: "https://elevate360systems.com",
  },
  openGraph: {
    title: "Elevate360 Systems™",
    description:
      "Engineering • Cybersecurity • Applied Mathematics — Privacy-first engineering for real-world systems.",
    url: "https://elevate360systems.com",
    siteName: "Elevate360 Systems™",
    type: "website",
    images: ["/e360favicon.png"], // OG preview image
  },
  icons: {
    icon: "/e360favicon.png", // Favicon + navbar logo source
    shortcut: "/e360favicon.png",
    apple: "/e360favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        {/* === NAVBAR === */}
        <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            
            {/* LEFT — LOGO + TITLE + MOTTO */}
            <div className="flex items-center gap-3">
              <Image
                src="/e360favicon.png"
                alt="Elevate360 Systems Logo"
                width={36}
                height={36}
                priority
                className="rounded-xl shadow-sm"
              />

              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold tracking-wide text-slate-100">
                  Elevate360 Systems™
                </span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-slate-400">
                  Predicting Tomorrow, Today.
                </span>
              </div>
            </div>

            {/* RIGHT — NAVIGATION */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#services" className="hover:text-sky-400 transition">
                Services
              </a>
              <a href="#products" className="hover:text-sky-400 transition">
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

        {/* === PAGE CONTENT === */}
        <main>{children}</main>
      </body>
    </html>
  );
}
