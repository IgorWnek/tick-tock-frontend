import React from 'react';
import { Ship, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ShipItButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isPending?: boolean;
  entryCount: number;
  className?: string;
}

// Random encouraging messages for the Ship It button
const SHIP_MESSAGES = [
  'Ship It! 🚀',
  'Send it! 🎯',
  'Make it happen! ✨',
  'Time to shine! 🌟',
  'Deploy & conquer! 🏆',
  'Launch time! 🚀',
  "Let's do this! 💪",
  'Ready for liftoff! 🚁',
  'Full steam ahead! ⚡',
  'Time logged & locked! 🔒',
  'Ship it with style! 🎨',
  'Go time! 🏃‍♂️',
] as const;

const PENDING_MESSAGES = [
  'Shipping...',
  'Launching...',
  'Deploying...',
  'Processing...',
  'Working magic...',
  'Almost there...',
] as const;

export const ShipItButton: React.FC<ShipItButtonProps> = ({
  onClick,
  disabled = false,
  isPending = false,
  entryCount,
  className,
}) => {
  // Get a consistent random message based on entry count (so it doesn't change on re-renders)
  const messageIndex = entryCount % SHIP_MESSAGES.length;
  const shipMessage = SHIP_MESSAGES[messageIndex];

  const pendingMessageIndex = entryCount % PENDING_MESSAGES.length;
  const pendingMessage = PENDING_MESSAGES[pendingMessageIndex];

  const isDisabled = disabled || isPending;

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled}
      size="lg"
      className={`
        relative overflow-hidden transition-all duration-300
        bg-green-600 hover:bg-green-700 text-white
        disabled:bg-green-400 disabled:text-green-100
        shadow-lg hover:shadow-xl active:scale-[0.98]
        min-w-[160px] font-semibold
        ${className || ''}
      `.trim()}
    >
      {/* Background animation effect */}
      {!isDisabled && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}

      {/* Content */}
      <div className="relative flex items-center gap-2">
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {pendingMessage}
          </>
        ) : (
          <>
            <div className="relative">
              <Ship className="h-4 w-4" />
              {/* Sparkle effect */}
              <Sparkles className="absolute -top-1 -right-1 h-2 w-2 text-yellow-300 animate-pulse" />
            </div>
            {shipMessage}
          </>
        )}
      </div>

      {/* Subtle shine effect on hover */}
      {!isDisabled && (
        <div className="absolute inset-0 -translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full" />
      )}
    </Button>
  );
};
