"use client";

import { useId } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPartySize } from "@/lib/booking";
import { cn } from "@/lib/utils";

type GuestStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label?: string;
  className?: string;
};

/**
 * −/+ control for the party size.
 *
 * At a limit the button is marked `aria-disabled` instead of `disabled`, so
 * it keeps keyboard focus and screen readers still find it; clicks are
 * ignored. The count is an `<output>`, which announces changes politely.
 *
 * @param value - current party size, between `min` and `max`.
 * @param onChange - called with the new size; never called outside the limits.
 */
export function GuestStepper({
  value,
  onChange,
  min,
  max,
  label = "Guests",
  className,
}: GuestStepperProps) {
  const labelId = useId();
  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span
        id={labelId}
        className="text-sm font-semibold text-muted-on-graphite"
      >
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className="flex h-13 items-center justify-between rounded-lg bg-background p-1 text-foreground"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Fewer guests"
          aria-disabled={atMin}
          onClick={() => !atMin && onChange(value - 1)}
          className="aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
        >
          <MinusIcon aria-hidden="true" />
        </Button>
        <output className="font-semibold">{formatPartySize(value)}</output>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="More guests"
          aria-disabled={atMax}
          onClick={() => !atMax && onChange(value + 1)}
          className="aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
        >
          <PlusIcon aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
