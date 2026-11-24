import Link from "next/link";

import { cn } from "@/lib/utils";
import type { NavLink } from "@/lib/types";

type SectionHeaderProps = {
  /** Heading text, rendered as an `<h2>`. */
  title: string;
  /** Id for the heading, so the section can use `aria-labelledby`. */
  id: string;
  /** Optional link shown next to the heading, e.g. "Full menu →". */
  action?: NavLink;
  /** `section` for page sections, `panel` for the smaller booking-panel heading. */
  size?: "section" | "panel";
  className?: string;
};

/**
 * Section heading with an optional trailing link. The link inherits the
 * surrounding text colour, so it works on cream and graphite sections.
 */
export function SectionHeader({
  title,
  id,
  action,
  size = "section",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-4 gap-y-3",
        className,
      )}
    >
      <h2
        id={id}
        className={cn(
          "font-heading",
          size === "section"
            ? "text-section font-extrabold tracking-heading"
            : "text-3xl font-bold tracking-tight",
        )}
      >
        {title}
      </h2>
      {action && (
        <Link
          href={action.href}
          className={cn(
            "underline underline-offset-4",
            size === "section" ? "font-semibold" : "text-sm",
          )}
        >
          {action.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
