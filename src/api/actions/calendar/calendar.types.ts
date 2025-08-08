export type CalendarDayStatus = 'no-logs' | 'draft' | 'logged';

export interface CalendarDayData {
  date: string; // ISO date string (YYYY-MM-DD)
  status: CalendarDayStatus;
  entryCount: number;
  totalMinutes: number;
  isWorkingDay: boolean;
}

export interface GetCalendarDataArgs {
  month: string; // Format: YYYY-MM
}

export interface GetCalendarDataResponse {
  month: string;
  days: CalendarDayData[];
}

export interface TimeLogEntry {
  id: string;
  userId: string;
  date: string;
  jiraTaskId: string;
  description: string;
  duration: number; // minutes
  status: 'draft' | 'logged';
  originalMessage: string;
  refinementHistory?: string[];
  createdAt: string;
  loggedAt?: string;
}

export interface GetDayEntriesArgs {
  date: string; // ISO date string (YYYY-MM-DD)
}

export interface GetDayEntriesResponse {
  date: string;
  entries: TimeLogEntry[];
  totalMinutes: number;
}
