/**
 * Atomic Design System - Atoms
 *
 * Atoms are the basic building blocks of matter. Applied to web interfaces,
 * atoms are our HTML tags, such as a form label, an input or a button.
 *
 * Each atom should be completely self-contained and not depend on other
 * components except for design tokens and utilities.
 */

// Button atom exports
export { Button, buttonVariants } from './Button';
export type { ButtonProps } from './Button/Button.types';

// Input atom exports
export { Input } from './Input';
export type { InputProps } from './Input/Input.types';

// Label atom exports
export { Label } from './Label';
export type { LabelProps } from './Label/Label.types';

// Avatar atom exports
export { Avatar, avatarVariants } from './Avatar';
export type { AvatarProps } from './Avatar/Avatar.types';

// Note: Exports are commented out until components are implemented
// This prevents TypeScript compilation errors during development
