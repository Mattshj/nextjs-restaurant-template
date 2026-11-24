import type { NavLink } from "@/lib/types";

export const siteName = "Hearthwick";

/** In-page anchor of the booking panel; every "Book a table" CTA points here. */
export const bookingHref = "/#book";

/**
 * Main navigation. Items with a homepage section link to it; the rest point
 * at routes that will be built in later issues.
 */
export const mainNav = [
  { label: "Menu", href: "/#menu" },
  { label: "Locations", href: "/#locations" },
  { label: "Private dining", href: "/#private-dining" },
  { label: "Order pickup", href: "/order" },
] as const satisfies readonly NavLink[];

export const signInLink = {
  label: "Sign in",
  href: "/sign-in",
} as const satisfies NavLink;

export const footerNav = [
  { label: "Careers", href: "/careers" },
  { label: "Gift cards", href: "/gift-cards" },
  { label: "Accessibility", href: "/accessibility" },
] as const satisfies readonly NavLink[];
