import type { NextConfig } from "next";
import { getMeasurementConfig } from "./src/lib/nettruth/config";

const isDevelopment = process.env.NODE_ENV !== "production";
const measurementOrigins = getMeasurementConfig().nodes.map(node => node.origin).join(" ");

const contentSecurityPolicy = `
  default-src 'self';
  base-uri 'self';
  form-action 'self' mailto:;
  frame-ancestors 'none';
  object-src 'none';
  script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://challenges.cloudflare.com https://www.googletagmanager.com https://www.googleadservices.com https://www.google.com;
  frame-src https://challenges.cloudflare.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://www.google.com;
  font-src 'self' data:;
  connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://formsubmit.co https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com https://www.google.com https://ad.doubleclick.net ${measurementOrigins};
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
