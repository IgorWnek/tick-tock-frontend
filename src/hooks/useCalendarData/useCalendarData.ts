import { calendarQueries } from 'api/actions/calendar';
import { useQuery } from '../useQuery/useQuery';

export const useCalendarData = (month: string) => {
  return useQuery(calendarQueries.calendarMonth({ month }));
};
