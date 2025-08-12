import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Calendar, Clock, ExternalLink, CheckCircle, Ship } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ParseMessageResponse } from '@/api/actions/timeLogs/timeLogs.types';
import { formatDuration } from '@/utils/dateUtils';
import { useShipEntries } from '@/hooks';

interface ParsedEntriesDisplayProps {
  data: ParseMessageResponse;
  date: string; // Use string directly for consistency
}

export const ParsedEntriesDisplay: React.FC<ParsedEntriesDisplayProps> = ({ data, date }) => {
  const navigate = useNavigate();
  const shipEntriesMutation = useShipEntries();

  const totalDuration = data.entries.reduce((sum, entry) => sum + entry.duration, 0);

  const handleViewDay = () => {
    navigate({ to: '/day/$date', params: { date } });
  };

  const handleShipEntries = async () => {
    if (data.entries.length === 0) return;

    try {
      await shipEntriesMutation.mutateAsync({
        entryIds: data.entries.map((entry) => entry.id),
        date,
      });
      // After successful shipping, navigate to day view to see results
      handleViewDay();
    } catch {
      // Error handling is managed by the hook
    }
  };

  return (
    <div className="space-y-4">
      {/* Success Alert with Navigation */}
      <Alert className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="text-green-800 dark:text-green-200 flex items-center justify-between">
          <span>
            ✅ Successfully parsed {data.entries.length} time {data.entries.length === 1 ? 'entry' : 'entries'} with{' '}
            {data.confidence}% confidence
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDay}
            className="ml-4 border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
          >
            <Calendar className="h-3 w-3 mr-1" />
            View Day
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </AlertDescription>
      </Alert>

      {/* Parsed Entries Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Parsed Time Entries
            </span>
            <Badge variant="secondary" className="text-sm">
              Total: {formatDuration(totalDuration)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.entries.map((entry, index) => (
            <div
              key={entry.id}
              className="p-4 border rounded-lg bg-muted/30 space-y-2 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {entry.jiraTaskId}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {formatDuration(entry.duration)}
                  </Badge>
                  <Badge variant={entry.status === 'draft' ? 'default' : 'secondary'} className="text-xs">
                    {entry.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">Entry #{index + 1}</span>
              </div>

              {entry.description && <p className="text-sm text-foreground leading-relaxed">{entry.description}</p>}

              <div className="text-xs text-muted-foreground pt-1 border-t">
                Created: {new Date(entry.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}

          {/* Suggestions */}
          {data.suggestions && data.suggestions.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Suggestions:</h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                {data.suggestions.map((suggestion) => (
                  <li key={suggestion} className="flex items-start gap-1">
                    <span className="text-blue-400 mt-0.5">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="font-medium text-foreground">What&apos;s Next?</h3>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button variant="outline" size="sm" onClick={handleViewDay}>
                <Calendar className="h-4 w-4 mr-2" />
                View Full Day
              </Button>
              <Button variant="outline" size="sm" onClick={handleShipEntries} disabled={shipEntriesMutation.isPending}>
                <Ship className="h-4 w-4 mr-2" />
                {shipEntriesMutation.isPending ? 'Shipping...' : 'Review & Ship'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your time entries are saved as drafts. Visit the day view to see them in context.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
