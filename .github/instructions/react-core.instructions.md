---
applyTo: '**/*.tsx, **/*.ts'
description: 'React 19 + TypeScript core patterns: functional components, basic hooks, props typing, events, and fundamentals'
---

# React Core (React 19 + TypeScript)

## Context
Use these baseline rules for all React code in this repo. They cover fundamental patterns only. Advanced React 19 features (Actions, useActionState, useOptimistic, useTransition, direct ref props, form status) are defined separately.

## Core Principles
- TypeScript first: explicit prop and return types; prefer inference where clear.
- Functional components only; no classes.
- Named exports only; no default exports.
- Hooks correctly: call at top level, include all reactive deps.
- Compose small components; single responsibility.
- Accessibility and semantics by default.

## Patterns

### Functional component with typed props
```tsx
type User = { id: string; name: string };

type UserCardProps = {
  user: User;
  onSelect?: (id: string) => void;
  className?: string;
};

export const UserCard = ({ user, onSelect, className }: UserCardProps) => {
  return (
    <button
      type="button"
      aria-label={`Select ${user.name}`}
      onClick={() => onSelect?.(user.id)}
      className={className}
    >
      {user.name}
    </button>
  );
};
```

### Lists and keys
```tsx
export const UserList = ({ users, onSelect }: { users: User[]; onSelect: (id: string) => void }) => {
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>
          <UserCard user={u} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
};
```

### State and effects
```tsx
import { useEffect, useMemo, useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);

  // Derive values with useMemo when non-trivial
  const isEven = useMemo(() => count % 2 === 0, [count]);

  // Sync with external systems in effects
  useEffect(() => {
    document.title = `Count ${count}`;
    return () => {
      // cleanup if you subscribed / set up timers etc.
    };
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <p>{isEven ? 'Even' : 'Odd'}</p>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Increment
      </button>
    </div>
  );
};
```

### Memoizing callbacks (when needed)
```tsx
import { useCallback } from 'react';

type Item = { id: string; label: string };

export const SelectList = ({ items, onPick }: { items: Item[]; onPick: (id: string) => void }) => {
  const handlePick = useCallback((id: string) => onPick(id), [onPick]);

  return (
    <ul>
      {items.map((i) => (
        <li key={i.id}>
          <button type="button" onClick={() => handlePick(i.id)}>
            {i.label}
          </button>
        </li>
      ))}
    </ul>
  );
};
```

### Refs basics
```tsx
import { useRef } from 'react';

export const FocusableInput = () => {
  const ref = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <input ref={ref} placeholder="Type here" />
      <button type="button" onClick={() => ref.current?.focus()}>
        Focus
      </button>
    </div>
  );
};
```

## Props and TypeScript
- Define a `Props` type per component; colocate or in `Component.types.ts` for larger ones.
- Optional props use `?` and sensible defaults.
- Use discriminated unions for variant-like APIs.
- Type children with `React.ReactNode` when applicable.
- Extend DOM props for intrinsic elements with intersections.

```ts
export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
```

## Event handling
- Use precise event types: `React.MouseEvent<HTMLButtonElement>`, `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`.
- Prevent default at the handler boundary when needed.
- Prefer stable handlers (memoize if passed to memoized children).

```tsx
type SearchInputProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
};

export const SearchInput = ({ placeholder, onSearch, onClear }: SearchInputProps) => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(value);
  };
  const handleClear = () => {
    setValue('');
    onClear?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        aria-label="Search"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear} aria-label="Clear search">
        ×
      </button>
    </form>
  );
};
```

## Best practices
- Keep components small; lift state up only when needed.
- Derive state; avoid duplicating props into state.
- Group related state into objects; avoid many independent flags.
- Always handle loading/empty/error states when rendering async data.
- Organize files and imports consistently; prefer named exports.

## Anti-patterns (avoid)
```tsx
// Default export
export default function Component() {}

// Prop spreading (hides API and increases surface)
<Component {...props} />

// Using any
const onClick = (e: any) => {};

// Side effects in render (no useEffect)
console.log('do network request here');

// Unstable inline objects in deps causing effect churn
useEffect(() => {}, [{ a: 1 }]);

// Index as key (breaks reordering)
items.map((it, i) => <li key={i}>{it.name}</li>);
```

## Integration
- Data fetching and caching: see `./tanstack-query.instructions.md`.
- Atomic component structure: see `./atomic-design.instructions.md`.
- Advanced React 19 features: see `./react19-features.instructions.md`.
- Hooks authoring patterns: see `./hooks.instructions.md`.
- Code quality and formatting: see `./eslint.instructions.md` and `./prettier.instructions.md`.

## Related Instructions
- Atomic Design: `./atomic-design.instructions.md`
- React 19 Advanced Features: `./react19-features.instructions.md`
- Hooks: `./hooks.instructions.md`
- Testing: `./testing.instructions.md`
- Code Quality: `./code-quality.instructions.md`

## Summary
Write small, typed, functional components. Use basic hooks correctly (state, effects, memo/callback, refs), strongly typed props and events, and avoid core anti-patterns. Use the other instruction files for data, structure, advanced React 19 features, testing, and code quality.
