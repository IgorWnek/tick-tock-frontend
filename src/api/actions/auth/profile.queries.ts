import { AxiosInstance } from 'axios';

import { queryFactoryOptions } from '../../utils/queryFactoryOptions';

import { GetMeQueryResponse } from './auth.types';

/**
 * Profile management queries for user profile operations
 * These queries handle fetching user profile information
 */

/**
 * Get current user profile information
 * This is an alias to the existing getCurrentUser but in the profile context
 */
const getProfile = (client: AxiosInstance) => async () => {
  return (await client.get<GetMeQueryResponse>('/me')).data;
};

export const profileQueries = {
  all: () => ['profile'],

  /**
   * Get current user profile
   * Uses the same endpoint as auth.queries.me but provides profile-specific context
   */
  me: () =>
    queryFactoryOptions({
      queryKey: [...profileQueries.all(), 'me'],
      queryFn: getProfile,
    }),
};
