---
applyTo: "**/components/atoms/**/*.{tsx,ts}, **/components/molecules/**/*.{tsx,ts}"
description: "Strict no-fetching rules for atoms and molecules (Atomic Design). TanStack Query v5 is used only at organism level and above."
---

# Atoms and Molecules: No Remote Fetching (Strict)

Scope this file to the smallest UI building blocks. Atoms never fetch data. Molecules also never fetch data and never perform mutations. Both are presentational and may use only local UI state. All remote data and mutations belong to organisms/templates/pages or dedicated feature hooks/containers.

References:
- See `tanstack-query.instructions.md` for data architecture, caching, invalidation, and where to place queries/mutations (organisms+).
- See `atomic-design.instructions.md` for responsibilities by atomic level (this file strictly enforces molecules without data fetching).
- See `code-quality.instructions.md` for import rules and TypeScript conventions.
- See `testing.instructions.md` for testing patterns with MSW and Testing Library.

## Core principles

- Atoms are pure display: no `useQuery`/`useMutation`; receive data and callbacks via props.
- Molecules are composite UI: still no `useQuery`/`useMutation`; accept data/loading/error via props and emit UI events to parents.
- Remote I/O, cache coordination, optimistic updates, and invalidations live in organisms/templates/pages or feature-level hooks/containers.
- Use Controller/Container components to bridge server state to molecules; keep molecules unaware of TanStack Query.
- Accessibility first: semantic markup, labels, keyboard operability, and clear error messaging provided via props.

## Atoms — pure display (no data)

Atoms should be stateless, theme-aware, and accessible.

```tsx
// Atom: StatusBadge - receives state via props
type StatusBadgeProps = { status: 'draft' | 'logged'; className?: string };

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const label = status === 'logged' ? 'Logged' : 'Draft';
  return (
    <span className={`rounded-full px-2 py-1 text-xs ${className ?? ''}`} aria-label={label}>
      {label}
    </span>
  );
};
```

Guidelines:
- Receive display data and callbacks as props.
- Keep markup semantic; expose ARIA/labels where appropriate.
- Do not import TanStack Query or remote data hooks.

## Molecules — presentational composition (no I/O)

Molecules accept state and callbacks from parents. They may manage small local UI state (e.g., input text), but they must not perform remote I/O.

Example: search suggestions (controlled by parent)

```tsx
import * as React from 'react';

type Suggestion = { id: string; name: string };

type UserSearchProps = {
  value: string;
  onChange: (value: string) => void;
  suggestions: Suggestion[];
  loading?: boolean;
  error?: string | null;
  onSelect: (id: string) => void;
};

export const UserSearch = ({ value, onChange, suggestions, loading, error, onSelect }: UserSearchProps) => {
  return (
    <div>
      <label htmlFor="user-search">Search users</label>
      <input
        id="user-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-controls="user-suggestions"
        aria-busy={!!loading}
      />
      {error ? (
        <div role="alert">{error}</div>
      ) : null}
      <ul id="user-suggestions">
        {suggestions.map((u) => (
          <li key={u.id}>
            <button type="button" onClick={() => onSelect(u.id)}>
              {u.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

Example: field-level validation (status from parent)

```tsx
type EmailFieldProps = {
  value: string;
  onChange: (value: string) => void;
  checking?: boolean;
  available?: boolean; // undefined when unknown
  error?: string | null;
};

export const EmailField = ({ value, onChange, checking, available, error }: EmailFieldProps) => {
  const invalid = available === false || !!error;
  return (
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} />
      {checking ? <span aria-live="polite">Checking…</span> : null}
      {invalid ? (
        <span id="email-error" role="alert">{error ?? 'Email already in use'}</span>
      ) : null}
    </div>
  );
};
```

Example: mutation-driven control (delegate to parent)

```tsx
type SubscribeToggleProps = {
  isSubscribed: boolean;
  pending?: boolean;
  onToggle: (next: boolean) => void; // parent performs mutation
};

export const SubscribeToggle = ({ isSubscribed, pending, onToggle }: SubscribeToggleProps) => (
  <button type="button" onClick={() => onToggle(!isSubscribed)} disabled={!!pending}>
    {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
  </button>
);
```

## Data flow patterns to use

- Container/Controller + Presentational: Parent at organism level uses TanStack Query hooks, then renders molecules with `data`, `loading`, `error`, and event callbacks.
- Compound components: Expose slots/subcomponents to pass in states from parents when helpful.
- Context is allowed for UI-only concerns (theme, locale), not for server state.

Container example (organism-level, not in atoms/molecules):

```tsx
// Pseudo-code at organism level
import { useQuery, useMutation } from '@tanstack/react-query';
import { userQueries, userMutations } from '@/api/queries/user.queries';
import { UserSearch } from '@/components/molecules/UserSearch';

export const UserSearchContainer = () => {
  const [value, setValue] = React.useState('');
  const enabled = value.length >= 2;
  const { data = [], isLoading, error } = useQuery({ ...userQueries.search(value), enabled });
  const { mutate, isPending } = useMutation(userMutations.toggleSubscribe());

  return (
    <UserSearch
      value={value}
      onChange={setValue}
      suggestions={data}
      loading={isLoading}
      error={error ? 'Failed to load suggestions' : null}
      onSelect={(id) => mutate(id)}
    />
  );
};
```

## Error and loading UX (props-driven)

- Show concise, accessible messages with `role="alert"` near the control when `error` prop is present.
- Reflect loading via `aria-busy` or small inline skeleton/spinner when `loading` prop is true.
- Do not implement global retry/backoff in molecules; they simply render status passed via props.

## Anti-patterns

- Importing or calling `useQuery`/`useMutation` inside atoms or molecules.
- Importing feature query factories or API clients into atoms/molecules.
- Performing cache invalidation or optimistic updates from molecules.
- Duplicating server state in local component state instead of receiving it via props.
- Molecules orchestrating multiple pieces of server state.

## Checklist

- [ ] Atom receives data via props; no TanStack Query or remote I/O.
- [ ] Molecule is presentational only; no `useQuery`/`useMutation` and no feature data imports.
- [ ] Loading and error are props-driven (aria-busy, role=alert) and accessible.
- [ ] All server interactions are delegated to organisms/templates/pages or feature-level hooks/containers.
- [ ] Only small local UI state is kept; no duplication of server state.
