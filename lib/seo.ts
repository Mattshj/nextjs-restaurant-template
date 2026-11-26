import type { Metadata } from "next";

import { locations } from "@/lib/data/locations";
import { siteName } from "@/lib/data/site";

const LOCAL_SITE_URL = "http://localhost:3000";

/** Shared description for search results and social cards. */
export const siteDescription =
  "A wood-fired kitchen with seasonal plates and long tables, across three neighbourhoods. Book a table or order ahead for pickup.";

export const defaultTitle = `${siteName} — Fire-cooked restaurants`;

/**
 * Open Graph fields shared by every page. Next.js merges metadata only at
 * the top level, so a page that sets `openGraph` replaces the layout's
 * object entirely; spread these in to keep them.
 */
export const openGraphDefaults = {
  type: "website",
  siteName,
  title: defaultTitle,
  description: siteDescription,
  locale: "en",
} satisfies Metadata["openGraph"];

/**
 * Public base URL of the site, used for canonical links, Open Graph URLs,
 * the sitemap and structured data.
 *
 * Read from `SITE_URL` (see `.env.example`). Falls back to localhost when
 * it's missing or not an http(s) URL, so local builds still work; a wrong
 * production URL would quietly point search engines elsewhere, so set it
 * in every deployed environment.
 *
 * @param value - raw setting; defaults to `process.env.SITE_URL`.
 * @returns the URL without a trailing slash on its path.
 */
export function getSiteUrl(value: string | undefined = process.env.SITE_URL) {
  if (value) {
    try {
      const url = new URL(value);
      if (url.protocol === "http:" || url.protocol === "https:") {
        url.pathname = url.pathname.replace(/\/+$/, "");
        return url;
      }
    } catch {
      // Not a URL: fall through to the local default.
    }
  }
  return new URL(LOCAL_SITE_URL);
}

/**
 * Builds an absolute URL for a path on this site. A leading slash is
 * resolved relative to the site URL rather than its domain root, so a base
 * path such as `/hearthwick` is kept.
 */
export function absoluteUrl(path: string, base: URL = getSiteUrl()) {
  const baseWithSlash = `${base.href.replace(/\/$/, "")}/`;
  return new URL(path.replace(/^\//, ""), baseWithSlash).href;
}

/**
 * schema.org structured data for the homepage: the Hearthwick group plus one
 * `Restaurant` per location.
 *
 * Addresses and phone numbers are omitted rather than filled with the
 * `[ADDRESS]` placeholder: search engines would read a placeholder as the
 * real address. Add them here once real details are provided.
 */
export function buildRestaurantJsonLd(base: URL = getSiteUrl()) {
  const organizationId = absoluteUrl("/#organization", base);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        url: absoluteUrl("/", base),
        description: siteDescription,
      },
      ...locations.map((location) => ({
        "@type": "Restaurant",
        "@id": absoluteUrl(`/#location-${location.id}`, base),
        name: `${siteName} ${location.name}`,
        description: location.summary,
        url: absoluteUrl(`/?location=${location.id}#book`, base),
        servesCuisine: "Wood-fired, seasonal",
        acceptsReservations: true,
        parentOrganization: { "@id": organizationId },
      })),
    ],
  };
}

/**
 * Serialises JSON-LD for a `<script>` tag. `<` is escaped so a value
 * containing `</script>` can't close the tag early and inject markup.
 */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
