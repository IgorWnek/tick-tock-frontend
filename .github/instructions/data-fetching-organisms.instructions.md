---
applyTo: "**/components/organisms/**/*.{tsx,ts}, **/components/templates/**/*.{tsx,ts}, **/routes/**/*.{tsx,ts}"
description: "Complex data fetching for organisms, templates, and pages (TanStack Query v5) aligned with Atomic Design and strict no-fetching for atoms/molecules."
---

# Data Fetching: Organisms, Templates, and Pages

## Context
Use this file for complex server-state patterns at composition levels allowed to talk to the network. We enforce strict atomic boundaries:
- Atoms: no fetching, presentational only
- Molecules: no fetching, presentational composition only (see `data-fetching-atoms.instructions.md`)
- Organisms: allowed to fetch and mutate; coordinate business logic and local UX states
- Templates: layout and slots only; no data fetching
- Pages (routes): route-specific data orchestration, prefetch, and cross-organism coordination

This guidance targets React 19 + TypeScript + TanStack Query v5 and is tailored for Vite + TanStack Router. If older documents mention "simple fetching in molecules", treat this file together with `data-fetching-atoms.instructions.md` as the authoritative, stricter rule: molecules do not fetch.

Related:
- `atomic-design.instructions.md` for responsibilities by level
- `data-fetching-atoms.instructions.md` for strict atoms/molecules rules
- `data-architecture.instructions.md` for global query/mutation architecture
- `performance.instructions.md` for render/code-splitting tips
- `testing.instructions.md` for Testing Library + MSW patterns

## Core principles

- Query cache is the single source of truth for server state. Never duplicate server state in component state.
- Use feature-level query/mutation factories for keys and fetchers. Keys must be stable and hierarchical.
- Prefer selective, targeted invalidation; when correctness is uncertain, escalate to broader invalidation at organism/page level.
- Keep UI accessible: render clear loading/empty/error states; use semantic roles and ARIA.
- Co-locate data orchestration at organisms/pages; keep templates free of I/O and molecules/atoms unaware of TanStack Query.
- Parity across environments: MSW handlers must behave like real APIs.

## Organisms — complex data orchestration

Organisms may combine multiple queries and controlled mutations for a feature area. They own localized side effects and compose molecules/atoms via props.

Example: UserProfile organism with derived data and guarded fetching

```tsx
import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userQueries, userMutations } from '@/api/queries/user.queries';
import { Button } from '@/components/atoms/Button';
import { StatusBadge } from '@/components/atoms/StatusBadge';

type User = { id: string; name: string; email: string; status: 'draft' | 'logged' };

export const UserProfile = ({ userId }: { userId: string }) => {
  const qc = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    ...userQueries.detail(userId),
    staleTime: 60_000,
    // Reduce re-renders and over-fetching
    select: (u: User) => ({ id: u.id, name: u.name, email: u.email, status: u.status }),
  });

  const updateEmail = useMutation({
    ...userMutations.updateEmail(userId),
    // Optimistic update with rollback
    onMutate: async (newEmail: string) => {
      const key = userQueries.detail(userId);
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<User>(key);
      if (prev) qc.setQueryData<User>(key, { ...prev, email: newEmail });
      return { prev } as const;
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(userQueries.detail(userId), ctx.prev);
    },
    onSuccess: () => {
      // Targeted invalidations: detail + list summaries
      qc.invalidateQueries({ queryKey: userQueries.detail(userId) });
      qc.invalidateQueries({ queryKey: userQueries.lists() });
    },
  });

  if (isLoading) return <div>Loading profile…</div>;
  if (isError || !user) return <div role="alert">Failed to load user</div>;

  return (
    <section aria-labelledby="user-heading" className="grid gap-2">
      <h2 id="user-heading" className="text-lg font-medium">{user.name}</h2>
      <div className="text-sm text-muted-foreground">{user.email}</div>
      <StatusBadge status={user.status} />
      <Button onClick={() => updateEmail.mutate(`${user.name}@example.com`)} disabled={updateEmail.isPending}>
        Update email
      </Button>
    </section>
  );
};
```

Patterns to apply in organisms:
- Guard queries with `enabled` when inputs are incomplete; debounce upstream in stateful containers when needed.
- Use `select` to project minimal shapes.
- Use `placeholderData` or rely on structural sharing to smooth transitions.
- Use optimistic updates for snappy UX; always provide a rollback strategy.
- Invalidate narrowly first (detail, lists) and related aggregates as needed.

## Templates — data-free layout and slots

Templates define structure and regions; they must not fetch or mutate. Accept children/data via props. Handle skeletons by contract (via props), not by talking to the cache.

Example: Dashboard template (no I/O)

```tsx
type DashboardTemplateProps = {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
  // Optional presentational flags; do not query here
  loading?: boolean;
  error?: string | null;
};

export const DashboardTemplate = ({ header, sidebar, content, footer, loading, error }: DashboardTemplateProps) => (
  <div className="grid grid-rows-[auto_1fr_auto] h-dvh">
    <header className="border-b">{header}</header>
    <div className="grid grid-cols-[280px_1fr] min-h-0">
      <aside className="border-r overflow-auto">{sidebar}</aside>
      <main className="overflow-auto p-4">
        {loading ? <div aria-busy>Loading…</div> : error ? <div role="alert">{error}</div> : content}
      </main>
    </div>
    {footer ? <footer className="border-t p-2">{footer}</footer> : null}
  </div>
);
```

