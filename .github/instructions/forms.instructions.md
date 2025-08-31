---
applyTo: '**/forms/**/*.{tsx,ts}, **/organisms/**/*Form*.{tsx,ts}, **/molecules/**/*Field*.{tsx,ts}, **/atoms/**/*Input*.{tsx,ts}'
description: 'Form management with TanStack Form: typed, performant, headless form state for React applications with Zod validation'
---

# Forms — TanStack Form + Zod Validation

## Context
Use TanStack Form (`@tanstack/react-form`) as the single form management solution for all forms in this React application. TanStack Form provides headless, performant, type-safe form state management with excellent validation integration.

**Required:** All forms MUST use `@tanstack/react-form`. Do not use React Hook Form, Formik, or other form libraries.

Related:
- React fundamentals: `./react-core.instructions.md`
- Atomic Design: `./atomic-design.instructions.md`
- Validation with Zod schemas: use `zod` for form validation
- TypeScript patterns: maintain strict typing throughout forms
- Testing: `./testing.instructions.md` for form testing patterns

## Core Principles

1. **TanStack Form Only**: Use `@tanstack/react-form` for all form state management
2. **Zod Validation**: Use Zod schemas for form validation and type inference
3. **Atomic Design Alignment**: Forms respect atomic boundaries (atoms → molecules → organisms)
4. **Type Safety**: Leverage TypeScript and TanStack Form's type inference
5. **Performance**: Use TanStack Form's optimized rendering and field isolation
6. **Accessibility**: Ensure proper ARIA attributes, labels, and error announcements

## Basic Form Setup

### Simple Form with Validation

```tsx
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
});

type UserFormData = z.infer<typeof userSchema>;

export const UserForm = ({ onSubmit }: { onSubmit: (data: UserFormData) => void }) => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    } as UserFormData,
    validators: {
      onChange: userSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <div>
            <label htmlFor={field.name}>Email</label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
            />
            {field.state.meta.errors.length > 0 && (
              <div id={`${field.name}-error`} role="alert">
                {field.state.meta.errorMap.onChange}
              </div>
            )}
          </div>
        )}
      </form.Field>

      <button type="submit" disabled={form.state.isSubmitting}>
        {form.state.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};
```

## Atomic Design Integration

### Form Field Molecule

Create reusable form field molecules that work with TanStack Form:

