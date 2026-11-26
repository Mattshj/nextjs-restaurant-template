import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/**
 * Sitemap served at `/sitemap.xml`. Lists only routes that exist; add each
 * new page (menu, locations, private dining) here when it ships.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
