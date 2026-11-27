"use client";

import { useCallback, useEffect, useRef } from "react";

import type { AvailabilityService, HoldRequest, TableHold } from "@/lib/types";

/**
 * Keeps at most one table held for the guest.
 *
 * - `hold` releases the previous hold, then holds the new slot.
 * - `release` gives the current hold back, e.g. when the search changes.
 * - A hold that resolves after a newer `hold` or `release` call is released
 *   straight away and reported as `null`, so fast clicks on different times
 *   never leave a table blocked for the full hold period.
 *
 * Release errors are ignored: every hold expires on its own (`HOLD_MINUTES`),
 * so a failed release only delays freeing the table.
 */
export function useTableHold(service: AvailabilityService) {
  const currentHold = useRef<TableHold | null>(null);
  // Bumped by every hold/release call; a response is only used if no newer
  // call happened while it was in flight.
  const generation = useRef(0);

  const releaseQuietly = useCallback(
    (hold: TableHold) => {
      service.releaseHold(hold.id).catch(() => {});
    },
    [service],
  );

  const release = useCallback(() => {
    generation.current++;
    const hold = currentHold.current;
    currentHold.current = null;
    if (hold) releaseQuietly(hold);
  }, [releaseQuietly]);

  /**
   * Holds a slot for the guest.
   *
   * @returns the hold, or `null` if a newer hold or release superseded it.
   * @throws whatever `holdTable` throws, unless the call was superseded.
   */
  const hold = useCallback(
    async (request: HoldRequest) => {
      release();
      const callGeneration = generation.current;

      let newHold: TableHold;
      try {
        newHold = await service.holdTable(request);
      } catch (error) {
        if (callGeneration !== generation.current) return null;
        throw error;
      }

      if (callGeneration !== generation.current) {
        releaseQuietly(newHold);
        return null;
      }
      currentHold.current = newHold;
      return newHold;
    },
    [release, releaseQuietly, service],
  );

  // Give the table back if the guest leaves the page mid-booking.
  useEffect(() => release, [release]);

  return { hold, release };
}
