import { type VariantProps } from 'class-variance-authority';

import { avatarVariants } from './Avatar';

/**
 * Avatar component props with user information and customization options.
 * Supports both image display and initials fallback with multiple sizes.
 */
export type AvatarProps = {
  /** First name for initials generation */
  firstName?: string;
  /** Last name for initials generation */
  lastName?: string;
  /** Image source URL */
  src?: string;
  /** Alt text for the image (auto-generated if not provided) */
  alt?: string;
  /** Additional CSS classes */
  className?: string;
} & VariantProps<typeof avatarVariants>;
