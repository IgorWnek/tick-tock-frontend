import { DefaultBodyType, HttpResponse, PathParams } from 'msw';

import {
  GetMeQueryResponse,
  GetUsersResponse,
  LoginMutationArguments,
  LoginMutationResponse,
} from 'api/actions/auth/auth.types';
import { GetCalendarDataResponse, GetDayEntriesResponse } from 'api/actions/calendar/calendar.types';
import {
  ParseMessageArgs,
  ParseMessageResponse,
  RefineEntryArgs,
  RefineEntryResponse,
  ShipEntriesArgs,
  ShipEntriesResponse,
} from 'api/actions/timeLogs/timeLogs.types';

import { calendarHandlers } from './calendar.handlers';
import { timeLogsHandlers } from './timeLogs.handlers';
import { http } from './http';

const authorizeHandler = http.post<LoginMutationArguments, never, LoginMutationResponse>('/authorize', async () =>
  HttpResponse.json(
    {
      accessToken: 'MTQ0NjJkZmQ5OTM2NDE1ZTZjNGZmZjI3',
      tokenType: 'bearer',
      expires: 123,
      refreshToken: 'IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk',
    },
    { status: 200 },
  ),
);
const meHandler = http.get<PathParams, DefaultBodyType, GetMeQueryResponse>('/me', async () =>
  HttpResponse.json(
    {
      firstName: 'Mike',
      lastName: 'Tyson',
      username: 'mike',
    },
    { status: 200 },
  ),
);

const createUsers = (numUsers = 40) => {
  return Array.from({ length: numUsers }, (el, index) => ({ id: `${index}`, name: `User ${index + 1}` }));
};

const usersHandler = http.get<PathParams, DefaultBodyType, GetUsersResponse>('/users', ({ request }) => {
  const url = new URL(request.url);

  const pageParam = url.searchParams.get('page');
  const countParam = url.searchParams.get('count');
  const page = pageParam ? parseInt(pageParam) : null;
  const count = countParam ? parseInt(countParam) : null;
  const allUsers = createUsers();

  if (page === null || count === null) {
    return HttpResponse.json({ users: allUsers }, { status: 200 });
  }

  const start = (page - 1) * count;
  const end = start + count;
  const nextPageCursor = end >= allUsers.length ? null : page + 1;
  const paginatedUsers = allUsers.slice(start, end);

  return HttpResponse.json({ users: paginatedUsers, nextPage: nextPageCursor }, { status: 200 });
});

// Calendar handlers
const calendarDataHandler = http.get<{ month: string }, DefaultBodyType, GetCalendarDataResponse>(
  '/api/time-logs/calendar/:month',
  async ({ params }) => {
    const response = await calendarHandlers.getCalendarData(params.month);
    return HttpResponse.json(response, { status: 200 });
  },
);

const dayEntriesHandler = http.get<{ date: string }, DefaultBodyType, GetDayEntriesResponse>(
  '/api/time-logs/day/:date',
  async ({ params }) => {
    const response = await calendarHandlers.getDayEntries(params.date);
    return HttpResponse.json(response, { status: 200 });
  },
);

// Time logs handlers
const parseMessageHandler = http.post<PathParams, ParseMessageArgs, ParseMessageResponse>(
  '/api/time-logs/parse',
  async ({ request }) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('🔧 MSW: parseMessage handler called');
    }

    try {
      const body = await request.json();

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('🔧 MSW: parseMessage request body:', body);
      }

      const response = await timeLogsHandlers.parseMessage(body.message, body.date);

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('🔧 MSW: parseMessage response:', response);
      }

      return HttpResponse.json(response, { status: 200 });
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('🔧 MSW: parseMessage error:', error);
      }
      // Return a valid ParseMessageResponse format for errors
      return HttpResponse.json(
        {
          entries: [],
          confidence: 0,
          suggestions: ['Server error occurred. Please try again.'],
          totalDuration: 0,
        },
        { status: 500 },
      );
    }
  },
);

const refineEntryHandler = http.post<PathParams, RefineEntryArgs, RefineEntryResponse>(
  '/api/time-logs/refine',
  async ({ request }) => {
    const body = await request.json();
    const response = await timeLogsHandlers.refineEntry(body.entryId, body.refinementRequest, body.originalMessage);
    return HttpResponse.json(response, { status: 200 });
  },
);

const shipEntriesHandler = http.post<PathParams, ShipEntriesArgs, ShipEntriesResponse>(
  '/api/time-logs/ship',
  async ({ request }) => {
    const body = await request.json();
    const response = await timeLogsHandlers.shipEntries(body.entryIds, body.date);
    return HttpResponse.json(response, { status: 200 });
  },
);

export const handlers = [
  authorizeHandler,
  meHandler,
  usersHandler,
  calendarDataHandler,
  dayEntriesHandler,
  parseMessageHandler,
  refineEntryHandler,
  shipEntriesHandler,
];
