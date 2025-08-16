import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Clock, FileText, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

import { TimeEntryCard } from './TimeEntryCard';
import { ShipItButton } from './ShipItButton';
import { RefineButton } from './RefineButton';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ParseMessageResponse } from '@/api/actions/timeLogs/timeLogs.types';
import { formatDuration } from '@/utils/dateUtils';
import { useShipEntries, useRefineEntry } from '@/hooks';

interface DraftReviewProps {
  initialData: ParseMessageResponse;
  date: string;
  onNavigateToDay?: () => void;
  className?: string;
}

export const DraftReview: React.FC<DraftReviewProps> = ({ initialData, date, onNavigateToDay, className }) => {
  // State to manage current data (may be updated after refinement)
  const [currentData, setCurrentData] = useState<ParseMessageResponse>(initialData);
  const [showRefinement, setShowRefinement] = useState(false);
  const [refinementMessage, setRefinementMessage] = useState('');

  const shipEntriesMutation = useShipEntries();
  const refineEntryMutation = useRefineEntry();

  // Update current data when initial data changes (new parse)
  useEffect(() => {
    setCurrentData(initialData);
  }, [initialData]);

  // Get badge variant based on confidence level
  const getConfidenceBadgeVariant = () => {
    if (currentData.confidence >= 80) return 'default';
    if (currentData.confidence >= 60) return 'secondary';
    return 'destructive';
  };

  const totalDuration = currentData.entries.reduce((sum: number, entry) => sum + entry.duration, 0);
  const entryCount = currentData.entries.length;

  // Handle shipping all entries
  const handleShipAll = async () => {
    if (currentData.entries.length === 0) return;

    try {
      await shipEntriesMutation.mutateAsync({
        entryIds: currentData.entries.map((entry) => entry.id),
        date,
      });
      // Optionally navigate to day view after successful shipping
      onNavigateToDay?.();
    } catch {
      // Error handling is managed by the hook
    }
  };

  // Handle refinement request
  const handleRefine = async () => {
    if (!refinementMessage.trim()) {
      return;
    }

    // For now, refine the first entry as an example
    // In a real app, you might want to refine all entries or specific ones
    const firstEntry = currentData.entries[0];
    if (!firstEntry) return;

    try {
      const refinementResponse = await refineEntryMutation.mutateAsync({
        entryId: firstEntry.id,
        refinementRequest: refinementMessage.trim(),
        originalMessage: firstEntry.originalMessage,
        date, // Pass date for proper cache invalidation
      });

      // Update current data with refined entries
      setCurrentData({
        entries: refinementResponse.entries,
        confidence: refinementResponse.confidence,
        suggestions: refinementResponse.suggestions,
        totalDuration: refinementResponse.entries.reduce((sum: number, entry) => sum + entry.duration, 0),
      });

      // Reset refinement UI after success
      setRefinementMessage('');
      setShowRefinement(false);
    } catch {
      // Error handling is managed by the hook
    }
  };

  const isAnyMutationPending = shipEntriesMutation.isPending || refineEntryMutation.isPending;

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Header with Summary */}
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-blue-900 dark:text-blue-100">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Draft Review
            </div>
            <Badge variant="secondary" className="text-sm font-semibold">
              {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900 dark:text-blue-100">
                  Total: {formatDuration(totalDuration)}
                </span>
              </div>
              <Badge variant={getConfidenceBadgeVariant()} className="text-xs">
                {currentData.confidence}% confidence
              </Badge>
            </div>

            {/* Confidence indicator */}
            {currentData.confidence >= 80 ? (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">High confidence</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Consider refinement</span>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {currentData.suggestions && currentData.suggestions.length > 0 && (
            <div className="mt-4 p-3 bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-1">
                💡 Suggestions
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                {currentData.suggestions.map((suggestion) => (
                  <li key={suggestion} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Entry Cards */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Parsed Entries
        </h3>

        <div className="space-y-3">
          {currentData.entries.map((entry, index) => (
            <TimeEntryCard
              key={entry.id}
              entry={entry}
              index={index}
              className="transition-all duration-300 hover:scale-[1.01]"
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-medium text-foreground mb-3">Ready to finalize your time log?</h3>

              <div className="flex gap-3 justify-center flex-wrap">
                <ShipItButton
                  onClick={handleShipAll}
                  disabled={isAnyMutationPending}
                  isPending={shipEntriesMutation.isPending}
                  entryCount={entryCount}
                  className="min-w-[160px]"
                />

                <RefineButton
                  onClick={() => setShowRefinement(!showRefinement)}
                  disabled={isAnyMutationPending}
                  isPending={refineEntryMutation.isPending}
                />
              </div>
            </div>

            {/* Refinement Interface */}
            {showRefinement && (
              <div className="mt-6 p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/30 dark:bg-blue-950/20 animate-in slide-in-from-top-2 duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="refinement-message"
                      className="text-sm font-medium text-blue-900 dark:text-blue-100"
                    >
                      🧐 Describe what changes should be made:
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRefinement(false)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      {showRefinement ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  <Textarea
                    id="refinement-message"
                    value={refinementMessage}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRefinementMessage(e.target.value)}
                    placeholder="Example: Split the XYZ-1111 task into 2 hours for coding and 1 hour for testing..."
                    className="min-h-[100px] border-blue-300 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-500"
                    disabled={isAnyMutationPending}
                  />

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRefinement(false)}
                      disabled={isAnyMutationPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRefine}
                      disabled={!refinementMessage.trim() || isAnyMutationPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {refineEntryMutation.isPending ? 'Refining...' : 'Apply Refinement'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              Your entries are saved as drafts until you ship them.
              {onNavigateToDay && ' Use "Ship It" to make them permanent.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
