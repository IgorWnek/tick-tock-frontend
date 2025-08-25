---
applyTo: "**/*.tsx"
description: "Performance optimization, memoization, code splitting, rendering optimization, and monitoring for React 19 + Vite + TanStack"
---

# Performance Instructions for GitHub Copilot

These guidelines focus on rendering performance, shipping less JS, and measuring improvements in this repo’s stack: React 19, Vite 5 (SWC), TanStack Router, and TanStack Query v5.

Keep in mind:
- Atomic Design: Atoms are pure and cheap to render; push data work up to molecules/organisms; perform orchestration at templates/pages.
- TanStack Query is the source of truth for server state. Avoid duplicating server data in local state. See `tanstack-query.instructions.md`.
- Measure first. Optimize only what you can prove is slow. Use the tools in `development.instructions.md`.

## Core principles

- Render less: split components, memoize props, avoid unnecessary context updates.
- Work less: cache expensive computations and derived data.
- Ship less: code split by route and feature; tree-shake aggressively.
- Defer work: lazy load non-critical UI and data.
- Measure: profile renders and analyze bundles before/after changes.

## Memoization strategies (useMemo, useCallback, memo)

When to memoize:
- Stable handlers passed to child components that are memoized.
- Expensive computations based on props/state.
- Derived objects/arrays used in dependency arrays.

When to avoid:
- Trivial computations; memoization overhead may outweigh benefits.

Patterns:

```tsx
// Atom: keep pure; export memoized by default if props are stable
import { memo, useMemo, useCallback } from 'react';

type StatusBadgeProps = { status: 'draft' | 'logged'; className?: string };

const StatusBadgeBase = ({ status, className }: StatusBadgeProps) => {
  const label = status === 'logged' ? 'Logged' : 'Draft';
  const cls = useMemo(() => `rounded-full px-2 py-1 text-xs ${status === 'logged' ? 'bg-green-100' : 'bg-blue-100'} ${
    className ?? ''
  }`, [status, className]);
  return <span className={cls}>{label}</span>;
};

export const StatusBadge = memo(StatusBadgeBase);

// Molecule: stable callbacks for memoized children
export const EntryRow = ({ entry, onOpen }: { entry: { id: string }; onOpen: (id: string) => void }) => {
  const handleOpen = useCallback(() => onOpen(entry.id), [onOpen, entry.id]);
  return <button onClick={handleOpen}>Open</button>;
};
```

Context values:

```tsx
// Memoize context values to avoid rerenders of all consumers
const value = useMemo(() => ({ state, actions }), [state, actions]);
return <SomeContext.Provider value={value}>{children}</SomeContext.Provider>;
```

Data selection (TanStack Query):

```tsx
// Select minimizes re-renders by projecting only what you need
const { data: totalMinutes } = useQuery({
  queryKey: ['time-logs', 'day', date],
  queryFn: fetchDay,
  select: (data) => data.totalMinutes,
});
```

## Code splitting and lazy loading

Use route- and organism-level splits. Vite supports dynamic import() and React.lazy.

Route components (TanStack Router):

```tsx
// Example inside a route file to lazy-load the page component
import { lazy, Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';

const Home = lazy(() => import('./-components/Home').then((m) => ({ default: m.Home })));

export const Route = createFileRoute('/')({
  component: () => (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Home />
    </Suspense>
  ),
});
```

Large organisms:

```tsx
import { lazy, Suspense } from 'react';
const UserProfileCard = lazy(() => import('@/components/organisms/UserProfileCard/UserProfileCard').then((m) => ({ default: m.UserProfileCard })));

export const UserManagementPage = () => (
  <Suspense fallback={<div className="p-4">Loading profile…</div>}>
    <UserProfileCard />
  </Suspense>
);
```

Preloading on intent:
- Prefetch routes on hover/focus for perceived speed. With TanStack Router, you can preload routes or data in link interactions where appropriate.

## Bundle optimization techniques (Vite + Rollup)

Analyze first:

```bash
# Opens bundle visualizer; see development.instructions.md
npm run build:analyze
```

Tree-shaking:
- Prefer named imports. Example: `import { Calendar } from 'lucide-react'` over bulk imports.
- Avoid barrel files that re-export everything with side effects.
- Keep atoms simple; avoid importing heavy utilities into atoms.

Manual chunks:
- Our `vite.config.ts` already splits Sentry into its own chunk via `manualChunks`.
- You can extend chunking for large, rarely-shared dependencies if needed:

```ts
// vite.config.ts (illustrative)
const manualChunks = (id: string) => {
  if (id.includes('@sentry')) return 'sentry';
  if (id.includes('react-day-picker')) return 'date-tools';
};
```

Asset hygiene:
- Prefer SVG via SVGR and import only what you need.
- Remove unused images and code paths identified by the analyzer.

## Rendering optimization patterns

Component boundaries:
- Split large components; keep props minimal and stable.
- Push derived state down; keep atoms pure. Use `React.memo` for atoms/molecules when props are stable.

Lists:
- Always provide stable `key`s. For large lists consider virtualization (only when needed).

Avoid re-render triggers:
- Don’t create new objects/arrays inline for props; memoize them.
- Memoize event handlers passed to memoized children.
- Avoid overusing context; lift local state or split contexts to reduce blast radius.

TanStack Query specifics:
- Tune `staleTime` to avoid unnecessary refetches.
- Use `placeholderData` or `keepPreviousData` for smooth pagination.
- Use `retry: false` in dev when diagnosing re-render/refetch loops.

Suspense and fallbacks:
- Use lightweight skeletons/spinners for lazy and data boundaries.
- Place Suspense boundaries low enough to minimize the area that pauses.

## Performance monitoring and measurement

Runtime profiling:
- React DevTools Profiler: record interactions to see commit times and re-render counts.
- TanStack Query Devtools: detect refetch storms and cache churn.

Build-time analysis:
- Use `npm run build:analyze` to open the Rollup visualizer.
- Compare before/after chunk sizes when introducing dependencies.

Network & timing:
- Use the browser Performance panel for long tasks and layout thrash.
- Consider `performance.mark/measure` around expensive flows during investigation.

Sentry (optional):
- If Sentry is configured, enable Performance tracing to capture slow transactions.

## Practical patterns by atomic level

- Atoms: pure, memoized, no data fetching; tiny dependency surface. Export `memo(Atom)` by default if prop shapes are stable.
- Molecules: memoize handlers; use `useMemo` for derived arrays/objects; avoid passing unstable props to atoms.
- Organisms: handle data with TanStack Query, use `select` to project only needed fields, and place Suspense boundaries close to data consumers.
- Templates/Pages: perform route-level lazy loading, prefetch critical data on navigation intent.

## Lightweight checklist

- [ ] Atom is pure, props are serializable and stable; wrapped in `memo` if helpful.
- [ ] Handlers passed down are memoized; derived data is cached with `useMemo`.
- [ ] Large organisms/routes are lazy-loaded with appropriate Suspense fallbacks.
- [ ] Query hooks use `staleTime/select` where beneficial; avoid duplicate local copies of server data.
- [ ] Bundle analysis shows no unexpected heavy chunks; named imports only.
- [ ] Verified improvements via Profiler or analyzer; comments reference findings when non-obvious.

## References

- See `development.instructions.md` for running build analysis and dev tooling.
- See `tanstack-query.instructions.md` for caching, invalidation, pagination, and data selection performance.
- See `atomic-design.instructions.md` for responsibilities by component level.
