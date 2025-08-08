import { createFileRoute } from '@tanstack/react-router';

import { CalendarSolutionsDemo } from '@/components/dashboard/CalendarSolutionsDemo';

export const Route = createFileRoute('/calendar-solutions')({
  component: () => <CalendarSolutionsDemo />,
});
