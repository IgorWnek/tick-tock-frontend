---
applyTo: '**/*.tsx, **/*.ts, !**/*.test.tsx, !**/*.test.ts, !**/node_modules/**, !**/dist/**, !**/build/**'
description: 'Comprehensive React 19 and TypeScript coding standards, patterns, and best practices for component development, hooks usage, testing, and code organization'
---

# React 19 TypeScript Best Practices

Follow these patterns and conventions when writing React 19 TypeScript code in this repository.

## Core Principles

### 1. TypeScript First

- Use strict TypeScript configuration with `strict: true`
- Define explicit types for all component props, hooks, and return values
- Use utility types like `Simplify<T>` and `Unwrap<T>` for complex type transformations
- Prefer type inference when TypeScript can determine the type accurately

```typescript
// ✅ Good - Explicit prop types
type UserCardProps = {
  user: User;
  onSelect: (userId: string) => void;
  className?: string;
};

// ✅ Good - Utility type usage
export type Simplify<T> = T extends object ? { [K in keyof T]: Simplify<T[K]> } : T;
```

### 2. Functional Components Only

- Use functional components with hooks exclusively
- Avoid class components and legacy patterns
- Leverage React 19 features and hooks

```tsx
// ✅ Good - Functional component with proper typing
export const UserProfile = ({ user, onUpdate }: UserProfileProps) => {
  const { t } = useLocale();
  const { mutateAsync: updateUser, isPending } = useMutation('updateUser');

  return (
    <div>
      <h2>{user.name}</h2>
      {/* Component JSX */}
    </div>
  );
};
```

## File Organization Patterns

### 1. Atomic Design Component Structure

Follow the atomic design methodology for component organization:

```
src/
├── components/
│   ├── atoms/                   # Basic UI elements
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.test.tsx
│   │       ├── Button.types.ts
│   │       └── Button.stories.tsx
│   ├── molecules/               # Simple component combinations
│   │   └── SearchInput/
│   │       ├── SearchInput.tsx
│   │       ├── SearchInput.test.tsx
│   │       ├── SearchInput.types.ts
│   │       └── SearchInput.stories.tsx
│   ├── organisms/               # Complex UI sections
│   │   └── UserCard/
│   │       ├── UserCard.tsx
│   │       ├── UserCard.test.tsx
│   │       ├── UserCard.types.ts
│   │       └── UserCard.stories.tsx
│   ├── templates/               # Page layouts
│   │   └── DashboardLayout/
│   │       ├── DashboardLayout.tsx
│   │       ├── DashboardLayout.test.tsx
│   │       └── DashboardLayout.types.ts
│   └── ui/                      # Legacy components (to be migrated)
├── routes/                      # Route-specific components (pages)
│   └── routeName/
│       └── -components/
│           ├── ComponentName.tsx
│           ├── ComponentName.test.tsx
│           └── ComponentName.types.ts
└── hooks/                       # Custom hooks
    └── useHookName/
        ├── useHookName.ts
        ├── useHookName.test.tsx
        └── useHookName.types.ts
```

### 2. Atomic Design Component Guidelines

**Atoms** (Basic UI elements):
- Single responsibility, minimal props
- No business logic or data fetching
- Focus on visual consistency and theming
- Examples: Button, Input, Label, Icon

**Molecules** (Simple combinations):
- Combine 2-3 atoms into functional units
- Handle basic interactions and validation
- Minimal data dependencies
- Examples: SearchInput, FormField, NavigationLink

**Organisms** (Complex sections):
- Combine molecules and atoms into complete sections
- Can include data fetching and business logic
- Manage their own state and side effects
- Examples: UserCard, DataTable, NavigationHeader

**Templates** (Page layouts):
- Define page structure and layout
- Manage responsive behavior
- Handle loading and error states
- Examples: DashboardLayout, FormLayout, ListLayout

