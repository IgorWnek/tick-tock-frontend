/**
 * Design System Tokens
 *
 * Central repository for design tokens including colors, spacing, typography,
 * borders, shadows, and other design values. These tokens should be used
 * throughout the design system to ensure consistency.
 *
 * Tokens integrate with Tailwind CSS v4 and CSS custom properties.
 */

// Color tokens - using semantic names that work across themes
export const colors = {
  // Primary colors
  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',

  // Secondary colors
  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',

  // Background colors
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',

  // UI colors
  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',

  // State colors
  destructive: 'hsl(var(--destructive))',
  destructiveForeground: 'hsl(var(--destructive-foreground))',
  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',
  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',
} as const;

// Spacing tokens - consistent spacing scale
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '3rem', // 48px
  '4xl': '4rem', // 64px
} as const;

// Typography tokens
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// Border radius tokens
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  full: '9999px',
} as const;

// Shadow tokens
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Avatar size tokens - specific for Avatar component
export const avatarSizes = {
  sm: '2rem', // 32px
  md: '2.5rem', // 40px
  lg: '3rem', // 48px
} as const;

// Component-specific tokens
export const components = {
  avatar: {
    sizes: avatarSizes,
  },
  button: {
    minHeight: '2.5rem', // 40px - touch-friendly
    padding: {
      sm: '0.5rem 0.75rem', // 8px 12px
      md: '0.75rem 1rem', // 12px 16px
      lg: '1rem 2rem', // 16px 32px
    },
  },
  input: {
    minHeight: '2.5rem', // 40px - touch-friendly
    padding: '0.75rem', // 12px
  },
} as const;

// Animation tokens
export const animations = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Breakpoint tokens - align with Tailwind defaults
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Z-index tokens - layering system
export const zIndex = {
  base: 0,
  dropdown: 10,
  modal: 20,
  popover: 30,
  tooltip: 40,
  toast: 50,
} as const;

// Export all tokens as a consolidated object
export const tokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  components,
  animations,
  breakpoints,
  zIndex,
} as const;
