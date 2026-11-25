import { createMockAvailabilityService } from "@/lib/mock/availability";
import type { AvailabilityService } from "@/lib/types";

/**
 * The availability service the app uses. This is the single place to swap
 * the mock for the real booking API (see docs/architecture/c4.md).
 */
export const availabilityService: AvailabilityService =
  createMockAvailabilityService();
