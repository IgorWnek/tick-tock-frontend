/* eslint-disable react/prop-types, react/jsx-props-no-spreading, @typescript-eslint/no-unused-vars */
import React from 'react';
import { DayButton } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const EnhancedDayButton = ({
  className,
  day: _day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      // Base styling for comfortable UX - larger touch targets inspired by Dashboard Multi-View Calendar
      'h-14 w-full min-w-14 aspect-square rounded-lg border border-transparent',
      'text-base font-medium transition-all duration-200',
      'hover:scale-105 hover:border-border hover:bg-muted/50 hover:shadow-md',
      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      // Selection states
      'data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground',
      'data-[selected=true]:border-primary data-[selected=true]:shadow-lg',
      // Today indicator
      modifiers?.today && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
      // Outside month styling
      modifiers?.outside && 'text-muted-foreground/50 hover:text-muted-foreground/80',
      className,
    )}
    aria-label={modifiers?.today ? 'Today' : undefined}
    {...props}
  />
);
