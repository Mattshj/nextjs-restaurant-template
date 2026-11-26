import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { siteName } from "@/lib/data/site";
import { getSiteUrl, siteDescription } from "@/lib/seo";

import "./globals.css";

// Both are variable fonts, so every weight the design uses (Inter 400–600,
// Inter Tight 700–800) loads from a single file per family.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const defaultTitle = `${siteName} — Fire-cooked restaurants`;

// Defaults for every route. Pages set their own title and canonical URL;
// relative URLs resolve against `metadataBase`.
export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: defaultTitle, template: `%s · ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    title: defaultTitle,
    description: siteDescription,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteDescription,
  },
};

/**
 * Root layout: brand fonts, global styles, and the header and footer shared
 * by every route. Each page renders its own `<main id="main-content">`, which
 * the skip link targets.
 *
 * @param children - the active route's content.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-card focus:px-5 focus:py-3 focus:font-semibold"
        >
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
