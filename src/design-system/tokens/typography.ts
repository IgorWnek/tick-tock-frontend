export const typographyTokens = {
  heading: {
    h1: 'text-3xl font-bold tracking-tight',
    h2: 'text-2xl font-semibold tracking-tight',
    h3: 'text-xl font-semibold',
    h4: 'text-lg font-medium',
  },
  body: {
    large: 'text-lg leading-relaxed',
    default: 'text-base leading-normal',
    small: 'text-sm leading-normal',
    tiny: 'text-xs leading-normal',
  },
  code: {
    inline: 'font-mono text-sm bg-muted px-1 py-0.5 rounded',
    block: 'font-mono text-sm bg-muted p-3 rounded-lg',
  },
} as const;

export type TypographyTokens = typeof typographyTokens;
