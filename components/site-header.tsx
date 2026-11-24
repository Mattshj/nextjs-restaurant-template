import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/wordmark";
import { bookingHref, mainNav, signInLink } from "@/lib/data/site";

/**
 * Site header: wordmark, main navigation, sign-in link and the primary
 * "Book a table" call to action. Below `lg` the navigation and sign-in
 * move into the drawer of {@link MobileNav}; below `sm` the booking CTA
 * moves there too, so the header fits a 375px screen.
 */
export function SiteHeader() {
  return (
    <header className="page-container flex items-center justify-between gap-4 py-5">
      <Wordmark />

      <nav aria-label="Main" className="hidden lg:block">
        <ul className="flex gap-7 text-ui font-medium">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href={signInLink.href}
          className="hidden px-2 py-3 text-ui font-medium hover:underline lg:block"
        >
          {signInLink.label}
        </Link>
        {/* Hidden on phones, where the drawer and the hero already offer it. */}
        <Button asChild className="hidden sm:inline-flex">
          <Link href={bookingHref}>Book a table</Link>
        </Button>
        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
