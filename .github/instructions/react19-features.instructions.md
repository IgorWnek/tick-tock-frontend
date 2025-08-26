---
applyTo: '**/*.tsx'
description: 'React 19 specific features: Actions, useActionState, useOptimistic, useTransition, direct ref props, ref callback cleanup, useFormStatus, and Server Components preparation patterns'
---

# React 19 — Advanced Features & Patterns

Use these guidelines when leveraging React 19 advanced capabilities. Keep TypeScript-first, named exports only, and follow repo-wide ESLint and Prettier rules.

References:
- Code quality: `./eslint.instructions.md`
- Formatting: `./prettier.instructions.md`
- Data layer: `./data-architecture.instructions.md`
- Core React: `./react-core.instructions.md`
- Atomic Design: `./atomic-design.instructions.md`

Note: This repo runs React 19.1.x (see `package.json`). Examples are client-first and work without Server Components; when frameworks support RSC/Server Functions, the same patterns extend naturally (see “Server Components prep”).

## Actions and Form Handling

Actions let you pass a function directly to a `<form action>` or a `button formAction`, with React managing pending state and sequencing.

### Minimal action via `useActionState`
```tsx
import { useActionState } from 'react';

type SubmitState = { error?: string | null } | null;

async function saveProfile(prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const name = String(formData.get('name') ?? '');
  if (!name.trim()) return { error: 'Name is required' };
  // Simulate async save
  await new Promise((r) => setTimeout(r, 400));
  return null; // null => success
}

export const ProfileForm = () => {
  const [state, action, pending] = useActionState<SubmitState>(saveProfile, null);
  return (
    <form action={action} className="flex flex-col gap-2">
      <label htmlFor="name">Name</label>
      <input id="name" name="name" placeholder="Ada Lovelace" />
      <button type="submit" disabled={pending}>
        {pending ? 'Saving…' : 'Save'}
      </button>
      {state?.error && <p role="alert">{state.error}</p>}
    </form>
  );
};

// Atomic design: Typically molecule/organism. If it persists data, keep at organism/page level.
```

### Button-scoped actions (`formAction`)
```tsx
import { useActionState } from 'react';

async function increment(prev: number): Promise<number> {
  await new Promise((r) => setTimeout(r, 200));
  return prev + 1;
}

export const CounterForm = () => {
  const [count, formAction, isPending] = useActionState<number>(increment, 0);
  return (
    <form className="inline-flex items-center gap-2">
      <button type="submit" formAction={formAction} disabled={isPending}>
        Count: {count}
      </button>
    </form>
  );
};

// Atomic design: Molecule example (no remote data fetching).
```

## Form status with `useFormStatus`

Use `useFormStatus` to react to the nearest parent form’s submission without prop drilling.

```tsx
import { useFormStatus } from 'react-dom';

export const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-live="polite">
      {pending ? 'Submitting…' : 'Submit'}
    </button>
  );
};

export const SimpleForm = ({ action }: { action: (fd: FormData) => Promise<void> | void }) => {
  return (
    <form action={action} className="flex gap-2">
      <input name="q" placeholder="Search" />
      <SubmitButton />
    </form>
  );
};

// Atomic design: Molecule (composable form shell, no remote data).
```

## Optimistic updates with `useOptimistic`

`useOptimistic` renders a provisional state immediately, then reconciles when the real result arrives. Combine with mutations or Actions.

### Standalone optimistic list
```tsx
import { useOptimistic } from 'react';

type Todo = { id: string; title: string };

export const TodoList = ({ initial }: { initial: Todo[] }) => {
  const [todos, addOptimistic] = useOptimistic<Todo[], Todo>(initial, (state, newTodo) => [newTodo, ...state]);

  const create = async (formData: FormData) => {
    const title = String(formData.get('title') ?? '');
    const temp: Todo = { id: `tmp-${Date.now()}`, title };
    addOptimistic(temp);
    // Simulate server save, replace temp with real
    await new Promise((r) => setTimeout(r, 300));
  };

  return (
    <div>
      <form action={create} className="flex gap-2">
        <input name="title" placeholder="New todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  );
};

// Atomic design: Organism (manages list state and server intent).
```

### With TanStack Query mutation
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useOptimistic } from 'react';

type Comment = { id: string; body: string };

export const Comments = ({ initial, postId }: { initial: Comment[]; postId: string }) => {
  const qc = useQueryClient();
  const [list, addOptimistic] = useOptimistic<Comment[], Comment>(initial, (state, c) => [c, ...state]);

  const create = useMutation({
    mutationFn: async (body: string) => {
      await new Promise((r) => setTimeout(r, 250));
      return { id: crypto.randomUUID(), body } as Comment;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', postId] }),
  });

  const action = async (fd: FormData) => {
    const body = String(fd.get('body') ?? '');
    const temp: Comment = { id: `tmp-${Date.now()}`, body };
    addOptimistic(temp);
    try {
      const saved = await create.mutateAsync(body);
      // Optionally reconcile/replace temp here; often invalidation suffices
    } catch {
      // On failure, trigger a refetch to correct optimistic state
      qc.invalidateQueries({ queryKey: ['comments', postId] });
    }
  };

  return (
    <div>
      <form action={action} className="flex gap-2">
        <input name="body" placeholder="Write a comment" />
        <button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Sending…' : 'Send'}
        </button>
      </form>
      <ul>
        {list.map((c) => (
          <li key={c.id}>{c.body}</li>
        ))}
      </ul>
    </div>
  );
};

// Atomic design: Organism (remote mutation + optimistic UI).
```

## Non-blocking transitions with `useTransition`

Wrap expensive updates or navigations to keep the UI responsive. Works well with Actions.

```tsx
import { useTransition } from 'react';

export const TabButton = ({ label, onSelect, active }: { label: string; onSelect: () => void; active: boolean }) => {
  const [pending, startTransition] = useTransition();
  if (active) return <b>{label}</b>;
  if (pending) return <b className="opacity-60">{label}</b>;
  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await onSelect();
        });
      }}
    >
      {label}
    </button>
  );
};

