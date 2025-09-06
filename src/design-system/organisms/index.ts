/**
 * Atomic Design System - Organisms
 *
 * Organisms are groups of molecules joined together to form a relatively
 * complex, distinct section of an interface. Organisms can contain data
 * fetching logic and complex business logic.
 *
 * Organisms orchestrate molecules and atoms to create complete sections
 * of functionality, such as forms, menus, and content areas.
 */

// LoginForm organism exports
export { LoginForm } from './LoginForm';
export type { LoginFormProps } from './LoginForm/LoginForm.types';

// UserMenu organism exports
export { UserMenu } from './UserMenu';
export type { UserMenuProps } from './UserMenu/UserMenu.types';

// ProfileForm organism exports
export { ProfileForm } from './ProfileForm';
export type { ProfileFormProps } from './ProfileForm/ProfileForm.types';

// Note: Exports are commented out until components are implemented
// This prevents TypeScript compilation errors during development
