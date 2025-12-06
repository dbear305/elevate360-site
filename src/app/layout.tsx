// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elevate360 Systems™ — Privacy-First Engineering",
  description:
    "Elevate360 Systems™ builds privacy-first platforms for elevators, field teams, financial operations, and decision intelligence. Transparent. Reliable. No hype.",
  openGraph: {
    title: "Elevate360 Systems™ — Privacy-First Engineering",
    description:
      "Privacy-first engineering for elevators, field teams, financial systems, and decision intelligence. No black boxes. No hype.",
    url: "https://elevate360systems.com",
    siteName: "Elevate360 Systems™",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elevate360 Systems™ — Privacy-First Engineering",
    description:
      "Transparent, reality-based engineering for elevators, field teams, and financial operations.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200">
        {/* Top navigation */}
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              className="text-lg font-semibold tracking-wide flex items-center gap-2"
            >
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                E360
              </span>
              <span>Elevate360 Systems™</span>
            </a>

            {/* Nav links */}
            <nav className="flex gap-8 text-sm font-medium">
              <a href="/#platforms" className="hover:text-blue-400 transition">Platforms</a>
              <a href="/matchmetrics" className="hover:text-blue-400 transition">MatchMetrics</a>
              <a href="/#running" className="hover:text-blue-400 transition">Built & Running</a>
              <a href="/#services" className="hover:text-blue-400 transition">Services</a>
              <a href="/about" className="hover:text-blue-400 transition">About</a>
              <a href="/contact" className="hover:text-blue-400 transition">Contact</a>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-8 mt-20 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Elevate360 Systems LLC.  
          <br />
          Privacy-first engineering. No hype. No lies.
        </footer>
      </body>
    </html>
  );
}
