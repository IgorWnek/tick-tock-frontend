import React, { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { ProfileFormProps, PersonalInfoFormData, PasswordChangeFormData, MessageState } from './ProfileForm.types';

import { useAuth, useMutation } from '@/hooks';
import { FormField } from '@/design-system/molecules/FormField';
import { Button } from '@/design-system/atoms/Button';
import { cn } from '@/lib/utils';
import { ProfileUpdateResponse, PasswordUpdateResponse } from '@/api/actions/auth/auth.types';

// Validation schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or less'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or less'),
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format')
    .max(100, 'Email must be 100 characters or less'),
});

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password must be 128 characters or less'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

/**
 * ProfileForm organism component
 *
 * A comprehensive profile management form that orchestrates FormField molecules
 * to create a complete profile editing interface. Follows atomic design principles
 * by composing molecules and atoms into a functional organism.
 *
 * Features:
 * - Two separate form sections: Personal Information and Password Change
 * - TanStack Form integration with Zod validation
 * - Real-time form validation with immediate feedback
 * - Loading states during API operations
 * - Success and error message handling
 * - Dirty state detection to prevent accidental navigation
 * - Responsive design with mobile-first approach
 * - Comprehensive accessibility with ARIA attributes
 *
 * @example
 * ```tsx
 * <ProfileForm
 *   onProfileUpdate={() => console.log('Profile updated')}
 *   onPasswordUpdate={() => console.log('Password updated')}
 *   onCancel={() => navigate('/dashboard')}
 * />
 * ```
 */
