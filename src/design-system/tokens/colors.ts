export const colorTokens = {
  primitive: {
    neutral: {
      50: 'oklch(0.985 0 0)',
      100: 'oklch(0.97 0 0)',
      200: 'oklch(0.922 0 0)',
      300: 'oklch(0.87 0 0)',
      400: 'oklch(0.708 0 0)',
      500: 'oklch(0.556 0 0)',
      600: 'oklch(0.398 0 0)',
      700: 'oklch(0.269 0 0)',
      800: 'oklch(0.205 0 0)',
      900: 'oklch(0.145 0 0)',
    },
    brand: {
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
    },
  },
  semantic: {
    success: 'oklch(0.646 0.222 41.116)',
    warning: 'oklch(0.828 0.189 84.429)',
    error: 'var(--destructive)',
    info: 'oklch(0.6 0.118 184.704)',
  },
  component: {
    timeEntry: {
      draft: {
        bg: 'bg-blue-50/30 dark:bg-blue-950/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-900 dark:text-blue-100',
      },
      logged: {
        bg: 'bg-green-50/30 dark:bg-green-950/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-900 dark:text-green-100',
      },
    },
    calendar: {
      today: 'ring-2 ring-primary ring-offset-2',
      hasEntries: 'bg-accent/50',
      weekend: 'opacity-60',
    },
  },
} as const;

export type ColorTokens = typeof colorTokens;
