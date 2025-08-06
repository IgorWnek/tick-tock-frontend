import * as React from 'react';
import { ErrorBoundary as ReactErrorBoundary, type ErrorBoundaryPropsWithRender } from 'react-error-boundary';

import { logger } from '@/integrations/logger';

export type ErrorBoundaryProps = Omit<ErrorBoundaryPropsWithRender, 'fallbackRender'> & {
  shouldLog?: boolean;
  fallbackRender?: ErrorBoundaryPropsWithRender['fallbackRender'];
};

const defaultFallbackRender: ErrorBoundaryPropsWithRender['fallbackRender'] = ({ error, resetErrorBoundary }) => (
  <div
    data-slot="error-boundary"
    className="flex flex-col items-center justify-center min-h-32 p-6 border border-destructive/20 rounded-md bg-destructive/5"
  >
    <h2 className="text-lg font-semibold text-destructive mb-2">Something went wrong</h2>
    <p className="text-sm text-muted-foreground mb-4 text-center">{error.message}</p>
    <button
      type="button"
      onClick={resetErrorBoundary}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
    >
      Try again
    </button>
  </div>
);

export const ErrorBoundary = ({
  shouldLog = true,
  onError,
  fallbackRender = defaultFallbackRender,
  ...props
}: ErrorBoundaryProps) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    if (shouldLog) {
      logger.error(error);
    }
    onError?.(error, errorInfo);
  };

  return <ReactErrorBoundary fallbackRender={fallbackRender} onError={handleError} {...props} />;
};
