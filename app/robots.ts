import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/** `robots.txt`: the whole public site may be crawled; points to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
