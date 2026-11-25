import { Suspense } from "react";

import { SectionHeader } from "@/components/section-header";
import { DEFAULT_LOCATION_ID } from "@/lib/booking";

import { BookingForm } from "./booking-form";
import { UrlBookingForm } from "./url-booking-form";

/**
 * "Reserve your table" panel, the target of every "Book a table" link.
 *
 * The form reads `?location=`, so it renders on the client inside
 * `<Suspense>` while the rest of the page stays prerendered. The fallback
 * is the same form with the default location, so the prerendered HTML
 * already looks finished and nothing shifts when it hydrates.
 */
export function BookingPanel() {
  return (
    <section
      id="book"
      aria-labelledby="book-title"
      className="page-container scroll-mt-6 pb-16 md:pb-22"
    >
      <div className="flex flex-col gap-6 rounded-banner surface-dark p-6 md:p-8">
        <SectionHeader
          id="book-title"
          title="Reserve your table"
          size="panel"
          action={{
            label: "Larger group? Plan an event",
            href: "/#private-dining",
          }}
        />
        <Suspense fallback={<BookingForm locationId={DEFAULT_LOCATION_ID} />}>
          <UrlBookingForm />
        </Suspense>
      </div>
    </section>
  );
}
