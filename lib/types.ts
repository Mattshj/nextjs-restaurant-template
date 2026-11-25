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

/** A guest's search for open tables. */
export type AvailabilityRequest = {
  locationId: LocationId;
  /** Calendar date in local time, as `YYYY-MM-DD`. */
  date: string;
  partySize: number;
};

/** A bookable start time. */
export type TimeSlot = {
  /** Local start time in 24-hour `HH:mm` format, e.g. `"19:00"`. */
  time: string;
};

/** A request to hold one slot while the guest completes the booking. */
export type HoldRequest = AvailabilityRequest & {
  /** Start time in `HH:mm`, taken from a {@link TimeSlot}. */
  time: string;
};

/** A table reserved for a short time so no one else can take it mid-booking. */
export type TableHold = {
  id: string;
  request: HoldRequest;
  expiresAt: Date;
};

/**
 * Source of table availability. The booking UI depends only on this type,
 * so the mock in `lib/mock/` can be replaced by real API calls without
 * changing any component.
 */
export type AvailabilityService = {
  /** Open start times for the request, earliest first. Empty when fully booked. */
  getAvailability(request: AvailabilityRequest): Promise<TimeSlot[]>;
  /** Holds a table for `HOLD_MINUTES` (lib/booking.ts); rejects if the slot is gone. */
  holdTable(request: HoldRequest): Promise<TableHold>;
};
