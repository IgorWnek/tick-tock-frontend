---
applyTo: '**/context/**/*.{tsx,ts}, **/contexts/**/*.{tsx,ts}, **/stores/**/*.{tsx,ts}'
description: 'Context patterns, state management, and data flow guidelines aligned with React 19, Atomic Design, and TanStack Query'
---

# State Management — Context, Reducers, and Data Flow

Use these rules to design local and app-level state. Prefer React primitives (`useState`, `useReducer`, Context) for local/client state and TanStack Query for server state. Keep responsibilities clear per Atomic Design level.

References:
- Data layer (server state): `./tanstack-query.instructions.md`
- React fundamentals: `./react-core.instructions.md`
- React 19 features: `./react19-features.instructions.md`
- Code quality: `./eslint.instructions.md`
- Testing patterns: `./testing.instructions.md`
- Atomic Design: `./atomic-design.instructions.md`

## Core principles

1) Server vs local state
- Server state (remote, async, cacheable, shareable) → TanStack Query. Don’t mirror it in local state.
- Local/UI state (component-specific, ephemeral) → `useState` / `useReducer` / Context.

2) Context Controller pattern
- Encapsulate providers, reducers, and side-effects in a single “Controller” component per domain (e.g., `AuthContextController`, `LocaleContextController`, `ApiClientContextController`).
- Expose a minimal, typed context value and companion hooks to consume it.
- Keep effects inside controllers; keep consumers simple and synchronous.

3) Single source of truth
- Avoid duplicating the same data across state layers. Derive values where possible.
- Normalize domain state if needed (ids, maps) to avoid nested updates.

4) Atomic alignment
- Atoms: no cross-cutting state; pass props only.
- Molecules: light local state; lift up if multiple siblings need coordination.
- Organisms/Templates: orchestrate domain state via contexts and data hooks.
- Pages: wire route params and top-level coordination only.

## Context Controller pattern (recommended)

Pattern contract
- Inputs: none or initial props (rare). Wires providers and effects.
- Outputs: Context value object with stable identity for consumers.
- Error modes: Controllers handle side-effect errors internally or expose normalized error in context.

Example — Locale controller (UI state)
```tsx
// src/context/locale/localeContextController/LocaleContextController.tsx
export const LocaleContextController = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<AppLocale>(defaultLocale);
  return (
    <IntlProvider defaultLocale={defaultLocale} locale={locale} messages={translations[locale]} onError={() => {}}>
      <LocaleContext.Provider value={{ defaultLocale, locale, setLocale }}>{children}</LocaleContext.Provider>
    </IntlProvider>
  );
};
```

Example — API client + QueryClient (server state root)
```tsx
// src/context/apiClient/apiClientContextController/ApiClientContextController.tsx
export const ApiClientContextController = ({ children }: Props) => {
  const mutationCache = new MutationCache({ /* global onError wiring */ });
  const queryCache = new QueryCache({ /* global onError wiring */ });
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
    mutationCache,
    queryCache,
  }), []);

  return (
    <ApiClientContext.Provider value={{ client: axiosClient }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApiClientContext.Provider>
  );
};
```

