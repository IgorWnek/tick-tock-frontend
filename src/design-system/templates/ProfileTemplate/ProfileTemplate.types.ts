/**
 * ProfileTemplate component types
 * Template-level component for profile-related pages
 */

import type { ReactNode } from 'react';

export type ProfileSection = {
  /** Unique identifier for the section */
  id: string;
  /** Display label for the section */
  label: string;
  /** URL path for the section */
  href: string;
  /** Optional icon component */
  icon?: ReactNode;
  /** Whether this section is currently active */
  isActive?: boolean;
};

export type ProfileTemplateProps = {
  /** Main content to render in the profile template */
  children: ReactNode;

  /** Current page title */
  title: string;

  /** Optional page description */
  description?: string;

  /** Navigation sections for the sidebar */
  sections: ProfileSection[];

  /** Currently active section ID */
  activeSection: string;

  /** Breadcrumb items for navigation context */
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;

  /** Additional CSS classes for the container */
  className?: string;

  /** Whether the sidebar should be initially collapsed on mobile */
  sidebarCollapsed?: boolean;

  /** Callback when sidebar collapse state changes */
  onSidebarToggle?: (collapsed: boolean) => void;
};
