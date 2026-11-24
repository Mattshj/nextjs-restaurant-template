"use client";

import { useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { bookingHref, mainNav, signInLink } from "@/lib/data/site";

/**
 * Menu button and slide-in drawer with the main navigation, shown below the
 * `lg` breakpoint where the inline nav does not fit.
 *
 * The drawer locks page scrolling while open and restores the old scroll
 * position when it closes, which would cancel the jump to an in-page anchor
 * such as `/#locations`. So a link click closes the drawer first, and the
 * navigation runs once it has fully closed.
 */
export function MobileNav() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pendingHref = useRef<string | null>(null);

  function navigateAfterClose(event: MouseEvent<HTMLAnchorElement>) {
    // Let the browser handle "open in new tab" and similar modified clicks.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    pendingHref.current = event.currentTarget.getAttribute("href");
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <MenuIcon aria-hidden="true" className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="gap-8 px-6 pt-6 pb-8"
        onCloseAutoFocus={(event) => {
          const href = pendingHref.current;
          if (!href) return;
          // Skip returning focus to the menu button, which would scroll the
          // page back to the header.
          event.preventDefault();
          pendingHref.current = null;
          router.push(href);
        }}
      >
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
                <Link
                  href={item.href}
                  onClick={navigateAfterClose}
                  className="-mx-3 block rounded-lg px-3 py-3 text-lg font-medium hover:bg-foreground/5"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Button asChild size="lg" className="mt-auto">
          <Link href={bookingHref} onClick={navigateAfterClose}>
            Book a table
          </Link>
        </Button>
      </SheetContent>
    </Sheet>
  );
}
