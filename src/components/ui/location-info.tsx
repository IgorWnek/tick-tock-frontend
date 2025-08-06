import * as React from 'react';
import { useRouterState } from '@tanstack/react-router';

import { CodeBlock } from '@/components/ui/code-block';

export type LocationInfoProps = {
  className?: string;
  variant?: 'default' | 'destructive' | 'success';
  size?: 'default' | 'sm' | 'lg';
};

export const LocationInfo = ({ className, variant = 'default', size = 'default' }: LocationInfoProps) => {
  const location = useRouterState({ select: (state) => state.location });

  return (
    <div data-slot="location-info" className={className}>
      <p className="mb-4 text-sm text-muted-foreground">
        Current location (provided by{' '}
        <a
          href="https://reacttraining.com/react-router/web/api/Hooks/uselocation"
          className="text-primary hover:underline"
        >
          <code className="text-xs bg-muted px-1 py-0.5 rounded">useLocation</code>
        </a>{' '}
        hook from{' '}
        <a href="https://github.com/ReactTraining/react-router" className="text-primary hover:underline">
          react-router
        </a>
        ):
      </p>
      <CodeBlock variant={variant} size={size}>
        {JSON.stringify(location, null, 2)}
      </CodeBlock>
    </div>
  );
};
