# Atomic Design Migration Guide

## Overview

This guide outlines the migration from the current component structure to an atomic design system with enhanced theming capabilities, specifically designed for the Tick-Tock frontend application.

## Current State vs Target State

### Current Structure

```text
src/components/
├── dashboard/          # Feature-specific components
├── log-entry/          # Feature-specific components
└── ui/                 # Mixed-level UI components
```

### Target Structure

```text
src/
├── design-system/      # Atomic design system
│   ├── atoms/          # Basic building blocks
│   ├── molecules/      # Component combinations
│   ├── organisms/      # Complex UI sections
│   ├── templates/      # Page layouts
│   └── tokens/         # Design tokens
├── features/           # Business logic components
└── components/         # Legacy (to be migrated)
```

---

## Phase 1: Foundation Setup

### 1.1 Create Design System Structure

Create the new atomic design folder structure:

```bash
mkdir -p src/design-system/{atoms,molecules,organisms,templates,tokens}
mkdir -p src/features/{calendar,time-logging,dashboard}
```

### 1.2 Design Tokens System

**File: `src/design-system/tokens/colors.ts`**

```typescript
export const colorTokens = {
  // Primitive colors (from TailwindCSS variables)
  primitive: {
    neutral: {
      50: 'oklch(0.985 0 0)',
      100: 'oklch(0.97 0 0)',
      200: 'oklch(0.922 0 0)',
      // ... extend existing color system
    },
    brand: {
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
    },
  },

  // Semantic colors (meaning-based)
  semantic: {
    success: 'var(--success, oklch(0.646 0.222 41.116))',
    warning: 'var(--warning, oklch(0.828 0.189 84.429))',
    error: 'var(--destructive)',
    info: 'var(--info, oklch(0.6 0.118 184.704))',
  },

  // Component-specific colors
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
};
```

**File: `src/design-system/tokens/spacing.ts`**

```typescript
export const spacingTokens = {
  // Based on TailwindCSS scale but with semantic naming
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
};
```

**File: `src/design-system/tokens/typography.ts`**

```typescript
export const typographyTokens = {
  // Semantic typography scale
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
};
```

### 1.3 Enhanced Tailwind Configuration

**File: `tailwind.config.ts` (enhance existing)**

```typescript
import type { Config } from 'tailwindcss';
import { colorTokens } from './src/design-system/tokens/colors';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Existing animations and keyframes...

      // Design system tokens
      colors: {
        // Extend existing colors with semantic tokens
        'time-entry-draft': 'rgb(59 130 246 / 0.1)',
        'time-entry-logged': 'rgb(34 197 94 / 0.1)',
        'calendar-today': 'var(--primary)',
      },

      // Component-specific utilities
      spacing: {
        'card-sm': '0.75rem',
        'card-md': '1rem',
        'card-lg': '1.5rem',
      },

      // Enhanced theming utilities
      utilities: {
        '.card-time-entry-draft': {
          '@apply bg-blue-50/30 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800': {},
        },
        '.card-time-entry-logged': {
          '@apply bg-green-50/30 border-green-200 dark:bg-green-950/20 dark:border-green-800': {},
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
```

---

## Phase 2: Atomic Components Migration

### 2.1 Atoms (Basic Building Blocks)

**File: `src/design-system/atoms/Typography/Typography.tsx`**

```typescript
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

interface TypographyProps extends VariantProps<typeof typographyVariants> {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant,
  color,
  as: Component = 'p',
  className,
  ...props
}) => {
  return (
    <Component
      className={cn(typographyVariants({ variant, color }), className)}
      {...props}
    >
      {children}
    </Component>
  );
};
```

**File: `src/design-system/atoms/Icon/Icon.tsx`**

```typescript
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

interface IconProps extends VariantProps<typeof iconVariants> {
  icon: LucideIcon;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size,
  color,
  className,
  ...props
}) => {
  return (
    <IconComponent
      className={cn(iconVariants({ size, color }), className)}
      {...props}
    />
  );
};
```

### 2.2 Molecules (Component Combinations)

**File: `src/design-system/molecules/TimeDisplay/TimeDisplay.tsx`**

```typescript
import React from 'react';
import { Clock } from 'lucide-react';
import { Icon } from '../../atoms/Icon/Icon';
import { Typography } from '../../atoms/Typography/Typography';
import { cn } from '@/lib/utils';

interface TimeDisplayProps {
  duration: number; // in minutes
  showIcon?: boolean;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  duration,
  showIcon = true,
  variant = 'compact',
  className,
}) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (variant === 'detailed') {
      if (hours === 0) return `${mins} minutes`;
      if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
    }

    // Compact format
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && <Icon icon={Clock} size="sm" color="muted" />}
      <Typography variant="body" className="font-semibold">
        {formatDuration(duration)}
      </Typography>
      {variant === 'detailed' && (
        <Typography variant="small" color="muted">
          ({duration} min)
        </Typography>
      )}
    </div>
  );
};
```

