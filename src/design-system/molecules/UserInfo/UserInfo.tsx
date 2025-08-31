import { cva } from 'class-variance-authority';

import { cn } from '../../../lib/utils';
import { Avatar } from '../../atoms/Avatar';

import type { UserInfoProps } from './UserInfo.types';

const userInfoVariants = cva(
  'flex items-center', // Base classes
  {
    variants: {
      layout: {
        horizontal: 'flex-row gap-3',
        vertical: 'flex-col gap-2 text-center',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      layout: 'horizontal',
      size: 'md',
    },
  },
);

const textContentVariants = cva(
  'min-w-0', // Ensures text can shrink and truncate
  {
    variants: {
      layout: {
        horizontal: 'flex-1',
        vertical: 'w-full',
      },
    },
    defaultVariants: {
      layout: 'horizontal',
    },
  },
);

const nameVariants = cva(
  'font-medium truncate', // Base name styling
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const emailVariants = cva(
  'text-muted-foreground truncate', // Base email styling
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

/**
 * Helper function to extract user display information
 */
const getUserDisplayInfo = (user: UserInfoProps['user']) => {
  // Check if user has firstName/lastName (GetMeQueryResponse)
  if ('firstName' in user && 'lastName' in user) {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
    };
  }

  // User is simple User type (id, name)
  const nameParts = user.name.split(' ');
  return {
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    name: user.name,
    email: undefined,
  };
};

export const UserInfo = ({
  user,
  layout = 'horizontal',
  size = 'md',
  avatarSize = 'md',
  showEmail = true,
  truncateText = true,
  onClick,
  className,
  'data-testid': testId,
  ...props
}: UserInfoProps) => {
  const isInteractive = Boolean(onClick);
  const userInfo = getUserDisplayInfo(user);

  const baseClasses = cn(
    userInfoVariants({ layout, size }),
    isInteractive && [
      'cursor-pointer rounded-md p-2 transition-colors',
      'hover:bg-accent focus-visible:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    ],
    className,
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        className={baseClasses}
        onClick={onClick}
        aria-label={`View ${userInfo.name} profile`}
        data-testid={testId}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <Avatar
          firstName={userInfo.firstName}
          lastName={userInfo.lastName}
          size={avatarSize}
          className={layout === 'vertical' ? 'mx-auto' : undefined}
        />

        <div className={cn(textContentVariants({ layout }))}>
          <div className={cn(nameVariants({ size }), !truncateText && 'whitespace-normal')}>{userInfo.name}</div>

          {showEmail && userInfo.email && (
            <div className={cn(emailVariants({ size }), !truncateText && 'whitespace-normal')}>{userInfo.email}</div>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className={baseClasses} data-testid={testId} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      <Avatar
        firstName={userInfo.firstName}
        lastName={userInfo.lastName}
        size={avatarSize}
        className={layout === 'vertical' ? 'mx-auto' : undefined}
      />

      <div className={cn(textContentVariants({ layout }))}>
        <div className={cn(nameVariants({ size }), !truncateText && 'whitespace-normal')}>{userInfo.name}</div>

        {showEmail && userInfo.email && (
          <div className={cn(emailVariants({ size }), !truncateText && 'whitespace-normal')}>{userInfo.email}</div>
        )}
      </div>
    </div>
  );
};
