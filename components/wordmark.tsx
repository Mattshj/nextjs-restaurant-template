import Link from "next/link";

import { siteName } from "@/lib/data/site";

/** Hearthwick wordmark that links to the homepage. */
export function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 font-heading text-xl font-extrabold tracking-wider uppercase"
    >
      <span aria-hidden="true" className="size-3.5 rounded-xs bg-graphite" />
      {siteName}
    </Link>
  );
}
