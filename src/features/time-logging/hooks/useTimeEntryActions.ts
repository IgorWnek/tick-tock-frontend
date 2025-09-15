import { useCallback } from 'react';

import { useShipEntries } from '@/hooks/useShipEntries/useShipEntries';
import { useRefineEntry } from '@/hooks/useRefineEntry/useRefineEntry';
import { TimeEntry } from '@/api/actions/timeLogs/timeLogs.types';

export type TimeEntryAction = 'ship' | 'refine' | 'view';

export const useTimeEntryActions = () => {
  const { mutate: shipEntries } = useShipEntries();
  const { mutate: refineEntry } = useRefineEntry();

  const handleTimeEntryAction = useCallback(
    (action: TimeEntryAction, entry: TimeEntry) => {
      switch (action) {
        case 'ship': {
          const date = entry.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10);
          shipEntries({ entryIds: [entry.id], date });
          break;
        }
        case 'refine': {
          refineEntry({
            entryId: entry.id,
            refinementRequest: 'Improve description',
            originalMessage: entry.originalMessage,
            date: entry.createdAt?.slice(0, 10),
          });
          break;
        }
        case 'view': {
          break;
        }
        default:
          break;
      }
    },
    [shipEntries, refineEntry],
  );

  return { handleTimeEntryAction };
};
