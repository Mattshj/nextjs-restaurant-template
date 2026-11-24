import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";

/*
 * Hearthwick buttons are always pill-shaped. Focus styling comes from the
 * global `:focus-visible` outline in globals.css, which picks a colour with
 * enough contrast for the surface the button sits on.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent font-semibold whitespace-nowrap transition-colors select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover aria-expanded:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover aria-expanded:bg-secondary-hover",
        outline:
          "border-current bg-transparent hover:bg-foreground/5 aria-expanded:bg-foreground/5",
        ghost:
          "bg-transparent hover:bg-foreground/5 aria-expanded:bg-foreground/5",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        default: "h-11 px-[1.375rem] text-[0.9375rem]",
        lg: "h-13 px-7 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

/**
 * Pill button in the Hearthwick style.
 *
 * @param variant - `primary` (tangerine, main call to action), `secondary`
 *   (graphite), `outline` or `ghost` (inherit the surrounding text colour).
 * @param size - `sm`, `default` (44px tall, the minimum touch target),
 *   `lg` for hero CTAs, or `icon` / `icon-sm` for square icon buttons.
 * @param asChild - render the child element (e.g. a `Link`) with button
 *   styling instead of a `<button>`.
 */
function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
