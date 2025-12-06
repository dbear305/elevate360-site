// src/app/layout.tsx
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Elevate360 Systems™",
  description: "Privacy-first engineering for real-world operations.",
  openGraph: {
    title: "Elevate360 Systems™",
    description: "Privacy-first engineering for real-world operations.",
    url: "https://elevate360systems.com",
    siteName: "Elevate360 Systems™",
    type: "website",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className="bg-slate-950 text-slate-50 antialiased">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
