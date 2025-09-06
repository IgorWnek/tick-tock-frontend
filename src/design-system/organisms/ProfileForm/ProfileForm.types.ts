/**
 * ProfileForm organism props for managing user profile information
 * Orchestrates FormField molecules to create a complete profile management interface
 */
export type ProfileFormProps = {
  /** Additional CSS classes for the form container */
  className?: string;
  /** Test ID for testing purposes */
  'data-testid'?: string;
  /** Callback for successful profile updates */
  onProfileUpdate?: () => void;
  /** Callback for successful password updates */
  onPasswordUpdate?: () => void;
  /** Callback for form cancellation */
  onCancel?: () => void;
};

/**
 * Personal information form data schema
 */
export type PersonalInfoFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

/**
 * Password change form data schema
 */
export type PasswordChangeFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * Form states for tracking user interaction
 */
export type FormState = {
  isPersonalInfoDirty: boolean;
  isPasswordDirty: boolean;
  hasUnsavedChanges: boolean;
};

/**
 * Success/error message state
 */
export type MessageState = {
  personalInfoMessage?: string;
  passwordMessage?: string;
  personalInfoError?: string;
  passwordError?: string;
};
