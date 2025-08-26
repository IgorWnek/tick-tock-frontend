import React from 'react';
import { Clock } from 'lucide-react';

import { Icon } from '@/design-system/atoms/Icon/Icon';
import { Typography } from '@/design-system/atoms/Typography/Typography';
import { cn } from '@/lib/utils';

export interface TimeDisplayProps {
  duration: number; // minutes
  showIcon?: boolean;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const TimeDisplay = ({ duration, showIcon = true, variant = 'compact', className }: TimeDisplayProps) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (variant === 'detailed') {
      if (hours === 0) return `${mins} minutes`;
      if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
    }

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && <Icon icon={Clock} size="sm" color="muted" aria-hidden />}
      <Typography variant="body" className="font-semibold">
        {formatDuration(duration)}
      </Typography>
      {variant === 'detailed' && (
        <Typography variant="small" color="muted">
          ({duration} min)
        </Typography>
      )}
    </div>
  );
};
