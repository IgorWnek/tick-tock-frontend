/**
 * AppTemplate component types
 * Template-level component for main application pages
 */

import type { ReactNode } from 'react';

export type AppTemplateProps = {
  /** Main content to render within the app template */
  children: ReactNode;

  /** Additional CSS classes for the main container */
  className?: string;
};
