---
applyTo: 'src/components/**/*.{tsx,ts},src/components/**/*.{css,scss},src/assets/styles/**/*.{css,scss}'
description: 'Design tokens, CSS variables, Tailwind CSS v4 patterns, and theming guidelines for a consistent UI.'
---

# Design System, Theming, and Styling Instructions

## Context

These instructions provide guidelines for implementing and maintaining a consistent design system. They cover theming, design tokens, styling with Tailwind CSS v4 (CSS-first), and creating component variants. Following these patterns ensures a cohesive, maintainable, and scalable user interface.

## Core Principles

1.  **Token-First Design**: All styling values (colors, spacing, typography, etc.) must be defined as design tokens and accessed via CSS variables. Avoid hardcoded values.
2.  **Centralized Theming**: Themes (e.g., light/dark mode) are managed globally through CSS variables defined in `:root` and theme-specific selectors (e.g., `.dark`).
3.  **Utility-First with Tailwind CSS**: Leverage Tailwind for applying styles. Use `tailwind-merge` and `clsx` to handle dynamic and conditional classes gracefully.
4.  **Variant-Driven Components**: Use `class-variance-authority` (CVA) to create flexible and consistent component variants (e.g., size, color, style).
5.  **Atomic Design Consistency**: Theming and styling should respect the atomic design hierarchy. Atoms define the base styles, which are composed into larger components.

## Patterns

### 1. Tailwind v4 CSS-first tokens with @theme

In Tailwind v4, define design tokens directly in CSS using the `@theme` directive. Tailwind will:
- generate utilities from these tokens (e.g., `bg-primary`, `text-secondary-foreground`), and
- expose them as native CSS variables under `:root` (so you can use `var(--color-*)` anywhere).

Place tokens in a global stylesheet (e.g., `src/assets/styles/globals.css`). Prefer OKLCH for color tokens.

```css
/* src/assets/styles/globals.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.22 0.044 257.287);

  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.22 0.044 257.287);

  --color-primary: oklch(0.53 0.12 264);
  --color-primary-foreground: oklch(0.98 0 0);

  --color-secondary: oklch(0.96 0.01 256);
  --color-secondary-foreground: oklch(0.22 0.044 257.287);

  /* Radius and spacing */
  --radius: 0.5rem;
  --spacing: 0.25rem;

  /* Example custom breakpoint → enables 3xl:* utilities */
  --breakpoint-3xl: 120rem;
}

:root {
  /* Any non-utility variables you want available at runtime */
  --radius: 0.5rem;
}

.dark {
  /* Theme overrides for dark mode */
  --color-background: oklch(0.22 0.044 257.287);
  --color-foreground: oklch(0.98 0 0);
  --color-card: oklch(0.22 0.044 257.287);
  --color-card-foreground: oklch(0.98 0 0);
  --color-primary: oklch(0.98 0 0);
  --color-primary-foreground: oklch(0.22 0.044 257.287);
  --color-secondary: oklch(0.49 0.08 205.88);
  --color-secondary-foreground: oklch(0.98 0 0);
}
```

Tips
- Use `@theme static { ... }` if you want all tokens emitted to CSS even if unused (handy for debugging/external consumption).
- Tokens defined in `@theme` automatically create utilities and are accessible as CSS variables in CSS/JS.

### 2. Build integration (Vite plugin)

This repo uses the official Tailwind v4 Vite plugin (see `vite.config.ts`). Content detection is automatic; no `content` globs are required in CSS-first mode.

Optional legacy config
- You may keep a small `tailwind.config.ts` for add-ons (e.g., custom animations/keyframes). Avoid defining tokens there in v4; prefer `@theme`.

### 3. Component Variant Patterns (CVA)

Use `class-variance-authority` to manage component variants. This is especially critical for **Atoms**.

```typescript
// src/components/atoms/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils'; // Utility for merging tailwind classes

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};
```

### 4. Theming, Dark Mode, and Variants

Apply themes by toggling a class on a parent element (e.g., `<html class="dark">`). Use Tailwind’s `dark:` variant in markup or `@variant dark` in CSS.

```tsx
// Example of a component using themed styles
// src/components/molecules/Card/Card.tsx
import { cn } from '@/lib/utils';

export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm dark:bg-background', className)}
      {...props}
    />
  );
};
```

