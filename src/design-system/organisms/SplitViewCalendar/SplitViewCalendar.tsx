import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { CalendarGrid } from '@/design-system/organisms/CalendarGrid/CalendarGrid';
import { DayDetailsPanel } from '@/design-system/molecules/DayDetailsPanel/DayDetailsPanel';
import { Button } from '@/components/ui/button';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useDayEntries } from '@/hooks/useDayEntries';

interface SplitViewCalendarProps {
  onDayClick?: (date: Date) => void;
  showInlineDetails?: boolean; // New prop to control behavior
  maxHeight?: string; // Allow parent to control height
}

export const SplitViewCalendar: React.FC<SplitViewCalendarProps> = ({
  onDayClick,
  showInlineDetails = true,
  maxHeight = 'h-[600px]',
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const currentMonth = format(currentDate, 'yyyy-MM');

  const { data, isLoading, error } = useCalendarData(currentMonth);

  // Fetch detailed entries for selected date
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const { data: dayEntries, isLoading: entriesLoading, error: entriesError } = useDayEntries(selectedDateStr);

  // Build modifiers for CalendarGrid
  const modifiers = useMemo(() => {
    if (!data?.days) return undefined;

    const logged: Date[] = [];
    const draft: Date[] = [];
    const noLogs: Date[] = [];

    data.days.forEach((day) => {
      const date = new Date(day.date);
      switch (day.status) {
        case 'logged':
          logged.push(date);
          break;
        case 'draft':
          draft.push(date);
          break;
        case 'no-logs':
          noLogs.push(date);
          break;
      }
    });

    return { logged, draft, 'no-logs': noLogs };
  }, [data?.days]);

  const modifiersClassNames = {
    logged:
      'bg-green-100 border-green-300 text-green-900 hover:bg-green-200 dark:bg-green-900/30 dark:border-green-700 dark:text-green-100',
    draft:
      'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-100',
    'no-logs':
      'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-100',
  };

  const selectedDayData = useMemo(() => {
    if (!selectedDate || !data?.days) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return data.days.find((day) => day.date === dateStr);
  }, [selectedDate, data?.days]);

  const handleDayClick = (date: Date) => {
    // Show details in panel instead of navigating when showInlineDetails is true
    setSelectedDate(date);

    // Also call external handler if not showing inline details
    if (!showInlineDetails) {
      onDayClick?.(date);
    }
  };

  const handleDaySelect = (dates: Date[] | undefined) => {
    if (dates && dates.length > 0) {
      handleDayClick(dates[dates.length - 1]); // Use the last selected date
    }
  };

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const legendItems = [
    { colorClass: 'bg-orange-500', label: 'No logs' },
    { colorClass: 'bg-blue-500', label: 'Draft logs' },
    { colorClass: 'bg-green-500', label: 'Completed logs' },
  ];

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-center gap-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
          aria-label="Previous month"
          disabled={isLoading}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>
        <h2 className="text-xl font-semibold min-w-[180px] text-center">{format(currentDate, 'MMMM yyyy')}</h2>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          aria-label="Next month"
          disabled={isLoading}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px] h-full">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 h-full">
          <CalendarGrid
            month={currentDate}
            isLoading={isLoading}
            error={error ? 'Error loading calendar data' : null}
            onMonthChange={handleMonthChange}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            onDaySelect={handleDaySelect}
            captionLayout="label"
            title="Daily Progress"
            description="Click on any day to view detailed time entries"
            legendItems={legendItems}
          />
        </div>

        {/* Day Details Panel */}
        <DayDetailsPanel
          selectedDate={selectedDate}
          selectedDayData={selectedDayData || null}
          dayEntries={dayEntries || null}
          entriesLoading={entriesLoading}
          entriesError={Boolean(entriesError)}
          maxHeight={maxHeight}
        />
      </div>
    </div>
  );
};
