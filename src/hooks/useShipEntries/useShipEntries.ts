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

        // Invalidate all calendar-related queries to ensure fresh data
        queryClient.invalidateQueries({
          queryKey: ['time-logs'],
        });

        // Also invalidate specific queries for safety
        queryClient.invalidateQueries({
          queryKey: [...calendarQueries.calendar(), month],
        });

        queryClient.invalidateQueries({
          queryKey: [...calendarQueries.days(), date],
        });

        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.log(
            `🔄 Query invalidation: Invalidated all time-logs queries for ${month} and day ${date} after shipping`,
          );
        }
      }
    },
  });
};
