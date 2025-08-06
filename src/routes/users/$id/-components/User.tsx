import { useParams } from '@tanstack/react-router';
import { User as UserIcon, Route, Hash } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/ui/code-block';

export const User = () => {
  const params = useParams({ from: '/users/$id/' });

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <UserIcon className="h-8 w-8" />
          User Details
        </h1>
        <p className="text-muted-foreground">
          This page demonstrates URL parameter extraction using TanStack Router&apos;s useParams hook.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Route Parameters
            </CardTitle>
            <CardDescription>Parameters extracted from the current URL using useParams hook</CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock variant="default">{JSON.stringify(params, null, 2)}</CodeBlock>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              User Information
            </CardTitle>
            <CardDescription>Details extracted from the route parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">User ID:</span>
                <Badge variant="outline">{params.id}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Route Pattern:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">/users/$id/</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Parameter Type:</span>
                <Badge variant="secondary">Dynamic</Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Route Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Type-safe parameter extraction</li>
                <li>• Automatic URL parsing</li>
                <li>• Built-in parameter validation</li>
                <li>• Seamless navigation support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
          <CardDescription>How to extract and use route parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock variant="default">
            {`// Extract parameters from the route
const params = useParams({ from: '/users/$id/' });

// Access the parameter
const userId = params.id; // "${params.id}"

// Use in your component logic
console.log('Current user ID:', userId);`}
          </CodeBlock>
        </CardContent>
      </Card>
    </div>
  );
};