## Pages (routes) — route-specific orchestration

Pages coordinate organisms, route params, and cross-organism data. They are the right place to prefetch data and bridge navigation with cache.

Example: Route component with param-derived keys and prefetch hint

```tsx
import * as React from 'react';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { userQueries } from '@/api/queries/user.queries';
import { UserProfile } from '@/components/organisms/UserProfile';

export const queryClient = new QueryClient();

// Optional prefetch helper (call on navigation or loader)
export const prefetchUser = (id: string) =>
  queryClient.prefetchQuery({ ...userQueries.detail(id), staleTime: 60_000 });

export const UserPage = () => {
  const { userId } = useParams({ from: '/users/$userId' });
  const { isLoading, isError } = useQuery({ ...userQueries.detail(userId), staleTime: 60_000 });
  return (
    <UserProfile userId={userId} />
  );
};
```

Page-level patterns:
- Derive query keys from route params and search params.
- Prefetch on navigation or in route loaders to minimize perceived latency.
- Coordinate multiple organisms; handle cross-cutting toasts/logging.

## Complex mutation patterns

Use organisms/pages for multi-entity updates, transactional workflows, and cross-cache coordination.

- Optimistic updates with rollback: snapshot affected caches; patch local cache; rollback on error.
- Post-success invalidation: target detail keys, then parent lists and aggregates; consider neighbors impacted by the change (e.g., calendar views, counters).
- Retry/backoff: rely on TanStack defaults; customize per mutation only when necessary.

Sketch:

```tsx
const createEntry = useMutation({
  ...entryMutations.create(),
  onMutate: async (vars) => {
    await qc.cancelQueries({ queryKey: calendarQueries.month(vars.date) });
    const prevMonth = qc.getQueryData(calendarQueries.month(vars.date));
    // optimistic insert…
    return { prevMonth };
  },
  onError: (_e, _v, ctx) => ctx?.prevMonth && qc.setQueryData(calendarQueries.month(_v.date), ctx.prevMonth),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: calendarQueries.months?.() }); // example parent hierarchy
    qc.invalidateQueries({ queryKey: entryQueries.byDay() });
  },
});
```

## Cache invalidation strategies

- Keys must be hierarchical and stable; use factories only from the feature data layer.
- Prefer targeted invalidation: invalidate exact detail key and the smallest relevant lists/aggregates.
- When relationships are complex or uncertain, broaden invalidation deliberately at organism/page level to ensure correctness.
- Avoid invalidating unrelated features; document relationships in the feature folder.

## Performance for complex components

- Configure `staleTime` and `gcTime` per data volatility; avoid refetch storms.
- Use `select` to shrink shapes and reduce render work; memoize heavy projections.
- Use `placeholderData`/structural sharing for smooth pagination and filters.
- Debounce high-frequency inputs upstream; guard queries with `enabled`.
- Split organisms by concern; avoid monolithic sections that always re-render.

## MSW parity and integration

- Handlers must persist and mirror real API semantics (status codes, errors, pagination, sorting).
- Use a shared in-memory store to simulate server state across requests.
- Keep fixtures/types in sync with real contracts; fail fast on schema drift.

## Error handling and UX

- Localize errors to the nearest organism; render with `role="alert"` and actionable guidance.
- Escalate global failures to route-level toasts or error boundaries.
- Do not swallow errors; log via the app logger when appropriate.

## Testing patterns (Vitest + Testing Library + MSW)

- Organism tests: assert loading/error/empty/data states and optimistic flows.
- Mutation tests: verify cache patches and invalidations via QueryClient inspection.
- Page tests: assert prefetch and coordination across organisms.
- Keep tests environment-agnostic: they must pass with MSW and real APIs.

## Anti-patterns

- Templates performing `useQuery`/`useMutation`.
- Molecules/atoms importing query factories or API clients.
- Duplicating server state in component state (except transient UI state).
- Broad invalidation that thrashes unrelated caches.
- Inconsistent query keys across a feature.

## Checklist

- [ ] No queries/mutations in atoms/molecules/templates.
- [ ] Organisms own feature queries and focused mutations with optimistic updates as needed.
- [ ] Keys are hierarchical and come from feature query factories.
- [ ] Invalidation is targeted first, broader only when necessary.
- [ ] Loading/empty/error states are accessible and localized.
- [ ] MSW handlers mirror real API behavior for covered scenarios.

## Summary
Organisms and pages are responsible for server-state orchestration using TanStack Query v5, while templates remain data-free. Keep keys consistent via factories, prefer targeted invalidation, and use optimistic updates with rollback for great UX. Ensure a11y, performance, and MSW parity across all flows.

## Integration

- See `./atomic-design.instructions.md` for component responsibilities by level.
- See `./data-fetching-atoms.instructions.md` for strict no-fetching rules at atoms/molecules.
- See `./data-architecture.instructions.md` for global data architecture, factories, and caches.
- See `./performance.instructions.md` for render/code-splitting/perf settings.
- See `./testing.instructions.md` for Testing Library + MSW patterns.
