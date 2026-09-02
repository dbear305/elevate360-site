import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl = "https://www.elevate360systems.com";

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
    "Secure infrastructure, custom software, workflow automation, network diagnostics, and operational systems built around real-world problems.",
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
    "Custom software development",
    "Workflow automation",
    "Operational analytics",
    "Field operations software",
    "Diagnostic monitoring systems",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-786-312-7320",
    email: "contact@elevate360systems.com",
    contactType: "project inquiries",
    availableLanguage: "English",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Elevate360 Systems | Secure Infrastructure, Software & Automation",
    template: "%s | Elevate360 Systems",
  },

  description:
    "Elevate360 Systems designs and builds secure infrastructure, custom software, workflow automation, network diagnostics, and operational systems for real-world environments.",

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
    title:
      "Elevate360 Systems | Secure Infrastructure, Software & Automation",
    description:
      "Secure infrastructure, custom software, workflow automation, diagnostics, and operational systems built for real-world environments.",
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
    title:
      "Elevate360 Systems | Secure Infrastructure, Software & Automation",
    description:
      "Secure infrastructure, custom software, workflow automation, diagnostics, and operational systems built for real-world environments.",
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