**File: `src/design-system/molecules/StatusBadge/StatusBadge.tsx`**

```typescript
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Badge } from '@/components/ui/badge';
import { Icon } from '../../atoms/Icon/Icon';
import { CheckCircle, Clock, AlertCircle, LucideIcon } from 'lucide-react';

const statusBadgeVariants = cva('', {
  variants: {
    status: {
      draft: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300',
      logged: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300',
      'no-logs': 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-300',
    },
  },
});

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const statusIcons: Record<NonNullable<StatusBadgeProps['status']>, LucideIcon> = {
  draft: Clock,
  logged: CheckCircle,
  'no-logs': AlertCircle,
};

const statusLabels: Record<NonNullable<StatusBadgeProps['status']>, string> = {
  draft: 'Draft',
  logged: 'Logged',
  'no-logs': 'No Logs',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'draft',
  showIcon = true,
  children,
  className,
}) => {
  const IconComponent = statusIcons[status];
  const label = children || statusLabels[status];

  return (
    <Badge
      variant="outline"
      className={statusBadgeVariants({ status, className })}
    >
      {showIcon && <Icon icon={IconComponent} size="xs" />}
      <span className="ml-1">{label}</span>
    </Badge>
  );
};
```

### 2.3 Organisms (Complex UI Sections)

**File: `src/design-system/organisms/TimeEntryCard/TimeEntryCard.tsx`**

```typescript
import React from 'react';
import { ExternalLink, Calendar, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Typography } from '../../atoms/Typography/Typography';
import { Icon } from '../../atoms/Icon/Icon';
import { TimeDisplay } from '../../molecules/TimeDisplay/TimeDisplay';
import { StatusBadge } from '../../molecules/StatusBadge/StatusBadge';
import { TimeEntry } from '@/api/actions/timeLogs/timeLogs.types';
import { cn } from '@/lib/utils';

interface TimeEntryCardProps {
  entry: TimeEntry;
  index: number;
  onAction?: (action: 'ship' | 'refine' | 'view', entry: TimeEntry) => void;
  showActions?: boolean;
  className?: string;
}

export const TimeEntryCard: React.FC<TimeEntryCardProps> = ({
  entry,
  index,
  onAction,
  showActions = false,
  className,
}) => {
  const isLogged = entry.status === 'logged';
  const isDraft = entry.status === 'draft';

  // Apply status-specific styling using design tokens
  const getCardStyles = () => {
    if (isDraft) return 'card-time-entry-draft';
    if (isLogged) return 'card-time-entry-logged';
    return '';
  };

  return (
    <Card className={cn('transition-all duration-200 hover:shadow-md', getCardStyles(), className)}>
      <CardContent className="p-4">
        {/* Header with Task ID and Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-sm font-medium">
              <Icon icon={ExternalLink} size="xs" />
              <span className="ml-1">{entry.jiraTaskId}</span>
            </Badge>
            <StatusBadge status={entry.status as 'draft' | 'logged' | 'no-logs'} />
          </div>
          <div className="flex items-center gap-1">
            <Typography variant="tiny" color="muted">Entry</Typography>
            <Badge variant="outline" className="text-xs">
              #{index + 1}
            </Badge>
          </div>
        </div>

        {/* Duration Display */}
        <div className="mb-3">
          <TimeDisplay duration={entry.duration} variant="detailed" />
        </div>

        {/* Description */}
        {entry.description && (
          <div className="mb-3">
            <div className="flex items-start gap-2">
              <Icon icon={FileText} size="sm" color="muted" className="mt-0.5" />
              <Typography variant="small" className="flex-1 leading-relaxed">
                {entry.description}
              </Typography>
            </div>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-border/50 space-y-1">
          <div className="flex items-center gap-2">
            <Icon icon={Calendar} size="xs" color="muted" />
            <Typography variant="tiny" color="muted">
              Created: {new Date(entry.createdAt).toLocaleString()}
            </Typography>
          </div>
          {entry.loggedAt && (
            <div className="flex items-center gap-2">
              <Icon icon={Calendar} size="xs" color="muted" />
              <Typography variant="tiny" color="muted">
                Logged: {new Date(entry.loggedAt).toLocaleString()}
              </Typography>
            </div>
          )}
        </div>

        {/* Original Message Preview (for drafts) */}
        {isDraft && entry.originalMessage && (
          <div className="mt-3 p-2 bg-muted/50 rounded-md">
            <Typography variant="tiny" color="muted" className="mb-1">
              Original message:
            </Typography>
            <Typography variant="tiny" color="muted" className="italic line-clamp-2">
              &ldquo;{entry.originalMessage}&rdquo;
            </Typography>
          </div>
        )}

        {/* Action Buttons (if provided) */}
        {showActions && onAction && isDraft && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-border/50">
            <Button
              size="sm"
              onClick={() => onAction('ship', entry)}
              className="flex-1"
            >
              🚀 Ship It
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction('refine', entry)}
            >
              🧐 Refine
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

---

## Phase 3: Feature Component Migration

### 3.1 Extract Business Logic

**File: `src/features/time-logging/hooks/useTimeEntryActions.ts`**

```typescript
import { useCallback } from 'react';
import { useShipEntries } from '@/hooks/useShipEntries';
import { useRefineEntry } from '@/hooks/useRefineEntry';
import { TimeEntry } from '@/api/actions/timeLogs/timeLogs.types';

