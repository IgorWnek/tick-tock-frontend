export const spacingTokens = {
  component: {
    card: {
      padding: 'p-4',
      gap: 'gap-3',
      borderRadius: 'rounded-lg',
    },
    form: {
      fieldGap: 'gap-4',
      sectionGap: 'gap-6',
      inputPadding: 'px-3 py-2',
    },
    layout: {
      sidebarWidth: 'w-64',
      headerHeight: 'h-16',
      contentPadding: 'p-6',
    },
  },
} as const;

export type SpacingTokens = typeof spacingTokens;
