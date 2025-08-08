import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/log-entry')({
  component: LogEntryPage,
});

function LogEntryPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Log Today&apos;s Work</h1>
          <p className="text-muted-foreground text-lg">
            Describe your work in natural language and we&apos;ll convert it to structured time entries
          </p>
        </div>

        {/* Coming Soon Placeholder */}
        <div className="bg-gradient-to-br from-muted via-muted/80 to-muted/60 rounded-lg p-12 text-center">
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-3xl">⏰</span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Time Log Input Coming Soon</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This is where you&apos;ll write natural language descriptions like &ldquo;Worked on XYZ-1111 for 3 hours
              implementing authentication, had 1 hour meeting about XYZ-2222 planning&rdquo; and our AI will parse it
              into structured time entries.
            </p>
            <div className="pt-4 space-y-2">
              <h3 className="font-medium text-foreground">Planned Features:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Natural language input with large text area</li>
                <li>• Jira ID pattern detection and highlighting</li>
                <li>• Draft review with &ldquo;🚀 Ship It&rdquo; and &ldquo;🧐 Refine&rdquo; options</li>
                <li>• Real-time validation and feedback</li>
                <li>• Example prompts and helper text</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
