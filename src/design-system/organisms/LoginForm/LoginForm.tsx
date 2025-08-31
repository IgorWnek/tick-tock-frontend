import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { LoginFormProps } from './LoginForm.types';

import { useAuth } from '@/hooks';
import { FormField } from '@/design-system/molecules/FormField';
import { Button } from '@/design-system/atoms/Button';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * LoginForm organism component
 *
 * A complete login form that orchestrates FormField molecules with authentication logic.
 * Follows atomic design principles by composing molecules and atoms into a functional organism.
 *
 * Features:
 * - TanStack Form integration with Zod validation
 * - Real-time form validation with immediate feedback
 * - Loading states during authentication
 * - API error message display
 * - Accessibility with proper ARIA attributes
 * - Password manager support with autocomplete
 * - Keyboard navigation support
 *
 * @example
 * // Basic usage
 * <LoginForm onSuccess={() => navigate('/dashboard')} />
 *
 * @example
 * // With custom styling
 * <LoginForm
 *   className="max-w-md mx-auto"
 *   onSuccess={() => console.log('Login successful')}
 * />
 */
export const LoginForm = ({ onSuccess, className }: LoginFormProps) => {
  const { login, isAuthenticating } = useAuth();
  const [loginError, setLoginError] = useState<string>('');

  const handleLogin = async (credentials: { username: string; password: string }) => {
    setLoginError('');
    try {
      // Type assertion to handle the mismatch between types and runtime behavior
      const loginFn = login as unknown as (credentials: { username: string; password: string }) => Promise<unknown>;
      await loginFn(credentials);
      onSuccess?.();
    } catch {
      // Always show a consistent user-friendly error message for login failures
      // Don't expose internal error details to users for security reasons
      setLoginError('Invalid email or password. Please try again.');
    }
  };

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginFormData,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      await handleLogin({ username: value.email, password: value.password });
    },
  });

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
          {(field) => {
            // Handle Zod validation errors
            const getErrorMessage = () => {
              const error = field.state.meta.errorMap.onChange;
              if (Array.isArray(error) && error.length > 0) {
                return error[0]?.message || 'Invalid email';
              }
              return undefined;
            };

            return (
              <FormField
                name={field.name}
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={getErrorMessage()}
                required
                autoComplete="email"
                data-testid="login-email"
              />
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            // Handle Zod validation errors
            const getErrorMessage = () => {
              const error = field.state.meta.errorMap.onChange;
              if (Array.isArray(error) && error.length > 0) {
                return error[0]?.message || 'Invalid password';
              }
              return undefined;
            };

            return (
              <FormField
                name={field.name}
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                error={getErrorMessage()}
                required
                autoComplete="current-password"
                data-testid="login-password"
              />
            );
          }}
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
