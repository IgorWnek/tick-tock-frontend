import { Outlet } from '@tanstack/react-router';

/**
 * Layout - Root layout component
 *
 * Simplified root layout that provides the basic application shell.
 * Individual routes use specific templates (AuthTemplate, AppTemplate, etc.)
 * for their layout needs following atomic design principles.
 */
export const Layout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};
