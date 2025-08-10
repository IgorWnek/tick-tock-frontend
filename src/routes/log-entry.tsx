import React, { useActionState, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Loader2, Send, Brain, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageInput, ExamplePrompts, ParsedEntriesDisplay } from '@/components/log-entry';
import { MSWDebugButton } from '@/components/debug/MSWDebugButton';
import { useParseMessage } from '@/hooks/useParseMessage';
import { ParseMessageResponse } from '@/api/actions/timeLogs/timeLogs.types';

export const Route = createFileRoute('/log-entry')({
  component: LogEntryPage,
});

interface FormState {
  success: boolean;
  error?: string;
  data?: ParseMessageResponse;
}

function LogEntryPage() {
  const navigate = useNavigate();
  const parseMessage = useParseMessage();
  const [message, setMessage] = useState('');

  // React 19 useActionState for form handling
  const [state, action, isPending] = useActionState(
    async (prevState: FormState, formData: FormData): Promise<FormState> => {
      const messageText = formData.get('message') as string;

      if (!messageText?.trim()) {
        return { success: false, error: 'Please enter a message describing your work.' };
      }

      if (messageText.length < 10) {
        return { success: false, error: 'Please provide a more detailed description (at least 10 characters).' };
      }

      // Check for at least one Jira ID
      const jiraIds = messageText.match(/[A-Z]+-\d+/g);
      if (!jiraIds || jiraIds.length === 0) {
        return { success: false, error: 'Please include at least one Jira task ID (e.g., "XYZ-123").' };
      }

      try {
        const result = await parseMessage.mutateAsync({
          message: messageText,
          date: new Date().toISOString().split('T')[0],
        });

        return { success: true, data: result };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse message:', error);
        return { success: false, error: 'Failed to parse your message. Please try again.' };
      }
    },
    { success: false },
  );

  // Handle successful parsing - show results for now
  React.useEffect(() => {
    if (state.success && state.data) {
      // For development - show results. In production, navigate to draft review
      // navigate({ to: '/draft-review', search: { entries: state.data.entries } });
    }
  }, [state, navigate]);

  const handleExampleSelect = (example: string) => {
    setMessage(example);
  };

  const isDisabled = isPending || parseMessage.isPending;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Log Today&apos;s Work</h1>
            <p className="text-muted-foreground text-lg">
              Describe your work in natural language and we&apos;ll convert it to structured time entries
            </p>
          </div>
        </div>

        {/* Debug Tools (Development Only) */}
        {import.meta.env.DEV && (
          <Card className="border-dashed border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/50">
            <CardHeader>
              <CardTitle className="text-sm text-orange-800 dark:text-orange-200">
                🔧 Debug Tools (Development Only)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MSWDebugButton />
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Use this button to test MSW handlers directly via fetch API
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Natural Language Time Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form action={action} className="space-y-4">
              <input type="hidden" name="message" value={message} />

              <MessageInput
                value={message}
                onChange={setMessage}
                disabled={isDisabled}
                placeholder="Example: Worked on XYZ-1111 for 3 hours implementing authentication, had 1 hour meeting about XYZ-2222 planning..."
              />

              {/* Error Display */}
              {state.error && (
                <Alert variant="destructive">
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isDisabled || !message.trim()}
                  size="lg"
                  className="gap-2 min-w-[140px]"
                >
                  {isDisabled ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Parse Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Parsed Entries Results */}
        {state.success && state.data && (
          <ParsedEntriesDisplay data={state.data} date={new Date().toISOString().split('T')[0]} />
        )}

        {/* Example Prompts */}
        <ExamplePrompts onSelectExample={handleExampleSelect} />

        {/* Debug Info (Development Only) */}
        {state.success && state.data && (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">Parsed Results (Debug)</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto">{JSON.stringify(state.data, null, 2)}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
