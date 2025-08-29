import { DefaultBodyType, HttpResponse, PathParams } from 'msw';

import { GetMeQueryResponse, GetUsersResponse, LoginMutationArguments } from 'api/actions/auth/auth.types';
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

// Enhanced user data structure for authentication and profile management
const testUsers = [
  {
    id: 'user-1',
    firstName: 'Test',
    lastName: 'User',
    username: 'user@email.com', // Use email as username for compatibility
    email: 'user@email.com',
    password: 'password', // Store in mock for validation
  },
  {
    id: 'user-2',
    firstName: 'John',
    lastName: 'Doe',
    username: 'john@example.com',
    email: 'john@example.com',
    password: 'admin123',
  },
  {
    id: 'user-3',
    firstName: 'Mike',
    lastName: 'Tyson',
    username: 'mike',
    email: 'mike@boxing.com',
    password: 'knockout',
  },
];

// In-memory storage for session state (simulates server-side session)
let currentUser: (typeof testUsers)[0] | null = null;

// Temporary types for profile management (will be moved to auth.types.ts in Task 2.2)
type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

type UpdatePasswordRequest = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const authorizeHandler = http.post<never, LoginMutationArguments>('/authorize', async ({ request }) => {
  const { username, password } = await request.json();
  const user = testUsers.find((u) => u.username === username && u.password === password);

  if (!user) {
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Set current user for session simulation
  currentUser = user;

  return HttpResponse.json(
    {
      accessToken: 'MTQ0NjJkZmQ5OTM2NDE1ZTZjNGZmZjI3',
      tokenType: 'bearer',
      expires: 3600,
      refreshToken: 'IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk',
    },
    { status: 200 },
  );
});

const meHandler = http.get('/me', async () => {
  if (!currentUser) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return HttpResponse.json(
    {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      username: currentUser.username,
      // Temporarily casting to include id and email until types are updated
      id: currentUser.id,
      email: currentUser.email,
    },
    { status: 200 },
  );
});

// Profile update endpoint - PATCH /me
const updateProfileHandler = http.patch('/me', async ({ request }) => {
  if (!currentUser) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const updates = (await request.json()) as UpdateProfileRequest;

    // Validate email uniqueness if email is being updated
    if (updates.email && updates.email !== currentUser.email) {
      const emailExists = testUsers.some((u) => u.email === updates.email && u.id !== currentUser!.id);
      if (emailExists) {
        return HttpResponse.json({ error: 'Email already in use' }, { status: 400 });
      }
    }

    // Update current user and the testUsers array
    const updatedUser = { ...currentUser };
    if (updates.firstName !== undefined) updatedUser.firstName = updates.firstName;
    if (updates.lastName !== undefined) updatedUser.lastName = updates.lastName;
    if (updates.email !== undefined) {
      updatedUser.email = updates.email;
      updatedUser.username = updates.email; // Keep username in sync with email
    }

    // Update in testUsers array for persistence
    const userIndex = testUsers.findIndex((u) => u.id === currentUser!.id);
    if (userIndex !== -1) {
      testUsers[userIndex] = updatedUser;
    }
    currentUser = updatedUser;

    return HttpResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          username: updatedUser.username,
          email: updatedUser.email,
        },
      } as unknown as GetMeQueryResponse,
      { status: 200 },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Profile update error:', error);
    return HttpResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
});

// Password update endpoint - PATCH /me/password
const updatePasswordHandler = http.patch('/me/password', async ({ request }) => {
  if (!currentUser) {
    return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword, confirmPassword } = (await request.json()) as UpdatePasswordRequest;

    // Validate current password
    if (currentPassword !== currentUser.password) {
      return HttpResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      return HttpResponse.json({ error: 'New password and confirmation do not match' }, { status: 400 });
    }

    // Validate password strength (basic check)
    if (newPassword.length < 6) {
      return HttpResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Update password in testUsers array for persistence
    const userIndex = testUsers.findIndex((u) => u.id === currentUser!.id);
    if (userIndex !== -1) {
      testUsers[userIndex].password = newPassword;
      currentUser.password = newPassword;
    }

    return HttpResponse.json(
      {
        success: true,
        message: 'Password updated successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Password update error:', error);
    return HttpResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
});

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
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('🔧 MSW: refineEntry handler called');
    }

    try {
      const body = await request.json();
      const response = await timeLogsHandlers.refineEntry(
        body.entryId,
        body.refinementRequest,
        body.originalMessage,
        body.date,
      );

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('🔧 MSW: refineEntry response:', response);
      }

      return HttpResponse.json(response, { status: 200 });
    } catch (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('🔧 MSW: refineEntry error:', error);
      }
      return HttpResponse.json(
        {
          entries: [],
          confidence: 0,
          suggestions: ['Refinement failed. Please try again.'],
        },
        { status: 500 },
      );
    }
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
  updateProfileHandler,
  updatePasswordHandler,
  usersHandler,
  calendarDataHandler,
  dayEntriesHandler,
  parseMessageHandler,
  refineEntryHandler,
  shipEntriesHandler,
];
