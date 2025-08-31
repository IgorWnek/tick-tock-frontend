import * as React from 'react';

import { type AvatarProps } from '@/design-system/atoms/Avatar/Avatar';
import { type GetMeQueryResponse, type User } from '@/api/actions/auth/auth.types';

/**
 * User data that can be displayed in UserInfo
 * Supports both simple user (id, name) and detailed profile (firstName, lastName, email)
 */
export type UserInfoUser = User | GetMeQueryResponse;

/**
 * Base UserInfo props without interaction handlers
 */
type BaseUserInfoProps = {
  /** User data to display */
  user: UserInfoUser;
  /** Layout orientation for the user info display */
  layout?: 'horizontal' | 'vertical';
  /** Size variant for the overall component */
  size?: 'sm' | 'md' | 'lg';
  /** Avatar size variant */
  avatarSize?: AvatarProps['size'];
  /** Whether to show the email address (if available) */
  showEmail?: boolean;
  /** Whether to truncate long text */
  truncateText?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Test identifier */
  'data-testid'?: string;
};

/**
 * UserInfo as a non-interactive div
 */
type NonInteractiveUserInfoProps = BaseUserInfoProps & {
  onClick?: never;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>;

/**
 * UserInfo as an interactive button
 */
type InteractiveUserInfoProps = BaseUserInfoProps & {
  /** Click handler for interactive mode */
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'>;

/**
 * UserInfo molecule props for displaying user information with avatar
 * Supports horizontal and vertical layouts with optional interactive behavior
 */
export type UserInfoProps = NonInteractiveUserInfoProps | InteractiveUserInfoProps;

/**
 * Internal props for managing text display and accessibility
 */
export type UserInfoInternalProps = {
  /** Computed display name from firstName and lastName */
  displayName: string;
  /** Whether the component has any content to display */
  hasContent: boolean;
  /** Whether interactive keyboard/mouse handlers should be applied */
  shouldBeInteractive: boolean;
};
