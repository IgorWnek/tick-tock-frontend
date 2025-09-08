import React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';

import { AuthTemplate } from '@/design-system/templates/AuthTemplate';
import { LoginForm } from '@/design-system/organisms/LoginForm';
import { useAuth } from '@/hooks/useAuth/useAuth';

type LoginSearchParams = {
  redirect?: string;
};

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearchParams => {
    const result = loginSearchSchema.safeParse(search);
    return result.success ? result.data : {};
  },
  beforeLoad: () => {
    // This will be implemented when auth context is added to route context in task 6.2
    // For now, check auth in component
    return {};
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { redirect } = Route.useSearch();

  // Redirect authenticated users to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: redirect || '/' });
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleLoginSuccess = () => {
    // Navigate to intended destination or dashboard
    navigate({ to: redirect || '/' });
  };

  return (
    <AuthTemplate title="Sign In" subtitle="Welcome back to Tick-Tock">
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthTemplate>
  );
}