**Pages** (Route components):
- Specific instances of templates with real data
- Handle route-specific logic and navigation
- Coordinate multiple organisms
- Examples: /dashboard, /users, /settings

### 2. Naming Conventions

- **Components**: PascalCase following atomic hierarchy (`Button`, `SearchInput`, `UserCard`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useApiClient`)
- **Types**: PascalCase (`UserCardProps`, `AuthState`)
- **Files**: Match the main export name
- **Atomic Categories**: Use clear atomic design prefixes when needed for clarity

### 3. Enhanced Theming and Design Tokens

Leverage TailwindCSS 4 design tokens and CSS variables for consistent theming:

```tsx
// ✅ Good - Using design tokens in atoms
export const Button = ({ variant = 'primary', size = 'md', children, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        // Base styles using design tokens
        'inline-flex items-center justify-center font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',

        // Size variants using design tokens
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-11 px-8': size === 'lg',
        },

        // Color variants using CSS variables
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// ✅ Good - Molecule using atomic components with consistent theming
export const SearchInput = ({ placeholder, onSearch, ...props }: SearchInputProps) => {
  const [value, setValue] = useState('');

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
        {...props}
      />
      <Button
        onClick={() => onSearch(value)}
        variant="outline"
        size="md"
      >
        Search
      </Button>
    </div>
  );
};
```

### 4. CSS Variables and Theme Integration

Use CSS variables for dynamic theming:

```css
/* Design tokens in CSS */
:root {
  --color-primary: 222.2 84% 4.9%;
  --color-primary-foreground: 210 40% 98%;
  --color-secondary: 210 40% 96%;
  --color-accent: 210 40% 94%;
  --border-radius: 0.5rem;
  --spacing-unit: 0.25rem;
}

.dark {
  --color-primary: 210 40% 98%;
  --color-primary-foreground: 222.2 84% 4.9%;
  --color-secondary: 222.2 84% 4.9%;
  --color-accent: 217.2 32.6% 17.5%;
}
```

```tsx
// ✅ Good - Component using CSS variables
export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'rounded-[var(--border-radius)] border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
```

### 3. Import/Export Patterns

- Use **named exports only** (no default exports)
- Organize imports with specific groups and spacing
- Follow atomic design import hierarchy (atoms → molecules → organisms)

```tsx
// ✅ Good - Organized imports following atomic hierarchy
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useMutation } from 'hooks/useMutation/useMutation';
import { useAuth } from 'hooks/useAuth/useAuth';

// Atomic design imports: atoms first, then molecules, organisms
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { SearchInput } from '@/components/molecules/SearchInput';
import { UserCard } from '@/components/organisms/UserCard';

import { ComponentProps } from './Component.types';

