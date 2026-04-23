import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elevate360 Systems",
  description:
    "Secure, low-latency network systems built for real environments. Network security, segmentation, and performance engineering.",

  icons: {
    icon: "/favicon.png",
  },

  openGraph: {
    title: "Elevate360 Systems",
    description:
      "Secure, low-latency network systems built for real environments.",
    url: "https://elevate360systems.com",
    siteName: "Elevate360 Systems",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Elevate360 Systems",
    description:
      "Secure, low-latency network systems built for real environments.",
    images: ["/og.png"],
  },
};