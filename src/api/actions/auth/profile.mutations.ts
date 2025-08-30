import { AxiosInstance } from 'axios';

import {
  UpdateProfileMutationArguments,
  UpdatePasswordMutationArguments,
  ProfileUpdateResponse,
  PasswordUpdateResponse,
} from './auth.types';

/**
 * Profile management mutations for user profile operations
 * These mutations handle updating user profile information and password changes
 */

/**
 * Update user profile information (firstName, lastName, email)
 * Supports partial updates - only provided fields will be updated
 */
const updateProfile = (client: AxiosInstance) => async (body: UpdateProfileMutationArguments) => {
  return (await client.patch<ProfileUpdateResponse>('/me', body)).data;
};

/**
 * Update user password
 * Requires current password for security validation
 */
const updatePassword = (client: AxiosInstance) => async (body: UpdatePasswordMutationArguments) => {
  return (await client.patch<PasswordUpdateResponse>('/me/password', body)).data;
};

export const profileMutations = {
  updateProfile,
  updatePassword,
};
