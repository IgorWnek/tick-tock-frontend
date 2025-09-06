/**
 * AuthTemplate component types
 * Template-level component for authentication-related pages
 */

import type { ReactNode } from 'react';

export type AuthTemplateProps = {
  /** Main content to render within the auth template */
  children: ReactNode;

  /** Page title displayed below the logo */
  title: string;

  /** Optional subtitle or description */
  subtitle?: string;

  /** Additional CSS classes for the main container */
  className?: string;

  /** Optional navigation link back to the main app */
  backLink?: {
    to: string;
    label: string;
  };

  /** Optional footer content */
  footer?: ReactNode;
};
