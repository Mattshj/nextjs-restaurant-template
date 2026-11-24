/** Shared domain types. Keep one definition per concept here. */

/** URL-safe identifier for a restaurant location, used in links and booking requests. */
export type LocationId = "downtown" | "riverside" | "old-town";

/** One Hearthwick restaurant. */
export type Location = {
  id: LocationId;
  name: string;
  /** One-line description of what makes this room different. */
  summary: string;
  /** Street address. Stays a placeholder until real content is provided. */
  address: string;
};

/** A dish shown on the homepage. */
export type Dish = {
  name: string;
  /** Display price. Stays a placeholder until real content is provided. */
  price: string;
  description: string;
  /** Dietary and editorial labels, e.g. "Vegetarian" or "Chef's pick". */
  labels: readonly string[];
};

/** A navigation link. */
export type NavLink = {
  label: string;
  href: string;
};
