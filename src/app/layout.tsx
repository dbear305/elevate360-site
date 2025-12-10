import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "Elevate360 Systems™",
  description:
    "Privacy-first engineering for real-world systems. Secure software, automation, applied mathematics, cybersecurity, and infrastructure — built with clarity and discipline.",
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
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt="Elevate360 Systems Logo"
                width={46}
                height={46}
                priority
                className="w-auto h-11"
                style={{ objectFit: "contain" }}
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

            {/* RIGHT — NAVIGATION */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#services" className="hover:text-sky-400 transition">Services</a>
              <a href="#products" className="hover:text-sky-400 transition">Platforms</a>
              <a href="#about" className="hover:text-sky-400 transition">About</a>
              <a href="#contact" className="hover:text-sky-400 transition">Contact</a>
            </nav>
          </div>
        </header>

        {/* === PAGE CONTENT === */}
        <main>{children}</main>

        {/* === FOOTER === */}
        <footer className="border-t border-slate-800 mt-28 py-12 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between gap-10">

            {/* LEFT — LOGO + BRANDING */}
            <div className="flex items-center gap-4">
             <Image
               src="/logo.png"
               alt="Elevate360 Systems Logo"
               height={46}
               width={0}
               priority
               className="h-11 w-auto select-none"
               style={{ objectFit: "contain" }}
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

            {/* RIGHT — FOOTER NAV */}
            <nav className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-slate-400">
              <a href="#services" className="hover:text-sky-400 transition">Services</a>
              <a href="#products" className="hover:text-sky-400 transition">Platforms</a>
              <a href="#about" className="hover:text-sky-400 transition">About</a>
              <a href="#contact" className="hover:text-sky-400 transition">Contact</a>
            </nav>

          </div>

          {/* COPYRIGHT */}
          <div className="text-center mt-10 text-xs text-slate-500">
            © {new Date().getFullYear()} Elevate360 Systems™ — All rights reserved.
          </div>
        </footer>

      </body>
    </html>
  );
}
