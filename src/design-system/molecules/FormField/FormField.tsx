import * as React from 'react';

import { FormFieldProps } from './FormField.types';

import { cn } from '@/lib/utils';
import { Label } from '@/design-system/atoms/Label';
import { Input } from '@/design-system/atoms/Input';

/**
 * FormField molecule component that composes Label and Input atoms
 *
 * A reusable form field component that combines label, input, and error handling
 * into a cohesive form element. Follows atomic design principles by composing
 * atoms into a functional molecule.
 *
 * Features:
 * - Accessible form field with proper labeling and error announcements
 * - Visual error states with design system colors
 * - Required field indicators with asterisk
 * - React Hook Form integration support via forwardRef
 * - Controlled and uncontrolled modes
 * - Responsive design with consistent spacing
 *
 * @example
 * // Basic usage
 * <FormField
 *   name="email"
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 * />
 *
 * @example
 * // With error state
 * <FormField
 *   name="password"
 *   label="Password"
 *   type="password"
 *   required
 *   error="Password must be at least 8 characters"
 * />
 *
 * @example
 * // React Hook Form integration
 * const { register } = useForm();
 * <FormField
 *   {...register('username')}
 *   label="Username"
 *   error={errors.username?.message}
 * />
 */
export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ name, label, error, required, className, 'data-testid': dataTestId, ...inputProps }, ref) => {
    // Generate unique IDs for accessibility
    const errorId = error ? `${name}-error` : undefined;
    const hasError = !!error;

    return (
      <div className={cn('space-y-2', className)}>
        {/* Label with required indicator */}
        <Label htmlFor={name} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
          {label}
        </Label>

        {/* Input with error states */}
        <Input
          ref={ref}
          id={name}
          name={name}
          aria-describedby={errorId}
          aria-invalid={hasError}
          className={cn(hasError && 'border-destructive focus-visible:ring-destructive/50')}
          {...(dataTestId && { 'data-testid': dataTestId })}
          {...inputProps}
        />

        {/* Error message with accessibility */}
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert" aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = 'FormField';
