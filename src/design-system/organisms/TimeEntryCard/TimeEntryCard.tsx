import React from 'react';
import { Calendar, Clock, ExternalLink, FileText } from 'lucide-react';

import { TimeEntry } from '@/api/actions/timeLogs/timeLogs.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/design-system/atoms/Icon/Icon';
import { Typography } from '@/design-system/atoms/Typography/Typography';
import { StatusBadge } from '@/design-system/molecules/StatusBadge/StatusBadge';
import { TimeDisplay } from '@/design-system/molecules/TimeDisplay/TimeDisplay';
import { cn } from '@/lib/utils';

export interface TimeEntryCardProps {
  entry: TimeEntry;
  index: number;
  onAction?: (action: 'ship' | 'refine' | 'view', entry: TimeEntry) => void;
  className?: string;
}

export const TimeEntryCard = ({ entry, index, className }: TimeEntryCardProps) => {
  const isLogged = entry.status === 'logged';
  const isDraft = entry.status === 'draft';

  const cardStatusClass = isDraft ? 'card-time-entry-draft' : isLogged ? 'card-time-entry-logged' : '';

  return (
    <Card className={cn('transition-all duration-200 hover:shadow-md', cardStatusClass, className)}>
      <CardContent className="p-4">
        {/* Header with Task ID and Status */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-sm font-medium">
              <Icon icon={ExternalLink} size="xs" className="mr-1" aria-hidden />
              {entry.jiraTaskId}
            </Badge>
            <StatusBadge status={entry.status as 'draft' | 'logged'} />
          </div>
          <div className="flex items-center gap-1">
            <Typography variant="tiny" color="muted">
              Entry
            </Typography>
            <Badge variant="outline" className="text-xs">
              #{index + 1}
            </Badge>
          </div>
        </div>

        {/* Duration Display */}
        <div className="mb-3 flex items-center gap-2">
          <Icon icon={Clock} size="sm" color="muted" aria-hidden />
          <Typography as="span" variant="h4" className="font-semibold">
            <TimeDisplay duration={entry.duration} showIcon={false} variant="compact" />
          </Typography>
          <Typography as="span" variant="small" color="muted">
            ({entry.duration} minutes)
          </Typography>
        </div>

        {/* Description */}
        {entry.description ? (
          <div className="mb-3">
            <div className="flex items-start gap-2">
              <Icon icon={FileText} size="sm" color="muted" className="mt-0.5 flex-shrink-0" aria-hidden />
              <Typography variant="small" className="flex-1 leading-relaxed">
                {entry.description}
              </Typography>
            </div>
          </div>
        ) : null}

        {/* Metadata Footer */}
        <div className="space-y-1 border-t border-border/50 pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon icon={Calendar} size="xs" aria-hidden />
            <time dateTime={new Date(entry.createdAt).toISOString()}>
              Created: {new Date(entry.createdAt).toLocaleString()}
            </time>
          </div>
          {entry.loggedAt ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon icon={Clock} size="xs" aria-hidden />
              <time dateTime={new Date(entry.loggedAt).toISOString()}>
                Logged: {new Date(entry.loggedAt).toLocaleString()}
              </time>
            </div>
          ) : null}
        </div>

        {/* Original Message Preview (for drafts) */}
        {isDraft && entry.originalMessage ? (
          <div className="mt-3 rounded-md bg-muted/50 p-2">
            <Typography variant="tiny" color="muted" className="mb-1">
              Original message:
            </Typography>
            <Typography variant="tiny" color="muted" className="italic line-clamp-2">
              &ldquo;{entry.originalMessage}&rdquo;
            </Typography>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
