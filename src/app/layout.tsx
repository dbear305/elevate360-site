import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "Elevate360 Systems™",
  description:
    "Privacy-first engineering for real-world systems. Secure software, applied mathematics, automation, and infrastructure built with clarity and discipline.",
  metadataBase: new URL("https://elevate360systems.com"),
  alternates: {
    canonical: "https://elevate360systems.com",
  },
  openGraph: {
    title: "Elevate360 Systems™",
    description:
      "Privacy-first engineering studio specializing in secure systems, automation, field-ready tooling, and applied mathematics.",
    url: "https://elevate360systems.com",
    siteName: "Elevate360 Systems™",
    type: "website",
  },
  icons: {
    icon: "/icon.png", // Favicon + navbar logo file
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
        {/* === Navbar === */}
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            {/* Left Logo + Title */}
            <div className="flex items-center gap-3">
              <Image
                src="/icon.png"
                alt="Elevate360 Systems Logo"
                width={32}
                height={32}
                className="rounded-md"
                priority
              />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-wide text-slate-100">
                  Elevate360 Systems™
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Predicting Tomorrow, Today.
                </span>
              </div>
            </div>

            {/* Right-side Navigation */}
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

        {/* === Page Content === */}
        <main>{children}</main>
      </body>
    </html>
  );
}
