---
applyTo: '**/hooks/**/*.{ts,tsx}'
description: 'Custom hooks development, composition patterns by atomic level, naming, return types, performance, and testing strategies'
---

# Custom Hooks — Patterns, Composition, and Testing

Use these rules for writing custom hooks in this repo. Avoid repeating fundamentals from `react-core.instructions.md` and advanced features from `react19-features.instructions.md`; reference them as needed.

References:
- Core React: `./react-core.instructions.md`
- React 19 Advanced: `./react19-features.instructions.md`
- Data architecture: `./data-architecture.instructions.md`
- Code quality: `./eslint.instructions.md`
- Formatting: `./prettier.instructions.md`
- Atomic Design: `./atomic-design.instructions.md`

Note on naming: In this doc, “TanStack Query” refers to the React bindings `@tanstack/react-query` (formerly known as “React Query”). We use “TanStack Query” consistently.

## Core principles
- Prefix with `use` and keep names descriptive: `useToggle`, `useUserQuery`, `useDebouncedValue`.
- Single responsibility; compose hooks rather than adding optional complexity.
- Stable API surface: prefer returning an object with stable memoized properties where identity matters.
- Explicit input params with a single `options` object for extensibility; validate/normalize inside the hook.
- Side effects only where required; clean up on unmount; avoid hidden globals.
- Hooks are pure in render: no imperative calls or subscriptions outside effects.

## Atomic design alignment
- Atoms: UI-only hooks (local state, keyboard or focus helpers, media queries). No remote data.
- Molecules: Combine atom-level hooks; light coordination logic. No remote data.
- Organisms/Pages: Data hooks (queries/mutations), orchestration, and domain logic; handle loading/error/empty.

## API “contract” checklist
When designing a hook:
- Inputs: Document required and optional options; provide sensible defaults.
- Outputs: Return an object; name fields clearly (`data`, `error`, `isLoading`, handlers).
- Errors: Normalize to a predictable shape or pass through; never throw from render.
- Performance: Memoize derived values and callbacks that consumers may depend on.
- Effects: Unsubscribe/cleanup; support aborting async work when applicable.

## Patterns and examples

### Atom-level hook — toggle
```ts
import { useCallback, useState } from 'react';

export type UseToggleOptions = { initial?: boolean };
export type UseToggleReturn = {
  value: boolean;
  set: (next: boolean) => void;
  toggle: () => void;
  on: () => void;
  off: () => void;
};

export const useToggle = ({ initial = false }: UseToggleOptions = {}): UseToggleReturn => {
  const [value, setValue] = useState<boolean>(initial);
  const set = useCallback((next: boolean) => setValue(next), []);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const on = useCallback(() => setValue(true), []);
  const off = useCallback(() => setValue(false), []);

  return { value: value, set, toggle, on, off };
};
```

### Atom-level hook — debounced value
```ts
import { useEffect, useMemo, useState } from 'react';

export const useDebouncedValue = <T,>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState(value);
  const d = useMemo(() => Math.max(0, delay), [delay]);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), d);
    return () => clearTimeout(id);
  }, [value, d]);

  return debounced;
};
```

### Molecule-level hook — compose atom hooks
```ts
import { useMemo } from 'react';

type UseSearchOptions = { query: string; minLength?: number; delay?: number };

export const useSearchParams = ({ query, minLength = 2, delay = 250 }: UseSearchOptions) => {
  const debounced = useDebouncedValue(query, delay);
  const canSearch = useMemo(() => debounced.trim().length >= minLength, [debounced, minLength]);
  return { query: debounced, canSearch };
};
```

### Organism-level hook — data fetching (TanStack Query abstraction)
Use our query abstraction (see `data-architecture.instructions.md`). Keep keys stable, type the result, and expose typical status fields.

```ts
// Pseudocode: adapt imports to our abstraction (e.g., hooks/useQuery)
import { useQuery } from '@/hooks/useQuery/useQuery';

type User = { id: string; name: string };

export const useUser = (userId: string) => {
  return useQuery<User>({
    // Prefer query factories for consistent cache keys
  // See data-architecture.instructions.md → Query Factories Pattern
    queryKey: userQueries.detail(userId),
    queryFn: async () => {
      // fetch via API client abstraction
      // return apiClient.user.get(userId)
      return { id: userId, name: 'Mock' } as User;
    },
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
};
```

### Organism-level hook — mutation with optimistic update
Prefer using TanStack Query’s mutation lifecycle for optimistic updates; for pure UI optimistic state, see `react19-features.instructions.md` (`useOptimistic`).

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

