import { describe, expect, it } from "vitest";

import { BookingRequestError, SlotUnavailableError } from "@/lib/booking";
import type { AvailabilityRequest } from "@/lib/types";

import { createMockAvailabilityService } from "./availability";

// Wednesday 25 November 2026, noon.
const noon = new Date(2026, 10, 25, 12, 0);

function serviceAt(now: Date) {
  return createMockAvailabilityService({ now: () => now, delayMs: 0 });
}

const tomorrowForTwo: AvailabilityRequest = {
  locationId: "downtown",
  date: "2026-11-26",
  partySize: 2,
};

const times = (slots: { time: string }[]) => slots.map((slot) => slot.time);

describe("mock availability service", () => {
  it("returns evening times in order, the same ones on every call", async () => {
    const service = serviceAt(noon);

    const first = times(await service.getAvailability(tomorrowForTwo));
    const second = times(await service.getAvailability(tomorrowForTwo));

    expect(first.length).toBeGreaterThan(0);
    expect(first).toEqual([...first].sort());
    expect(second).toEqual(first);
  });

  it("offers fewer times to large parties than to couples", async () => {
    const service = serviceAt(noon);

    const couple = await service.getAvailability(tomorrowForTwo);
    const group = await service.getAvailability({
      ...tomorrowForTwo,
      partySize: 10,
    });

    expect(group.length).toBeLessThan(couple.length);
  });

  it("needs 30 minutes' notice for same-day bookings", async () => {
    const service = serviceAt(new Date(2026, 10, 25, 18, 40));

    const slots = await service.getAvailability({
      ...tomorrowForTwo,
      date: "2026-11-25",
    });

    expect(slots.length).toBeGreaterThan(0);
    expect(times(slots).every((time) => time >= "19:10")).toBe(true);
  });

  it("has no tables at Old Town on a Monday", async () => {
    const service = serviceAt(noon);

    const slots = await service.getAvailability({
      locationId: "old-town",
      date: "2026-11-30", // a Monday
      partySize: 2,
    });

    expect(slots).toEqual([]);
  });

  it("rejects invalid requests", async () => {
    const service = serviceAt(noon);

    await expect(
      service.getAvailability({ ...tomorrowForTwo, date: "2026-11-24" }),
    ).rejects.toThrow(BookingRequestError);
    await expect(
      service.getAvailability({ ...tomorrowForTwo, partySize: 13 }),
    ).rejects.toThrow(BookingRequestError);
  });

  it("holds an open table for 10 minutes", async () => {
    const service = serviceAt(noon);
    const [slot] = await service.getAvailability(tomorrowForTwo);

    const hold = await service.holdTable({
      ...tomorrowForTwo,
      time: slot.time,
    });

    expect(hold.request.time).toBe(slot.time);
    expect(hold.expiresAt).toEqual(new Date(2026, 10, 25, 12, 10));
  });

  it("refuses to hold a time that isn't open", async () => {
    const service = serviceAt(noon);

    await expect(
      service.holdTable({ ...tomorrowForTwo, time: "23:45" }),
    ).rejects.toThrow(SlotUnavailableError);
  });
});
