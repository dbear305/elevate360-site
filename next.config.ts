import type { NextConfig } from "next";
import { getMeasurementConfig } from "./src/lib/nettruth/config";

const isDevelopment = process.env.NODE_ENV !== "production";
const measurementOrigins = getMeasurementConfig().nodes.map(node => node.origin).join(" ");

// Google Ads tag endpoints: https://developers.google.com/tag-platform/security/guides/csp
// Explicit US origins keep the allowlist bounded for the Miami search campaign.
const googleAdsScriptOrigins = [
  "https://www.googletagmanager.com",
  "https://www.googleadservices.com",
  "https://www.google.com",
  "https://pagead2.googlesyndication.com",
  "https://googleads.g.doubleclick.net",
].join(" ");
const googleAdsImageOrigins = `${googleAdsScriptOrigins} https://google.com`;
const googleAdsConnectOrigins = `${googleAdsImageOrigins} https://ad.doubleclick.net`;

const contentSecurityPolicy = `
  default-src 'self';
  base-uri 'self';
  form-action 'self' mailto:;
  frame-ancestors 'none';
  object-src 'none';
  script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com ${googleAdsScriptOrigins};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: ${googleAdsImageOrigins};
  frame-src 'self' https://www.googletagmanager.com;
  font-src 'self' data:;
  connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://formsubmit.co ${measurementOrigins} ${googleAdsConnectOrigins};
  manifest-src 'self';
  media-src 'self';
  worker-src 'self' blob:;
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,

  turbopack: {
    root: process.cwd(),
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