type UpdateUserInput = { id: string; name: string };

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      // return apiClient.user.update(input)
      return input;
    },
    onSuccess: (data) => {
      // Prefer query factories for stable invalidation
      qc.invalidateQueries({ queryKey: userQueries.detail(data.id) });
      qc.invalidateQueries({ queryKey: userQueries.lists() });
    },
  });
};
```

## Return shape guidance
- Prefer returning an object over tuples for readability and evolvability.
- Keep function references stable with `useCallback` when users may pass them into memoized children.
- Memoize derived values (`useMemo`) if computation is non-trivial or identity stability matters.

Example:
```ts
export const useCounter = (initial = 0) => {
  const [count, setCount] = useState(initial);
  const inc = useCallback((n = 1) => setCount((c) => c + n), []);
  const dec = useCallback((n = 1) => setCount((c) => c - n), []);
  const reset = useCallback(() => setCount(initial), [initial]);
  return { count, inc, dec, reset };
};
```

## Performance considerations
- Stable dependencies: include all reactive values; suppressing ESLint is a last resort. See `eslint.instructions.md`.
- Avoid unnecessary object/array literals in dependencies; lift them out or memoize.
- Support `enabled` flags for data hooks to avoid wasteful network calls.
- Respect `staleTime`/`gcTime` in queries; debounce/throttle inputs when appropriate.
- Consider `useTransition` for non-urgent UI reactions to avoid blocking updates.

## Testing hooks
Use Vitest + React Testing Library’s `renderHook`. For data hooks, wrap with required providers and MSW handlers.

### Unit test — atom hook
```ts
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('toggles value', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.value).toBe(true);
  });
});
```

### Unit test — debounced hook (fake timers)
```ts
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  it('debounces value changes', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 300), {
      initialProps: { v: 'a' },
    });
    expect(result.current).toBe('a');
    rerender({ v: 'ab' });
    expect(result.current).toBe('a');
    vi.advanceTimersByTime(300);
    expect(result.current).toBe('ab');
    vi.useRealTimers();
  });
});
```

### Integration test — data hook with providers
```ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { useUser } from './useUser';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe('useUser', () => {
  it('returns user data', async () => {
    const { result } = renderHook(() => useUser('123'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
    expect(result.current.data?.id).toBe('123');
  });
});
```

### MSW handlers for networked hooks
Use MSW for deterministic network behavior in tests (see `development.instructions.md` and repository MSW setup).

```ts
import { http, HttpResponse } from 'msw';

export const userHandlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Test' });
  }),
];
```

## Organization and naming
- File per hook: `src/hooks/useThing/useThing.ts` (+ optional `.test.ts`, `.types.ts`).
- Name reflects behavior, not implementation: `useLocalStorage`, not `useBrowserEffect`.
- Separate UI hooks (DOM/events) from data hooks (queries/mutations) for clarity.
- Re-export only where it reduces import noise and does not create cycles.

## Anti-patterns
```ts
// ❌ Returning new object/array identities on every render without memoization
return { list: items.map(x => ({ ...x })) };

// ❌ Hiding async side effects inside render phase
const data = fetch('/api'); // not in an effect or query abstraction

// ❌ Overloading a single hook with many unrelated options
useFeature({ aOrBOrC: true, mode: 'all', cache: 'forever', transport: 'ws' });

// ❌ Swallowing errors silently (no surfaced state)
useSomething(); // but never expose error/loading states or throw in effects
```

## Integration
- For data hooks: follow `./data-architecture.instructions.md` for keys, factories, and invalidation.
- For UI hooks: follow `./atomic-design.instructions.md` to keep them within atoms/molecules.
- Use `./eslint.instructions.md` for hooks rules; do not disable exhaustive-deps unless justified.
- Keep examples formatted per `./prettier.instructions.md`.

### Query factories — quick template
Use a small factory object per feature to centralize keys and ensure consistent invalidation.

```ts
// user.queries.ts
export const userQueries = {
  all: () => ['users'] as const,
  lists: () => [...userQueries.all(), 'list'] as const,
  details: () => [...userQueries.all(), 'detail'] as const,

  list: (filters: { page: number; search?: string }) =>
    [...userQueries.lists(), filters] as const,
  detail: (id: string) => [...userQueries.details(), id] as const,
  permissions: (id: string) => [...userQueries.details(), id, 'permissions'] as const,
};

// Usage in a hook
export const useUser = (id: string) =>
  useQuery({ queryKey: userQueries.detail(id), queryFn: () => api.user.get(id) });

// Invalidation in a mutation
qc.invalidateQueries({ queryKey: userQueries.lists() });
qc.invalidateQueries({ queryKey: userQueries.detail(id) });
```

## Summary
Write small, composable hooks with clear inputs and stable, object-based outputs. Place UI hooks at atom/molecule levels; reserve remote data hooks for organisms/pages via our query abstraction. Test with `renderHook`, proper providers, and MSW. Optimize for stability and maintainability.
