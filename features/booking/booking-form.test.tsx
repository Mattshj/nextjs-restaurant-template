import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Toaster } from "@/components/ui/sonner";
import { createMockAvailabilityService } from "@/lib/mock/availability";
import type { AvailabilityService, LocationId, TimeSlot } from "@/lib/types";

import { BookingForm } from "./booking-form";

// Only Date is faked, so user-event and Radix timers keep running.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 10, 25, 12, 0)); // Wed 25 Nov 2026, noon
});

afterEach(() => {
  vi.useRealTimers();
});

function renderForm({
  locationId = "riverside",
  service = createMockAvailabilityService({ delayMs: 0 }),
  onLocationChange,
}: {
  locationId?: LocationId;
  service?: AvailabilityService;
  onLocationChange?: (id: LocationId) => void;
} = {}) {
  const user = userEvent.setup();
  render(
    <>
      <BookingForm
        locationId={locationId}
        service={service}
        onLocationChange={onLocationChange}
      />
      <Toaster />
    </>,
  );
  return { user };
}

async function pickDate(user: ReturnType<typeof userEvent.setup>, day: RegExp) {
  await user.click(screen.getByRole("button", { name: /^Date/ }));
  await user.click(await screen.findByRole("button", { name: day }));
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe("BookingForm", () => {
  it("asks for a date before searching", async () => {
    const { user } = renderForm();

    await user.click(screen.getByRole("button", { name: "Find a table" }));

    const dateButton = screen.getByRole("button", { name: /^Date/ });
    expect(dateButton).toHaveFocus();
    expect(dateButton).toHaveAccessibleDescription("Choose a date first.");
  });

  it("finds open times and holds the one the guest picks", async () => {
    const { user } = renderForm();

    await pickDate(user, /November 27/);
    expect(
      screen.getByRole("button", { name: "Date Fri 27 Nov" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Find a table" }));

    const times = await screen.findByRole("radiogroup", {
      name: "Open at Riverside:",
    });
    const [, second] = within(times).getAllByRole("radio");
    await user.click(second);

    expect(second).toBeChecked();
    expect(
      await screen.findByText("Table held for 10 minutes"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Riverside · Fri 27 Nov · ${second.textContent} · 2 guests`,
      ),
    ).toBeInTheDocument();
  });

  it("hides results once the party size changes", async () => {
    const { user } = renderForm();
    await pickDate(user, /November 27/);
    await user.click(screen.getByRole("button", { name: "Find a table" }));
    await screen.findByRole("radiogroup");

    await user.click(screen.getByRole("button", { name: "More guests" }));

    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(
      screen.getByText("Pick a date and party size, then find a table."),
    ).toBeInTheDocument();
  });

  it("says when a location is fully booked", async () => {
    const { user } = renderForm({ locationId: "old-town" });

    await pickDate(user, /November 30/); // Old Town is closed on Mondays
    await user.click(screen.getByRole("button", { name: "Find a table" }));

    expect(
      await screen.findByText(/No tables left at Old Town on that date/),
    ).toBeVisible();
  });

  it("shows a friendly error when the search fails", async () => {
    const service: AvailabilityService = {
      getAvailability: () => Promise.reject(new Error("Network down")),
      holdTable: () => Promise.reject(new Error("unused")),
    };
    const { user } = renderForm({ service });

    await pickDate(user, /November 27/);
    await user.click(screen.getByRole("button", { name: "Find a table" }));

    expect(
      await screen.findByText("Something went wrong. Please try again."),
    ).toBeVisible();
  });

  it("ignores a slow response to an earlier search", async () => {
    const responses = [deferred<TimeSlot[]>(), deferred<TimeSlot[]>()];
    let call = 0;
    const service: AvailabilityService = {
      getAvailability: () => responses[call++].promise,
      holdTable: () => Promise.reject(new Error("unused")),
    };
    const { user } = renderForm({ service });
    await pickDate(user, /November 27/);

    await user.click(screen.getByRole("button", { name: "Find a table" }));
    await user.click(screen.getByRole("button", { name: "Finding tables…" }));
    responses[1].resolve([{ time: "19:00" }]);
    const times = await screen.findByRole("radiogroup");
    responses[0].resolve([{ time: "17:30" }]);
    await Promise.resolve();

    expect(
      within(times)
        .getAllByRole("radio")
        .map((r) => r.textContent),
    ).toEqual(["7:00 pm"]);
  });

  it("reports a location change to its owner", async () => {
    const onLocationChange = vi.fn();
    const { user } = renderForm({ onLocationChange });

    await user.click(screen.getByRole("combobox", { name: "Location" }));
    await user.click(await screen.findByRole("option", { name: "Old Town" }));

    expect(onLocationChange).toHaveBeenCalledWith("old-town");
  });
});
