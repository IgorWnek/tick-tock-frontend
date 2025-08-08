import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useCalendarData } from '@/hooks/useCalendarData';

interface CalendarGridProps {
  onDayClick?: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentMonth = format(currentDate, 'yyyy-MM');

  const { data, isLoading, error } = useCalendarData(currentMonth);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const modifiers = useMemo(() => {
    if (!data?.days) return {};

    const modifiersByStatus: Record<string, Date[]> = {
      logged: [],
      draft: [],
      'no-logs': [],
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
    logged: 'bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900 dark:text-green-100',
    draft: 'bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100',
    'no-logs': 'bg-orange-100 text-orange-900 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-100',
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Time Log Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-destructive">
            <p>Error loading calendar data. Please try again.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Time Log Calendar
            </CardTitle>
            <CardDescription>Track your daily time logging progress across the month</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousMonth}
              disabled={isLoading}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="min-w-[120px] text-center">
              <span className="font-medium text-sm">{format(currentDate, 'MMMM yyyy')}</span>
            </div>

            <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={isLoading} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading calendar...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Calendar
              month={currentDate}
              onMonthChange={setCurrentDate}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              showOutsideDays={false}
              className="rounded-md border"
            />

            {/* Status Legend */}
            <div className="flex items-center justify-center gap-6 text-sm border-t pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full" />
                <span className="text-muted-foreground">No logs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-muted-foreground">Draft logs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-muted-foreground">Completed logs</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
