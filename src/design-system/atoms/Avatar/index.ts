/**
 * Avatar Atom Component
 *
 * A versatile avatar component that displays user profile images with
 * intelligent fallback to initials. Supports multiple sizes and handles
 * edge cases gracefully.
 *
 * @example
 * ```tsx
 * import { Avatar } from '@/design-system/atoms/Avatar';
 *
 * <Avatar firstName="John" lastName="Doe" size="lg" />
 * <Avatar src="/profile.jpg" alt="User profile" />
 * ```
 */

export { Avatar, avatarVariants } from './Avatar';
export type { AvatarProps } from './Avatar.types';
