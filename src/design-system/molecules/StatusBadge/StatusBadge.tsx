import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, Clock, AlertCircle, type LucideIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Icon } from '@/design-system/atoms/Icon/Icon';

const statusBadgeVariants = cva('', {
  variants: {
    status: {
      draft: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-300',
      logged:
        'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-300',
      'no-logs':
        'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/20 dark:text-orange-300',
    },
  },
});

export interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const statusIcons: Record<NonNullable<StatusBadgeProps['status']>, LucideIcon> = {
  draft: Clock,
  logged: CheckCircle,
  'no-logs': AlertCircle,
};

const statusLabels: Record<NonNullable<StatusBadgeProps['status']>, string> = {
  draft: 'Draft',
  logged: 'Logged',
  'no-logs': 'No Logs',
};

export const StatusBadge = ({ status = 'draft', showIcon = true, children, className }: StatusBadgeProps) => {
  const safeStatus = (status ?? 'draft') as NonNullable<StatusBadgeProps['status']>;
  const IconComponent = statusIcons[safeStatus];
  const label = children || statusLabels[safeStatus];

  return (
    <Badge variant="outline" className={statusBadgeVariants({ status: safeStatus, className })}>
      {showIcon && <Icon icon={IconComponent} size="xs" aria-hidden />}
      <span className="ml-1">{label}</span>
    </Badge>
  );
};
