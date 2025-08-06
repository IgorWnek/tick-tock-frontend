---
applyTo: '**/*.tsx, **/*.ts, !**/*.test.tsx, !**/*.test.ts, !**/node_modules/**, !**/dist/**, !**/build/**'
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

### 1. Component Structure

Follow the established file organization pattern:

```
src/
├── ui/                          # Reusable UI components
│   └── componentName/
│       ├── ComponentName.tsx    # Main component
│       ├── ComponentName.test.tsx
│       └── ComponentName.types.ts
├── routes/                      # Route-specific components
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

### 2. Naming Conventions

- **Components**: PascalCase (`UserCard`, `Navigation`)
- **Hooks**: camelCase with `use` prefix (`useAuth`, `useApiClient`)
- **Types**: PascalCase (`UserCardProps`, `AuthState`)
- **Files**: Match the main export name

### 3. Import/Export Patterns

- Use **named exports only** (no default exports)
- Organize imports with specific groups and spacing

```tsx
// ✅ Good - Organized imports
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { useMutation } from 'hooks/useMutation/useMutation';
import { useAuth } from 'hooks/useAuth/useAuth';
import { Translation } from '@/components/ui/translation';

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

### 1. Props and TypeScript

- Define props interfaces in separate `.types.ts` files
- Use explicit prop destructuring
- Handle optional props properly

```tsx
// In Component.types.ts
export type UserCardProps = {
  user: User;
  onSelect: (userId: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
};

// In Component.tsx
export const UserCard = ({ user, onSelect, variant = 'default', className }: UserCardProps) => {
  return (
    <div className={clsx('user-card', `user-card--${variant}`, className)}>
      <h3>{user.name}</h3>
      <button onClick={() => onSelect(user.id)}>Select User</button>
    </div>
  );
};
```

### 2. Event Handling

- Use proper event handler typing
- Implement accessibility features

```tsx
export const SearchInput = ({ onSearch, placeholder }: SearchInputProps) => {
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

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search-input">Search Users</label>
      <input
        id="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Search users by name"
      />
      <button type="submit">Search</button>
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

### 1. Hook Composition

- Keep hooks focused and composable
- Return objects with clear naming
- Handle loading and error states

```tsx
export const useUserData = (userId: string) => {
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery(userQueries.getById(userId));

  const { data: permissions, isLoading: isPermissionsLoading } = useQuery(userQueries.getPermissions(userId), {
    enabled: !!user,
  });

  return {
    user,
    permissions,
    isLoading: isUserLoading || isPermissionsLoading,
    isError: isUserError,
  };
};
```

### 2. Custom Hook Testing

Write comprehensive tests for custom hooks:

```tsx
// useUserData.test.tsx
describe('useUserData', () => {
  test('returns user data when loaded', async () => {
    const mockUser = { id: '1', name: 'John Doe' };
    mockApiResponse(mockUser, 'get');

    const { result } = renderHook(() => useUserData('1'), {
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
});
```

## Testing Patterns

### 1. Component Testing

Follow Testing Library best practices:

```tsx
// Component.test.tsx
describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  test('renders user information correctly', () => {
    const handleSelect = vi.fn();

    render(<UserCard user={mockUser} onSelect={handleSelect} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select user/i })).toBeInTheDocument();
  });

  test('calls onSelect when button is clicked', async () => {
    const handleSelect = vi.fn();

    render(<UserCard user={mockUser} onSelect={handleSelect} />);

    await userEvent.click(screen.getByRole('button', { name: /select user/i }));

    expect(handleSelect).toHaveBeenCalledWith('1');
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
```

### ✅ Do these instead:

```tsx
// ✅ Good - Named exports
export const Component = () => {};

// ✅ Good - Explicit props
<Component prop1={value1} prop2={value2} />

// ✅ Good - Proper typing
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {};

// ✅ Good - CSS classes
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
```

## Summary

Always prioritize:

1. **Type Safety** - Comprehensive TypeScript usage
2. **Component Composition** - Small, focused, reusable components
3. **Testing** - Comprehensive test coverage with Testing Library
4. **Accessibility** - WCAG compliant interfaces
5. **Performance** - Proper memoization and code splitting
6. **Code Organization** - Consistent file structure and naming
7. **Error Handling** - Robust error boundaries and loading states

Follow these patterns to maintain consistency with the existing codebase and React 19 best practices.
