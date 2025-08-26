---
applyTo: '**/*.test.{tsx,ts}, **/*.spec.{tsx,ts}'
description: 'Testing patterns for React components, hooks, and integration tests (Vitest + Testing Library + MSW) aligned with Atomic Design and TanStack Query'
---

# Testing Instructions — React + Vitest

Use these guidelines when writing tests. They align with our Atomic Design structure, TanStack Query setup, and MSW-powered API mocking.

References:
- Dev workflow and commands: `./development.instructions.md`
- Code quality rules (testing-specific rules included): `./eslint.instructions.md`
- Data layer (queries/mutations and test patterns): `./data-architecture.instructions.md`
- Atomic Design levels and responsibilities: `./atomic-design.instructions.md`

Tooling used (see `package.json`):
- Vitest 1.x with jsdom and `vitest/globals`
- React Testing Library 16.x + `@testing-library/jest-dom` 6.x
- `@testing-library/user-event` 14.x
- MSW 2.x (browser worker for dev, `msw/node` for tests)

## How to run tests

- Unit/integration tests: `npm test`
- Coverage: `npm run coverage`
- E2E (Playwright): see `e2e/` and dev guide; not covered here.

Note: Vitest auto-loads `src/setupTests.ts` where `@testing-library/jest-dom` is registered.

## Project test helpers (use them)

- Prefer `import { render, screen, userEvent } from 'tests'` over importing from RTL directly.
  - Our `tests` helper (`src/tests/index.tsx`) wraps your UI with providers:
    - Router (TanStack Router, memory history)
    - IntlProvider and LocaleContext
    - AuthContext (stubbed)
    - ApiClientContextController (includes QueryClientProvider for TanStack Query)
  - It also exposes `routerConfig` to simulate routes: `{ routerPath: '/users/$id', currentPath: '/users/42' }`.
  - Re-exports: `render`, `screen`, `waitFor`, `act`, and `renderHook`.

Tip: For components that need a specific route or URL params, pass `routerConfig` to `render`.

```tsx
import { render, screen } from 'tests';

test('renders user page at /users/42', async () => {
  render(<UserPage />, { routerConfig: { routerPath: '/users/$id', currentPath: '/users/42' } });
  await screen.findByRole('heading', { name: /user 42/i });
});
```

## Atomic Design testing strategies

Follow responsibilities per level; test behavior and accessibility, not implementation details.

### Atoms
- No remote data; pure UI. Test:
  - Accessible roles/names/labels (`getByRole`, `getByLabelText`)
  - Variants and states via props (use `toHaveClass`, `toBeDisabled`, etc.)
  - Keyboard interaction (e.g., `await userEvent.tab()`)
- Avoid snapshots; prefer explicit assertions.

Example:
```tsx
import { render, screen } from 'tests';
import { Button } from '@/components/atoms/Button';

test('button exposes accessible name and variant class', () => {
  render(<Button variant="primary">Submit</Button>);
  const btn = screen.getByRole('button', { name: /submit/i });
  expect(btn).toBeEnabled();
  expect(btn).toHaveClass(expect.stringContaining('primary'));
});
```

### Molecules
- Compose atoms; light local state only. Test:
  - User flows with `userEvent` (typing, clicking)
  - Validation and conditional rendering
  - Props → behavior contracts (callbacks fired with right args)

```tsx
import { render, screen } from 'tests';
import userEvent from '@testing-library/user-event';

test('search input calls onSearch on submit', async () => {
  const onSearch = vi.fn();
  render(<SearchInput onSearch={onSearch} placeholder="Search" />);
  await userEvent.type(screen.getByRole('textbox', { name: /search/i }), 'react');
  await userEvent.click(screen.getByRole('button', { name: /search/i }));
  expect(onSearch).toHaveBeenCalledWith('react');
});
```

### Organisms
- Complex sections; may fetch data via hooks. Test:
  - Loading/empty/error/success states
  - Integration with TanStack Query (cache effects, invalidation signals)
  - Interaction that triggers mutations and UI updates
- Use MSW handlers to simulate backend behavior (see MSW section).

```tsx
import { render, screen, waitFor } from 'tests';

test('user card shows loading then user name', async () => {
  render(<UserCard userId="42" />);
  expect(screen.getByRole('status')).toBeInTheDocument();
  await screen.findByText(/user 42/i);
  await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
});
```

### Templates & Pages
- Layout orchestration and routing. Test:
  - Route params and navigation
  - Coordinated loading and error boundaries
  - Presence of layout regions (header/sidebar/content)

## Custom hook testing

Use `renderHook` from `tests` (re-exported). Wrap with providers if needed.

