import Link from "next/link";

import { footerNav, siteName } from "@/lib/data/site";

/** Site footer with the concept-project credit and secondary links. */
export function SiteFooter() {
  return (
    <footer className="page-container flex flex-wrap justify-between gap-4 pb-12 text-sm text-muted-foreground">
      <p>{siteName} · a concept project by MapleCatch Solutions</p>
      <nav aria-label="Footer">
        <ul className="flex flex-wrap gap-6">
          {footerNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-foreground underline underline-offset-4"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