// ✅ Good - Named export
export const Component = ({ prop1, prop2 }: ComponentProps) => {
  // Component implementation
};
```

## React 19 Patterns

### 1. Modern Hook Usage

Leverage React 19 hooks and patterns effectively:

```tsx
// ✅ Good - useCallback for event handlers
export const UserList = ({ users, onUserSelect }: UserListProps) => {
  const navigate = useNavigate();

  const handleUserClick = useCallback(
    (userId: string) => {
      navigate({ to: '/users/$id', params: { id: userId } });
      onUserSelect(userId);
    },
    [navigate, onUserSelect],
  );

  // ✅ Good - useMemo for expensive calculations
  const sortedUsers = useMemo(() => users.sort((a, b) => a.name.localeCompare(b.name)), [users]);

  return (
    <ul>
      {sortedUsers.map((user) => (
        <li key={user.id}>
          <button onClick={() => handleUserClick(user.id)}>{user.name}</button>
        </li>
      ))}
    </ul>
  );
};
```

### 2. React 19 Actions and Form Handling

Leverage React 19's Actions for streamlined form handling:

```tsx
// ✅ Good - Form Actions with useActionState
export const UserForm = ({ user }: UserFormProps) => {
  const [formState, formAction, isPending] = useActionState(
    async (previousState: FormState, formData: FormData) => {
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;

      try {
        await updateUser({ id: user.id, name, email });
        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    { success: false, error: null },
  );

  return (
    <form action={formAction}>
      <input type="text" name="name" defaultValue={user.name} disabled={isPending} />
      <input type="email" name="email" defaultValue={user.email} disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update User'}
      </button>
      {formState.error && <div className="error">{formState.error}</div>}
      {formState.success && <div className="success">User updated successfully</div>}
    </form>
  );
};

// ✅ Good - Direct form action with server function
export const QuickUserForm = () => {
  async function createUser(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    // Server-side user creation logic
    await saveUser({ name, email });
  }

  return (
    <form action={createUser}>
      <input type="text" name="name" placeholder="Name" required />
      <input type="email" name="email" placeholder="Email" required />
      <button type="submit">Create User</button>
    </form>
  );
};
```

### 3. Optimistic Updates with useOptimistic

Use `useOptimistic` for immediate UI feedback:

```tsx
// ✅ Good - Optimistic updates for better UX
export const TodoList = ({ todos }: TodoListProps) => {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos, (state: Todo[], newTodo: Todo) => [
    ...state,
    newTodo,
  ]);

  const [formState, formAction] = useActionState(
    async (previousState: FormState, formData: FormData) => {
      const text = formData.get('text') as string;
      const newTodo = { id: Date.now().toString(), text, completed: false };

      // Add optimistic update
      addOptimisticTodo(newTodo);

      try {
        await createTodo(newTodo);
        return { success: true, error: null };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    { success: false, error: null },
  );

  return (
    <div>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id} className={todo.pending ? 'pending' : ''}>
            {todo.text}
          </li>
        ))}
      </ul>

      <form action={formAction}>
        <input type="text" name="text" placeholder="Add todo..." required />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};
```

### 4. Enhanced useTransition for Actions

Use `useTransition` with Actions for non-blocking updates:

```tsx
// ✅ Good - useTransition with Actions
export const LikeButton = ({ postId, initialLikes }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    startTransition(async () => {
      // Optimistic update
      setLikes((prev) => prev + 1);

      try {
        const newLikes = await likePost(postId);
        setLikes(newLikes);
      } catch (error) {
        // Revert optimistic update
        setLikes((prev) => prev - 1);
        console.error('Failed to like post:', error);
      }
    });
  };

  return (
    <button onClick={handleLike} disabled={isPending}>
      {isPending ? 'Liking...' : `❤️ ${likes}`}
    </button>
  );
};
```

### 5. New Ref Callback Cleanup

Implement proper ref cleanup in React 19:

```tsx
// ✅ Good - Ref callback with cleanup
export const ScrollableList = ({ items }: ScrollableListProps) => {
  const [itemRefs, setItemRefs] = useState<Map<string, HTMLElement>>(new Map());

  const scrollToItem = useCallback(
    (itemId: string) => {
      const element = itemRefs.get(itemId);
      element?.scrollIntoView({ behavior: 'smooth' });
    },
    [itemRefs],
  );

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          ref={(node) => {
            if (node) {
              // Add to refs map
              setItemRefs((prev) => new Map(prev).set(item.id, node));

              // Return cleanup function
              return () => {
                setItemRefs((prev) => {
                  const newMap = new Map(prev);
                  newMap.delete(item.id);
                  return newMap;
                });
              };
            }
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};

// ✅ Good - Simple ref assignment with explicit block
export const FocusableInput = () => {
  let inputRef: HTMLInputElement | null = null;

  return (
    <div>
      <input
        ref={(current) => {
          inputRef = current;
        }} // Explicit block to avoid implicit return
        placeholder="Type here..."
      />
      <button onClick={() => inputRef?.focus()}>Focus Input</button>
    </div>
  );
};
```

### 6. Direct Ref Props (No forwardRef needed)

Use React 19's direct ref prop support:

```tsx
// ✅ Good - Direct ref prop in React 19
export const CustomInput = ({ placeholder, ref }: { placeholder: string; ref?: React.Ref<HTMLInputElement> }) => {
  return <input placeholder={placeholder} ref={ref} className="custom-input" />;
};

// Usage
export const ParentComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <CustomInput placeholder="Enter text..." ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </div>
  );
};
```

### 7. Enhanced Form Status with useFormStatus

Monitor form submission status across components:

```tsx
// ✅ Good - Form status monitoring
export const SubmitButton = () => {
  const { pending, data } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
      {data && <span>Submitting {data.get('name')}</span>}
    </button>
  );
};

