import { AxiosInstance } from 'axios';

import { queryFactoryOptions } from '../../utils/queryFactoryOptions';

import {
  GetCalendarDataArgs,
  GetCalendarDataResponse,
  GetDayEntriesArgs,
  GetDayEntriesResponse,
} from './calendar.types';

const getCalendarData =
  (client: AxiosInstance, { month }: GetCalendarDataArgs) =>
  async () => {
    return (await client.get<GetCalendarDataResponse>(`/api/time-logs/calendar/${month}`)).data;
  };

const getDayEntries =
  (client: AxiosInstance, { date }: GetDayEntriesArgs) =>
  async () => {
    return (await client.get<GetDayEntriesResponse>(`/api/time-logs/day/${date}`)).data;
  };

export const calendarQueries = {
  all: () => ['time-logs'],
  calendar: () => [...calendarQueries.all(), 'calendar'],
  calendarMonth: (params: GetCalendarDataArgs) =>
    queryFactoryOptions({
      queryKey: [...calendarQueries.calendar(), params.month],
      queryFn: (client) => getCalendarData(client, params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
  days: () => [...calendarQueries.all(), 'day'],
  day: (params: GetDayEntriesArgs) =>
    queryFactoryOptions({
      queryKey: [...calendarQueries.days(), params.date],
      queryFn: (client) => getDayEntries(client, params),
      staleTime: 2 * 60 * 1000, // 2 minutes
    }),
};
