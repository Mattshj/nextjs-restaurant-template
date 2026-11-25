@AGENTS.md

# Hearthwick

Website and booking platform for **Hearthwick**, a fictional multi-location restaurant group: a concept project by MapleCatch Solutions. It is a portfolio piece, so code quality, tests and git history are part of the deliverable.

The long-term goal is real engineering depth: a booking engine that handles many concurrent users, a host dashboard, CRM and analytics. See [docs/architecture/c4.md](docs/architecture/c4.md) for the target architecture. Today the project has the foundation and the homepage UI, with no backend: booking availability comes from typed mock data.

## Stack and commands

- Next.js 16 (App Router, Cache Components, Partial Prefetching), React 19, TypeScript strict
- Tailwind CSS v4 (CSS-first config in `app/globals.css`), shadcn/ui (Radix base)
- Node 24 LTS (`.nvmrc`), pnpm (version pinned in `package.json`)
- Vitest + React Testing Library (unit and component tests), Playwright (`e2e/`, smoke tests)

| Task       | Command                             |
| ---------- | ----------------------------------- |
| Dev server | `pnpm dev`                          |
| Lint       | `pnpm lint`                         |
| Format     | `pnpm format` / `pnpm format:check` |
| Typecheck  | `pnpm exec tsc --noEmit`            |
| Unit tests | `pnpm test`                         |
| E2E tests  | `pnpm build && pnpm test:e2e`       |
| Build      | `pnpm build`                        |

Run lint, typecheck, tests and format check before every commit.

## Folder structure

```text
app/                 Routes, root layout, globals.css (design tokens)
components/ui/       shadcn components, restyled to Hearthwick
components/          Shared layout pieces (SiteHeader, SiteFooter, SectionHeader)
features/<feature>/  Feature compositions, e.g. features/booking, features/home
lib/                 Utilities (cn), shared types and static content
lib/mock/            Typed mock data behind interfaces that a real API replaces later
lib/availability.ts  The one place that picks the availability service (mock today)
e2e/                 Playwright tests
docs/                Architecture (C4) and the approved design reference
```

## Design

The approved homepage design is [docs/design-reference/homepage-design-reference.html](docs/design-reference/homepage-design-reference.html). It uses a custom templating format (`{{holes}}`, `<sc-for>`), so treat it as a visual and content spec, not code to copy. Its "Ember & Oak" wordmark is outdated: the brand is **Hearthwick**.

### Tokens (60 / 30 / 10)

| Token             | Value     | Use                                                           |
| ----------------- | --------- | ------------------------------------------------------------- |
| Biscotti Cream    | `#EAE1D3` | Page background (~60%)                                        |
| Cream light       | `#F5F0E7` | Cards, pills                                                  |
| Cream deep        | `#DCD1BF` | Image placeholders, borders                                   |
| Graphite Enamel   | `#2B2C2F` | Text, booking panel, locations band, secondary buttons (~30%) |
| Tangerine Laser   | `#FF6A14` | Primary CTAs, selected states, small highlights (~10%)        |
| Muted on cream    | `#5E5A54` | Secondary text on light surfaces                              |
| Muted on graphite | `#BDB5A8` | Secondary text on dark surfaces                               |
| Graphite border   | `#4A4B50` | Dividers on dark surfaces                                     |

- Radii: buttons and pills fully rounded, inputs 14px (`--radius`), cards 24px (`rounded-card`), hero image and banners 32px (`rounded-banner`).
- Layout: `page-container` utility (1280px max, 32px gutters, 20px on mobile).
- Type: headings in Inter Tight 700–800 (`font-heading`, `tracking-heading` -0.03em, `tracking-display` -0.04em for the H1); body in Inter 400–600.

### Rules that are easy to get wrong

- **Text on tangerine is always graphite, never white.** White on tangerine is 2.9:1; graphite is 4.9:1.
- **Focus outlines:** tangerine on cream is only 2.2:1, below the WCAG 3:1 minimum. The global `:focus-visible` outline uses `--focus-ring`: graphite on light surfaces, tangerine inside `surface-dark`. Put dark sections in `surface-dark` rather than setting `bg-secondary` by hand.
- Use tokens (`bg-primary`, `text-muted-foreground`, `bg-graphite`), never raw hex or arbitrary colour values. Brand colours are defined once in `:root` in `app/globals.css`.
- shadcn's `dark:` utilities are disabled on purpose: the site has a single light theme.

### shadcn theme mapping

| Variable                             | Colour                |
| ------------------------------------ | --------------------- |
| `background` / `foreground`          | Cream / Graphite      |
| `primary` / `primary-foreground`     | Tangerine / Graphite  |
| `secondary` / `secondary-foreground` | Graphite / Cream      |
| `card`, `popover`, `muted`           | Cream light           |
| `muted-foreground`                   | Muted on cream        |
| `accent` / `accent-foreground`       | Cream deep / Graphite |
| `border`, `input`                    | Cream deep            |
| `ring`                               | Tangerine             |

## Components

- shadcn/ui is the base. Add a component with `pnpm shadcn add <name>` (uses the locked version) only when a section needs it, then restyle it to the tokens and change its `cn` import to `@/lib/utils`.
- Button variants: `primary` (default), `secondary`, `outline`, `ghost`. Badge variants: `default`, `subtle` (inside cards), `primary`, `secondary`. Toggle-group variants: `default` (cream surfaces), `dark` (inside `surface-dark`).
- Build custom only where shadcn has no fit: `GuestStepper`, `SectionHeader`, `SiteHeader`, `SiteFooter`.

## Conventions

- Server Components by default; `"use client"` only where interaction needs it, as low in the tree as possible.
- Accessibility: semantic HTML, a label on every input, visible focus, full keyboard support, WCAG AA contrast, `prefers-reduced-motion` respected.
- Responsive and mobile-first; check at 375px, 768px and 1440px.
- **Don't invent content.** Keep `[PRICE]`, `[ADDRESS]` and photo placeholders until real content is provided. No real people's names, photos, phone numbers or addresses.
- Mock data lives in `lib/mock/` behind a typed interface (`AvailabilityService` in `lib/types.ts`), so swapping in the real API changes `lib/availability.ts`, not the UI. Booking rules (party size, booking window, hold length) live in `lib/booking.ts`.
- State that belongs in the URL (e.g. the booking location, `?location=`) is read with `useSearchParams` inside `<Suspense>`, so the rest of the page stays prerendered.
- Tests are colocated as `*.test.ts(x)` and query by role, label or text.
