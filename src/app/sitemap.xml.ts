import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://elevate360systems.com/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://elevate360systems.com/matchmetrics",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Add more pages here as your site grows...
  ];
}
