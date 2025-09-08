/**
 * @fileoverview AppTemplate component tests
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { AppTemplate } from './AppTemplate';

// Mock TanStack Router components
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, ...props }: { children: React.ReactNode; to: string; className?: string }) => (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  ),
}));

describe('AppTemplate', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(
        <AppTemplate>
          <div data-testid="test-content">Test Content</div>
        </AppTemplate>,
      );

      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders header with branding', () => {
      render(<AppTemplate>Content</AppTemplate>);

      expect(screen.getByText('Tick-Tock')).toBeInTheDocument();
      expect(screen.getByText('Time Logging Made Simple')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      render(<AppTemplate>Content</AppTemplate>);

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
      const aboutLink = screen.getByRole('link', { name: /about/i });

      expect(dashboardLink).toBeInTheDocument();
      expect(aboutLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/');
      expect(aboutLink).toHaveAttribute('href', '/about');
    });
  });

  describe('Layout Structure', () => {
    it('has proper landmark structure', () => {
      render(<AppTemplate>Content</AppTemplate>);

      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
      expect(screen.getByRole('main')).toBeInTheDocument(); // main
    });

    it('applies proper CSS classes to root container', () => {
      render(<AppTemplate data-testid="app-template">Content</AppTemplate>);
      const appTemplate = screen.getByTestId('app-template');

      expect(appTemplate).toHaveClass('min-h-screen');
      expect(appTemplate).toHaveClass('bg-gradient-to-br');
      expect(appTemplate).toHaveClass('from-background');
      expect(appTemplate).toHaveClass('to-background/95');
    });

    it('supports custom className', () => {
      render(
        <AppTemplate className="custom-class" data-testid="app-template">
          Content
        </AppTemplate>,
      );
      const appTemplate = screen.getByTestId('app-template');

      expect(appTemplate).toHaveClass('custom-class');
      expect(appTemplate).toHaveClass('min-h-screen'); // Still has default classes
    });
  });

  describe('Header Layout', () => {
    it('has sticky header with proper styling', () => {
      render(<AppTemplate>Content</AppTemplate>);
      const header = screen.getByRole('banner');

      expect(header).toHaveClass('border-b');
      expect(header).toHaveClass('bg-background/80');
      expect(header).toHaveClass('backdrop-blur-sm');
      expect(header).toHaveClass('sticky');
      expect(header).toHaveClass('top-0');
      expect(header).toHaveClass('z-40');
    });

    it('contains brand logo and text', () => {
      render(<AppTemplate>Content</AppTemplate>);

      // Check for brand elements in header
      expect(screen.getByText('Tick-Tock')).toBeInTheDocument();
      expect(screen.getByText('Time Logging Made Simple')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('hides tagline on small screens', () => {
      render(<AppTemplate>Content</AppTemplate>);
      const tagline = screen.getByText('Time Logging Made Simple');

      expect(tagline).toHaveClass('hidden');
      expect(tagline).toHaveClass('sm:inline');
    });
  });

  describe('Main Content Area', () => {
    it('renders content in main element with proper styling', () => {
      render(<AppTemplate>Test Content</AppTemplate>);
      const main = screen.getByRole('main');

      expect(main).toHaveClass('container');
      expect(main).toHaveClass('mx-auto');
      expect(main).toHaveClass('px-4');
      expect(main).toHaveClass('py-6');
      expect(main).toHaveTextContent('Test Content');
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<AppTemplate ref={ref}>Content</AppTemplate>);

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });
});
