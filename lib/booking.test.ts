import { describe, expect, it } from "vitest";

import {
  BookingRequestError,
  assertValidRequest,
  formatPartySize,
  formatTime,
  parseIsoDate,
  parseLocationId,
  toIsoDate,
} from "./booking";

const today = "2026-11-25";
const validRequest = {
  locationId: "downtown",
  date: "2026-11-26",
  partySize: 2,
} as const;

describe("parseLocationId", () => {
  it("accepts a known location id", () => {
    expect(parseLocationId("riverside")).toBe("riverside");
  });

  it.each([["nowhere"], [""], [null], [undefined], [42]])(
    "rejects %j",
    (value) => {
      expect(parseLocationId(value)).toBeNull();
    },
  );
});

describe("toIsoDate", () => {
  it("uses the local calendar day, even late in the evening", () => {
    expect(toIsoDate(new Date(2026, 10, 25, 23, 30))).toBe("2026-11-25");
  });
});

describe("parseIsoDate", () => {
  it("parses a valid date as local midnight", () => {
    expect(parseIsoDate("2026-11-26")).toEqual(new Date(2026, 10, 26));
  });

  it.each([["2026-02-30"], ["26-11-2026"], ["2026-11-26T19:00"], [""]])(
    "returns null for %j",
    (value) => {
      expect(parseIsoDate(value)).toBeNull();
    },
  );
});

describe("formatTime", () => {
  it.each([
    ["17:30", "5:30 pm"],
    ["19:00", "7:00 pm"],
    ["12:15", "12:15 pm"],
    ["00:05", "12:05 am"],
  ])("formats %s as %s", (time, expected) => {
    expect(formatTime(time)).toBe(expected);
  });
});

describe("formatPartySize", () => {
  it("uses the singular for one guest", () => {
    expect(formatPartySize(1)).toBe("1 guest");
  });

  it("uses the plural for more guests", () => {
    expect(formatPartySize(12)).toBe("12 guests");
  });
});

describe("assertValidRequest", () => {
  it("accepts a valid request", () => {
    expect(() => assertValidRequest(validRequest, today)).not.toThrow();
  });

  it("accepts today and the last day of the booking window", () => {
    expect(() =>
      assertValidRequest({ ...validRequest, date: today }, today),
    ).not.toThrow();
    expect(() =>
      assertValidRequest({ ...validRequest, date: "2027-01-24" }, today),
    ).not.toThrow();
  });

  it.each([[0], [13], [2.5], [Number.NaN]])(
    "rejects a party size of %s",
    (partySize) => {
      expect(() =>
        assertValidRequest({ ...validRequest, partySize }, today),
      ).toThrow(BookingRequestError);
    },
  );

  it("rejects a date in the past", () => {
    expect(() =>
      assertValidRequest({ ...validRequest, date: "2026-11-24" }, today),
    ).toThrow("already passed");
  });

  it("rejects a date beyond the booking window", () => {
    expect(() =>
      assertValidRequest({ ...validRequest, date: "2027-01-25" }, today),
    ).toThrow("60 days ahead");
  });

  it("rejects a malformed date", () => {
    expect(() =>
      assertValidRequest({ ...validRequest, date: "tomorrow" }, today),
    ).toThrow(BookingRequestError);
  });
});
