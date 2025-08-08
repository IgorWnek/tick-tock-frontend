import React, { useMemo, useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BarChart3 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCalendarData } from '@/hooks/useCalendarData';

interface DashboardCalendarProps {
  onDayClick?: (date: Date) => void;
}

export const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const currentMonth = format(currentDate, 'yyyy-MM');

  const { data, isLoading, error } = useCalendarData(currentMonth);

  const weekDays = useMemo(() => {
    if (viewMode !== 'week') return [];
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate, viewMode]);

  const monthStats = useMemo(() => {
    if (!data?.days) return { total: 0, logged: 0, draft: 0, noLogs: 0 };

    const workingDays = data.days.filter((day) => day.isWorkingDay);
    return {
      total: workingDays.length,
      logged: workingDays.filter((day) => day.status === 'logged').length,
      draft: workingDays.filter((day) => day.status === 'draft').length,
      noLogs: workingDays.filter((day) => day.status === 'no-logs').length,
    };
  }, [data?.days]);

  const getDayStatus = (date: Date) => {
    if (!data?.days) return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    return data.days.find((day) => day.date === dateStr);
  };

  const getDayClassName = (status: string) => {
    const baseClasses =
      'h-12 w-12 flex items-center justify-center rounded-lg border transition-all hover:scale-105 cursor-pointer text-sm font-medium';

    switch (status) {
      case 'logged':
        return `${baseClasses} bg-green-100 border-green-300 text-green-900 hover:bg-green-200 dark:bg-green-900/30 dark:border-green-700 dark:text-green-100`;
      case 'draft':
        return `${baseClasses} bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-100`;
      case 'no-logs':
        return `${baseClasses} bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-100`;
      default:
        return `${baseClasses} bg-muted border-border text-muted-foreground hover:bg-muted/80`;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  };

  const renderMonthView = () => {
    if (!data?.days) return null;

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayData = getDayStatus(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <button
              key={day.toISOString()}
              className={`${getDayClassName(dayData?.status || '')} ${!isCurrentMonth ? 'opacity-40' : ''} ${
                isCurrentDay ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
              onClick={() => onDayClick?.(day)}
              aria-label={`View logs for ${format(day, 'MMMM d, yyyy')}`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayData = getDayStatus(day);
            const isCurrentDay = isToday(day);

            return (
              <div key={day.toISOString()} className="space-y-2">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">{format(day, 'EEE')}</div>
                  <div className={`text-lg font-medium ${isCurrentDay ? 'text-primary' : ''}`}>{format(day, 'd')}</div>
                </div>
                <button
                  className={getDayClassName(dayData?.status || '')}
                  onClick={() => onDayClick?.(day)}
                  aria-label={`View logs for ${format(day, 'MMMM d, yyyy')}`}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {dayData && (
                      <Badge variant="secondary" className="text-xs">
                        {dayData.totalMinutes ? Math.round(dayData.totalMinutes / 60) : 0}h
                      </Badge>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-destructive">Error loading calendar data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Time Log Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button variant={viewMode === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('week')}>
              Week
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => (viewMode === 'month' ? navigateMonth('prev') : navigateWeek('prev'))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {format(currentDate, viewMode === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy')}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (viewMode === 'month' ? navigateMonth('next') : navigateWeek('next'))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {viewMode === 'month' && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-green-600 font-medium">{monthStats.logged}</span>
                <span className="text-blue-600 font-medium">{monthStats.draft}</span>
                <span className="text-orange-600 font-medium">{monthStats.noLogs}</span>
                <span className="text-muted-foreground">/ {monthStats.total}</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading calendar...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {viewMode === 'month' ? renderMonthView() : renderWeekView()}

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded border" />
                <span className="text-muted-foreground">No logs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded border" />
                <span className="text-muted-foreground">Draft logs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded border" />
                <span className="text-muted-foreground">Completed logs</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
