import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.elevate360systems.com/",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://www.elevate360systems.com/systems",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://www.elevate360systems.com/systems/nettruth",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.elevate360systems.com/systems/nettruth/diagnostic",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
