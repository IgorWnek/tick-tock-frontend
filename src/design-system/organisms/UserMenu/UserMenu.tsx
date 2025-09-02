import { UserIcon, LogOutIcon } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../molecules/DropdownMenu';
import { UserInfo } from '../../molecules/UserInfo';

import type { UserMenuProps } from './UserMenu.types';

/**
 * UserMenu Organism - User dropdown menu for the header
 *
 * Features:
 * - Shows user's avatar and info as trigger
 * - Dropdown menu with user email, profile link, and logout
 * - Integrates with useAuth hook for user data and logout
 * - Mobile-friendly with proper touch targets
 * - Keyboard navigation support
 * - Accessible with proper ARIA attributes
 */
export const UserMenu = ({ className, 'data-testid': testId }: UserMenuProps) => {
  const { user, logout, isAuthenticated } = useAuth();

  // Don't render if user is not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    // Profile navigation will be implemented in Task 6.3
    // For now, this is a placeholder that can be expanded later
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center rounded-md p-2 transition-colors',
            'hover:bg-accent focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            className,
          )}
          aria-label={`Open menu for ${user.firstName} ${user.lastName}`}
          data-testid={testId}
        >
          <UserInfo
            user={user}
            layout="horizontal"
            size="sm"
            avatarSize="sm"
            showEmail={false} // Don't show email in trigger to keep it compact
            className="pointer-events-none" // Prevent nested interaction
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        align="end"
        sideOffset={5}
        data-testid={testId ? `${testId}-content` : undefined}
      >
        {/* User email - read-only, disabled item */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Profile link - future: navigate to profile page */}
        <DropdownMenuItem
          onClick={handleProfileClick}
          className="cursor-pointer"
          data-testid={testId ? `${testId}-profile` : undefined}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout button - functional */}
        <DropdownMenuItem
          onClick={handleLogout}
          variant="destructive"
          className="cursor-pointer"
          data-testid={testId ? `${testId}-logout` : undefined}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
