import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Toaster } from "@/components/ui/sonner";
import { createMockAvailabilityService } from "@/lib/mock/availability";
import type {
  AvailabilityService,
  HoldRequest,
  LocationId,
  TableHold,
  TimeSlot,
} from "@/lib/types";

import { BookingForm } from "./booking-form";

// Only Date is faked, so user-event and Radix timers keep running.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 10, 25, 12, 0)); // Wed 25 Nov 2026, noon
});

afterEach(() => {
  vi.useRealTimers();
  // Sonner keeps toasts in a module-level store; clear it so a new
  // <Toaster> doesn't show toasts from earlier tests.
  toast.dismiss();
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
      releaseHold: () => Promise.resolve(),
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
      releaseHold: () => Promise.resolve(),
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

  describe("table holds", () => {
    async function showTimes(user: ReturnType<typeof userEvent.setup>) {
      await pickDate(user, /November 27/);
      await user.click(screen.getByRole("button", { name: "Find a table" }));
      return within(await screen.findByRole("radiogroup")).getAllByRole(
        "radio",
      );
    }

    function spiedService() {
      const service = createMockAvailabilityService({ delayMs: 0 });
      return {
        service,
        holdTable: vi.spyOn(service, "holdTable"),
        releaseHold: vi.spyOn(service, "releaseHold"),
      };
    }

    it("releases the previous table when the guest picks another time", async () => {
      const { service, holdTable, releaseHold } = spiedService();
      const { user } = renderForm({ service });
      const [first, second] = await showTimes(user);

      await user.click(first);
      await screen.findByText("Table held for 10 minutes");
      const firstHold = await holdTable.mock.results[0].value;
      await user.click(second);

      await waitFor(() =>
        expect(releaseHold).toHaveBeenCalledWith(firstHold.id),
      );
      expect(second).toBeChecked();
    });

    it("releases the table when the party size changes", async () => {
      const { service, holdTable, releaseHold } = spiedService();
      const { user } = renderForm({ service });
      const [first] = await showTimes(user);
      await user.click(first);
      await screen.findByText("Table held for 10 minutes");
      const hold = await holdTable.mock.results[0].value;

      await user.click(screen.getByRole("button", { name: "More guests" }));

      expect(releaseHold).toHaveBeenCalledWith(hold.id);
    });

    it("asks for a new search after the inputs change, even if changed back", async () => {
      const { service } = spiedService();
      const { user } = renderForm({ service });
      const [first] = await showTimes(user);
      await user.click(first);
      await screen.findByText("Table held for 10 minutes");

      await user.click(screen.getByRole("button", { name: "More guests" }));
      await user.click(screen.getByRole("button", { name: "Fewer guests" }));

      // The old hold was released, so its time must not reappear as chosen.
      expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
      expect(
        screen.getByText("Pick a date and party size, then find a table."),
      ).toBeInTheDocument();
    });

    it("releases a hold that arrives after a newer choice", async () => {
      const pending = new Map<string, ReturnType<typeof deferred<TableHold>>>();
      const releaseHold = vi.fn(() => Promise.resolve());
      const service: AvailabilityService = {
        getAvailability: () =>
          Promise.resolve([{ time: "18:00" }, { time: "19:00" }]),
        holdTable: (request: HoldRequest) => {
          const response = deferred<TableHold>();
          pending.set(request.time, response);
          return response.promise;
        },
        releaseHold,
      };
      const holdFor = (request: HoldRequest, id: string): TableHold => ({
        id,
        request,
        expiresAt: new Date(2026, 10, 25, 12, 10),
      });
      const { user } = renderForm({ service });
      const [sixPm, sevenPm] = await showTimes(user);

      await user.click(sixPm);
      await user.click(sevenPm);
      const request = {
        locationId: "riverside",
        date: "2026-11-27",
        partySize: 2,
      } as const;
      pending
        .get("19:00")
        ?.resolve(holdFor({ ...request, time: "19:00" }, "late-pick"));
      await screen.findByText(/7:00 pm · 2 guests/);
      pending
        .get("18:00")
        ?.resolve(holdFor({ ...request, time: "18:00" }, "early-pick"));

      await waitFor(() =>
        expect(releaseHold).toHaveBeenCalledWith("early-pick"),
      );
      expect(releaseHold).not.toHaveBeenCalledWith("late-pick");
      expect(screen.getAllByText("Table held for 10 minutes")).toHaveLength(1);
    });
  });
});