Composable variants and first-render animations
- Tailwind v4 supports composable variants like `group-has-*` and the `starting:` variant for first-render transitions.

```html
<div class="group">
  <div class="opacity-0 group-has-[button:focus]:opacity-100 transition-opacity"></div>
</div>

<!-- Initial mount transition -->
<div class="transition-opacity starting:open:opacity-0 [@starting-style]:opacity-0 open:opacity-100"></div>
```

Use tokens in JS/CSS outside utilities
- Because tokens are exported as CSS variables, you can consume them in custom CSS or JS animations:

```tsx
import { motion } from 'framer-motion';

export const Slide = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ y: 'var(--spacing-8)' }} animate={{ y: 0 }} exit={{ y: 'var(--spacing-8)' }}>
    {children}
  </motion.div>
);
```

## Best Practices

-   **Keep Atoms Theming-Aware**: Atoms should be the primary consumers of design tokens and CVA variants.
-   **Compose Styles**: Molecules and Organisms should compose atoms and pass variant props down, rather than defining their own colors or complex styles.
-   **Use `cn` Utility**: Always use a utility like `cn` (combining `clsx` and `tailwind-merge`) to handle conditional and overriding styles. This prevents class name collisions and keeps the DOM clean.
-   **Document Variants**: For shared components, document the available `variants` and `sizes` using Storybook or JSDoc to ensure they are discoverable.
-   **Follow Prettier Rules**: Ensure all CSS and style-related code adheres to the project's `prettier.instructions.md`.
-   **Prefer `@theme` over JS config for tokens**: In v4, define theme values in CSS with `@theme` to get both utilities and CSS variables for free.
-   **Use OKLCH for color**: Improves perceptual uniformity and makes `color-mix()` usage predictable.
-   **Avoid maintaining content globs**: With the Vite plugin in v4, content detection is automatic.

## Anti-Patterns

-   **Hardcoding Values**: Never use hardcoded colors, spacing, or font sizes in components. Always use Tailwind utilities that map to design tokens.
    ```tsx
    // ❌ Bad: Hardcoded color and padding
    <div style={{ backgroundColor: '#000000', padding: '10px' }} />

    // ✅ Good: Using Tailwind utilities with design tokens
    <div className="bg-background p-4" />
    ```
-   **Bypassing CVA for Variants**: Do not create component variants using conditional logic inside the component's JSX. Centralize variants with CVA.
    ```tsx
    // ❌ Bad: Manual variant logic
    const buttonClass = isDisabled ? 'bg-gray-200' : 'bg-blue-500';
    <button className={`p-2 ${buttonClass}`} />

    // ✅ Good: Using CVA variants
    <Button variant="primary" disabled={isDisabled} />
    ```
-   **Styling in Higher-Order Components**: Avoid applying styles in Molecules or Organisms that should be part of an Atom's variants.
    ```tsx
    // ❌ Bad: Molecule overriding Atom styles
    // src/components/molecules/SearchForm.tsx
    <Button className="bg-green-500 text-white" /> // Should be a variant

    // ✅ Good: Molecule passing variant prop
    <Button variant="success" />
    ```
 -   **Defining tokens only in tailwind.config**: In v4, don’t mirror tokens in JS config; keep tokens in `@theme` so utilities and CSS vars stay in sync.

## Integration

-   **Atomic Design**: This design system is built upon the principles in `atomic-design.instructions.md`. Atoms are the source of truth for styling.
-   **React Core**: Component implementation should follow `react-core.instructions.md`.
-   **Prettier**: All code formatting must adhere to `prettier.instructions.md`.

## Related Instructions
- [Atomic Design](./atomic-design.instructions.md)
- [React Core](./react-core.instructions.md)

## Summary

-   Define all styles as **design tokens** in a global CSS file.
-   Use **Tailwind CSS v4** with CSS-first `@theme` for utilities and runtime CSS variables.
-   Create component variants using **CVA** at the **Atom** level.
-   Manage themes (light/dark) by toggling a class on a root element.
-   Avoid hardcoded style values and manual variant logic.
-   Compose atoms to build consistently styled, complex components.
