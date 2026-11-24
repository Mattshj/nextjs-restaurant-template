/**
 * Joins class names conditionally and resolves Tailwind conflicts, so the
 * last class wins (e.g. `cn("px-2", "px-4")` gives `"px-4"`).
 *
 * Re-exported from shadcn's `cn` package, a drop-in replacement for
 * clsx + tailwind-merge. Components import it from here so the
 * implementation can be swapped in one place.
 */
export { cn } from "cn";
