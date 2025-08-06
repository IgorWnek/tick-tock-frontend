import { createFileRoute } from '@tanstack/react-router';

import { ShadcnDemo } from 'routes/-components/ShadcnDemo';

export const Route = createFileRoute('/demo')({
  component: () => <ShadcnDemo />,
});
