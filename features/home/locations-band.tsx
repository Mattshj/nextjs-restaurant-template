import Link from "next/link";

import { SectionHeader } from "@/components/section-header";
import { locations } from "@/lib/data/locations";

/**
 * "Three rooms, one fire": graphite band listing the locations. Each
 * "Book" link carries the location id, so the booking panel can preselect it.
 */
export function LocationsBand() {
  return (
    <section
      id="locations"
      aria-labelledby="locations-title"
      className="surface-dark"
    >
      <div className="page-container flex flex-col gap-10 py-16 md:py-22">
        <SectionHeader id="locations-title" title="Three rooms, one fire" />
        <ol className="grid gap-8 md:grid-cols-3">
          {locations.map((location, index) => (
            <li
              key={location.id}
              className="flex flex-col gap-2.5 border-t border-graphite-border pt-6"
            >
              <span
                aria-hidden="true"
                className="font-heading text-ui font-bold text-tangerine"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-2xl font-semibold">{location.name}</h3>
              <p className="leading-relaxed text-muted-on-graphite">
                {location.summary}
                <br />
                {location.address}
              </p>
              <Link
                href={`/?location=${location.id}#book`}
                className="font-semibold underline underline-offset-4"
              >
                Book {location.name} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
