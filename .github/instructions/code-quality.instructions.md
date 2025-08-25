---
applyTo: "**/*.{ts,tsx}"
description: "Concise code quality guide: ESLint + Prettier + conventions aligned with this repo."
---

# Code Quality Instructions

Keep code consistent, readable, and maintainable. This guide consolidates our linting, formatting, and core conventions.

## What to run

- Lint all: `npm run lint`
- Auto-fix: `npm run lint:fix`
- Format (on save via editor + pre-commit via lint-staged). Run a full format when needed:
  - All files: `npx prettier --write .`
  - Check only: `npx prettier --check .`

## ESLint essentials (backed by .eslintrc)

Enabled rule sets:
- React + Hooks, TypeScript, jsx-a11y, import, Testing Library (in tests), Vitest.

Key enforced rules (high-impact):
- No default exports: use named exports only (`import/no-default-export`).
- No prop spreading (`react/jsx-props-no-spreading`) except allowed UI paths in overrides.
- No `any` (`@typescript-eslint/no-explicit-any`).
- Import order with grouped sections and blank lines between groups (`import/order`).
- Hooks exhaustive deps warning (`react-hooks/exhaustive-deps`).
- Prettier is enforced as an ESLint error (`prettier/prettier`).

Project-specific overrides:
- `src/components/ui/**/*.tsx`: allows prop spreading and disables prop-types/display-name.
- `src/**/*.test.tsx`: adds Testing Library rules and prefers user-event.

Useful tips:
- When you must disable a rule, do it locally and explain briefly. Prefer refactoring.
- Keep imports sorted logically by group; rely on the rule to enforce spacing.

## Prettier essentials (backed by .prettierrc)

Settings we care about:
- printWidth 120, singleQuote, trailingComma "all", proseWrap "always".
- Prettier integrates with ESLint via `plugin:prettier/recommended`; formatting issues surface as lint errors.

Usage:
- Format-on-save in editor; lint-staged formats staged files on commit.
- For large refactors, run `npx prettier --write .` after changes.

## Imports and file organization

- Named exports only; filename matches main export.
- Order imports by groups per lint rule: external/builtin → parent/internal → index/sibling; keep a blank line between.
- Avoid deep barrel files that re-export everything; prefer explicit module imports to aid tree-shaking.
- Keep components small and single-purpose; align with Atomic Design structure.

## Documentation and comments

- Keep comments minimal and meaningful; prefer self-explanatory code and clear names.
- Avoid large explanatory blocks that drift out of date. Document only tricky logic and public contracts.

## Testing quality

- Prefer user-event over fireEvent (enforced in test override).
- Query by role/name first in Testing Library to reflect accessibility.
- Keep tests deterministic; avoid real timers unless necessary.

## Quick checklists

PR checklist:
- [ ] No ESLint errors; warnings triaged.
- [ ] Prettier formatting applied; no noisy diffs.
- [ ] Imports ordered by rule; named exports only.
- [ ] No `any`, no prop spreading (except allowed UI overrides).
- [ ] Components and hooks typed; API surface explicit.

File hygiene:
- [ ] One main export per file; co-locate small helpers if tightly coupled.
- [ ] Avoid long files; split by responsibility.
- [ ] Keep UI code free of dead imports and unused vars.

## Commands reference

These are already defined in `package.json`:
- Lint: `npm run lint` → ESLint (TS/TSX) + Stylelint (CSS/SCSS/PCSS)
- Fix: `npm run lint:fix`
- Type check: `npm run typecheck`
- Tests: `npm test`, Coverage: `npm run coverage`

## When to deviate

- Rule disables must be narrow (line/block) with a short reason. Consider adding a local helper or refactor instead.
- For generated or legacy code, prefer `.eslintignore` entries rather than blanket disables inline.
