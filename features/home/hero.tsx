import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bookingHref } from "@/lib/data/site";

/**
 * Homepage hero: status pill, headline, intro, the two main calls to action,
 * and a photo placeholder with tonight's availability and the seasonal badge.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="page-container grid items-center gap-12 pt-8 pb-16 md:pt-12 md:pb-18 lg:grid-cols-2"
    >
      <div className="flex flex-col items-start gap-6.5">
        <Badge>
          <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
          Now taking bookings in all three rooms
        </Badge>
        <h1
          id="hero-title"
          className="font-heading text-display font-extrabold tracking-display"
        >
          Fire-cooked.
          <br /> Every plate,
          <br /> on purpose.
        </h1>
        <p className="max-w-124 text-lg leading-relaxed text-muted-foreground">
          A wood-fired kitchen with seasonal plates and long tables, across
          three neighbourhoods. Book in seconds or order ahead for pickup.
        </p>
        <div className="flex flex-wrap items-center gap-3.5">
          <Button asChild size="lg">
            <Link href={bookingHref}>Book a table</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/#menu">View the menu</Link>
          </Button>
        </div>
      </div>

      {/* Photo placeholder until real photography is provided. */}
      <figure className="relative flex h-96 items-center justify-center rounded-banner bg-accent md:h-140">
        <figcaption className="px-6 text-center text-sm text-muted-foreground">
          Photo · signature dish from the hearth
        </figcaption>
        <p className="absolute bottom-6 left-6 flex flex-col gap-1 rounded-xl bg-card px-5 py-4">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Tonight at Downtown
          </span>
          <span className="font-semibold">Tables open from 5:30 pm</span>
        </p>
        <p className="absolute top-6 right-6 flex size-24 items-center justify-center rounded-full bg-primary text-center font-heading text-sm leading-tight font-extrabold text-primary-foreground md:size-26 md:text-ui">
          New
          <br /> winter
          <br /> menu
        </p>
      </figure>
    </section>
  );
}
