/**
 * AuthTemplate - Template component for authentication-related pages
 *
 * Provides a centered layout with consistent branding, responsive design,
 * and background styling for login, registration, and other auth flows.
 */

import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Clock } from 'lucide-react';

import type { AuthTemplateProps } from './AuthTemplate.types';

import { cn } from '@/lib/utils';

export const AuthTemplate = React.forwardRef<HTMLDivElement, AuthTemplateProps>(
  ({ children, title, subtitle, className, backLink, footer, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen bg-gradient-to-br from-background to-background/95',
          'flex flex-col items-center justify-center',
          'px-4 py-8',
          className,
        )}
        {...props}
      >
        {/* Optional back navigation */}
        {backLink && (
          <div className="w-full max-w-md mb-6">
            <Link
              to={backLink.to}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLink.label}
            </Link>
          </div>
        )}

        {/* Main content container */}
        <div className="w-full max-w-md space-y-6 animate-fade-in">
          {/* Header with branding */}
          <div className="text-center space-y-4">
            {/* Logo and brand */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-8 w-8 text-primary animate-pulse" />
                <h1 className="text-2xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  Tick-Tock
                </h1>
              </div>
            </div>

            {/* Page title and subtitle */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>

          {/* Main content area */}
          <div className="bg-card border border-border rounded-lg shadow-lg p-6">{children}</div>

          {/* Optional footer */}
          {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    );
  },
);

AuthTemplate.displayName = 'AuthTemplate';
