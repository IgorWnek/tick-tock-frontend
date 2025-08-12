import {
  CalendarDayData,
  CalendarDayStatus,
  GetCalendarDataResponse,
  GetDayEntriesResponse,
  TimeLogEntry,
} from 'api/actions/calendar/calendar.types';

import { mockDataStore, initializeMockData } from './mockDataStore';

// Helper function to generate mock calendar data using the shared data store
const generateCalendarData = (month: string): CalendarDayData[] => {
  const [year, monthNumber] = month.split('-').map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const days: CalendarDayData[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthNumber - 1, day);
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 5;

    // Use the mock data store to get accurate status
    const { status, entryCount, totalMinutes } = isWorkingDay
      ? mockDataStore.getDayStatus(dateString)
      : { status: 'no-logs' as CalendarDayStatus, entryCount: 0, totalMinutes: 0 };

    if (import.meta.env.DEV && entryCount > 0) {
      // eslint-disable-next-line no-console
      console.log(`📅 calendar.handlers: Day ${dateString} has ${entryCount} entries with status ${status}`);
    }

    days.push({
      date: dateString,
      status,
      entryCount,
      totalMinutes,
      isWorkingDay,
    });
  }

  return days;
};

// Helper function to generate mock time log entries for a specific day using the shared data store
const generateDayEntries = (date: string): TimeLogEntry[] => {
  // First check if we have real entries from the data store
  const realEntries = mockDataStore.getDayEntries(date);

  if (realEntries.length > 0) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`📅 calendar.handlers: Found ${realEntries.length} real entries for ${date}`);
    }
    return realEntries;
  }

  // Fallback to mock entries for demonstration (only for working days with random data)
  const calendarData = generateCalendarData(date.substring(0, 7)); // Get month data
  const dayData = calendarData.find((day) => day.date === date);

  if (!dayData || dayData.entryCount === 0) {
    return [];
  }

  // Generate mock entries for demo purposes
  const entries: TimeLogEntry[] = [];
  const jiraTasks = ['XYZ-1111', 'XYZ-2222', 'ABC-3333', 'DEF-4444', 'GHI-5555'];

  for (let i = 0; i < dayData.entryCount; i++) {
    const taskId = jiraTasks[Math.floor(Math.random() * jiraTasks.length)];
    const duration = Math.floor(Math.random() * 180) + 60; // 1-4 hours
    const entryDate = new Date(date);

    entries.push({
      id: `mock-entry-${date}-${i + 1}`,
      userId: 'user-123',
      date,
      jiraTaskId: taskId,
      description: `Work on ${taskId}: ${getRandomWorkDescription()}`,
      duration,
      status: dayData.status === 'logged' ? 'logged' : 'draft',
      originalMessage: `Worked on ${taskId} for ${Math.floor(duration / 60)} hours ${
        duration % 60
      } minutes. ${getRandomWorkDescription()}`,
      refinementHistory: dayData.status === 'draft' ? [] : undefined,
      createdAt: new Date(entryDate.getTime() + i * 60000).toISOString(),
      loggedAt:
        dayData.status === 'logged' ? new Date(entryDate.getTime() + i * 60000 + 3600000).toISOString() : undefined,
    });
  }

  return entries;
};

const getRandomWorkDescription = (): string => {
  const descriptions = [
    'implementing authentication system',
    'fixing bugs in the UI component',
    'writing unit tests for the service layer',
    'refactoring database queries',
    'attending team meeting and planning session',
    'code review and pair programming',
    'updating documentation and README',
    'optimizing performance and reducing load times',
    'integrating third-party API',
    'debugging production issue',
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

export const calendarHandlers = {
  getCalendarData: (month: string) => {
    // Initialize mock data on first call
    initializeMockData();

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`📅 calendar.handlers.getCalendarData: Generating calendar for ${month}`);
      // Show all dates with entries in the store
      mockDataStore.getAllDatesWithEntries();
    }

    // Add realistic delay
    return new Promise<GetCalendarDataResponse>((resolve) => {
      setTimeout(
        () => {
          const days = generateCalendarData(month);

          if (import.meta.env.DEV) {
            const daysWithEntries = days.filter((day) => day.entryCount > 0);
            // eslint-disable-next-line no-console
            console.log(
              `📅 calendar.handlers: Generated calendar for ${month}. ${daysWithEntries.length} days with entries`,
            );
          }

          resolve({
            month,
            days,
          });
        },
        300 + Math.random() * 200,
      );
    });
  },

  getDayEntries: (date: string) => {
    return new Promise<GetDayEntriesResponse>((resolve) => {
      setTimeout(
        () => {
          const entries = generateDayEntries(date);
          const totalMinutes = entries.reduce((sum, entry) => sum + entry.duration, 0);

          if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.log(
              `📅 calendar.handlers: Retrieved ${entries.length} entries for ${date}, total: ${totalMinutes}min`,
            );
          }

          resolve({
            date,
            entries,
            totalMinutes,
          });
        },
        200 + Math.random() * 150,
      );
    });
  },
};
