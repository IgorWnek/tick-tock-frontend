import React, { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';

import { useCalendarData } from '@/hooks/useCalendarData';
import { CalendarGrid } from '@/design-system/organisms/CalendarGrid/CalendarGrid';

export interface CalendarMonthProps {
  onDayClick?: (date: Date) => void;
  className?: string;
}

export const CalendarMonth = ({ onDayClick, className }: CalendarMonthProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = format(currentDate, 'yyyy-MM');

  const { data, isLoading, error } = useCalendarData(currentMonth);

  const modifiers = useMemo(() => {
    if (!data?.days) return {} as Record<string, Date[]>;
    const map: Record<string, Date[]> = { logged: [], draft: [], 'no-logs': [], today: [new Date()] };
    data.days.forEach((d) => {
      if (d.isWorkingDay) {
        map[d.status].push(new Date(d.date));
      }
    });
    return map;
  }, [data?.days]);

  const modifiersClassNames: Record<string, string> = {
    logged:
      'bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-100 border-2 border-green-500/30',
    draft:
      'bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-100 border-2 border-blue-500/30',
    'no-logs':
      'bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-100 border-2 border-orange-500/30',
    today: 'ring-2 ring-primary ring-offset-2 animate-pulse',
  };

  const handleDaySelect = useCallback(
    (dates: Date[] | undefined) => {
      if (dates && dates.length > 0 && onDayClick) {
        onDayClick(dates[dates.length - 1]);
      }
    },
    [onDayClick],
  );

  return (
    <CalendarGrid
      month={currentDate}
      isLoading={isLoading}
      error={error ? 'Error loading calendar data.' : null}
      onMonthChange={setCurrentDate}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      onDaySelect={handleDaySelect}
      captionLayout="dropdown"
      legendItems={[
        { colorClass: 'bg-orange-500', label: 'No logs' },
        { colorClass: 'bg-blue-500', label: 'Draft logs' },
        { colorClass: 'bg-green-500', label: 'Completed logs' },
      ]}
      className={className}
    />
  );
};
