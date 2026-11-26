# Hearthwick

Website and booking platform for Hearthwick, a fictional multi-location restaurant group: a concept project by MapleCatch Solutions.

The goal is to show real engineering depth behind a polished restaurant site: a booking engine that handles many users at once, a host dashboard, CRM and analytics. The current stage is the foundation and the homepage, with booking availability served from typed mock data.

> **Status:** in early development. Features are added through small, reviewed pull requests; see the commit history and closed PRs for progress.

## Tech stack

| Area      | Choice                                                                                |
| --------- | ------------------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Cache Components, Partial Prefetching)  |
| UI        | [React 19](https://react.dev)                                                         |
| Language  | [TypeScript](https://www.typescriptlang.org) in strict mode                           |
| Styling   | [Tailwind CSS v4](https://tailwindcss.com) with CSS-first design tokens               |
| UI kit    | [shadcn/ui](https://ui.shadcn.com) (Radix), restyled to the Hearthwick theme          |
| Testing   | [Vitest](https://vitest.dev) and [React Testing Library](https://testing-library.com) |
| Linting   | [ESLint](https://eslint.org) with the Next.js Core Web Vitals and TypeScript configs  |

## Getting started

### Prerequisites

- Node.js 24 LTS (pinned in `.nvmrc`; run `nvm use`)
- pnpm 12, enabled through Corepack (`corepack enable`); the exact version is pinned in `package.json`

### Install and run

```bash
git clone <repository-url>
cd restaurant-template
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Environment

Copy `.env.example` to `.env.local` for local overrides. In every deployed environment, set:

| Variable   | Purpose                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL` | Public base URL, used for canonical links, Open Graph URLs, the sitemap and structured data. Defaults to `http://localhost:3000`. |

## Scripts

| Command             | What it does                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Start the development server                                                                                                        |
| `pnpm build`        | Create an optimised production build                                                                                                |
| `pnpm start`        | Serve the production build                                                                                                          |
| `pnpm lint`         | Lint the project with ESLint                                                                                                        |
| `pnpm format`       | Format all files with Prettier                                                                                                      |
| `pnpm format:check` | Check formatting without writing                                                                                                    |
| `pnpm test`         | Run the unit tests once with Vitest                                                                                                 |
| `pnpm test:watch`   | Run the unit tests in watch mode                                                                                                    |
| `pnpm test:e2e`     | Run Playwright smoke tests against a production build (run `pnpm build` first; first time: `pnpm exec playwright install chromium`) |

## Project structure

```text
app/              Routes, root layout and design tokens (globals.css)
components/ui/    shadcn/ui components, restyled to Hearthwick
components/       Shared layout pieces (header, footer, section header)
features/         Feature code: home sections, booking panel
lib/              Types, content, booking rules and utilities
lib/mock/         Mock availability service (replaced by the real API later)
e2e/              Playwright smoke tests
docs/             Architecture (C4 diagrams) and the approved design reference
public/           Static assets served as-is
```

## Development workflow

- `main` is always deployable. All work happens on short-lived branches named `<type>/<issue>-<short-name>`, for example `feat/12-menu-section`.
- Each change starts from a GitHub issue and lands through a pull request that links it.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Lint, typecheck, tests and build must pass before a change is merged.
- Project conventions and design tokens are documented in [CLAUDE.md](CLAUDE.md).
