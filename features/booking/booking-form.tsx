"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { addDays, format, startOfToday } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { availabilityService } from "@/lib/availability";
import {
  BOOKING_WINDOW_DAYS,
  BookingRequestError,
  HOLD_MINUTES,
  PARTY_SIZE_MAX,
  PARTY_SIZE_MIN,
  SlotUnavailableError,
  formatPartySize,
  formatTime,
  parseIsoDate,
  parseLocationId,
  toIsoDate,
} from "@/lib/booking";
import { locations } from "@/lib/data/locations";
import { cn } from "@/lib/utils";
import type {
  AvailabilityRequest,
  AvailabilityService,
  LocationId,
  TimeSlot,
} from "@/lib/types";

import { GuestStepper } from "./guest-stepper";
import { useTableHold } from "./use-table-hold";

type SearchState =
  | { status: "idle" }
  | { status: "loading"; request: AvailabilityRequest }
  | { status: "done"; request: AvailabilityRequest; slots: TimeSlot[] }
  | { status: "error"; request: AvailabilityRequest; message: string };

type BookingFormProps = {
  locationId: LocationId;
  /** Called when the guest picks another location. Omit to make it read-only. */
  onLocationChange?: (locationId: LocationId) => void;
  /** Availability source; tests inject their own. */
  service?: AvailabilityService;
};

const labelClass = "text-sm font-semibold text-muted-on-graphite";

/**
 * Table search: location, date and party size, then selectable time slots.
 * Choosing a time holds the table and confirms with a toast.
 *
 * Results belong to the request that produced them. When any input changes,
 * they are hidden rather than shown for the wrong search, responses to
 * superseded searches are ignored, and any table held for the old search is
 * released.
 */