export const FormWithStatus = () => {
  async function handleSubmit(formData: FormData) {
    // Form submission logic
    await saveFormData(formData);
  }

  return (
    <form action={handleSubmit}>
      <input type="text" name="name" placeholder="Name" />
      <input type="email" name="email" placeholder="Email" />
      <SubmitButton />
    </form>
  );
};
```

### 8. Context and State Management

Follow the established context patterns:

```tsx
// ✅ Good - Context Controller pattern
export const UserContextController = ({ children }: UserContextControllerProps) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const { mutateAsync: updateUser } = useMutation('updateUser', {
    onSuccess: (userData) => {
      dispatch(setUser(userData));
    },
  });

  const value: UserContextValue = useMemo(
    () => ({
      ...state,
      updateUser,
    }),
    [state, updateUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// ✅ Good - Custom hook for context
export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('UserContext must be within UserProvider');
  }

  return context;
};
```

### 9. Data Fetching Patterns

Use the established React Query abstraction:

```tsx
// ✅ Good - Query usage
export const UserProfile = ({ userId }: UserProfileProps) => {
  const { data: user, isLoading, isError } = useQuery(userQueries.getById(userId));

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  return (
    <div>
      <h2>{user?.name}</h2>
      {/* Profile content */}
    </div>
  );
};

