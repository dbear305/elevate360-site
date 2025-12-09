import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elevate360 Systems™",
  description:
    "Privacy-first engineering for real-world operations, field systems, analytics, and decision clarity.",

  alternates: {
    canonical: "https://elevate360systems.com/",
  },

  openGraph: {
    title: "Elevate360 Systems™",
    description:
      "Privacy-first engineering for real-world operations, field teams, analytics, and real decision clarity.",
    url: "https://elevate360systems.com",
    siteName: "Elevate360 Systems™",
    type: "website",
  },

  icons: {
    icon: "/favicon.png",
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
        {children}
      </body>
    </html>
  );
}