### Pure hooks (no providers)
```ts
import { renderHook, act } from 'tests';
import { useToggle } from '@/hooks/useToggle/useToggle';

test('useToggle toggles state', () => {
  const { result } = renderHook(() => useToggle());
  expect(result.current.value).toBe(false);
  act(() => result.current.toggle());
  expect(result.current.value).toBe(true);
});
```

### Data hooks (TanStack Query)
For hooks that call the API or use TanStack Query, provide the right wrappers. You can:
1) Use `AppProviders` as a wrapper, or
2) Build a minimal `QueryClientProvider` wrapper (set `{ queries: { retry: false } }` for speed).

```tsx
import { renderHook, waitFor } from 'tests';
import { AppProviders } from '@/providers/AppProviders';
import { useUser } from '@/hooks/useUser/useUser';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProviders>{children}</AppProviders>
);

test('useUser returns user data', async () => {
  const { result } = renderHook(() => useUser('42'), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.name).toMatch(/user 42/i);
});
```

Timers: use fake timers for debounced/throttled hooks.
```ts
import { renderHook } from 'tests';
import { vi } from 'vitest';
import { useDebouncedValue } from '@/hooks/useDebouncedValue/useDebouncedValue';

test('debounces value', () => {
  vi.useFakeTimers();
  const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 300), { initialProps: { v: 'a' } });
  expect(result.current).toBe('a');
  rerender({ v: 'ab' });
  vi.advanceTimersByTime(299);
  expect(result.current).toBe('a');
  vi.advanceTimersByTime(1);
  expect(result.current).toBe('ab');
  vi.useRealTimers();
});
```

## MSW integration in tests (Node)

Use `msw/node` with our shared `handlers` (`src/api/mocks/handlers.ts`). Keep tests environment-agnostic; MSW must mirror real API responses.

Minimal setup suggestion (place in a test-only module and import from tests or register in `setupTests.ts`):
```ts
// src/tests/msw-server.ts
import { setupServer } from 'msw/node';
import { handlers } from '@/api/mocks/handlers';

export const server = setupServer(...handlers);

// In src/setupTests.ts or your test file root:
import { server } from '@/tests/msw-server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Overriding per test:
```ts
import { http, HttpResponse } from 'msw';
import { server } from '@/tests/msw-server';

test('handles server error', async () => {
  server.use(http.get('**/users/42', () => HttpResponse.json({ message: 'err' }, { status: 500 })));
  // render ... assert error UI
});
```

Notes:
- Vitest provides `import.meta.env` via Vite. If your MSW handlers depend on `VITE_API_URL`, ensure it’s set for tests (e.g., default to `mock` in Vite config or use `BASE_URL` from axios client).
- In development (browser), MSW is started by `src/setupMSW.ts` and uses a Service Worker; do not import that in tests.

## Testing Library best practices

- Prefer role-based queries with accessible names: `getByRole('button', { name: /save/i })`.
- Use `screen` for queries; avoid destructuring from `render`.
- Use `userEvent` over `fireEvent`.
- Async UI: prefer `findBy*` or `waitFor` with explicit expectations. Avoid arbitrary `setTimeout`.
- Assert visibility with `toBeInTheDocument`, `toBeVisible`, `toHaveAccessibleName`, `toHaveAttribute`.
- Absence: `queryBy*` before an action, `findBy*` or `waitFor` after.
- Don’t test implementation details (state, private methods); test observable behavior and DOM.

## Accessibility testing approaches

- Write tests with accessibility-first queries (role, name, label, placeholder).
- Ensure keyboard support is testable: `userEvent.tab()`, `userEvent.type`, ARIA attributes reflected in behavior.
- Use `@testing-library/jest-dom` matchers like `toHaveAccessibleName`, `toHaveDescription`.
- Check focus management for dialogs/menus: assert `document.activeElement` or `toHaveFocus`.

## TanStack Query in tests — key tips

- Our `ApiClientContextController` provides a `QueryClient` with sensible defaults. Prefer the `tests` helper or `AppProviders` wrapper.
- For deterministic tests, set `retry: false` in ad-hoc `QueryClient` wrappers.
- Use `waitFor` to assert cache-driven updates. For optimistic updates, assert provisional UI first, then the reconciled state.
- When testing invalidation, inspect `queryClient` directly if you provide it, or assert user-visible effects after invalidation.

Example (pagination placeholderData): see `./data-architecture.instructions.md` for a working snippet and test sketch.

## Patterns to avoid

- Snapshot tests for dynamic UI
- Asserting internal hook state or private functions
- Overusing `waitFor` without a clear expectation
- Mocking React hooks that you can exercise realistically via DOM interactions
- Calling network directly in tests; always go through MSW

## Quick checklist

- Uses `tests` helper and providers (or supplies an explicit wrapper)
- Role/name-based queries; `userEvent` interactions
- Covers loading/empty/error/success states
- MSW handlers used; no real network
- Clean, focused assertions; avoids implementation details
