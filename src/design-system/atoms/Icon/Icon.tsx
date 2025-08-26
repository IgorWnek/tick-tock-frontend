import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const iconVariants = cva('flex-shrink-0', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
      xl: 'h-8 w-8',
    },
    color: {
      default: 'text-current',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      success: 'text-green-500',
      warning: 'text-orange-500',
      error: 'text-destructive',
    },
  },
  defaultVariants: {
    size: 'sm',
    color: 'default',
  },
});

export interface IconProps extends VariantProps<typeof iconVariants> {
  icon: LucideIcon;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export const Icon = ({ icon: IconComponent, size, color, className, 'aria-hidden': ariaHidden }: IconProps) => {
  return <IconComponent className={cn(iconVariants({ size, color }), className)} aria-hidden={ariaHidden} />;
};
