import { calendarQueries } from 'api/actions/calendar';
import { useQuery } from '../useQuery/useQuery';

export const useDayEntries = (date: string) => {
  return useQuery(calendarQueries.day({ date }));
};
