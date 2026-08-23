import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://www.elevate360systems.com/sitemap.xml",
    host: "https://www.elevate360systems.com",
  };
}