// ✅ Good - Mutation usage
export const UserForm = ({ user }: UserFormProps) => {
  const { mutateAsync: saveUser, isPending } = useMutation('updateUser', {
    onSuccess: () => {
      // Handle success
    },
  });

  const handleSubmit = useCallback(
    async (formData: UserFormData) => {
      await saveUser(formData);
    },
    [saveUser],
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};
```

## Component Patterns

### 1. Atomic Design Component Development

Follow atomic design principles when creating components:

**Atoms - Basic Building Blocks:**
```tsx
// ✅ Good - Atom component (Button)
export const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        // Base styles using design tokens
        'inline-flex items-center justify-center font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        'disabled:pointer-events-none disabled:opacity-50',

        // Variant styles
        buttonVariants({ variant, size }),
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Supporting variant configuration
const buttonVariants = cva('', {
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
});
```

**Molecules - Simple Combinations:**
```tsx
// ✅ Good - Molecule component (FormField)
export const FormField = ({
  label,
  error,
  required = false,
  children,
  className,
  ...props
}: FormFieldProps) => {
  const id = useId();

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} className={required ? 'required' : undefined}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-describedby': error ? `${id}-error` : undefined,
          'aria-invalid': !!error,
          ...props
        })}
      </div>

      {error && (
        <Text
          id={`${id}-error`}
          variant="error"
          size="sm"
          role="alert"
        >
          {error}
        </Text>
      )}
    </div>
  );
};
```

**Organisms - Complex Sections:**
```tsx
// ✅ Good - Organism component (UserCard)
export const UserCard = ({ user, onEdit, onDelete, className }: UserCardProps) => {
  const { mutateAsync: deleteUser, isPending: isDeleting } = useMutation('deleteUser');
  const { t } = useLocale();

  const handleDelete = useCallback(async () => {
    if (window.confirm(t('user.deleteConfirmation'))) {
      await deleteUser(user.id);
      onDelete?.(user.id);
    }
  }, [deleteUser, user.id, onDelete, t]);

  return (
    <Card className={cn('p-4', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <Text variant="h4" className="truncate">{user.name}</Text>
            <Text variant="muted" size="sm">{user.email}</Text>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <Text size="sm">
            <span className="font-medium">{t('user.role')}:</span> {user.role}
          </Text>
          <Text size="sm">
            <span className="font-medium">{t('user.lastActive')}:</span> {formatDate(user.lastActiveAt)}
          </Text>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(user)}
          >
            {t('common.edit')}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t('common.deleting') : t('common.delete')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
```

### 2. Props and TypeScript

- Define props interfaces in separate `.types.ts` files
- Use explicit prop destructuring with proper defaults
- Handle optional props with sensible defaults
- Use variant-based prop patterns for flexible component APIs

```tsx
// In Component.types.ts
export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type UserCardProps = {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  className?: string;
};

// In Component.tsx - Use proper defaults and destructuring
export const UserCard = ({
  user,
  onEdit,
  onDelete,
  className
}: UserCardProps) => {
  return (
    <div className={clsx('user-card', className)}>
      <h3>{user.name}</h3>
      <button onClick={() => onEdit?.(user)}>Edit</button>
      <button onClick={() => onDelete?.(user.id)}>Delete</button>
    </div>
  );
};
```

### 2. Event Handling

- Use proper event handler typing
- Implement accessibility features
- Follow atomic design patterns for event delegation

```tsx
// ✅ Good - Atom with proper event handling
export const SearchInput = ({ onSearch, onClear, placeholder }: SearchInputProps) => {
  const [value, setValue] = useState('');

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSearch(value);
    },
    [onSearch, value],
  );

  const handleClear = useCallback(() => {
    setValue('');
    onClear?.();
  }, [onClear]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        handleClear();
      }
    },
    [handleClear],
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Input
          id="search-input"
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search input"
          className="pr-10"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" variant="outline">
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
};
```

### 3. Error Boundaries

Implement error boundaries for robust error handling:

```tsx
export const FeatureErrorBoundary = ({ children }: FeatureErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error, errorInfo) => {
        logger.error(error);
        // Additional error handling
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

## Custom Hooks Patterns

### 1. Hook Composition with Atomic Design

- Keep hooks focused and composable
- Return objects with clear naming
- Handle loading and error states
- Consider atomic design principles for hook organization

```tsx
// ✅ Good - Atomic hook for basic data fetching
export const useUser = (userId: string) => {
  const { data: user, isLoading, isError, error } = useQuery(userQueries.getById(userId));

  return {
    user,
    isLoading,
    isError,
    error,
  };
};

// ✅ Good - Molecular hook combining multiple atomic hooks
export const useUserWithPermissions = (userId: string) => {
  const { user, isLoading: isUserLoading, isError: isUserError } = useUser(userId);

  const {
    data: permissions,
    isLoading: isPermissionsLoading
  } = useQuery(userQueries.getPermissions(userId), {
    enabled: !!user,
  });

  return {
    user,
    permissions,
    isLoading: isUserLoading || isPermissionsLoading,
    isError: isUserError,
    hasPermission: useCallback(
      (permission: string) => permissions?.includes(permission) ?? false,
      [permissions]
    ),
  };
};

// ✅ Good - Organism-level hook for complex business logic
export const useUserManagement = () => {
  const { data: users, isLoading } = useQuery(userQueries.getAll());

  const { mutateAsync: createUser, isPending: isCreating } = useMutation('createUser');
  const { mutateAsync: updateUser, isPending: isUpdating } = useMutation('updateUser');
  const { mutateAsync: deleteUser, isPending: isDeleting } = useMutation('deleteUser');

  const createUserWithValidation = useCallback(
    async (userData: CreateUserData) => {
      // Business logic validation
      if (!userData.email?.includes('@')) {
        throw new Error('Invalid email format');
      }

      return createUser(userData);
    },
    [createUser]
  );

  return {
    users,
    isLoading,
    actions: {
      createUser: createUserWithValidation,
      updateUser,
      deleteUser,
    },
    states: {
      isCreating,
      isUpdating,
      isDeleting,
      isBusy: isCreating || isUpdating || isDeleting,
    },
  };
};
```

### 2. Custom Hook Testing

Write comprehensive tests for custom hooks with atomic design considerations:

```tsx
// useUser.test.tsx - Testing atomic hook
describe('useUser', () => {
  test('returns user data when loaded', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    mockApiResponse(mockUser, 'get');

    const { result } = renderHook(() => useUser('1'), {
      wrapper: ({ children }) => (
        <AppProviders>
          <>{children}</>
        </AppProviders>
      ),
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);
    });
  });

  test('handles error states correctly', async () => {
    mockApiError(new Error('User not found'), 'get');

    const { result } = renderHook(() => useUser('1'), {
      wrapper: ({ children }) => (
        <AppProviders>
          <>{children}</>
        </AppProviders>
      ),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.user).toBeUndefined();
    });
  });
});

// useUserManagement.test.tsx - Testing organism-level hook
describe('useUserManagement', () => {
  test('creates user with validation', async () => {
    const { result } = renderHook(() => useUserManagement(), {
      wrapper: ({ children }) => (
        <AppProviders>
          <>{children}</>
        </AppProviders>
      ),
    });

    const validUser = { name: 'John Doe', email: 'john@example.com' };

    await act(async () => {
      await result.current.actions.createUser(validUser);
    });

    expect(mockCreateUser).toHaveBeenCalledWith(validUser);
  });

  test('validates email format before creation', async () => {
    const { result } = renderHook(() => useUserManagement(), {
      wrapper: ({ children }) => (
        <AppProviders>
          <>{children}</>
        </AppProviders>
      ),
    });

    const invalidUser = { name: 'John Doe', email: 'invalid-email' };

    await expect(async () => {
      await act(async () => {
        await result.current.actions.createUser(invalidUser);
      });
    }).rejects.toThrow('Invalid email format');
  });
});
```

## Testing Patterns

### 1. Component Testing with Atomic Design

Follow Testing Library best practices while considering atomic design hierarchy:

```tsx
// Button.test.tsx - Testing atom component
describe('Button', () => {
  test('renders with correct variant styles', () => {
    render(<Button variant="primary">Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  test('handles disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });

  test('supports different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8', 'px-3', 'text-sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11', 'px-8');
  });
});

// SearchInput.test.tsx - Testing molecule component
describe('SearchInput', () => {
  test('combines atoms correctly and handles interactions', async () => {
    const mockOnSearch = vi.fn();
    const mockOnClear = vi.fn();

    render(
      <SearchInput
        onSearch={mockOnSearch}
        onClear={mockOnClear}
        placeholder="Search users..."
      />
    );

    const input = screen.getByLabelText(/search input/i);
    const submitButton = screen.getByRole('button', { name: /search/i });

    // Test input functionality
    await userEvent.type(input, 'john doe');
    expect(input).toHaveValue('john doe');

    // Test search submission
    await userEvent.click(submitButton);
    expect(mockOnSearch).toHaveBeenCalledWith('john doe');

    // Test clear functionality
    const clearButton = screen.getByLabelText(/clear search/i);
    await userEvent.click(clearButton);
    expect(input).toHaveValue('');
    expect(mockOnClear).toHaveBeenCalled();
  });

  test('supports keyboard shortcuts', async () => {
    const mockOnClear = vi.fn();

    render(<SearchInput onSearch={vi.fn()} onClear={mockOnClear} />);

    const input = screen.getByLabelText(/search input/i);
    await userEvent.type(input, 'test query');
    await userEvent.keyboard('{Escape}');

    expect(input).toHaveValue('');
    expect(mockOnClear).toHaveBeenCalled();
  });
});

// UserCard.test.tsx - Testing organism component
describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    avatar: 'https://example.com/avatar.jpg',
    lastActiveAt: '2025-08-20T10:00:00Z',
  };

  test('renders user information correctly', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();

    const avatar = screen.getByRole('img', { name: /john doe/i });
    expect(avatar).toHaveAttribute('src', mockUser.avatar);
  });

  test('handles edit action correctly', async () => {
    const mockOnEdit = vi.fn();

    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });

  test('handles delete with confirmation', async () => {
    const mockOnDelete = vi.fn();

    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<UserCard user={mockUser} onDelete={mockOnDelete} />);

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(confirmSpy).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockUser.id);
    });

    confirmSpy.mockRestore();
  });

  test('cancels delete when confirmation is denied', async () => {
    const mockOnDelete = vi.fn();

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<UserCard user={mockUser} onDelete={mockOnDelete} />);

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });
});
```

### 2. Integration Testing

Test components with providers when needed:

```tsx
test('displays loading state correctly', async () => {
  mockApiResponse(mockUser, 'get');

  render(<UserProfile userId="1" />, {
    wrapper: ({ children }) => (
      <AppProviders>
        <>{children}</>
      </AppProviders>
    ),
  });

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## Accessibility Standards

### 1. Semantic HTML

- Use proper HTML elements and ARIA attributes
- Implement keyboard navigation
- Provide screen reader support

```tsx
export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <header>
          <h2 id="modal-title">{title}</h2>
          <button onClick={onClose} aria-label="Close modal" className="modal-close">
            ×
          </button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};
