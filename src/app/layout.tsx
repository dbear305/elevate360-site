import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elevate360 Systems",
  description: "Network security & performance engineering",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Elevate360 Systems",
    description: "Network security & performance engineering",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}