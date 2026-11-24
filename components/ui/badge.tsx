import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full font-semibold whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        // Pill on the cream page background, e.g. "Now taking bookings".
        default: "bg-card text-card-foreground",
        // Tag inside a cream-light card, e.g. dietary labels.
        subtle: "bg-background text-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
      size: {
        sm: "px-2.5 py-1 text-xs",
        default: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Non-interactive pill for status labels and tags.
 *
 * @param variant - `default` (cream-light, for the page background),
 *   `subtle` (cream, for use inside cards), `primary` or `secondary`.
 * @param size - `default` for status pills, `sm` for compact tags.
 * @param asChild - render the child element with badge styling.
 */
function Badge({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
