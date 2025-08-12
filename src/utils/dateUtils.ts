import { format, parse, isValid, startOfDay, endOfDay } from 'date-fns';

/**
 * Centralized date utility functions for consistent date handling across the application
 */

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'MMMM d, yyyy';
export const SHORT_DATE_FORMAT = 'MMM d';
export const DAY_NAME_FORMAT = 'EEEE';

/**
 * Formats a date to the standard API date format (YYYY-MM-DD)
 */
export const formatDateForAPI = (date: Date): string => {
  return format(date, DATE_FORMAT);
};

/**
 * Formats a date to a human-readable display format
 */
export const formatDateForDisplay = (date: Date): string => {
  return format(date, DISPLAY_DATE_FORMAT);
};

/**
 * Formats a date to a short display format (MMM d)
 */
export const formatDateShort = (date: Date): string => {
  return format(date, SHORT_DATE_FORMAT);
};

/**
 * Gets the day name from a date (e.g., "Monday")
 */
export const formatDayName = (date: Date): string => {
  return format(date, DAY_NAME_FORMAT);
};

/**
 * Parses a date string in YYYY-MM-DD format to a Date object
 */
export const parseDateFromAPI = (dateString: string): Date | null => {
  try {
    const parsed = parse(dateString, DATE_FORMAT, new Date());
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Validates if a date string is in the correct format and is a valid date
 */
export const isValidDateString = (dateString: string): boolean => {
  const parsed = parseDateFromAPI(dateString);
  return parsed !== null;
};

/**
 * Gets the current date in API format (YYYY-MM-DD)
 */
export const getCurrentDateString = (): string => {
  return formatDateForAPI(new Date());
};

/**
 * Checks if a date string represents today
 */
export const isToday = (dateString: string): boolean => {
  return dateString === getCurrentDateString();
};

/**
 * Checks if a date string represents a past date
 */
export const isPast = (dateString: string): boolean => {
  const date = parseDateFromAPI(dateString);
  if (!date) return false;
  return date < startOfDay(new Date());
};

/**
 * Checks if a date string represents a future date
 */
export const isFuture = (dateString: string): boolean => {
  const date = parseDateFromAPI(dateString);
  if (!date) return false;
  return date > endOfDay(new Date());
};

/**
 * Gets a user-friendly relative description of a date
 */
export const getDateDescription = (dateString: string): string => {
  if (isToday(dateString)) {
    return 'Today';
  }
  if (isPast(dateString)) {
    return 'Past date';
  }
  if (isFuture(dateString)) {
    return 'Future date';
  }
  return 'Unknown';
};

/**
 * Validates if a date is within reasonable bounds for time logging
 * (e.g., not too far in the past or future)
 */
export const isValidTimeLoggingDate = (dateString: string): boolean => {
  const date = parseDateFromAPI(dateString);
  if (!date) return false;

  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const sixMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());

  return date >= oneYearAgo && date <= sixMonthsFromNow;
};

/**
 * Converts a Date object to a URL-safe date parameter
 */
export const dateToURLParam = (date: Date): string => {
  return formatDateForAPI(date);
};

/**
 * Parses a URL date parameter and validates it
 */
export const parseURLDateParam = (param: string | undefined): string | null => {
  if (!param) return null;

  // Handle both direct date strings and URL-encoded dates
  const decoded = decodeURIComponent(param);

  if (isValidDateString(decoded) && isValidTimeLoggingDate(decoded)) {
    return decoded;
  }

  return null;
};

/**
 * Creates a standardized date context object for components
 */
export interface DateContext {
  dateString: string;
  displayDate: string;
  dayName: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  description: string;
}

/**
 * Creates a complete date context from a date string
 */
export const createDateContext = (dateString: string): DateContext | null => {
  const date = parseDateFromAPI(dateString);
  if (!date) return null;

  return {
    dateString,
    displayDate: formatDateForDisplay(date),
    dayName: formatDayName(date),
    isToday: isToday(dateString),
    isPast: isPast(dateString),
    isFuture: isFuture(dateString),
    description: getDateDescription(dateString),
  };
};

/**
 * Utility to format duration in minutes to human-readable format
 * (Not date-related but commonly used alongside date utilities)
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};
