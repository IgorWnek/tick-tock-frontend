/**
 * Button Atom Component
 *
 * A versatile button component with multiple variants and sizes.
 * Supports Radix UI's asChild pattern for polymorphic behavior.
 *
 * @example
 * ```tsx
 * import { Button } from '@/design-system/atoms/Button';
 *
 * <Button variant="primary" size="lg">Click me</Button>
 * <Button asChild><a href="/link">Link as button</a></Button>
 * ```
 */

export { Button, buttonVariants } from './Button';
export type { ButtonProps } from './Button.types';
