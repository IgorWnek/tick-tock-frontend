import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const codeBlockVariants = cva('relative rounded-md border bg-muted/50 font-mono text-sm overflow-auto', {
  variants: {
    variant: {
      default: 'bg-muted/50 text-foreground',
      destructive: 'bg-destructive/10 text-destructive border-destructive/20',
      success: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400',
    },
    size: {
      default: 'p-4',
      sm: 'p-2 text-xs',
      lg: 'p-6 text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export type CodeBlockProps = React.ComponentProps<'div'> &
  VariantProps<typeof codeBlockVariants> & {
    children?: React.ReactNode;
  };

export const CodeBlock = ({ className, variant, size, children, ...props }: CodeBlockProps) => {
  return (
    <div data-slot="code-block" className={cn(codeBlockVariants({ variant, size, className }))} {...props}>
      <code>{children}</code>
    </div>
  );
};
