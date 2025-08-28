import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

import { EnhancedDayButton } from './DayButton';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  modifiers?: Record<string, Date[]>;
  modifiersClassNames?: Record<string, string>;
  onDaySelect?: (dates: Date[] | undefined) => void;
  captionLayout?: 'dropdown' | 'label' | 'dropdown-months' | 'dropdown-years';
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
  modifiers,
  modifiersClassNames,
  onDaySelect,
  captionLayout = 'label',
  title = 'Time Log Calendar',
  description = 'Track your daily time logging progress across the month',
  legendItems,
  className,
}: CalendarGridProps) => {
  return (
    <Card className={cn('transition-shadow duration-300 hover:shadow-lg h-full flex flex-col', className)}>
      <CardHeader className="pb-4">
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
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {error && (
          <div className="flex flex-1 items-center justify-center text-destructive">
            <Typography variant="body">{error}</Typography>
          </div>
        )}
        {!error && isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <Typography variant="body" color="muted">
              Loading calendar...
            </Typography>
          </div>
        )}
        {!error && !isLoading && (
          <div className="space-y-4 flex-1 flex flex-col">
            <Calendar
              month={month}
              onMonthChange={onMonthChange}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              showOutsideDays={false}
              className="rounded-md border flex-1 p-4"
              classNames={{
                months: 'w-full h-full flex flex-col',
                month: 'w-full space-y-4 flex-1 flex flex-col',
                table: 'w-full border-collapse flex-1',
                weekdays: 'flex w-full',
                weekday: 'text-muted-foreground rounded-md flex-1 font-normal text-sm select-none text-center pb-3',
                week: 'flex w-full mt-3',
                day: 'relative p-1 text-center flex-1 aspect-square select-none', // Enhanced spacing and sizing
                nav: 'hidden', // Hide internal navigation since SplitViewCalendar has its own
              }}
              components={{
                DayButton: EnhancedDayButton,
              }}
              mode="multiple"
              captionLayout={captionLayout}
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