```tsx
// molecules/FormField/FormField.tsx
type FormFieldProps = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  'data-testid'?: string;
};

export const FormField = ({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required,
  autoComplete,
  'data-testid': testId,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className={`text-sm font-medium ${required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ''}`}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        autoComplete={autoComplete}
        data-testid={testId}
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-destructive' : 'border-input'}`}
      />
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
};
```

### Login Form Organism

Use molecules in form organisms:

```tsx
// organisms/LoginForm/LoginForm.tsx
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { FormField } from '@/design-system/molecules/FormField';
import { Button } from '@/design-system/atoms/Button';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = ({ onSuccess, className }: LoginFormProps) => {
  const { login, isAuthenticating } = useAuth();
  const [loginError, setLoginError] = useState<string>('');

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginFormData,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setLoginError('');
      try {
        await login({ username: value.email, password: value.password });
        onSuccess?.();
      } catch {
        setLoginError('Invalid email or password. Please try again.');
      }
    },
  });

  const getErrorMessage = (errorMap: any) => {
    if (Array.isArray(errorMap) && errorMap.length > 0) {
      return errorMap[0]?.message || 'Invalid input';
    }
    return undefined;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={className}
      noValidate
    >
      <div className="space-y-4">
        <form.Field name="email">
          {(field) => (
            <FormField
              name={field.name}
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={getErrorMessage(field.state.meta.errorMap.onChange)}
              required
              autoComplete="email"
              data-testid="login-email"
            />
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <FormField
              name={field.name}
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={getErrorMessage(field.state.meta.errorMap.onChange)}
              required
              autoComplete="current-password"
              data-testid="login-password"
            />
          )}
        </form.Field>

        {loginError && (
          <div className="text-sm text-destructive" role="alert" data-testid="login-error">
            {loginError}
          </div>
        )}

        <Button
          type="submit"
          disabled={isAuthenticating || form.state.isSubmitting}
          className="w-full"
          data-testid="login-submit"
        >
          {isAuthenticating || form.state.isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
};
```

## Advanced Patterns

### Array Fields Management

```tsx
const form = useForm({
  defaultValues: {
    items: [{ name: '', description: '' }],
  },
  onSubmit: async ({ value }) => console.log(value),
});

return (
  <form.Field name="items" mode="array">
    {(itemsField) => (
      <div>
        <h3>Items</h3>
        {itemsField.state.value.length === 0 ? (
          <p>No items added.</p>
        ) : (
          itemsField.state.value.map((_, i) => (
            <div key={i} className="border p-4 mb-2">
              <form.Field name={`items[${i}].name`}>
                {(field) => (
                  <FormField
                    name={field.name}
                    label="Name"
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={getErrorMessage(field.state.meta.errorMap.onChange)}
                  />
                )}
              </form.Field>

              <button
                type="button"
                onClick={() => itemsField.removeValue(i)}
                className="mt-2 text-destructive"
              >
                Remove Item
              </button>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={() => itemsField.pushValue({ name: '', description: '' })}
          className="mt-2"
        >
          Add Item
        </button>
      </div>
    )}
  </form.Field>
);
```

### Custom Field Validators

```tsx
const form = useForm({
  defaultValues: { username: '' },
  validators: {
    onChange: z.object({
      username: z.string().min(3, 'Username must be at least 3 characters'),
    }),
  },
});

// Field-level validation
<form.Field
  name="username"
  validators={{
    onChange: ({ value }) =>
      value.includes('@') ? 'Username cannot contain @ symbol' : undefined,
    onBlur: ({ value }) =>
      value.length < 3 ? 'Username too short' : undefined,
  }}
>
  {(field) => (
    <FormField
      name={field.name}
      label="Username"
      value={field.state.value}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
      error={getErrorMessage(field.state.meta.errorMap.onChange)}
    />
  )}
</form.Field>
```

### Async Validation

```tsx
const checkUsernameAvailable = async (username: string) => {
  const response = await fetch(`/api/users/check?username=${username}`);
  return response.ok;
};

<form.Field
  name="username"
  validators={{
    onChangeAsync: async ({ value }) => {
      if (value.length < 3) return 'Username too short';
      const isAvailable = await checkUsernameAvailable(value);
      return isAvailable ? undefined : 'Username is already taken';
    },
  }}
>
  {(field) => (
    <FormField
      name={field.name}
      label="Username"
      value={field.state.value}
      onChange={field.handleChange}
      onBlur={field.handleBlur}
      error={getErrorMessage(field.state.meta.errorMap.onChangeAsync)}
    />
  )}
</form.Field>
```

## Error Handling Patterns

### Handling Zod Validation Errors

```tsx
const getFieldError = (field: any) => {
  const error = field.state.meta.errorMap.onChange;
  if (Array.isArray(error) && error.length > 0) {
    // Zod returns array of StandardSchemaV1Issue objects
    return error[0]?.message || 'Invalid input';
  }
  return undefined;
};
```

### Form-Level Error Handling

```tsx
const form = useForm({
  // ... other options
  onSubmit: async ({ value }) => {
    try {
      await submitForm(value);
    } catch (error) {
      // Handle submission errors
      setSubmissionError('An error occurred while submitting the form');
      throw error; // Re-throw to let TanStack Form handle it
    }
  },
});
```

## Testing Patterns

### Testing Form Components

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('validates email format and shows error message', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSuccess={vi.fn()} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = vi.fn();

    render(<LoginForm onSuccess={mockOnSuccess} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
```

## Performance Optimization

### Field Isolation
TanStack Form automatically isolates field updates to prevent unnecessary re-renders. Each field only re-renders when its own state changes.

### Optimizing Large Forms
```tsx
// Use mode="array" for dynamic lists
<form.Field name="items" mode="array">
  {(field) => (
    // Only this field re-renders when items change
    <ItemsList field={field} />
  )}
</form.Field>

// Use validators object for consistent validation
const validators = useMemo(() => ({
  onChange: schema,
}), []);

const form = useForm({
  validators,
  // ... other options
});
```

## Best Practices

1. **Use Zod schemas** for validation and type inference
2. **Leverage field isolation** - each field manages its own state
3. **Handle errors gracefully** with proper ARIA attributes
4. **Provide loading states** during form submission
5. **Use semantic HTML** with proper labels and form structure
6. **Test form flows** including validation, submission, and error states
7. **Keep forms accessible** with proper ARIA attributes and announcements

## Anti-patterns (Avoid)

```tsx
// ❌ Don't use React Hook Form
import { useForm } from 'react-hook-form';

// ❌ Don't use Formik
import { Formik } from 'formik';

// ❌ Don't manage form state manually with useState
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// ❌ Don't duplicate form values in component state
const [formData, setFormData] = useState(form.state.values);

// ❌ Don't bypass TanStack Form validation
const handleSubmit = (e) => {
  e.preventDefault();
  // Custom validation logic here - use TanStack Form validators instead
};
```

## Migration from React Hook Form

If migrating from React Hook Form:

1. Replace `useForm` from `react-hook-form` with `@tanstack/react-form`
2. Replace `register()` pattern with `form.Field` render props
3. Replace `handleSubmit(onSubmit)` with `form.handleSubmit()`
4. Replace `errors` object with `field.state.meta.errorMap`
5. Replace `resolver: zodResolver(schema)` with `validators: { onChange: schema }`
6. Update error handling to work with TanStack Form's error format

## Integration Points

- **Atomic Design**: Forms respect atomic boundaries (atoms → molecules → organisms)
- **TypeScript**: Full type safety with TanStack Form's type inference
- **Validation**: Use Zod schemas for consistent validation
- **Testing**: Test with Testing Library and user interactions
- **Accessibility**: Ensure proper ARIA attributes and semantic HTML

## Summary

Use `@tanstack/react-form` exclusively for form management. Leverage Zod validation, maintain atomic design principles, ensure accessibility, and test thoroughly. TanStack Form provides excellent performance, type safety, and developer experience for all form needs in this React application.
