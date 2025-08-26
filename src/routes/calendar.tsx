import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';

import { CalendarMonth } from '@/features/calendar/components';

export const Route = createFileRoute('/calendar')({
  component: () => {
    const handleDayClick = (date: Date) => {
      // In a follow-up we can navigate to day view.
      // placeholder noop for now.
      // eslint-disable-next-line no-console
      console.log('Selected day', format(date, 'yyyy-MM-dd'));
    };
    return <CalendarMonth onDayClick={handleDayClick} />;
  },
});
