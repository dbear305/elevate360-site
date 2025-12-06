// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elevate360 Systems™ — Privacy-First Engineering",
  description:
    "Elevate360 Systems is a privacy-first engineering studio focused on real-world operations, applied mathematics, and practical systems thinking.",
  icons: {
    icon: "/favicon.png", // your new PNG favicon
  },
  openGraph: {
    title: "Elevate360 Systems™ — Privacy-First Engineering",
    description:
      "Engineering systems that are transparent, measurable, and grounded in reality.",
    url: "https://elevate360systems.com",
    siteName: "Elevate360 Systems",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elevate360 Systems™",
    description:
      "Privacy-first engineering for real-world operations, analytics, and systems clarity.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200 antialiased">

        {/* =========================== */}
        {/*         HEADER / NAV        */}
        {/* =========================== */}
        <header className="border-b border-white/5 sticky top-0 z-50">
          <nav className="container mx-auto flex items-center justify-between py-4 px-4 md:px-0 backdrop-blur-md bg-slate-900/60">

            {/* LEFT SIDE — LOGO + TAGLINE */}
            <div className="flex items-center gap-3">
              <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                E360
              </span>

              <a
                href="/"
                className="font-semibold text-sm md:text-base hover:text-white/80 transition"
              >
                Elevate360 Systems™
              </a>
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="/#platforms" className="hover:text-white/70 transition">
                Platforms
              </a>
              <a href="/matchmetrics" className="hover:text-white/70 transition">
                MatchMetrics
              </a>
              <a href="/#running" className="hover:text-white/70 transition">
                Built & Running
              </a>
              <a href="/#services" className="hover:text-white/70 transition">
                Services
              </a>
              <a href="/about" className="hover:text-white/70 transition">
                About
              </a>
              <a href="/#contact" className="hover:text-white/70 transition">
                Contact
              </a>
            </div>

            {/* MOBILE NAV PLACEHOLDER (future expansion) */}
            <div className="md:hidden">
              {/* we’ll add mobile menu later */}
            </div>
          </nav>
        </header>

        {/* =========================== */}
        {/*          PAGE CONTENT        */}
        {/* =========================== */}
        <main className="min-h-screen">{children}</main>

        {/* =========================== */}
        {/*          FOOTER             */}
        {/* =========================== */}
        <footer className="border-t border-white/5 py-8 mt-16">
          <div className="container mx-auto text-center text-slate-400 text-sm px-4 md:px-0">
            <p>© {new Date().getFullYear()} Elevate360 Systems LLC. All rights reserved.</p>
            <p className="mt-1">
              Privacy-first engineering. No hype. No lies.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
