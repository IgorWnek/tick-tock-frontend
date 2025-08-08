import React, { useMemo, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, ExternalLink, Plus, Edit3 } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

  const monthDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday = 1
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const selectedDayData = useMemo(() => {
    if (!selectedDate || !data?.days) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return data.days.find((day) => day.date === dateStr);
  }, [selectedDate, data?.days]);

  const getDayStatus = (date: Date) => {
    if (!data?.days) return null;
    const dateStr = format(date, 'yyyy-MM-dd');
    return data.days.find((day) => day.date === dateStr);
  };

  const getDayClassName = (status: string, isSelected: boolean = false) => {
    const baseClasses =
      'h-10 w-10 flex items-center justify-center rounded-lg border transition-all cursor-pointer text-sm font-medium leading-none';
    const selectedClasses = isSelected ? 'ring-2 ring-primary ring-offset-2' : '';

    switch (status) {
      case 'logged':
        return `${baseClasses} ${selectedClasses} bg-green-100 border-green-300 text-green-900 hover:bg-green-200 dark:bg-green-900/30 dark:border-green-700 dark:text-green-100`;
      case 'draft':
        return `${baseClasses} ${selectedClasses} bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-100`;
      case 'no-logs':
        return `${baseClasses} ${selectedClasses} bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-100`;
      default:
        return `${baseClasses} ${selectedClasses} bg-muted border-border text-muted-foreground hover:bg-muted/80`;
    }
  };

  const handleDayClick = (date: Date) => {
    if (showInlineDetails) {
      // Show details in panel instead of navigating
      setSelectedDate(date);
    } else {
      // Use original navigation behavior
      onDayClick?.(date);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'logged':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'no-logs':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'logged':
        return 'Completed';
      case 'draft':
        return 'Draft';
      case 'no-logs':
        return 'No logs';
      default:
        return 'No data';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-fit">
      {/* Compact Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((day) => {
                  const dayData = getDayStatus(day);
                  const isCurrentDay = isToday(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');

                  return (
                    <div key={day.toISOString()} className="text-center space-y-1">
                      <button
                        className={`${getDayClassName(dayData?.status || '', isSelected || false)} ${
                          isCurrentDay ? 'font-bold' : ''
                        } ${!isCurrentMonth ? 'opacity-40' : ''}`}
                        onClick={() => handleDayClick(day)}
                        aria-label={`View time logs for ${format(day, 'MMMM d, yyyy')}`}
                      >
                        {format(day, 'd')}
                      </button>
                      {dayData && isCurrentMonth && (
                        <div className="flex justify-center">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              dayData.status === 'logged'
                                ? 'bg-green-500'
                                : dayData.status === 'draft'
                                  ? 'bg-blue-500'
                                  : 'bg-orange-500'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

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

      {/* Enhanced Status Panel - Controlled Height */}
      <Card className={maxHeight}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Day Details
          </CardTitle>
        </CardHeader>

        <CardContent className="h-full flex flex-col overflow-hidden">
          {selectedDate ? (
            <div className="h-full flex flex-col overflow-hidden">
              {/* Date Header - Fixed Height */}
              <div className="pb-4 border-b">
                <h4 className="font-medium text-lg">{format(selectedDate, 'EEEE')}</h4>
                <p className="text-muted-foreground">{format(selectedDate, 'MMMM d, yyyy')}</p>
              </div>

              {selectedDayData ? (
                <div className="flex-1 flex flex-col overflow-hidden pt-4">
                  {/* Status and Summary - Fixed Height */}
                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant={getStatusBadgeVariant(selectedDayData.status)}>
                        {getStatusText(selectedDayData.status)}
                      </Badge>
                    </div>
                    {selectedDayData.totalMinutes > 0 && (
                      <div className="text-sm font-medium">{formatDuration(selectedDayData.totalMinutes)}</div>
                    )}
                  </div>

                  {/* Working Day Content - Flexible Height with Scroll */}
                  {selectedDayData.isWorkingDay ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Scrollable Content Area */}
                      <div className="flex-1 overflow-hidden">
                        {entriesLoading ? (
                          <div className="text-sm text-muted-foreground">Loading entries...</div>
                        ) : entriesError ? (
                          <div className="text-sm text-destructive">Error loading entries</div>
                        ) : dayEntries?.entries && dayEntries.entries.length > 0 ? (
                          <div className="h-full flex flex-col">
                            <Separator className="mb-4" />
                            <div className="flex-1 overflow-hidden">
                              <h5 className="text-sm font-medium mb-3">Time Entries ({dayEntries.entries.length})</h5>
                              <div className="h-full overflow-y-auto pr-2 space-y-2">
                                {dayEntries.entries.map((entry) => (
                                  <div key={entry.id} className="p-2 bg-muted/50 rounded-md border text-xs space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">{entry.jiraTaskId}</span>
                                      <Badge
                                        variant={entry.status === 'logged' ? 'default' : 'secondary'}
                                        className="text-xs px-1 py-0"
                                      >
                                        {formatDuration(entry.duration)}
                                      </Badge>
                                    </div>
                                    <p className="text-muted-foreground truncate">{entry.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Separator className="mb-4" />
                            <div className="text-sm text-muted-foreground">No entries found for this day.</div>
                          </div>
                        )}
                      </div>

                      {/* Action Cards - Fixed Height at Bottom */}
                      <div className="pt-4 border-t">
                        {selectedDayData.status === 'no-logs' && (
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-900/20 dark:border-orange-800">
                            <p className="text-sm text-orange-800 dark:text-orange-200 mb-2">
                              No time logs recorded for this day yet.
                            </p>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex items-center gap-1" asChild>
                                <Link to="/log-entry">
                                  <Plus className="h-3 w-3" />
                                  Add Log
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}

                        {selectedDayData.status === 'draft' && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                            <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                              You have draft time logs for this day.
                            </p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                                <Link to="/day/$date" params={{ date: selectedDateStr }}>
                                  <Edit3 className="h-3 w-3" />
                                  Edit Drafts
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}

                        {selectedDayData.status === 'logged' && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                            <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                              Time logs completed for this day.
                            </p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                                <Link to="/day/$date" params={{ date: selectedDateStr }}>
                                  <ExternalLink className="h-3 w-3" />
                                  View Details
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                                <Link to="/log-entry">
                                  <Plus className="h-3 w-3" />
                                  Add More
                                </Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">This is not a working day.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No data available for this date.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Select a day to view details</p>
              <p className="text-xs text-muted-foreground mt-1">
                Click any day on the calendar to see time entries and actions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