```

## Performance Optimization

### 1. Memoization

Use React's memoization features appropriately:

```tsx
// ✅ Good - Memoize expensive calculations
export const DataTable = ({ data, filters }: DataTableProps) => {
  const filteredData = useMemo(() => {
    return data.filter((item) => filters.every((filter) => filter.apply(item)));
  }, [data, filters]);

  const renderRow = useCallback((item: DataItem) => <TableRow key={item.id} data={item} />, []);

  return (
    <table>
      <tbody>{filteredData.map(renderRow)}</tbody>
    </table>
  );
};
```

### 2. Code Splitting

Implement proper code splitting for routes:

```tsx
// ✅ Good - Lazy loading
const UserManagement = lazy(() => import('./UserManagement'));

export const Route = createFileRoute('/users/')({
  component: () => (
    <Suspense fallback={<Loader />}>
      <UserManagement />
    </Suspense>
  ),
});
```

## Code Quality Standards

### 1. ESLint Rules Compliance

- No prop spreading (`react/jsx-props-no-spreading`)
- Organized imports with proper grouping
- No `any` types (`@typescript-eslint/no-explicit-any`)
- Prefer user-event in tests (`testing-library/prefer-user-event`)

### 2. Documentation

- Document complex business logic
- Use JSDoc for public APIs
- Maintain clear README files for feature modules

```tsx
/**
 * Custom hook for managing user authentication state and actions.
 * Handles login, logout, and token refresh automatically.
 *
 * @returns {AuthState} Current authentication state and actions
 */
