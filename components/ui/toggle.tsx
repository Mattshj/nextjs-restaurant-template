import { cva } from "class-variance-authority";

/*
 * Pill toggles. The "on" state is tangerine with graphite text, the same
 * pairing as primary buttons (4.9:1). Focus styling comes from the global
 * `:focus-visible` outline.
 */
const toggleVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border font-semibold whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // For cream surfaces.
        default: "border-border bg-transparent hover:bg-current/10",
        // For graphite surfaces (`surface-dark`).
        dark: "border-graphite-border bg-transparent hover:border-muted-on-graphite",
      },
      size: {
        default: "h-11 min-w-11 px-4.5 text-sm",
        sm: "h-9 min-w-9 px-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export { toggleVariants };
