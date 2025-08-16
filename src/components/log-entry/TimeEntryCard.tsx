import React from 'react';
import { Clock, FileText, Calendar, ExternalLink } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TimeEntry } from '@/api/actions/timeLogs/timeLogs.types';
import { formatDuration } from '@/utils/dateUtils';

interface TimeEntryCardProps {
  entry: TimeEntry;
  index: number;
  className?: string;
}

export const TimeEntryCard: React.FC<TimeEntryCardProps> = ({ entry, index, className }) => {
  const isLogged = entry.status === 'logged';
  const isDraft = entry.status === 'draft';

  // Get badge variant based on status
  const getBadgeVariant = () => {
    if (isDraft) return 'default';
    if (isLogged) return 'secondary';
    return 'outline';
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isDraft ? 'border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20' : ''
      } ${isLogged ? 'border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-950/20' : ''} ${
        className || ''
      }`}
    >
      <CardContent className="p-4">
        {/* Header with Task ID and Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-sm font-medium">
              <ExternalLink className="h-3 w-3 mr-1" />
              {entry.jiraTaskId}
            </Badge>
            <Badge variant={getBadgeVariant()} className="text-xs capitalize">
              {entry.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Entry</span>
            <Badge variant="outline" className="text-xs">
              #{index + 1}
            </Badge>
          </div>
        </div>

        {/* Duration Display */}
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-lg">{formatDuration(entry.duration)}</span>
          <span className="text-sm text-muted-foreground">({entry.duration} minutes)</span>
        </div>

        {/* Description */}
        {entry.description && (
          <div className="mb-3">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground leading-relaxed flex-1">{entry.description}</p>
            </div>
          </div>
        )}

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-border/50 space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Created: {new Date(entry.createdAt).toLocaleString()}</span>
          </div>
          {entry.loggedAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Logged: {new Date(entry.loggedAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Original Message Preview (for drafts) */}
        {isDraft && entry.originalMessage && (
          <div className="mt-3 p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Original message:</p>
            <p className="text-xs text-muted-foreground italic line-clamp-2">&ldquo;{entry.originalMessage}&rdquo;</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