// Atomic design: Atom/Molecule (UI control, no remote data).
```

## New ref callback cleanup (React 19)

Ref callbacks can return a cleanup function. Also, avoid implicit returns in ref callbacks—use a block to assign.

```tsx
import { useRef } from 'react';

export const ListWithRefs = ({ items }: { items: string[] }) => {
  const nodes = useRef<Array<{ key: string; node: HTMLLIElement }>>([]);
  return (
    <ul>
      {items.map((key) => (
        <li
          key={key}
          ref={(node) => {
            if (!node) return;
            const item = { key, node };
            nodes.current.push(item);
            return () => {
              nodes.current = nodes.current.filter((x) => x.node !== node);
            };
          }}
        >
          {key}
        </li>
      ))}
    </ul>
  );
};
```

Bad (implicit return) vs good:
```tsx
// ❌ Implicit return is not allowed now
// <div ref={(el) => (ref = el)} />

// ✅ Use a block
// <div ref={(el) => { ref = el; }} />
```

// Atomic design: Organism/Page (DOM node map management is complex behavior).

## Direct ref props (no `forwardRef` needed)

React 19 lets components accept `ref` in their props directly.

```tsx
import { useRef } from 'react';

type TextFieldProps = {
  ref?: React.Ref<HTMLInputElement>;
  label: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref'>;

export const TextField = ({ ref, label, id, ...input }: TextFieldProps) => {
  const inputId = id ?? `tf-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} ref={ref} {...input} />
    </div>
  );
};

export const FocusDemo = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <div>
      <TextField ref={ref} label="Name" placeholder="Type…" />
      <button type="button" onClick={() => ref.current?.focus()}>
        Focus
      </button>
    </div>
  );
};
```

// Atomic design: `TextField` is an Atom; `FocusDemo` is a dev/demo snippet, not a shipped component.

## useActionState + useFormStatus together

```tsx
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

type Result = { message?: string } | null;

async function submit(prev: Result, fd: FormData): Promise<Result> {
  await new Promise((r) => setTimeout(r, 300));
  const email = String(fd.get('email') ?? '');
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) return { message: 'Invalid email' };
  return { message: 'Thanks! Check your inbox.' };
}

const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Sending…' : 'Send'}
    </button>
  );
};

export const NewsletterForm = () => {
  const [res, action] = useActionState<Result>(submit, null);
  return (
    <form action={action} className="flex gap-2 items-start">
      <input name="email" placeholder="you@example.com" />
      <Submit />
      {res?.message && <p role="status">{res.message}</p>}
    </form>
  );
};
```

// Atomic design: Molecule (form UI) or Organism if it wires server actions.

## Server Components preparation patterns

When you adopt a framework with RSC + Server Functions:
- Keep action return values serializable (JSON-like) and small.
- Co-locate server functions near usage with a clear name and `'use server'` directive.
- Consider `permalink` (3rd arg) to `useActionState` for progressive enhancement on dynamic pages.

Example (conceptual):
```tsx
// requestUsername.ts (server)
export default async function requestUsername(_prev: string | null, fd: FormData) {
  'use server';
  const username = String(fd.get('username') ?? '');
  // Persist, validate, etc.
  return username; // serializable
}

// UsernameForm.tsx (client)
import { useActionState } from 'react';
import requestUsername from './requestUsername';

export const UsernameForm = () => {
  const [state, action] = useActionState<string | null>(requestUsername, null, '/settings');
  return (
    <form action={action}>
      <input name="username" />
      <button type="submit">Request</button>
      <p>Last result: {state}</p>
    </form>
  );
};
```

// Atomic design: Keep server wiring in organisms/pages; atoms/molecules stay presentational.

## Guidance and caveats

- Prefer Actions + `useActionState` for form mutations; integrate with TanStack Query by invalidating relevant queries in `onSuccess`.
- `useOptimistic` is local UI state. Always reconcile with actual server state (e.g., invalidate or refetch on failure).
- Keep action inputs and outputs simple and serializable to ease migration to Server Functions.
- Ref callbacks must use block bodies when assigning and should return cleanup functions when registering external resources.
- Keep components small, accessible, and typed; follow `react-core` for fundamentals.

## Quick checklists

Actions
- [ ] Function passed to `<form action>` or `button formAction`
- [ ] Handle pending UI (button disabled, aria-live where helpful)
- [ ] Return serializable result (error/message)

useOptimistic
- [ ] Provide fast UI feedback
- [ ] Reconcile on success or refetch on failure

Refs
- [ ] No implicit return in ref callbacks
- [ ] Provide cleanup when storing DOM refs

Integration
- [ ] Tie mutations to React Query when applicable
- [ ] Invalidate queries after success
