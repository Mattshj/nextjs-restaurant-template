import { getDay } from "date-fns";

import {
  HOLD_MINUTES,
  SlotUnavailableError,
  assertValidRequest,
  parseIsoDate,
  toIsoDate,
} from "@/lib/booking";
import type {
  AvailabilityRequest,
  AvailabilityService,
  HoldRequest,
  TableHold,
  TimeSlot,
} from "@/lib/types";

/** Start times offered each evening, matching the design reference. */
const SERVICE_TIMES = [
  "17:30",
  "18:00",
  "18:45",
  "19:00",
  "19:30",
  "20:15",
  "21:00",
] as const;

/** Same-day bookings need this much notice, so the kitchen can prepare. */
const SAME_DAY_LEAD_MINUTES = 30;

type MockAvailabilityOptions = {
  /** Clock for "today" and same-day cut-offs. Defaults to the real time. */
  now?: () => Date;
  /** Simulated network latency, so loading states are visible. Use 0 in tests. */
  delayMs?: number;
};

/**
 * In-memory stand-in for the booking API. Results are deterministic: the
 * same location, date and party size always return the same times, so
 * demos and tests are repeatable.
 *
 * Mock rules (not real business rules):
 * - Each request has a few slots already taken, chosen from a hash of the
 *   request. Larger parties lose more slots, as big tables sell out first.
 * - Same-day slots need {@link SAME_DAY_LEAD_MINUTES} minutes' notice.
 * - Old Town is closed on Mondays, so the fully booked state can be demoed.
 * - Each slot has one table. While a hold on it is active (not released and
 *   not expired), holding the same slot again fails, as it would for a
 *   second guest. Availability doesn't hide held slots; the clash is
 *   reported when holding, like a real race between two guests.
 *
 * Times are in the browser's timezone; the real service will use each
 * location's timezone.
 */
export function createMockAvailabilityService({
  now = () => new Date(),
  delayMs = 300,
}: MockAvailabilityOptions = {}): AvailabilityService {
  const activeHolds = new Map<string, TableHold>();
  let holdCount = 0;

  async function getAvailability(
    request: AvailabilityRequest,
  ): Promise<TimeSlot[]> {
    await wait(delayMs);
    const current = now();
    assertValidRequest(request, toIsoDate(current));
    return openTimes(request, current).map((time) => ({ time }));
  }

  async function holdTable(request: HoldRequest): Promise<TableHold> {
    await wait(delayMs);
    const current = now();
    assertValidRequest(request, toIsoDate(current));
    if (
      !openTimes(request, current).includes(request.time) ||
      isHeld(request, current)
    ) {
      throw new SlotUnavailableError("That time is no longer available.");
    }

    const hold: TableHold = {
      id: `hold-${++holdCount}`,
      request,
      expiresAt: new Date(current.getTime() + HOLD_MINUTES * 60_000),
    };
    activeHolds.set(hold.id, hold);
    return hold;
  }

  async function releaseHold(holdId: string): Promise<void> {
    await wait(delayMs);
    activeHolds.delete(holdId);
  }

  function isHeld(request: HoldRequest, current: Date) {
    for (const [id, hold] of activeHolds) {
      if (hold.expiresAt <= current) {
        activeHolds.delete(id);
      } else if (isSameSlot(hold.request, request)) {
        return true;
      }
    }
    return false;
  }

  return { getAvailability, holdTable, releaseHold };
}

function isSameSlot(a: HoldRequest, b: HoldRequest) {
  return (
    a.locationId === b.locationId && a.date === b.date && a.time === b.time
  );
}

function openTimes(request: AvailabilityRequest, now: Date): string[] {
  const date = parseIsoDate(request.date);
  if (request.locationId === "old-town" && date && getDay(date) === 1) {
    return [];
  }

  const takenCount =
    request.partySize >= 7 ? 4 : request.partySize >= 5 ? 2 : 1;
  const taken = pickIndexes(
    hash(`${request.locationId}|${request.date}|${request.partySize}`),
    takenCount,
    SERVICE_TIMES.length,
  );

  const isToday = request.date === toIsoDate(now);
  const earliest = isToday
    ? now.getHours() * 60 + now.getMinutes() + SAME_DAY_LEAD_MINUTES
    : 0;

  return SERVICE_TIMES.filter(
    (time, index) => !taken.has(index) && minutesOfDay(time) >= earliest,
  );
}

function minutesOfDay(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** FNV-1a: a small, stable string hash used as a seed. */
function hash(value: string): number {
  let result = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    result = Math.imul(result ^ value.charCodeAt(i), 0x01000193);
  }
  return result >>> 0;
}

/** Picks `count` distinct indexes below `length` from a seeded generator. */
function pickIndexes(seed: number, count: number, length: number) {
  const picked = new Set<number>();
  let state = seed;
  while (picked.size < count) {
    // Linear congruential generator (Numerical Recipes constants).
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    picked.add(state % length);
  }
  return picked;
}

function wait(ms: number) {
  return ms > 0
    ? new Promise<void>((resolve) => setTimeout(resolve, ms))
    : Promise.resolve();
}
