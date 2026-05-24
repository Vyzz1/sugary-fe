# Repository Guidelines

## Project Structure & Module Organization

This is a TanStack Start React application built with Vite and TypeScript. Application code lives in `src/`. File-based routes are in `src/routes/`; `src/routes/__root.tsx` defines the root shell and `src/routeTree.gen.ts` is generated. Shared UI primitives belong in `src/components/ui/`, reusable hooks in `src/hooks/`, utilities in `src/lib/`, and integration providers in `src/integrations/`. Static assets are stored in `public/`. Use the `@/*` alias for imports from `src`, for example `@/lib/utils`.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the local Vite dev server on port `3000`.
- `npm run build`: create a production build.
- `npm run preview`: serve the built app locally for inspection.
- `npm run test`: run Vitest once.
- `npm run lint`: run ESLint.
- `npm run format`: apply Prettier formatting and ESLint autofixes.
- `npm run check`: verify Prettier formatting without changing files.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Keep route files aligned with TanStack Router file-based routing under `src/routes`. Name hooks with the `useX` pattern, components in `PascalCase`, and utility functions in `camelCase`. Prettier is configured for 2-space indentation, semicolons, double quotes, trailing commas where valid in ES5, and a 100-character print width. ESLint extends `@tanstack/eslint-config`; do not re-enable disabled import-order rules unless the project standard changes.

## Testing Guidelines

Vitest is the test runner, with React Testing Library available for component tests. Place tests near the code they cover using `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx`. Prefer behavior-focused tests for routes, hooks, and API helpers. Run `npm run test` before submitting changes; add coverage for new logic and regressions.

## Commit & Pull Request Guidelines

This repository currently has no commit history, so use clear, imperative commit messages such as `Add notification hook tests` or `Fix router provider setup`. Keep commits scoped to one logical change. Pull requests should include a brief summary, linked issue when available, screenshots for UI changes, and the commands run for validation, especially `npm run test`, `npm run lint`, and `npm run check`.

## Security & Configuration Tips

Do not commit secrets or environment-specific credentials. Keep local configuration in `.env` and document required variables in the README when adding them. Treat generated files such as `src/routeTree.gen.ts` as build artifacts from the router tooling and avoid manual edits unless necessary.
