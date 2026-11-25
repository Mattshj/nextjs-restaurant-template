"use client";

import { useSearchParams } from "next/navigation";

import { DEFAULT_LOCATION_ID, parseLocationId } from "@/lib/booking";
import type { LocationId } from "@/lib/types";

import { BookingForm } from "./booking-form";

/**
 * Booking form whose location lives in the `?location=` URL parameter, so
 * "Book Riverside →" links preselect it and a chosen location survives a
 * reload or a shared link. Must sit inside `<Suspense>` (useSearchParams).
 */
export function UrlBookingForm() {
  const searchParams = useSearchParams();
  const locationId =
    parseLocationId(searchParams.get("location")) ?? DEFAULT_LOCATION_ID;

  function changeLocation(id: LocationId) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("location", id);
    // Next.js syncs native history updates with useSearchParams, so this
    // re-renders without a server round trip.
    window.history.replaceState(
      null,
      "",
      `?${params.toString()}${window.location.hash}`,
    );
  }

  return (
    <BookingForm locationId={locationId} onLocationChange={changeLocation} />
  );
}
