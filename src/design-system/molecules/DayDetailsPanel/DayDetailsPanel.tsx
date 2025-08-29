import { format } from 'date-fns';
import { Clock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/design-system/atoms/Icon/Icon';
import { Typography } from '@/design-system/atoms/Typography/Typography';
import { StatusBadge } from '@/design-system/molecules/StatusBadge/StatusBadge';
import { TimeDisplay } from '@/design-system/molecules/TimeDisplay/TimeDisplay';
import { TimeEntryCard } from '@/design-system/organisms/TimeEntryCard/TimeEntryCard';

type DayData = {
  date: string;
  status: 'logged' | 'draft' | 'no-logs';
  totalMinutes: number;
  isWorkingDay: boolean;
};

type TimeEntry = {
  id: string;
  jiraTaskId: string;
  description: string;
  duration: number;
  status: 'logged' | 'draft';
  createdAt: string;
  originalMessage: string;
};

type DayDetailsData = {
  entries: TimeEntry[];
  totalMinutes: number;
};

type DayDetailsPanelProps = {
  selectedDate: Date | null;
  selectedDayData: DayData | null;
  dayEntries: DayDetailsData | null;
  entriesLoading: boolean;
  entriesError: boolean;
  maxHeight?: string;
};

const renderEntriesContent = (entriesLoading: boolean, entriesError: boolean, dayEntries: DayDetailsData | null) => {
  if (entriesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Typography variant="small" color="muted">
          Loading entries...
        </Typography>
      </div>
    );
  }

  if (entriesError) {
    return (
      <div className="flex items-center justify-center py-8">
        <Typography variant="small" color="error">
          Error loading entries
        </Typography>
      </div>
    );
  }

  if (dayEntries?.entries && dayEntries.entries.length > 0) {
    return (
      <div className="space-y-3">
        {dayEntries.entries.map((entry, index) => (
          <TimeEntryCard
            key={entry.id}
            entry={{
              id: entry.id,
              jiraTaskId: entry.jiraTaskId,
              description: entry.description,
              duration: entry.duration,
              status: entry.status,
              createdAt: entry.createdAt,
              originalMessage: entry.originalMessage,
            }}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <Typography variant="small" color="muted">
        No entries for this day
      </Typography>
    </div>
  );
};

const renderStatusActionCard = (status: string) => {
  if (status === 'no-logs') {
    return (
      <div className="p-3 bg-muted/50 rounded-lg">
        <Typography variant="small" color="muted">
          Ready to log time for this day
        </Typography>
      </div>
    );
  }

  if (status === 'draft') {
    return (
      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
        <Typography variant="small" className="text-blue-700 dark:text-blue-300">
          Draft entries need to be reviewed and shipped
        </Typography>
      </div>
    );
  }

  if (status === 'logged') {
    return (
      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
        <Typography variant="small" className="text-green-700 dark:text-green-300">
          All entries logged for this day
        </Typography>
      </div>
    );
  }

  return null;
};

export const DayDetailsPanel = ({
  selectedDate,
  selectedDayData,
  dayEntries,
  entriesLoading,
  entriesError,
  maxHeight = 'h-[600px]',
}: DayDetailsPanelProps) => {
  return (
    <Card className={maxHeight}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Icon icon={Clock} size="sm" />
          <Typography variant="h3" as="span">
            Day Details
          </Typography>
        </CardTitle>
      </CardHeader>

      <CardContent className="h-full flex flex-col overflow-hidden">
        {selectedDate ? (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Date Header - Fixed Height */}
            <div className="pb-4 border-b">
              <Typography variant="h4" className="font-medium">
                {format(selectedDate, 'EEEE')}
              </Typography>
              <Typography variant="small" color="muted">
                {format(selectedDate, 'MMMM d, yyyy')}
              </Typography>
            </div>

            {selectedDayData ? (
              <div className="flex-1 flex flex-col overflow-hidden pt-4">
                {/* Status and Summary - Fixed Height */}
                <div className="flex items-center justify-between pb-4">
                  <div className="flex items-center gap-2">
                    <Typography variant="small" className="font-medium">
                      Status:
                    </Typography>
                    <StatusBadge status={selectedDayData.status} />
                  </div>
                  {selectedDayData.totalMinutes > 0 && (
                    <TimeDisplay duration={selectedDayData.totalMinutes} className="font-medium" />
                  )}
                </div>

                {/* Working Day Content - Flexible Height with Scroll */}
                {selectedDayData.isWorkingDay ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-auto">
                      {renderEntriesContent(entriesLoading, entriesError, dayEntries)}
                    </div>

                    {/* Action Cards - Fixed Height at Bottom */}
                    <div className="pt-4 border-t">{renderStatusActionCard(selectedDayData.status)}</div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <Typography variant="small" color="muted">
                        This is not a working day.
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <Typography variant="small" color="muted">
                  No data available for this date.
                </Typography>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <Icon icon={Clock} size="lg" className="mx-auto text-muted-foreground/50 mb-4" />
            <Typography variant="body" color="muted">
              Select a day to view details
            </Typography>
            <Typography variant="tiny" color="muted" className="mt-1">
              Click any day on the calendar to see time entries and actions
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
