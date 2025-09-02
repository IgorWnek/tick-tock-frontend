/**
 * Atomic Design System - Molecules
 *
 * Molecules are groups of atoms bonded together and are the smallest
 * fundamental units of a compound. In interfaces, molecules are relatively
 * simple groups of UI elements functioning together as a unit.
 *
 * Molecules should compose 2-3 atoms and may contain simple local state
 * but should not perform data fetching operations.
 */

// FormField molecule exports
export { FormField } from './FormField';
export type { FormFieldProps } from './FormField/FormField.types';

// UserInfo molecule exports
export { UserInfo } from './UserInfo';
export type { UserInfoProps, UserInfoUser } from './UserInfo/UserInfo.types';

// DropdownMenu molecule exports
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './DropdownMenu';
export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
} from './DropdownMenu/DropdownMenu.types';

// Note: Exports are commented out until components are implemented
// This prevents TypeScript compilation errors during development
