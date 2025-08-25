---
applyTo: "**/api/**/*.{ts,tsx}, **/hooks/**/*.{ts,tsx}"
description: "Query factories, cache management, error normalization, MSW parity, and data architecture patterns for TanStack Query v5"
---

# Data Architecture: Query Factories, Keys, and Cache Management

## Context
This file defines the data layer architecture for TanStack Query v5: how to create query/mutation factories, structure keys, manage invalidation, normalize errors, and integrate with MSW. It applies to `api/**` and `hooks/**` only and complements:
- `data-fetching-atoms.instructions.md` (strict: no fetching in atoms/molecules)
- `data-fetching-organisms.instructions.md` (organisms/pages orchestrate server state; templates are data-free)

Keep component-level concerns out of this file. Focus on reusable factories, hooks, and cache policies. Molecules must not import factories or perform I/O; consumption happens in organisms/pages (or feature hooks used by them).

## Core principles

- Feature-first organization: group factories by feature folder.
- Keys are hierarchical, serializable, and stable. Factories are the only source of truth for keys and fetchers.
- Never duplicate server state in local state. Derive UI from the cache.
- Prefer targeted invalidation; broaden deliberately when relationships are complex.
- MSW must mirror real API behavior and schemas.
- Normalize errors to a consistent shape across the app.

## Query factories pattern

Structure: colocate a `queries.ts` per feature with keys and fetchers; expose typed helpers.

```ts
// api/users/queries.ts
import { api } from '@/api/axios/client';

export type User = { id: string; name: string; email: string; status: 'draft' | 'logged' };

export const userKeys = {
  all: () => ['users'] as const,
  lists: () => [...userKeys.all(), 'lists'] as const,
  list: (params?: { search?: string; page?: number }) => [...userKeys.lists(), params ?? {}] as const,
  details: () => [...userKeys.all(), 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const userQueries = {
  list: (params?: { search?: string; page?: number }) => ({
    queryKey: userKeys.list(params),
    queryFn: () => api.getUsers(params),
    staleTime: 60_000,
  }),
  detail: (id: string) => ({
    queryKey: userKeys.detail(id),
    queryFn: () => api.getUserById(id),
    staleTime: 60_000,
  }),
};
```

Guidelines:
- Keep factories pure (no side effects). Don’t import React here.
- Return objects compatible with `useQuery`/`prefetchQuery` ({ queryKey, queryFn, ...options }).
- Include default `staleTime`/`gcTime` when the feature domain is stable.
- Avoid dynamic objects in keys unless stable (e.g., frozen or normalized params).

## Mutation factories pattern

Colocate mutation factories in `mutations.ts` per feature with typed variables and side-effects defined by the caller.

```ts
// api/users/mutations.ts
import { api } from '@/api/axios/client';
import { userKeys } from './queries';

export const userMutations = {
  updateEmail: (id: string) => ({
    mutationFn: (email: string) => api.updateUserEmail(id, email),
    onSuccess:
      (qc: import('@tanstack/react-query').QueryClient) => () => {
        qc.invalidateQueries({ queryKey: userKeys.detail(id) });
        qc.invalidateQueries({ queryKey: userKeys.lists() });
      },
  }),
  create: () => ({
    mutationFn: (input: { name: string; email: string }) => api.createUser(input),
  }),
};
```

Guidelines:
- Keep factories transport-agnostic (axios/fetch hidden behind `api`).
- Do not call `invalidateQueries` inside the factory by default; return helpers so callers decide scope.
- Prefer returning a function that accepts `QueryClient` to centralize invalidation at call site.

Call-site sketch (organism/page):

```ts
const qc = useQueryClient();
const m = useMutation({
  ...userMutations.updateEmail(userId),
  onSuccess: userMutations.updateEmail(userId).onSuccess(qc),
});
```

## Key hierarchy and relationships

- Root → category → subcategory → entity → params
- Examples:
  - `['time-logs']`, `['time-logs', 'calendar']`, `['time-logs', 'calendar', '2025-07']`
  - `['users']`, `['users', 'lists']`, `['users', 'detail', userId]`
- Document relationships in a `README.md` per feature when aggregates depend on entities (e.g., user updates affect team dashboards).

## Prefetch and dehydration

- Use `queryClient.prefetchQuery` with factories in route loaders or navigation events.
- Use `queryClient.ensureQueryData` when the data must exist before render.
- Dehydrate/hydrate across navigation or SSR when applicable.

```ts
// routes/users/prefetch.ts
import { queryClient } from '@/providers/AppProviders';
import { userQueries } from '@/api/users/queries';

export const prefetchUser = (id: string) =>
  queryClient.prefetchQuery({ ...userQueries.detail(id), staleTime: 60_000 });
```

## Pagination and infinite patterns

- Classic pagination: include `page`, `pageSize`, and `search` in the key; use `placeholderData` to keep previous data visible.
- Infinite queries: use `useInfiniteQuery` with stable `getNextPageParam` and structural sharing.

