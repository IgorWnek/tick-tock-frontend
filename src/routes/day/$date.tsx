import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';

import { useDayEntries } from '@/hooks/useDayEntries';

export const Route = createFileRoute('/day/$date')({
  component: DayDetailPage,
});

function DayDetailPage() {
  const { date } = Route.useParams();
  const { data, isLoading, error } = useDayEntries(date);

  const formattedDate = format(new Date(date), 'EEEE, MMMM d, yyyy');

  const getSubtitle = () => {
    if (isLoading) return 'Loading time entries...';
    if (!data?.entries.length) return 'No time entries for this day';

    const entryText = data.entries.length === 1 ? 'entry' : 'entries';
    const hours = Math.round((data.totalMinutes || 0) / 60);
    return `${data.entries.length} time ${entryText} • ${hours} hours total`;
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-destructive">Error Loading Day</h1>
          <p className="text-muted-foreground">Unable to load time entries for {formattedDate}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{formattedDate}</h1>
          <p className="text-muted-foreground text-lg">{getSubtitle()}</p>
        </div>

        {isLoading ? (
          <div className="bg-gradient-to-br from-muted via-muted/80 to-muted/60 rounded-lg p-12 text-center">
            <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-muted-foreground">Loading day details...</p>
          </div>
        ) : null}

        {!isLoading && data?.entries.length ? (
          <div className="space-y-4">
            {data.entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{entry.jiraTaskId}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'logged'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {entry.status === 'logged' ? 'Logged' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{entry.description}</h3>
                    <p className="text-sm text-muted-foreground">{entry.originalMessage}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-semibold text-foreground">
                      {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                    </div>
                    <div className="text-xs text-muted-foreground">{format(new Date(entry.createdAt), 'h:mm a')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!isLoading && !data?.entries.length ? (
          <div className="bg-gradient-to-br from-muted via-muted/80 to-muted/60 rounded-lg p-12 text-center">
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto bg-muted-foreground/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">📅</span>
              </div>
              <h2 className="text-2xl font-semibold text-foreground">No Time Entries</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                No time logs have been recorded for this day yet. Click &ldquo;Log Today&apos;s Work&rdquo; to get
                started.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
