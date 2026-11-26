import type { Metadata } from "next";

import { BookingPanel } from "@/features/booking/booking-panel";
import { Hero } from "@/features/home/hero";
import { LocationsBand } from "@/features/home/locations-band";
import { PrivateDiningBanner } from "@/features/home/private-dining-banner";
import { SignatureDishes } from "@/features/home/signature-dishes";
import { buildRestaurantJsonLd, serializeJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

/** Homepage: composes the marketing sections in design order, plus structured data for search engines. */
export default function Home() {
  return (
    <main id="main-content" className="flex-1">
      <script
        type="application/ld+json"
        // Static data we build ourselves; serializeJsonLd escapes `<` so it
        // can't break out of the script tag.
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildRestaurantJsonLd()),
        }}
      />
      <Hero />
      <BookingPanel />
      <SignatureDishes />
      <LocationsBand />
      <PrivateDiningBanner />
    </main>
  );
}
