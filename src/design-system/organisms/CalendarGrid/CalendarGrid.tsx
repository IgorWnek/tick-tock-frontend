import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Icon } from '@/design-system/atoms/Icon/Icon';
import { Typography } from '@/design-system/atoms/Typography/Typography';
import { cn } from '@/lib/utils';

export interface CalendarGridLegendItem {
  colorClass: string; // e.g., 'bg-green-500'
  label: string;
}

export interface CalendarGridProps {
  month: Date;
  isLoading?: boolean;
  error?: string | null;
  onMonthChange?: (date: Date) => void;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  modifiers?: Record<string, Date[]>;
  modifiersClassNames?: Record<string, string>;
  onDaySelect?: (dates: Date[] | undefined) => void;
  title?: string;
  description?: string;
  legendItems?: CalendarGridLegendItem[];
  className?: string;
}

export const CalendarGrid = ({
  month,
  isLoading,
  error,
  onMonthChange,
  onPreviousMonth,
  onNextMonth,
  modifiers,
  modifiersClassNames,
  onDaySelect,
  title = 'Time Log Calendar',
  description = 'Track your daily time logging progress across the month',
  legendItems,
  className,
}: CalendarGridProps) => {
  return (
    <Card className={cn('transition-shadow duration-300 hover:shadow-lg', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon icon={CalendarIcon} size="sm" aria-hidden />
              {title}
            </CardTitle>
            {description && (
              <Typography variant="small" color="muted" className="mt-1">
                {description}
              </Typography>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onPreviousMonth}
              aria-label="Previous month"
              disabled={isLoading}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </Button>
            <Typography as="span" variant="small" className="min-w-[120px] text-center font-medium">
              {month.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
            </Typography>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onNextMonth}
              aria-label="Next month"
              disabled={isLoading}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex h-64 items-center justify-center text-destructive">
            <Typography variant="body">{error}</Typography>
          </div>
        )}
        {!error && isLoading && (
          <div className="flex h-64 items-center justify-center">
            <Typography variant="body" color="muted">
              Loading calendar...
            </Typography>
          </div>
        )}
        {!error && !isLoading && (
          <div className="space-y-4">
            <Calendar
              month={month}
              onMonthChange={onMonthChange}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              showOutsideDays={false}
              className="rounded-md border"
              onSelect={onDaySelect}
            />
            {legendItems && legendItems.length > 0 && (
              <div className="flex items-center justify-center gap-6 border-t pt-4 text-sm">
                {legendItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={cn('h-3 w-3 rounded-full', item.colorClass)} />
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
