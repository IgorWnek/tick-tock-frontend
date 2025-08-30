import * as React from 'react';

/**
 * FormField molecule props for composing Label and Input atoms
 * Supports React Hook Form integration and comprehensive form validation
 */
export type FormFieldProps = {
  /** Unique field identifier, used for htmlFor, id, and name attributes */
  name: string;
  /** Visible label text displayed above the input */
  label: string;
  /** Input type - supports common form input types */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'search';
  /** Placeholder text shown when input is empty */
  placeholder?: string;
  /** Controlled value for controlled components */
  value?: string;
  /** Default value for uncontrolled components */
  defaultValue?: string;
  /** Error message to display below the input */
  error?: string;
  /** Whether the field is required (shows asterisk) */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
  /** Change event handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Blur event handler */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type' | 'onChange' | 'onBlur' | 'data-testid'>;

/**
 * Internal props for managing accessibility and error states
 */
export type FormFieldInternalProps = {
  /** Generated error ID for aria-describedby */
  errorId?: string;
  /** Whether the field has an error state */
  hasError: boolean;
};
