# Restaurant Website Template

A modern, reusable website template for restaurants, built with Next.js, React and Tailwind CSS. The goal is a fast, accessible, SEO-friendly site that can be rebranded for a new restaurant by changing content and design tokens, not code.

> **Status:** in early development. Features are added through small, reviewed pull requests; see the commit history and closed PRs for progress.

## Tech stack

| Area      | Choice                                                                                             |
| --------- | -------------------------------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Cache Components, Partial Prefetching)              |
| UI        | [React 19](https://react.dev)                                                                      |
| Language  | [TypeScript](https://www.typescriptlang.org) in strict mode                                        |
| Styling   | [Tailwind CSS v4](https://tailwindcss.com) with CSS-first design tokens                            |
| Linting   | [ESLint](https://eslint.org) with the Next.js Core Web Vitals and TypeScript configs               |

## Getting started

### Prerequisites

- Node.js 20 or later
- npm 10 or later

### Install and run

```bash
git clone <repository-url>
cd restaurant-template
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Scripts

| Command         | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the development server              |
| `npm run build` | Create an optimised production build      |
| `npm run start` | Serve the production build                |
| `npm run lint`  | Lint the project with ESLint              |

## Project structure

```text
app/            Routes, layouts and global styles (Next.js App Router)
public/         Static assets served as-is
```

## Development workflow

- `main` is always deployable. All work happens on short-lived branches named `<type>/<issue>-<short-name>`, for example `feat/12-menu-section`.
- Each change starts from a GitHub issue and lands through a pull request that links it.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- Lint and build must pass before a change is merged.
