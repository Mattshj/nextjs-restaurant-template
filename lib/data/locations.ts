import type { Location } from "@/lib/types";

/**
 * The three Hearthwick rooms, in display order.
 * Addresses are placeholders until real content is provided.
 */
export const locations = [
  {
    id: "downtown",
    name: "Downtown",
    summary: "Chef’s counter and a late kitchen on weekends.",
    address: "[ADDRESS]",
  },
  {
    id: "riverside",
    name: "Riverside",
    summary: "Patio by the water and weekend brunch.",
    address: "[ADDRESS]",
  },
  {
    id: "old-town",
    name: "Old Town",
    summary: "The original room, with private dining for groups.",
    address: "[ADDRESS]",
  },
] as const satisfies readonly Location[];
