import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://elevate360systems.com"),
  title: "Elevate360 Systems",
  description:
    "Secure, low-latency network systems built for real environments. Network security, segmentation, and performance engineering.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Elevate360 Systems",
    description:
      "Secure, low-latency network systems built for real environments.",
    url: "https://elevate360systems.com",
    siteName: "Elevate360 Systems",
    images: [
      {
        url: "/opgraph.png",
        width: 1200,
        height: 630,
        alt: "Elevate360 Systems",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elevate360 Systems",
    description:
      "Secure, low-latency network systems built for real environments.",
    images: ["/opgraph.png"],
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