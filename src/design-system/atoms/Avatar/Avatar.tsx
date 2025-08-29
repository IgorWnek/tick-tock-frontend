import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium border border-border shrink-0',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs', // 32px
        md: 'h-10 w-10 text-sm', // 40px
        lg: 'h-12 w-12 text-base', // 48px
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type AvatarProps = {
  firstName?: string;
  lastName?: string;
  src?: string;
  alt?: string;
  className?: string;
} & VariantProps<typeof avatarVariants>;

/**
 * Get initials from first and last name
 * Handles edge cases like missing names, empty strings, and single names
 */
const getInitials = (firstName?: string, lastName?: string): string => {
  const first = firstName?.trim();
  const last = lastName?.trim();

  if (!first && !last) {
    return '?'; // Fallback when no names provided
  }

  if (!first) {
    return last!.charAt(0).toUpperCase();
  }

  if (!last) {
    return first.charAt(0).toUpperCase();
  }

  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
};

/**
 * Generate accessible description for the avatar
 */
const getAccessibleDescription = (firstName?: string, lastName?: string, alt?: string): string => {
  if (alt) return alt;

  const first = firstName?.trim();
  const last = lastName?.trim();

  if (first && last) {
    return `Avatar for ${first} ${last}`;
  }

  if (first || last) {
    return `Avatar for ${first || last}`;
  }

  return 'User avatar';
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ firstName, lastName, src, alt, size, className, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoading, setImageLoading] = React.useState(!!src);

    // Reset error state when src changes
    React.useEffect(() => {
      if (src) {
        setImageError(false);
        setImageLoading(true);
      }
    }, [src]);

    const initials = getInitials(firstName, lastName);
    const accessibleDescription = getAccessibleDescription(firstName, lastName, alt);
    const showImage = src && !imageError;
    const showInitials = !showImage;

    const handleImageLoad = () => {
      setImageLoading(false);
    };

    const handleImageError = () => {
      setImageError(true);
      setImageLoading(false);
    };

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        role="img"
        aria-label={accessibleDescription}
        {...props}
      >
        {showImage && (
          <img
            src={src}
            alt={alt || accessibleDescription}
            className="h-full w-full rounded-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        {imageLoading && <div className="h-full w-full rounded-full bg-muted animate-pulse" />}
        {showInitials && (
          <span className="select-none" aria-hidden="true">
            {initials}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

export { avatarVariants };
