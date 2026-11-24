"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { bookingHref, mainNav, signInLink } from "@/lib/data/site";

/**
 * Menu button and slide-in drawer with the main navigation, shown below the
 * `lg` breakpoint where the inline nav does not fit. The drawer closes on
 * every link, so in-page anchors don't leave it covering the section.
 */
export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <MenuIcon aria-hidden="true" className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="gap-8 px-6 pt-6 pb-8">
        <div>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation
          </SheetDescription>
        </div>
        <nav aria-label="Main">
          <ul className="flex flex-col gap-1">
            {[...mainNav, signInLink].map((item) => (
              <li key={item.href}>
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-3 text-lg font-medium hover:bg-foreground/5"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
        <SheetClose asChild>
          <Button asChild size="lg" className="mt-auto">
            <Link href={bookingHref}>Book a table</Link>
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
