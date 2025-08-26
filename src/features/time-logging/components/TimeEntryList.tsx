import React from 'react';

import { Typography } from '@/design-system/atoms/Typography/Typography';
import { TimeEntry } from '@/api/actions/timeLogs/timeLogs.types';
import { TimeEntryCard as LegacyTimeEntryCard } from '@/components/log-entry/TimeEntryCard';

export interface TimeEntryListProps {
  entries: TimeEntry[];
  title?: string;
  className?: string;
}

export const TimeEntryList = ({ entries, title, className }: TimeEntryListProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <Typography variant="body" color="muted">
          No time entries found.
        </Typography>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <Typography variant="h3" className="mb-4">
          {title}
        </Typography>
      )}
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <LegacyTimeEntryCard key={entry.id} entry={entry} index={index} />
        ))}
      </div>
    </div>
  );
};