export const useAuth = (): AuthState => {
  // Implementation
};
```

## Anti-Patterns to Avoid

### ❌ Don't do these:

```tsx
// ❌ Bad - Default exports
export default Component;

// ❌ Bad - Prop spreading
<Component {...props} />

// ❌ Bad - Using `any` type
const handleClick = (event: any) => {};

// ❌ Bad - Inline styles for complex styling
<div style={{ display: 'flex', justifyContent: 'space-between' }}>

// ❌ Bad - Missing error boundaries
const App = () => <UnstableComponent />;

// ❌ Bad - Not using loading states
const { data } = useQuery(query);
return <div>{data.name}</div>; // Could crash if data is undefined

// ❌ Bad - Implicit returns in ref callbacks (React 19)
<div ref={current => (instance = current)} />

// ❌ Bad - Not using Actions for form handling
const handleSubmit = (e) => {
  e.preventDefault();
  setIsPending(true);
  updateData(formData).finally(() => setIsPending(false));
};

// ❌ Bad - Using old forwardRef pattern unnecessarily
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

// ❌ Bad - Manual pending state management
const [isPending, setIsPending] = useState(false);
const handleClick = async () => {
  setIsPending(true);
  try {
    await updateData();
  } finally {
    setIsPending(false);
  }
};