export const useTimeEntryActions = () => {
  const { mutate: shipEntries } = useShipEntries();
  const { mutate: refineEntry } = useRefineEntry();

  const handleTimeEntryAction = useCallback(
    (action: 'ship' | 'refine' | 'view', entry: TimeEntry) => {
      switch (action) {
        case 'ship':
          shipEntries([entry.id]);
          break;
        case 'refine':
          // Handle refine logic
          refineEntry({ entryId: entry.id, newDescription: entry.description });
          break;
        case 'view':
          // Handle view logic (navigation, etc.)
          break;
      }
    },
    [shipEntries, refineEntry]
  );

  return { handleTimeEntryAction };
};
```

### 3.2 Create Feature-Specific Organisms

**File: `src/features/time-logging/components/TimeEntryList.tsx`**

```typescript
import React from 'react';
import { TimeEntryCard } from '@/design-system/organisms/TimeEntryCard/TimeEntryCard';
import { Typography } from '@/design-system/atoms/Typography/Typography';
import { useTimeEntryActions } from '../hooks/useTimeEntryActions';
import { TimeEntry } from '@/api/actions/timeLogs/timeLogs.types';

interface TimeEntryListProps {
  entries: TimeEntry[];
  title?: string;
  showActions?: boolean;
  className?: string;
}

export const TimeEntryList: React.FC<TimeEntryListProps> = ({
  entries,
  title,
  showActions = true,
  className,
}) => {
  const { handleTimeEntryAction } = useTimeEntryActions();

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <Typography variant="body" color="muted">
          No time entries found.
        </Typography>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <Typography variant="h3" className="mb-4">
          {title}
        </Typography>
      )}
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <TimeEntryCard
            key={entry.id}
            entry={entry}
            index={index}
            onAction={handleTimeEntryAction}
            showActions={showActions}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## Phase 4: Migration Strategy

### 4.1 Gradual Migration Plan

1. **Week 1**: Set up design system foundation
   - Create folder structure
   - Implement design tokens
   - Create basic atoms (Typography, Icon)

2. **Week 2**: Migrate core molecules
   - TimeDisplay, StatusBadge, FormField
   - Update imports in existing components

3. **Week 3**: Refactor organisms
   - TimeEntryCard, CalendarGrid
   - Extract business logic to feature hooks

4. **Week 4**: Update feature components
   - Migrate dashboard, log-entry folders
   - Update all imports

5. **Week 5**: Cleanup and optimization
   - Remove old components
   - Update documentation
   - Performance optimization

### 4.2 Backward Compatibility

**File: `src/components/ui/index.ts` (temporary aliases)**

```typescript
// Temporary aliases during migration
export { Button } from '@/design-system/atoms/Button/Button';
export { Typography as Text } from '@/design-system/atoms/Typography/Typography';
export { TimeEntryCard } from '@/design-system/organisms/TimeEntryCard/TimeEntryCard';

// Legacy exports (to be removed)
export { TimeEntryCard as LegacyTimeEntryCard } from './TimeEntryCard';
```

### 4.3 Import Update Script

Create a script to help with import updates:

**File: `scripts/update-imports.js`**

```javascript
// Node.js script to update imports across the codebase
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const importMappings = {
  '@/components/ui/button': '@/design-system/atoms/Button/Button',
  '@/components/log-entry/TimeEntryCard': '@/design-system/organisms/TimeEntryCard/TimeEntryCard',
  // Add more mappings as needed
};

// Update imports in all TypeScript files
glob('src/**/*.{ts,tsx}', (err, files) => {
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let updated = false;

    Object.entries(importMappings).forEach(([oldPath, newPath]) => {
      if (content.includes(oldPath)) {
        content = content.replace(new RegExp(oldPath, 'g'), newPath);
        updated = true;
      }
    });

    if (updated) {
      fs.writeFileSync(file, content);
      console.log(`Updated imports in ${file}`);
    }
  });
});
```

---

## Phase 5: Enhanced Theming System

### 5.1 Theme Provider Enhancement

**File: `src/design-system/providers/ThemeProvider.tsx`**

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ThemePreset = 'default' | 'high-contrast' | 'colorful';

