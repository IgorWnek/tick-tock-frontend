import { useQueryClient } from '@tanstack/react-query';

import { calendarQueries } from 'api/actions/calendar';
import { useMutation } from 'hooks/useMutation/useMutation';

export const useShipEntries = () => {
  const queryClient = useQueryClient();

  return useMutation('shipEntries', {
    meta: {
      successMessage: 'Entries shipped successfully!',
      errorMessage: 'Failed to ship entries. Please try again.',
    },
    onSuccess: (data, variables) => {
      // Extract the date from the mutation variables
      const date = variables.date;

      if (date && data.success) {
        // Extract month from date (YYYY-MM-DD -> YYYY-MM)
        const month = date.substring(0, 7);

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log(`🔄 Query invalidation: Starting cache invalidation for date ${date} and month ${month}`);
        }

        // Invalidate specific day entries query first
        queryClient.invalidateQueries({
          queryKey: [...calendarQueries.days(), date],
        });

        // Invalidate calendar data for the month
        queryClient.invalidateQueries({
          queryKey: [...calendarQueries.calendar(), month],
        });

        // Invalidate all time-logs queries for safety
        queryClient.invalidateQueries({
          queryKey: ['time-logs'],
        });

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log(
            `🔄 Query invalidation: Completed invalidation for day ${date}, month ${month}, and all time-logs queries`,
          );
        }
      }
    },
  });
};
