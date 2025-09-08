import { createFileRoute } from '@tanstack/react-router';

import { Home } from 'routes/-components/Home';

import { AppTemplate } from '@/design-system/templates/AppTemplate';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppTemplate>
      <Home />
    </AppTemplate>
  );
}
