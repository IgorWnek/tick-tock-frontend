import React from 'react';
import { Wrench, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface RefineButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isPending?: boolean;
  className?: string;
}

export const RefineButton: React.FC<RefineButtonProps> = ({
  onClick,
  disabled = false,
  isPending = false,
  className,
}) => {
  const isDisabled = disabled || isPending;

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      variant="outline"
      size="default"
      className={`
        relative overflow-hidden transition-all duration-300
        border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400
        dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950/50
        disabled:border-blue-200 disabled:text-blue-400 disabled:bg-gray-50
        dark:disabled:border-blue-800 dark:disabled:text-blue-600 dark:disabled:bg-gray-900
        shadow-sm hover:shadow-md active:scale-[0.98]
        font-medium
        ${className || ''}
      `.trim()}
    >
      {/* Background subtle pattern */}
      {!isDisabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
      )}

      {/* Content */}
      <div className="relative flex items-center gap-2">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Refining...
          </>
        ) : (
          <>
            <div className="relative">
              <Wrench className="h-4 w-4" />
              {/* Subtle sparkle effect */}
              <Sparkles className="absolute -top-0.5 -right-0.5 h-2 w-2 text-blue-400 animate-pulse opacity-75" />
            </div>
            🧐 Refine
          </>
        )}
      </div>

      {/* Subtle shine effect on hover */}
      {!isDisabled && (
        <div className="absolute inset-0 -translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent hover:translate-x-full" />
      )}
    </Button>
  );
};