```ts
// hooks/usePaginatedUsers.ts
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '@/api/users/queries';

export const usePaginatedUsers = (page: number, search: string) =>
  useQuery({
    ...userQueries.list({ page, search }),
    placeholderData: (prev) => prev,
    keepPreviousData: true, // optional with v5 depending on strategy
  });
```

## Invalidation strategy

- Targeted first: invalidate detail keys and the smallest relevant lists.
- Relationship-aware: invalidate aggregates (e.g., calendar/month, counters) when entities change.
- Broad as fallback: when unsure of relationships, escalate at organism/page level.
- Prefer `invalidateQueries({ queryKey })` with hierarchical keys; avoid string/regex unless necessary.

## Axios client and interceptors

- Centralize HTTP in `api/axios/client.ts` with baseURL, auth headers, and response interceptors.
- Convert transport-layer errors into normalized app errors (see next section).
- Avoid leaking axios types beyond the `api` layer; return domain types.

## Error normalization

Define a common error shape and convert transport errors in one place.

```ts
// api/errors.ts
export type AppError = {
  code: string; // e.g., 'VALIDATION_ERROR' | 'NOT_FOUND' | 'NETWORK'
  message: string;
  details?: Record<string, unknown>;
  status?: number;
};

export const toAppError = (e: unknown): AppError => {
  // map axios/fetch error → AppError
  return { code: 'NETWORK', message: 'Request failed' };
};
```

Usage in queries/mutations: throw/return `AppError` so consumers render consistent messages.

Hook example with error normalization:

```ts
// hooks/useUserDetail.ts
import { useQuery } from '@tanstack/react-query';
import { userQueries } from '@/api/users/queries';
import { toAppError, type AppError } from '@/api/errors';

export const useUserDetail = (id: string) =>
  useQuery({
    ...userQueries.detail(id),
    retry: (failureCount, error) => {
      const e = toAppError(error);
      return e.code === 'NETWORK' && failureCount < 2;
    },
    throwOnError: (error) => {
      const e = toAppError(error);
      return e.code === 'NOT_AUTHENTICATED';
    },
    meta: { errorMapper: toAppError as (e: unknown) => AppError },
  });
```

## Performance settings

- Configure `staleTime`/`gcTime` per feature; lengthen for stable data.
- Use `select` to minimize shapes and reduce re-renders.
- Prefer structural sharing over manual state copying; rely on normalized entities when helpful.
- Debounce high-frequency inputs before running queries.

## MSW integration patterns

- Use a shared in-memory store singleton to persist data across requests.
- Mirror real API: status codes, error payloads, pagination, sorting, and validation rules.
- Keep types/fixtures colocated with handlers and aligned with domain types.

```ts
// api/mocks/users.handlers.ts
import { http, HttpResponse } from 'msw';
import { mockStore } from './store';

export const usersHandlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') ?? '';
    return HttpResponse.json(mockStore.findUsers(search));
  }),
];
```

## Development vs Production

- Ensure implementations behave identically with MSW and real APIs (shape, status, timing where feasible).
- Keep environment-specific config confined to the `api` layer (baseURL, headers, retries).

## Testing patterns

- Test factories via hooks in isolation using `QueryClientProvider` and MSW.
- Assert cache behavior (targeted invalidation, optimistic updates) by inspecting `QueryClient`.
- Snapshot error normalization for consistent UX.

```ts
// hooks/usePaginatedUsers.test.tsx
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePaginatedUsers } from './usePaginatedUsers';

test('keeps previous page visible while loading next', async () => {
  const qc = new QueryClient();
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(() => usePaginatedUsers(1, ''), { wrapper });
  // expect(result.current.data).toMatchObject(...)
});
```

## Anti-patterns

- Declaring query keys inline at call sites; always use factories.
- Using non-serializable/dynamic objects in keys without normalization.
- Invalidating with broad wildcards by default.
- Leaking axios/fetch exceptions through the app; always normalize.
- Duplicating server state in local React state.

## Checklist

- [ ] Factories defined per feature, exporting stable keys and typed fetchers.
- [ ] Keys are hierarchical and serializable; params are normalized.
- [ ] Invalidation targets detail and minimal aggregates first.
- [ ] Errors are normalized to a shared AppError shape.
- [ ] MSW handlers mirror real API behavior and share a persistent store.
- [ ] Performance options (`staleTime`, `gcTime`, `select`) are tuned per feature.
- [ ] Tests validate cache behavior and error normalization.

## Integration

- See `./data-fetching-atoms.instructions.md` and `./data-fetching-organisms.instructions.md` for where queries are used.
- See `./testing.instructions.md` for MSW and Testing Library patterns.
- See `./performance.instructions.md` for performance considerations at component-level.

## Summary
Centralize query/mutation factories and hierarchical keys per feature. Normalize errors, keep MSW in lockstep with production APIs, and manage invalidation deliberately for correctness and performance. Use this file for all `api/**` and `hooks/**` data-layer decisions.