export function BookingForm({
  locationId,
  onLocationChange,
  service = availabilityService,
}: BookingFormProps) {
  const [date, setDate] = useState<Date>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dateMissing, setDateMissing] = useState(false);
  const [partySize, setPartySize] = useState(2);
  const [search, setSearch] = useState<SearchState>({ status: "idle" });
  const [selectedTime, setSelectedTime] = useState("");
  const latestSearchId = useRef(0);
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const tableHold = useTableHold(service);

  const ids = {
    location: useId(),
    dateLabel: useId(),
    dateValue: useId(),
    dateError: useId(),
    slots: useId(),
  };

  const location =
    locations.find((item) => item.id === locationId) ?? locations[0];
  const request: AvailabilityRequest | null = date
    ? { locationId, date: toIsoDate(date), partySize }
    : null;

  // When location, date or party size changes, the old results and chosen
  // time no longer apply, even if the guest later changes back. Reset during
  // render (React's "adjust state on prop change" pattern) because the
  // location arrives as a prop from the URL.
  const inputsKey = `${locationId}|${request?.date ?? ""}|${partySize}`;
  const [resultsKey, setResultsKey] = useState(inputsKey);
  if (inputsKey !== resultsKey) {
    setResultsKey(inputsKey);
    setSearch({ status: "idle" });
    setSelectedTime("");
  }
  const result =
    search.status !== "idle" &&
    request &&
    isSameRequest(search.request, request)
      ? search
      : null;

  const hasSlots = result?.status === "done" && result.slots.length > 0;
  const { release: releaseHold } = tableHold;

  // Once location, date or party size changes, the held table no longer
  // matches what the guest is looking for.
  const showingResults = result !== null;
  useEffect(() => {
    if (!showingResults) releaseHold();
  }, [showingResults, releaseHold]);

  async function findTables(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request) {
      setDateMissing(true);
      dateButtonRef.current?.focus();
      return;
    }

    const searchId = ++latestSearchId.current;
    tableHold.release();
    setSelectedTime("");
    setSearch({ status: "loading", request });
    try {
      const slots = await service.getAvailability(request);
      if (searchId === latestSearchId.current) {
        setSearch({ status: "done", request, slots });
      }
    } catch (error) {
      if (searchId === latestSearchId.current) {
        setSearch({ status: "error", request, message: messageFor(error) });
      }
    }
  }

  async function holdTime(time: string) {
    // Radix reports "" when the selected chip is pressed again; keep the choice.
    if (!time || result?.status !== "done") return;

    setSelectedTime(time);
    try {
      const hold = await tableHold.hold({ ...result.request, time });
      if (!hold) return; // superseded by a newer choice
      toast.success(`Table held for ${HOLD_MINUTES} minutes`, {
        description: describeHold(location.name, hold.request),
      });
    } catch (error) {
      setSelectedTime("");
      toast.error(messageFor(error));
    }
  }

  return (
    <form noValidate onSubmit={findTables} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div className="flex flex-col gap-2">
          <label htmlFor={ids.location} className={labelClass}>
            Location
          </label>
          <Select
            value={locationId}
            onValueChange={(value) => {
              const id = parseLocationId(value);
              if (id) onLocationChange?.(id);
            }}
          >
            <SelectTrigger id={ids.location}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locations.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative flex flex-col gap-2">
          <span id={ids.dateLabel} className={labelClass}>
            Date
          </span>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              {/* Labelled by both spans so screen readers hear the chosen date, not just "Date". */}
              <button
                ref={dateButtonRef}
                type="button"
                aria-labelledby={`${ids.dateLabel} ${ids.dateValue}`}
                data-invalid={dateMissing || undefined}
                aria-describedby={dateMissing ? ids.dateError : undefined}
                className="flex h-13 w-full items-center justify-between gap-2 rounded-lg bg-background px-3.5 text-left text-base font-medium text-foreground data-invalid:ring-2 data-invalid:ring-primary"
              >
                <span
                  id={ids.dateValue}
                  className={date ? undefined : "text-muted-foreground"}
                >
                  {date ? format(date, "EEE d MMM") : "Choose a date"}
                </span>
                <CalendarIcon
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-2">
              <BookingCalendar
                selected={date}
                onSelect={(day) => {
                  setDate(day);
                  setDateMissing(false);
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {dateMissing && (
            <p
              id={ids.dateError}
              // Out of the flow on wide screens, so the bottom-aligned row doesn't jump.
              className="text-sm font-semibold text-tangerine lg:absolute lg:top-full lg:mt-1.5"
            >
              Choose a date first.
            </p>
          )}
        </div>

        <GuestStepper
          value={partySize}
          onChange={setPartySize}
          min={PARTY_SIZE_MIN}
          max={PARTY_SIZE_MAX}
        />

        <Button type="submit" size="lg" className="h-13 w-full font-bold">
          {result?.status === "loading" ? "Finding tables…" : "Find a table"}
        </Button>
      </div>

      <div className="flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2.5">
        {/*
          One live region for every search state, so each change is announced
          once. With results, the visible "Open at …" label takes over and the
          count is read to screen readers only.
        */}
        <p
          role="status"
          className={cn(
            labelClass,
            result?.status === "error" && "text-tangerine",
            hasSlots && "sr-only",
          )}
        >
          {statusMessage(result, location.name)}
        </p>
        {hasSlots && (
          <>
            <span id={ids.slots} className={labelClass}>
              Open at {location.name}:
            </span>
            <ToggleGroup
              type="single"
              variant="dark"
              aria-labelledby={ids.slots}
              value={selectedTime}
              onValueChange={holdTime}
            >
              {result.slots.map((slot) => (
                <ToggleGroupItem key={slot.time} value={slot.time}>
                  {formatTime(slot.time)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </>
        )}
      </div>
    </form>
  );
}

/**
 * Calendar limited to today through the booking window. It only renders
 * while the popover is open, so reading the clock here never happens during
 * prerendering.
 */
function BookingCalendar({
  selected,
  onSelect,
}: {
  selected: Date | undefined;
  onSelect: (day: Date) => void;
}) {
  const today = startOfToday();
  const lastDay = addDays(today, BOOKING_WINDOW_DAYS);

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={(day) => day && onSelect(day)}
      defaultMonth={selected ?? today}
      startMonth={today}
      endMonth={lastDay}
      disabled={[{ before: today }, { after: lastDay }]}
      autoFocus
    />
  );
}

function isSameRequest(a: AvailabilityRequest, b: AvailabilityRequest) {
  return (
    a.locationId === b.locationId &&
    a.date === b.date &&
    a.partySize === b.partySize
  );
}

function messageFor(error: unknown) {
  if (
    error instanceof BookingRequestError ||
    error instanceof SlotUnavailableError
  ) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}

function describeHold(
  locationName: string,
  request: AvailabilityRequest & { time: string },
) {
  const day = parseIsoDate(request.date);
  return [
    locationName,
    day ? format(day, "EEE d MMM") : request.date,
    formatTime(request.time),
    formatPartySize(request.partySize),
  ].join(" · ");
}

function statusMessage(
  result: Exclude<SearchState, { status: "idle" }> | null,
  locationName: string,
) {
  if (!result) return "Pick a date and party size, then find a table.";
  switch (result.status) {
    case "loading":
      return `Checking tables at ${locationName}…`;
    case "error":
      return result.message;
    case "done":
      return result.slots.length === 0
        ? `No tables left at ${locationName} on that date. Try another day or a smaller party.`
        : `${result.slots.length} times open at ${locationName}.`;
  }
}
