import { addDays, format, isValid, parse } from "date-fns";

import { locations } from "@/lib/data/locations";
import type { AvailabilityRequest, LocationId } from "@/lib/types";

/** Smallest and largest party the online booking accepts; larger groups use private dining. */
export const PARTY_SIZE_MIN = 1;
export const PARTY_SIZE_MAX = 12;

/** How long a chosen table is held while the guest completes the booking. */
export const HOLD_MINUTES = 10;

/** How many days ahead guests can book. */
export const BOOKING_WINDOW_DAYS = 60;

/** Location preselected when the URL doesn't name one. */
export const DEFAULT_LOCATION_ID: LocationId = "downtown";

/** Thrown when a booking request is invalid, e.g. a past date or too many guests. */
export class BookingRequestError extends Error {
  override name = "BookingRequestError";
}

/** Thrown when a slot was taken between showing it and holding it. */
export class SlotUnavailableError extends Error {
  override name = "SlotUnavailableError";
}

/**
 * Narrows untrusted input (e.g. the `?location=` URL parameter) to a known
 * location id.
 *
 * @returns the id, or `null` if it doesn't match a location.
 */
export function parseLocationId(value: unknown): LocationId | null {
  return locations.find((location) => location.id === value)?.id ?? null;
}

/**
 * Formats a date as `YYYY-MM-DD` in local time. `toISOString()` is not used
 * because it converts to UTC, which shifts the day for evening bookings in
 * timezones behind UTC.
 */
export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Parses a `YYYY-MM-DD` string as a local date, or returns `null` if invalid. */
export function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = parse(value, "yyyy-MM-dd", new Date(0));
  return isValid(date) ? date : null;
}

/** Formats a 24-hour `HH:mm` time for display, e.g. `"19:00"` → `"7:00 pm"`. */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours < 12 ? "am" : "pm";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/** Formats a party size for display, e.g. `1` → `"1 guest"`, `4` → `"4 guests"`. */
export function formatPartySize(size: number): string {
  return `${size} ${size === 1 ? "guest" : "guests"}`;
}

/**
 * Checks a request against the booking rules. Services call this before
 * answering, because requests can be built from URL parameters or other
 * untrusted input.
 *
 * @param today - today's date as `YYYY-MM-DD`, injected so tests are deterministic.
 * @throws {BookingRequestError} for an unknown location, a party outside
 *   {@link PARTY_SIZE_MIN}–{@link PARTY_SIZE_MAX}, an invalid or past date,
 *   or a date beyond the booking window.
 */
export function assertValidRequest(
  request: AvailabilityRequest,
  today: string,
): void {
  if (!parseLocationId(request.locationId)) {
    throw new BookingRequestError(`Unknown location "${request.locationId}".`);
  }

  const { partySize } = request;
  if (
    !Number.isInteger(partySize) ||
    partySize < PARTY_SIZE_MIN ||
    partySize > PARTY_SIZE_MAX
  ) {
    throw new BookingRequestError(
      `Party size must be a whole number from ${PARTY_SIZE_MIN} to ${PARTY_SIZE_MAX}.`,
    );
  }

  const todayDate = parseIsoDate(today);
  if (!parseIsoDate(request.date) || !todayDate) {
    throw new BookingRequestError(`Invalid date "${request.date}".`);
  }
  // ISO dates compare correctly as strings.
  if (request.date < today) {
    throw new BookingRequestError("That date has already passed.");
  }
  if (request.date > toIsoDate(addDays(todayDate, BOOKING_WINDOW_DAYS))) {
    throw new BookingRequestError(
      `Bookings open ${BOOKING_WINDOW_DAYS} days ahead.`,
    );
  }
}
