import { AxiosInstance } from 'axios';

import { ParseMessageArgs, ParseMessageResponse } from './timeLogs.types';

/**
 * Debug version of parseMessage with enhanced logging
 * Use this to troubleshoot MSW integration issues
 */
export const debugParseMessage = (client: AxiosInstance) => {
  return async (data: ParseMessageArgs): Promise<ParseMessageResponse> => {
    // eslint-disable-next-line no-console
    console.log('🐛 DEBUG: Sending parseMessage request:', {
      url: '/api/time-logs/parse',
      method: 'POST',
      data,
    });

    try {
      const response = await client.post<ParseMessageResponse>('/api/time-logs/parse', data);

      // eslint-disable-next-line no-console
      console.log('🐛 DEBUG: parseMessage response:', {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('🐛 DEBUG: parseMessage error:', error);
      throw error;
    }
  };
};
