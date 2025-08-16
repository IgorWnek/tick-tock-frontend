import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RefineEntryArgs, RefineEntryResponse } from '@/api/actions/timeLogs/timeLogs.types';

const refineEntry = async (args: RefineEntryArgs): Promise<RefineEntryResponse> => {
  const response = await fetch('/api/time-logs/refine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });

  if (!response.ok) {
    throw new Error('Failed to refine entry');
  }

  return response.json();
};

export const useRefineEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refineEntry,
    onSuccess: (data, variables) => {
      // Note: In a real app, you would show a toast notification here
      // toast.success(`✨ Refined entries with ${data.confidence}% confidence`);

      // More targeted cache invalidation based on the specific date
      const targetDate = variables.date || new Date().toISOString().split('T')[0];

      // Invalidate queries for the specific date to refresh data
      queryClient.invalidateQueries({ queryKey: ['calendar', 'day-entries', targetDate] });
      queryClient.invalidateQueries({ queryKey: ['day-entries', targetDate] });

      // Invalidate calendar data to update status indicators
      const monthKey = targetDate.substring(0, 7); // YYYY-MM format
      queryClient.invalidateQueries({ queryKey: ['calendar', 'data', monthKey] });

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log(`🔄 TanStack Query: Invalidated cache for date ${targetDate} after refinement`);
      }
    },
    onError: (error) => {
      // Note: In a real app, you would show an error toast here
      // toast.error('Failed to refine entries. Please try again.');

      // For development, we can still log the error
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Refinement failed:', error);
      }
    },
  });
};
