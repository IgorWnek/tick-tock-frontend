/**
 * ProfileTemplate - Template component for profile-related pages
 *
 * Provides a standard app layout with sidebar navigation, main content area,
 * and breadcrumb navigation for profile management sections.
 */

import React from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X, ChevronRight, Home } from 'lucide-react';

import type { ProfileTemplateProps } from './ProfileTemplate.types';

import { cn } from '@/lib/utils';

export const ProfileTemplate = React.forwardRef<HTMLDivElement, ProfileTemplateProps>(
  (
    { children, title, description, sections, activeSection, breadcrumbs = [], className, onSidebarToggle, ...props },
    ref,
  ) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    const handleSidebarToggle = () => {
      const newCollapsed = !isMobileSidebarOpen;
      setIsMobileSidebarOpen(newCollapsed);
      onSidebarToggle?.(newCollapsed);
    };

    const defaultBreadcrumbs = [{ label: 'Dashboard', href: '/' }, { label: 'Profile' }, ...breadcrumbs];

    return (
      <div ref={ref} className={cn('min-h-screen bg-background', className)} {...props}>
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        <div className="flex h-screen">
          {/* Sidebar Navigation */}
          <aside
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            )}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
              <button
                type="button"
                className="md:hidden p-2 rounded-lg hover:bg-accent"
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6 space-y-2" role="navigation" aria-label="Profile navigation">
              {sections.map((section) => {
                const isActive = section.id === activeSection;
                return (
                  <Link
                    key={section.id}
                    to={section.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                    )}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    {section.icon && <span className="flex-shrink-0">{section.icon}</span>}
                    {section.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar with Mobile Menu & Breadcrumbs */}
            <header className="bg-background border-b border-border px-4 py-4 md:px-6">
              <div className="flex items-center justify-between">
                {/* Mobile Menu Button */}
                <button
                  type="button"
                  className="md:hidden p-2 rounded-lg hover:bg-accent"
                  onClick={handleSidebarToggle}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </button>

                {/* Breadcrumb Navigation */}
                <nav className="hidden md:flex" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                    {defaultBreadcrumbs.map((crumb, index) => (
                      <li key={crumb.label} className="flex items-center">
                        {index === 0 && <Home className="h-4 w-4 mr-2" />}
                        {crumb.href ? (
                          <Link to={crumb.href} className="hover:text-foreground transition-colors">
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="text-foreground font-medium">{crumb.label}</span>
                        )}
                        {index < defaultBreadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 mx-2" />}
                      </li>
                    ))}
                  </ol>
                </nav>

                {/* Mobile breadcrumb (simplified) */}
                <div className="md:hidden">
                  <span className="text-sm font-medium text-foreground">{title}</span>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 overflow-auto" role="main">
              <div className="container mx-auto px-4 py-6 md:px-6">
                {/* Page Header */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                  {description && <p className="mt-2 text-muted-foreground">{description}</p>}
                </div>

                {/* Main Content */}
                <div className="max-w-4xl">{children}</div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  },
);

ProfileTemplate.displayName = 'ProfileTemplate';
