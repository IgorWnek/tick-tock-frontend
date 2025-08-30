import { type VariantProps } from 'class-variance-authority';

import { buttonVariants } from './Button';

/**
 * Button component props extending native button element props
 * with atomic design variants and asChild prop for Radix polymorphism.
 */
export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    /**
     * When true, renders the component as a child of Slot component,
     * enabling polymorphic behavior via Radix UI's asChild pattern.
     */
    asChild?: boolean;
  };