// ❌ Bad - Not following atomic design hierarchy
import { ComplexUserManagementTable } from '@/components/atoms/ComplexUserManagementTable';

// ❌ Bad - Mixing atomic levels inappropriately
const Button = () => (
  <button>
    <UserCard user={user} /> {/* Organism inside atom */}
  </button>
);

// ❌ Bad - Not using design tokens
<button className="bg-blue-500 text-white px-4 py-2 rounded-md" />

// ❌ Bad - Hardcoded theme values
<div style={{ backgroundColor: '#3b82f6', color: '#ffffff' }} />
```

### ✅ Do these instead:

```tsx
// ✅ Good - Named exports
export const Component = () => {};

// ✅ Good - Explicit props
<Component prop1={value1} prop2={value2} />

// ✅ Good - Proper typing
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {};

// ✅ Good - CSS classes with design tokens
<div className="flex justify-between">

// ✅ Good - Error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <UnstableComponent />
</ErrorBoundary>

// ✅ Good - Handle loading states
const { data, isLoading } = useQuery(query);
if (isLoading) return <Loader />;
return <div>{data?.name}</div>;

// ✅ Good - Explicit block in ref callbacks (React 19)
<div ref={current => { instance = current; }} />

// ✅ Good - Use Actions for form handling
<form action={formAction}>
  <input name="data" />
  <button type="submit" disabled={isPending}>Submit</button>
</form>

// ✅ Good - Direct ref prop (React 19)
const MyInput = ({ placeholder, ref }) => {
  return <input placeholder={placeholder} ref={ref} />;
};

// ✅ Good - Use useTransition for automatic pending state
const [isPending, startTransition] = useTransition();
const handleClick = () => {
  startTransition(async () => {
    await updateData();
  });
};

// ✅ Good - Follow atomic design hierarchy
import { Button } from '@/components/atoms/Button';
import { SearchInput } from '@/components/molecules/SearchInput';
import { UserCard } from '@/components/organisms/UserCard';

// ✅ Good - Proper atomic composition
const SearchForm = () => (
  <form className="space-y-4">
    <SearchInput onSearch={handleSearch} />
    <Button type="submit">Search</Button>
  </form>
);

// ✅ Good - Using design tokens
<Button variant="primary" size="md" />

// ✅ Good - CSS variables for theming
<div className="bg-primary text-primary-foreground" />
```

## Summary

Always prioritize:

1. **Atomic Design Methodology** - Organize components by complexity and responsibility (atoms → molecules → organisms → templates → pages)
2. **Type Safety** - Comprehensive TypeScript usage with explicit prop types and interfaces
3. **Design System Consistency** - Use design tokens, CSS variables, and consistent theming patterns
4. **Component Composition** - Build complex UIs from simple, focused, reusable components
5. **Testing** - Comprehensive test coverage with Testing Library, considering atomic design hierarchy
6. **Accessibility** - WCAG compliant interfaces with proper semantic HTML and ARIA attributes
7. **Performance** - Proper memoization, code splitting, and optimized rendering
8. **Code Organization** - Consistent file structure following atomic design principles
9. **Error Handling** - Robust error boundaries and loading states at all component levels
10. **React 19 Features** - Leverage Actions, useOptimistic, enhanced useTransition, and direct ref props

Follow these patterns to maintain consistency with the existing codebase, atomic design principles, and React 19 best practices while building a scalable and maintainable component library.