Example — Auth controller (useReducer + server hooks)
```tsx
export const AuthContextController = ({ children }: Props) => {
  const [state, dispatch] = useReducer(authReducer, {
    accessToken: authStorage.accessToken,
    refreshToken: authStorage.refreshToken,
    expires: authStorage.expires,
  });

  const { data: user, isLoadingAndEnabled, isSuccess, isError, resetUser } = useUser({ enabled: !!state.accessToken });
  const { mutateAsync: login, isPending } = useMutation('loginMutation', {
    onSuccess: (res) => dispatch(setTokens(res)),
    onError: () => { dispatch(resetTokens()); resetUser(); },
  });

  const logout = useCallback(() => { resetUser(); dispatch(resetTokens()); }, [resetUser]);

  useEffect(() => { if (isError) dispatch(resetTokens()); }, [isError]);
  useEffect(() => { Object.assign(authStorage, state); }, [state]);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    isAuthenticating: isPending || isLoadingAndEnabled,
    isAuthenticated: isSuccess,
    login,
    logout,
    user,
  }), [state, isPending, isLoadingAndEnabled, isSuccess, login, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

## useReducer patterns and best practices

- Reducers are pure: compute next state from `(state, action)` with no side-effects.
- Co-locate `actions` and `types`; expose action creators (e.g., `setTokens`, `resetTokens`).
- Keep state minimal and normalized. Derive everything else in selectors or memoized getters.
- Prefer discriminated unions for action types; avoid `any` payloads.
- Don’t dispatch in render. Use event handlers/effects.

Example — Auth reducer
```ts
export const authReducer: Reducer<AuthState, AuthAction> = (prev, action) => {
  switch (action.type) {
    case AuthActionType.setTokens:
      return { ...prev, ...action.payload };
    case AuthActionType.resetTokens:
      return { ...prev, accessToken: null, refreshToken: null, expires: null };
    default:
      return prev;
  }
};
```

## State composition strategies

- Lift state up when siblings need to coordinate; otherwise keep local.
- Split state slices by domain (auth, locale, feature X). Avoid mega-contexts.
- Prefer provider composition over single global store. Use `AppProviders` to wire controllers.
- Derive frequently-useful state with memoized selectors/hooks to keep consumers simple.

App providers shell
```tsx
export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <LocaleContextController>
    <ApiClientContextController>
      <AuthContextController>{children}</AuthContextController>
    </ApiClientContextController>
  </LocaleContextController>
);
```

## Performance optimization for context

- Minimize context value churn. Memoize value objects; avoid new function/object identities on each render.
- Split contexts: separate state and dispatch contexts when updates are frequent.
- Keep large/volatile data in TanStack Query cache; pass ids/keys through context, not huge objects.
- Avoid rendering heavy trees on each update; move hot state closer to consumers or use component-level state.
- Consider `useSyncExternalStore` only for advanced external stores; prefer Query for server data.

### Edge cases to consider
- Null/undefined context values: provide safe defaults or invariant checks in custom hooks (`if (!ctx) throw new Error(...)`).
- Auth bootstrapping: hide children until user fetch resolves, or expose `isAuthenticating` to consumers.
- Effects and cleanups: keep subscriptions inside controllers; ensure cleanup on unmount.

## Integration with TanStack Query

- Treat Query cache as the source of truth for remote data. Don’t duplicate it in context.
- Controllers can react to Query events via `QueryCache`/`MutationCache` for global error handling only.
- For mutations impacting global UI (e.g., auth), dispatch reducer updates in mutation lifecycle handlers.
- Expose minimal cross-cutting flags (e.g., `isOnline`, `isAuthenticated`) via context; fetch data via feature hooks.

## API for consumer hooks

- Provide ergonomic, typed hooks: `useAuth()`, `useLocale()`, `useApiClient()`.
- Keep return shapes stable; document fields and their semantics.
- Avoid exposing dispatch directly unless you have a separate `DispatchContext`.

Example — consumer hook
```ts
export const useAuth = () => useContext(AuthContext);
```

## Anti-patterns

- Duplicating server state in context (e.g., caching lists in context). Use Query instead.
- Mega-context storing unrelated domains; causes unnecessary re-renders.
- Non-memoized context value objects leading to cascading updates.
- Performing network requests directly in context consumers; centralize in controllers/hooks.
- Storing derived/calculable state; compute in render or selectors.

## Testing guidance

- Wrap components with `AppProviders` or targeted controllers in tests. See `./testing.instructions.md`.
- For reducer logic, write unit tests for pure functions; for controllers, write integration tests asserting context value behavior under user flows.
- For auth flows, use MSW to simulate login/logout and verify reducer transitions and exposed flags.

## Checklist

- Clear boundary between server state (Query) and local state (Context/Reducer)
- Controller encapsulates effects and providers; consumers remain simple
- Minimal, normalized state; derived values not stored
- Memoized context values; split contexts if needed
- Atomic alignment respected (no cross-cutting state in atoms/molecules)
