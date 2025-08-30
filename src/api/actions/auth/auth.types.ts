export type LoginMutationArguments = {
  username: string;
  password: string;
};

export type LoginMutationResponse = {
  accessToken: string;
  tokenType: string;
  expires: number;
  refreshToken: string;
};

export type GetMeQueryResponse = {
  id: string; // Add id field
  firstName: string;
  lastName: string;
  username: string;
  email: string; // Add email field
};

export type User = {
  id: string;
  name: string;
};

export type GetUsersResponse = {
  users: User[];
  nextPage?: number | null;
};

export type GetUsersInfiniteArgs = {
  count?: string;
};

export type GetUsersListArgs = {
  page?: string;
};

export type RefreshTokenMutationResponse = {
  accessToken: string;
  refreshToken: string;
};

// Profile Management Types

/**
 * Arguments for updating user profile information
 * All fields are optional to support partial updates
 */
export type UpdateProfileMutationArguments = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

/**
 * Arguments for updating user password
 * Requires current password for security validation
 */
export type UpdatePasswordMutationArguments = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * Response type for successful profile updates
 */
export type ProfileUpdateResponse = {
  success: boolean;
  message: string;
  user?: GetMeQueryResponse;
};

/**
 * Response type for successful password updates
 */
export type PasswordUpdateResponse = {
  success: boolean;
  message: string;
};

// Error Response Types

/**
 * Standard error response format for authentication operations
 */
export type AuthErrorResponse = {
  error: string;
  message?: string;
  statusCode?: number;
};

// API_ACTION_TYPES
