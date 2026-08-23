import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl = "https://elevate360systems.com";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Elevate360 Systems LLC",
  alternateName: "Elevate360 Systems",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/opgraph.png`,
  email: "contact@elevate360systems.com",
  telephone: "+1-786-312-7320",
  description:
    "Secure, low-latency network systems, private routing, segmentation, firewall architecture, and performance engineering.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Miami",
    addressRegion: "FL",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "City",
    name: "Miami",
  },
  knowsAbout: [
    "Network security architecture",
    "Firewall deployment",
    "OPNsense",
    "WireGuard",
    "Network segmentation",
    "Private routing",
    "Latency optimization",
    "Bufferbloat reduction",
    "Custom network appliances",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-786-312-7320",
    email: "contact@elevate360systems.com",
    contactType: "sales and technical support",
    availableLanguage: "English",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Elevate360 Systems | Network Security & Performance Engineering",
    template: "%s | Elevate360 Systems",
  },

  description:
    "Secure, low-latency network systems built for real environments. Network security, segmentation, private routing, and performance engineering.",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },

  openGraph: {
    title: "Elevate360 Systems",
    description:
      "Secure, low-latency network systems built for real environments.",
    url: siteUrl,
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />

        {children}

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
