import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Tangerine banner promoting private dining and events enquiries. */
export function PrivateDiningBanner() {
  return (
    <section
      id="private-dining"
      aria-labelledby="private-dining-title"
      className="page-container py-16 md:py-22"
    >
      <div className="flex flex-wrap items-center justify-between gap-8 rounded-banner bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-14">
        <div className="flex max-w-xl flex-col gap-3">
          <h2
            id="private-dining-title"
            className="font-heading text-section font-extrabold tracking-heading"
          >
            Private dining & events
          </h2>
          <p className="text-lg leading-relaxed">
            Share your date, group size and budget, and we’ll send a proposal
            with menus.
          </p>
        </div>
        <Button asChild size="lg" variant="secondary">
          <Link href="/private-dining">Start an enquiry</Link>
        </Button>
      </div>
    </section>
  );
}
