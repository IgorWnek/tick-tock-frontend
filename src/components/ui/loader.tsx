import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { Skeleton } from './skeleton';

import { cn } from '@/lib/utils';

const loaderVariants = cva('flex items-center justify-center', {
  variants: {
    variant: {
      default: 'gap-2',
      dots: 'gap-1',
      spinner: '',
    },
    size: {
      default: 'min-h-24',
      sm: 'min-h-16',
      lg: 'min-h-32',
      full: 'min-h-screen',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export type LoaderProps = React.ComponentProps<'div'> &
  VariantProps<typeof loaderVariants> & {
    text?: string;
  };

export const Loader = ({ className, variant, size, text = 'Loading...', ...props }: LoaderProps) => {
  if (variant === 'dots') {
    return (
      <div data-slot="loader" className={cn(loaderVariants({ variant, size, className }))} {...props}>
        <div className="flex gap-1">
          <Skeleton className="h-2 w-2 rounded-full animate-pulse [animation-delay:0ms]" />
          <Skeleton className="h-2 w-2 rounded-full animate-pulse [animation-delay:150ms]" />
          <Skeleton className="h-2 w-2 rounded-full animate-pulse [animation-delay:300ms]" />
        </div>
        {text && <span className="text-sm text-muted-foreground ml-2">{text}</span>}
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div data-slot="loader" className={cn(loaderVariants({ variant, size, className }))} {...props}>
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        {text && <span className="text-sm text-muted-foreground ml-2">{text}</span>}
      </div>
    );
  }

  return (
    <div data-slot="loader" className={cn(loaderVariants({ variant, size, className }))} {...props}>
      <Skeleton className="h-4 w-20" />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};
