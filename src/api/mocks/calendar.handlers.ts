import {
  CalendarDayData,
  CalendarDayStatus,
  GetCalendarDataResponse,
  GetDayEntriesResponse,
  TimeLogEntry,
} from 'api/actions/calendar/calendar.types';

// Helper function to determine day status based on date
const getDayStatus = (date: Date): { status: CalendarDayStatus; entryCount: number; totalMinutes: number } => {
  const today = new Date();
  const isPastDate = date < today;
  const isToday = date.toDateString() === today.toDateString();

  if (isPastDate || isToday) {
    const rand = Math.random();
    if (rand < 0.6) {
      return {
        status: 'logged',
        entryCount: Math.floor(Math.random() * 4) + 1,
        totalMinutes: Math.floor(Math.random() * 240) + 240,
      };
    } else if (rand < 0.8) {
      return {
        status: 'draft',
        entryCount: Math.floor(Math.random() * 3) + 1,
        totalMinutes: Math.floor(Math.random() * 180) + 120,
      };
    }
  } else if (Math.random() < 0.1) {
    return {
      status: 'draft',
      entryCount: 1,
      totalMinutes: Math.floor(Math.random() * 120) + 60,
    };
  }

  return { status: 'no-logs', entryCount: 0, totalMinutes: 0 };
};

// Helper function to generate mock calendar data
const generateCalendarData = (month: string): CalendarDayData[] => {
  const [year, monthNumber] = month.split('-').map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const days: CalendarDayData[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthNumber - 1, day);
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 5;

    const { status, entryCount, totalMinutes } = isWorkingDay
      ? getDayStatus(date)
      : { status: 'no-logs' as CalendarDayStatus, entryCount: 0, totalMinutes: 0 };

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

// Helper function to generate mock time log entries for a specific day
const generateDayEntries = (date: string): TimeLogEntry[] => {
  const calendarData = generateCalendarData(date.substring(0, 7)); // Get month data
  const dayData = calendarData.find((day) => day.date === date);

  if (!dayData || dayData.entryCount === 0) {
    return [];
  }

  const entries: TimeLogEntry[] = [];
  const jiraTasks = ['XYZ-1111', 'XYZ-2222', 'ABC-3333', 'DEF-4444', 'GHI-5555'];

  for (let i = 0; i < dayData.entryCount; i++) {
    const taskId = jiraTasks[Math.floor(Math.random() * jiraTasks.length)];
    const duration = Math.floor(Math.random() * 180) + 60; // 1-4 hours
    const entryDate = new Date(date);

    entries.push({
      id: `entry-${date}-${i + 1}`,
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
    // Add realistic delay
    return new Promise<GetCalendarDataResponse>((resolve) => {
      setTimeout(
        () => {
          resolve({
            month,
            days: generateCalendarData(month),
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
