---
applyTo: 'src/components/**/*.{tsx,ts}, src/design-system/**/*.{tsx,ts}'
description: 'Atomic design methodology, component organization, hierarchy, naming, imports, and examples for each level'
---

# Atomic Design for Components

## Context
Use these rules to structure UI into atomic levels for consistency, reuse, and maintainability. These rules apply primarily to the new `src/design-system/**` directory and also to the legacy `src/components/**` directory during the migration. For the detailed migration plan, see `docs/tasks/atomic-design-migration-tasks.md`.

## Core Principles
- Single responsibility per component; compose up from atoms → molecules → organisms → templates → pages.
- Named exports only; no default exports.
- Strict typing for props, events, and returns (TypeScript-first).
- No remote data fetching in atoms; keep logic where it belongs by level.
- Consistent theming via design tokens and utilities; avoid hardcoded styles.
- Accessibility first: semantic markup, keyboard support, ARIA where needed.

## Patterns

### File organization
The project is migrating from a legacy structure to a new design-system-based organization.

- **Legacy (migrating from):** `src/components/`
- **Target (migrating to):** `src/design-system/`

```text
src/
├─ components/                 # Legacy (to be migrated gradually)
│  ├─ ...
└─ design-system/              # Target per migration guide
   ├─ atoms/
   ├─ molecules/
   ├─ organisms/
   ├─ templates/
   └─ tokens/
```

- Each component in its own folder, PascalCase: `Button/Button.tsx`, `Button/Button.types.ts`, optional `Button.test.tsx`.
- Co-locate small helpers; keep feature/business logic in `src/features/**` hooks, not inside design-system components.

### Atomic levels and responsibilities

1) Atoms (basic building blocks)
- Pure presentational; no business logic and no data fetching.
- Minimal, explicit props; accessible by default.
- Use design tokens and Tailwind utilities; configure variants with CVA.

2) Molecules (simple compositions)
- Combine 2–3 atoms; manage simple local state/validation.
- No remote data fetching; accept data via props and bubble events up.

3) Organisms (complex sections)
- Compose molecules/atoms into functional sections.
- May include data fetching via hooks; handle loading/error/empty UI.
- Own localized state and side effects; keep feature logic abstracted via hooks.

4) Templates (layouts)
- Define page structure and slots; no feature-specific logic.
- No remote data fetching; accept data/children and render regions.

5) Pages (routes)
- Compose templates with real data and navigation.
- Route-specific wiring; orchestrate organisms; minimal UI logic.

### Import/export and dependency direction
- Named exports only; filename matches main export.
- Import order within a file: React/3rd → project hooks/utils → atoms → molecules → organisms → templates.
- Never import “up” the hierarchy (e.g., atoms must not import molecules/organisms).
- Prefer path aliases consistently (e.g., `@/components/atoms/Button`).

### Naming conventions
- Components and folders: PascalCase (`TimeEntryCard`).
- Types/interfaces: PascalCase with suffix (`TimeEntryCardProps`).
- Variant helpers: `buttonVariants`, `typographyVariants` with CVA.
- Tests: `Component.test.tsx`. Types can be colocated or `Component.types.ts`.

### Examples by level (TypeScript)

Atoms — Button with variants (CVA + tokens):
```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = {
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof buttonVariants> & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ variant, size, className, children, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
    {children}
  </button>
);
```

Molecules — SearchInput composed from atoms:
```tsx
type SearchInputProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
};

export const SearchInput = ({ placeholder, onSearch, onClear }: SearchInputProps) => {
  const [value, setValue] = React.useState('');

  const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input aria-label="Search" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
      <Button type="submit" variant="outline">Search</Button>
      <Button type="button" variant="ghost" onClick={() => { setValue(''); onClear?.(); }} aria-label="Clear search">
        ×
      </Button>
    </form>
  );
};
```

Organisms — UserCard with loading/error states:
```tsx
type User = { id: string; name: string; email: string };

export const UserCard = ({ userId }: { userId: string }) => {
  const { data: user, isLoading, isError } = useQuery(userQueries.getById(userId));

  if (isLoading) return <div>Loading…</div>;
  if (isError || !user) return <div role="alert">Failed to load user</div>;

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-medium">{user.name}</h3>
      <p className="text-sm text-muted-foreground">{user.email}</p>
    </div>
  );
};
```

Templates — Dashboard layout slots:
```tsx
type DashboardTemplateProps = {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
};

export const DashboardTemplate = ({ header, sidebar, content, footer }: DashboardTemplateProps) => (
  <div className="grid grid-rows-[auto_1fr_auto] h-dvh">
    <header className="border-b">{header}</header>
    <div className="grid grid-cols-[280px_1fr] min-h-0">
      <aside className="border-r overflow-auto">{sidebar}</aside>
      <main className="overflow-auto p-4">{content}</main>
    </div>
    {footer ? <footer className="border-t p-2">{footer}</footer> : null}
  </div>
);
```

Pages — Route composition (no heavy logic):
```tsx
export const UsersPage = () => {
  return (
    <DashboardTemplate
      header={<Header />}
      sidebar={<UsersSidebar />}
      content={<UsersTable />}
    />
  );
};
```

## Best Practices
- Keep atomic boundaries strict: no organisms inside atoms; no remote data in atoms/molecules.
- Use CVA for variants; `cn` utility for class merging; design tokens for colors/spacing/typography.
- Co-locate tests next to components; cover accessibility and states (loading/empty/error).
- Prefer composition over props explosion; split complex components into smaller parts.
- Use named re-exports (`index.ts`) sparingly to avoid circular deps.

## Anti-Patterns
```tsx
// ❌ Atom importing organism
import { ComplexUserTable } from '@/components/organisms/ComplexUserTable';

// ❌ Data fetching in atom/molecule
const { data } = useQuery(userQueries.getAll());

// ❌ Default exports
export default function Button() {}

// ❌ Hardcoded theme values (skip tokens/design variables)
<div className="bg-blue-500 text-white" />

// ❌ Prop spreading that hides API surface
<Component {...props} />
```

## Integration
- Data fetching per level: see `./tanstack-query.instructions.md`.
  - Atoms: none. Molecules: none (accept data via props). Organisms/Pages: allowed via hooks with proper states.
- React fundamentals: see `./react-core.instructions.md`.
- Design tokens and theming: see `./design-system.instructions.md` and migration guide `docs/tasks/atomic-design-migration-tasks.md`.
- Testing patterns: see `./testing.instructions.md`.
- Code quality/formatting: see `./eslint.instructions.md` and `./prettier.instructions.md`.

## Summary
Organize UI into atomic layers with clear responsibilities. Keep atoms/molecules presentation-focused and free of remote data. Use typed, named exports, CVA variants, and design tokens for consistency. Compose up through organisms and templates, and wire real data at pages/routes.
