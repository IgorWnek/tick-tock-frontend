import { AxiosInstance } from 'axios';

import {
  ParseMessageArgs,
  ParseMessageResponse,
  RefineEntryArgs,
  RefineEntryResponse,
  ShipEntriesArgs,
  ShipEntriesResponse,
} from './timeLogs.types';

export const timeLogsMutations = {
  parseMessage:
    (client: AxiosInstance) =>
    async (data: ParseMessageArgs): Promise<ParseMessageResponse> => {
      // Debug logging for development
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('🔧 API: Sending parseMessage request:', {
          url: '/api/time-logs/parse',
          method: 'POST',
          data,
        });
      }

      try {
        const response = await client.post<ParseMessageResponse>('/api/time-logs/parse', data);

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log('🔧 API: parseMessage response:', {
            status: response.status,
            data: response.data,
          });
        }

        return response.data;
      } catch (error) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.error('🔧 API: parseMessage error:', error);
        }
        throw error;
      }
    },
  refineEntry:
    (client: AxiosInstance) =>
    async (data: RefineEntryArgs): Promise<RefineEntryResponse> => {
      return (await client.post<RefineEntryResponse>('/api/time-logs/refine', data)).data;
    },
  shipEntries:
    (client: AxiosInstance) =>
    async (data: ShipEntriesArgs): Promise<ShipEntriesResponse> => {
      return (await client.post<ShipEntriesResponse>('/api/time-logs/ship', data)).data;
    },
};
