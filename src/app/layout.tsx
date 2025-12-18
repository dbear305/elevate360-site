import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.elevate360systems.com"),

  title: "Elevate360 Systems™",
  description: "Engineering real-world systems.",

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
        url: "https://www.elevate360systems.com/og.png",
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
    images: ["https://www.elevate360systems.com/og.png"],
  },

  icons: {
    icon: "/favicon.png",
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
      <body className="bg-slate-950 text-slate-50 antialiased">
        {/* ================= HEADER ================= */}
        <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Elevate360 Systems Logo"
                width={40}
                height={40}
                priority
                className="select-none"
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
              <a href="/#services" className="hover:text-sky-400 transition">
                Services
              </a>
              <a href="/#platforms" className="hover:text-sky-400 transition">
                Platforms
              </a>
              <a href="/#about" className="hover:text-sky-400 transition">
                About
              </a>
              <a href="/#contact" className="hover:text-sky-400 transition">
                Contact
              </a>
            </nav>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main>{children}</main>

        {/* ================= FOOTER ================= */}
        <footer className="mt-28 border-t border-slate-800 bg-slate-950 py-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Elevate360 Systems Logo"
                width={44}
                height={44}
                className="select-none"
              />
              <div className="flex flex-col leading-none">
                <span className="text-base font-semibold tracking-wide text-slate-100">
                  Elevate360 Systems™
                </span>
                <span className="mt-[2px] text-[10px] uppercase tracking-[0.22em] text-slate-400">
                  Predicting Tomorrow Today
                </span>
              </div>
            </div>

            <nav className="grid grid-cols-2 gap-3 text-sm text-slate-400 sm:grid-cols-4">
              <a href="/#services" className="hover:text-sky-400 transition">
                Services
              </a>
              <a href="/#platforms" className="hover:text-sky-400 transition">
                Platforms
              </a>
              <a href="/#about" className="hover:text-sky-400 transition">
                About
              </a>
              <a href="/#contact" className="hover:text-sky-400 transition">
                Contact
              </a>
            </nav>
          </div>

          <div className="mt-10 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Elevate360 Systems™ — All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
