import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-3xl font-bold tracking-tight',
      h2: 'text-2xl font-semibold tracking-tight',
      h3: 'text-xl font-semibold',
      h4: 'text-lg font-medium',
      body: 'text-base leading-normal',
      small: 'text-sm leading-normal',
      tiny: 'text-xs leading-normal',
      code: 'font-mono text-sm bg-muted px-1 py-0.5 rounded',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      success: 'text-green-700 dark:text-green-300',
      warning: 'text-orange-700 dark:text-orange-300',
      error: 'text-destructive',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'default',
  },
});

export interface TypographyProps extends VariantProps<typeof typographyVariants> {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  id?: string;
  role?: string;
}

export const Typography = ({ children, variant, color, as, className, id, role }: TypographyProps) => {
  const Component = as || 'p';
  return (
    <Component id={id} role={role} className={cn(typographyVariants({ variant, color }), className)}>
      {children}
    </Component>
  );
};