export const ProfileForm = ({
  className,
  'data-testid': dataTestId = 'profile-form',
  onProfileUpdate,
  onPasswordUpdate,
  onCancel,
}: ProfileFormProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageState>({});

  // Profile update mutation
  const updateProfile = useMutation('updateProfile', {
    onSuccess: (data: ProfileUpdateResponse) => {
      setMessages((prev) => ({
        ...prev,
        personalInfoMessage: data.message || 'Profile updated successfully',
        personalInfoError: undefined,
      }));
      personalInfoForm.reset();
      onProfileUpdate?.();
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      setMessages((prev) => ({
        ...prev,
        personalInfoError: error.response?.data?.error || 'Failed to update profile',
        personalInfoMessage: undefined,
      }));
    },
  });

  // Password update mutation
  const updatePassword = useMutation('updatePassword', {
    onSuccess: (data: PasswordUpdateResponse) => {
      setMessages((prev) => ({
        ...prev,
        passwordMessage: data.message || 'Password updated successfully',
        passwordError: undefined,
      }));
      passwordForm.reset();
      onPasswordUpdate?.();
    },
    onError: (error: { response?: { data?: { error?: string } } }) => {
      setMessages((prev) => ({
        ...prev,
        passwordError: error.response?.data?.error || 'Failed to update password',
        passwordMessage: undefined,
      }));
    },
  });

  // Personal Information Form
  const personalInfoForm = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    } as PersonalInfoFormData,
    validators: {
      onChange: personalInfoSchema,
    },
    onSubmit: async ({ value }) => {
      // Clear previous messages
      setMessages((prev) => ({
        ...prev,
        personalInfoMessage: undefined,
        personalInfoError: undefined,
      }));

      await updateProfile.mutateAsync(value);
    },
  });

  // Password Change Form
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    } as PasswordChangeFormData,
    validators: {
      onChange: passwordChangeSchema,
    },
    onSubmit: async ({ value }) => {
      // Clear previous messages
      setMessages((prev) => ({
        ...prev,
        passwordMessage: undefined,
        passwordError: undefined,
      }));

      await updatePassword.mutateAsync(value);
    },
  });

  // Update form defaults when user data changes
  useEffect(() => {
    if (user) {
      personalInfoForm.setFieldValue('firstName', user.firstName || '');
      personalInfoForm.setFieldValue('lastName', user.lastName || '');
      personalInfoForm.setFieldValue('email', user.email || '');
    }
  }, [user, personalInfoForm]);

  // Dirty state detection
  const isPersonalInfoDirty = personalInfoForm.state.isDirty;
  const isPasswordDirty = passwordForm.state.isDirty;
  const hasUnsavedChanges = isPersonalInfoDirty || isPasswordDirty;

  // Handle cancel with unsaved changes warning
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }

    personalInfoForm.reset();
    passwordForm.reset();
    setMessages({});
    onCancel?.();
  };

  return (
    <div className={cn('space-y-8', className)} data-testid={dataTestId}>
      {/* Personal Information Section */}
      <section className="space-y-6" aria-labelledby="personal-info-heading">
        <div className="space-y-2">
          <h2 id="personal-info-heading" className="text-lg font-semibold">
            Personal Information
          </h2>
          <p className="text-sm text-muted-foreground">Update your profile information and email address.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            personalInfoForm.handleSubmit();
          }}
          className="space-y-4"
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <personalInfoForm.Field name="firstName">
              {(field) => {
                // Handle Zod validation errors
                const getErrorMessage = () => {
                  const error = field.state.meta.errorMap.onChange;
                  if (Array.isArray(error) && error.length > 0) {
                    return error[0]?.message || 'Invalid first name';
                  }
                  return undefined;
                };

                return (
                  <FormField
                    name={field.name}
                    label="First Name"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={getErrorMessage()}
                    required
                    autoComplete="given-name"
                    data-testid="personal-info-first-name"
                  />
                );
              }}
            </personalInfoForm.Field>

            <personalInfoForm.Field name="lastName">
              {(field) => {
                // Handle Zod validation errors
                const getErrorMessage = () => {
                  const error = field.state.meta.errorMap.onChange;
                  if (Array.isArray(error) && error.length > 0) {
                    return error[0]?.message || 'Invalid last name';
                  }
                  return undefined;
                };

                return (
                  <FormField
                    name={field.name}
                    label="Last Name"
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={getErrorMessage()}
                    required
                    autoComplete="family-name"
                    data-testid="personal-info-last-name"
                  />
                );
              }}
            </personalInfoForm.Field>
          </div>

          <personalInfoForm.Field name="email">
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
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={getErrorMessage()}
                  required
                  autoComplete="email"
                  data-testid="personal-info-email"
                />
              );
            }}
          </personalInfoForm.Field>

          {/* Success/Error Messages */}
          {messages.personalInfoMessage && (
            <output
              className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3 block"
              aria-live="polite"
              data-testid="personal-info-success"
            >
              {messages.personalInfoMessage}
            </output>
          )}

          {messages.personalInfoError && (
            <div
              className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3"
              role="alert"
              aria-live="assertive"
              data-testid="personal-info-error"
            >
              {messages.personalInfoError}
            </div>
          )}

          {/* Personal Info Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                personalInfoForm.reset();
                setMessages((prev) => ({
                  ...prev,
                  personalInfoMessage: undefined,
                  personalInfoError: undefined,
                }));
              }}
              disabled={!isPersonalInfoDirty || updateProfile.isPending}
              data-testid="personal-info-cancel"
            >
              Reset Changes
            </Button>
            <Button
              type="submit"
              disabled={!personalInfoForm.state.canSubmit || updateProfile.isPending}
              data-testid="personal-info-save"
            >
              {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </section>

      {/* Divider */}
      <hr className="border-border" />

      {/* Password Change Section */}
      <section className="space-y-6" aria-labelledby="password-heading">
        <div className="space-y-4 p-4 sm:p-6 bg-muted/10 rounded-lg border border-border/50">
          <div className="space-y-2">
            <h2 id="password-heading" className="text-lg font-semibold">
              Change Password
            </h2>
            <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              passwordForm.handleSubmit();
            }}
            className="space-y-4"
            noValidate
          >
            <passwordForm.Field name="currentPassword">
              {(field) => {
                // Handle Zod validation errors
                const getErrorMessage = () => {
                  const error = field.state.meta.errorMap.onChange;
                  if (Array.isArray(error) && error.length > 0) {
                    return error[0]?.message || 'Invalid current password';
                  }
                  return undefined;
                };

                return (
                  <FormField
                    name={field.name}
                    label="Current Password"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={getErrorMessage()}
                    required
                    autoComplete="current-password"
                    data-testid="password-current"
                  />
                );
              }}
            </passwordForm.Field>

            <passwordForm.Field name="newPassword">
              {(field) => {
                // Handle Zod validation errors
                const getErrorMessage = () => {
                  const error = field.state.meta.errorMap.onChange;
                  if (Array.isArray(error) && error.length > 0) {
                    return error[0]?.message || 'Invalid new password';
                  }
                  return undefined;
                };

                return (
                  <FormField
                    name={field.name}
                    label="New Password"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={getErrorMessage()}
                    required
                    autoComplete="new-password"
                    data-testid="password-new"
                  />
                );
              }}
            </passwordForm.Field>

            <passwordForm.Field name="confirmPassword">
              {(field) => {
                // Handle Zod validation errors
                const getErrorMessage = () => {
                  const error = field.state.meta.errorMap.onChange;
                  if (Array.isArray(error) && error.length > 0) {
                    return error[0]?.message || 'Invalid password confirmation';
                  }
                  return undefined;
                };

                return (
                  <FormField
                    name={field.name}
                    label="Confirm New Password"
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    error={getErrorMessage()}
                    required
                    autoComplete="new-password"
                    data-testid="password-confirm"
                  />
                );
              }}
            </passwordForm.Field>

            {/* Success/Error Messages */}
            {messages.passwordMessage && (
              <output
                className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3 block"
                aria-live="polite"
                data-testid="password-success"
              >
                {messages.passwordMessage}
              </output>
            )}

            {messages.passwordError && (
              <div
                className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3"
                role="alert"
                aria-live="assertive"
                data-testid="password-error"
              >
                {messages.passwordError}
              </div>
            )}

            {/* Password Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  passwordForm.reset();
                  setMessages((prev) => ({
                    ...prev,
                    passwordMessage: undefined,
                    passwordError: undefined,
                  }));
                }}
                disabled={!isPasswordDirty || updatePassword.isPending}
                data-testid="password-cancel"
              >
                Reset Changes
              </Button>
              <Button
                type="submit"
                disabled={!passwordForm.state.canSubmit || updatePassword.isPending}
                data-testid="password-save"
              >
                {updatePassword.isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Global Actions */}
      {onCancel && (
        <>
          <hr className="border-border" />
          <div className="flex justify-between items-center">
            {hasUnsavedChanges && (
              <output className="text-sm text-amber-600" aria-live="polite">
                ⚠️ You have unsaved changes
              </output>
            )}
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="ml-auto"
              data-testid="profile-form-cancel"
            >
              Cancel & Return
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

ProfileForm.displayName = 'ProfileForm';