interface ThemeContextValue {
  theme: Theme;
  themePreset: ThemePreset;
  setTheme: (theme: Theme) => void;
  setThemePreset: (preset: ThemePreset) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultPreset?: ThemePreset;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  defaultPreset = 'default',
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [themePreset, setThemePreset] = useState<ThemePreset>(defaultPreset);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
    } else {
      root.classList.add(theme);
      setResolvedTheme(theme);
    }

    // Apply theme preset
    root.classList.remove('default', 'high-contrast', 'colorful');
    root.classList.add(themePreset);
  }, [theme, themePreset]);

  return (
    <ThemeContext.Provider value={{
      theme,
      themePreset,
      setTheme,
      setThemePreset,
      resolvedTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 5.2 Theme Customization Utilities

**File: `src/design-system/utils/themeUtils.ts`**

```typescript
import { colorTokens } from '../tokens/colors';

export const generateThemeVariables = (preset: 'default' | 'high-contrast' | 'colorful') => {
  const baseVariables = {
    // Base semantic colors
    '--color-primary': 'oklch(0.205 0 0)',
    '--color-secondary': 'oklch(0.97 0 0)',
    // ... other base variables
  };

  const presetVariables = {
    'high-contrast': {
      '--color-primary': 'oklch(0.1 0 0)',
      '--color-secondary': 'oklch(0.95 0 0)',
      '--border-width': '2px',
    },
    'colorful': {
      '--color-primary': 'oklch(0.646 0.222 41.116)',
      '--color-secondary': 'oklch(0.6 0.118 184.704)',
      '--color-accent': 'oklch(0.769 0.188 70.08)',
    },
  };

  return {
    ...baseVariables,
    ...(presetVariables[preset] || {}),
  };
};

export const applyThemeVariables = (variables: Record<string, string>) => {
  const root = document.documentElement;
  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};
```

---

## Phase 6: Documentation and Testing

### 6.1 Component Documentation

Create Storybook-style documentation for each component:

**File: `src/design-system/atoms/Button/Button.stories.tsx`**

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
```

### 6.2 Testing Strategy

**File: `src/design-system/atoms/Button/Button.test.tsx`**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-destructive');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports asChild prop with Slot', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('inline-flex'); // Button classes applied
  });
});
```

---

## Benefits of This Migration

### 🎯 **Immediate Benefits**

- **Consistent UI**: Atomic components ensure design consistency
- **Easy Theme Changes**: Design tokens make customization trivial
- **Better Maintainability**: Clear component hierarchy reduces duplication
- **Improved Testing**: Smaller components are easier to test

### 🚀 **Long-term Benefits**

- **Scalability**: Clear patterns for team growth
- **Reusability**: Components can be easily shared across features
- **Performance**: Better tree-shaking and code splitting
- **Design System Evolution**: Foundation for future design system growth

### 🔧 **Technical Benefits**

- **Type Safety**: Enhanced TypeScript integration
- **Bundle Optimization**: Smaller, more focused components
- **Development Experience**: Better IntelliSense and auto-completion
- **Documentation**: Self-documenting component API

---

## Implementation Checklist

### Phase 1: Foundation ✅

- [ ] Create design system folder structure
- [ ] Implement design tokens (colors, spacing, typography)
- [ ] Enhance TailwindCSS configuration
- [ ] Set up theme provider

### Phase 2: Atoms ✅

- [ ] Migrate Button component
- [ ] Create Typography component
- [ ] Create Icon component
- [ ] Update existing imports

### Phase 3: Molecules ✅

- [ ] Create TimeDisplay component
- [ ] Create StatusBadge component
- [ ] Create FormField component
- [ ] Update feature components

### Phase 4: Organisms ✅

- [ ] Refactor TimeEntryCard
- [ ] Refactor Calendar components
- [ ] Extract business logic to feature hooks
- [ ] Update all imports

### Phase 5: Features ✅

- [ ] Migrate dashboard components
- [ ] Migrate log-entry components
- [ ] Update route components
- [ ] Remove legacy components

### Phase 6: Polish ✅

- [ ] Add component documentation
- [ ] Write comprehensive tests
- [ ] Performance optimization
- [ ] Update README and guides

---

## Conclusion

This atomic design migration will transform your current component structure into a robust, scalable design system while maintaining all existing functionality. The phased approach ensures minimal disruption to development, and the enhanced theming system will make future customizations much easier.

The migration preserves your excellent TanStack Query/Router integration and MSW setup while providing a solid foundation for future growth. Your team will benefit from clearer component patterns, better consistency, and improved maintainability.

**Estimated Timeline**: 4-6 weeks for complete migration
**Risk Level**: Low (gradual migration with backward compatibility)
**Impact**: High (significantly improved maintainability and consistency)
