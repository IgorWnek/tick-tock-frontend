import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import { useCalendarData } from '@/hooks/useCalendarData';

interface MinimalistCalendarProps {
  onDayClick?: (date: Date) => void;
}

export const MinimalistCalendar: React.FC<MinimalistCalendarProps> = ({ onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = format(currentDate, 'yyyy-MM');

  const { data, isLoading, error } = useCalendarData(currentMonth);

  const modifiers = useMemo(() => {
    if (!data?.days) return {};

    const modifiersByStatus: Record<string, Date[]> = {
      logged: [],
      draft: [],
      'no-logs': [],
      today: [new Date()],
    };

    data.days.forEach((day) => {
      if (day.isWorkingDay) {
        const date = new Date(day.date);
        modifiersByStatus[day.status].push(date);
      }
    });

    return modifiersByStatus;
  }, [data?.days]);

  const modifiersClassNames = {
    logged:
      'bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-100 border-2 border-green-500/30',
    draft:
      'bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-100 border-2 border-blue-500/30',
    'no-logs':
      'bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-100 border-2 border-orange-500/30',
    today: 'ring-2 ring-primary ring-offset-2 animate-pulse',
  };

  const handleDayClick = (dates: Date[] | undefined) => {
    if (dates && dates.length > 0 && onDayClick) {
      onDayClick(dates[dates.length - 1]);
    }
  };

  if (error) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <p className="text-destructive">Error loading calendar data</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border overflow-hidden">
      <div className="p-6">
        <Calendar
          mode="multiple"
          month={currentDate}
          onSelect={handleDayClick}
          onMonthChange={setCurrentDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          showOutsideDays={false}
          className="w-full"
          captionLayout="dropdown"
        />
      </div>

      {/* Floating Legend */}
      <div className="border-t bg-muted/50 p-4">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full border border-orange-600" />
            <span className="text-muted-foreground">No logs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full border border-blue-600" />
            <span className="text-muted-foreground">Draft logs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-green-600" />
            <span className="text-muted-foreground">Completed logs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
