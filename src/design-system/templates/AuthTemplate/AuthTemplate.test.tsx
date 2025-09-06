import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { AuthTemplate } from './AuthTemplate';

// Mock TanStack Router Link component for testing
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

describe('AuthTemplate', () => {
  it('renders with required props', () => {
    render(
      <AuthTemplate title="Sign In">
        <div>Form content</div>
      </AuthTemplate>,
    );

    expect(screen.getByText('Tick-Tock')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <AuthTemplate title="Sign In" subtitle="Welcome back to Tick-Tock">
        <div>Form content</div>
      </AuthTemplate>,
    );

    expect(screen.getByText('Welcome back to Tick-Tock')).toBeInTheDocument();
  });

  it('renders back link when provided', () => {
    render(
      <AuthTemplate title="Sign In" backLink={{ to: '/', label: 'Back to Dashboard' }}>
        <div>Form content</div>
      </AuthTemplate>,
    );

    const backLink = screen.getByRole('link', { name: /back to dashboard/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('does not render back link when not provided', () => {
    render(
      <AuthTemplate title="Sign In">
        <div>Form content</div>
      </AuthTemplate>,
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    const footer = <p>Need help? Contact support</p>;

    render(
      <AuthTemplate title="Sign In" footer={footer}>
        <div>Form content</div>
      </AuthTemplate>,
    );

    expect(screen.getByText('Need help? Contact support')).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    render(
      <AuthTemplate title="Sign In">
        <div>Form content</div>
      </AuthTemplate>,
    );

    expect(screen.queryByText(/need help/i)).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <AuthTemplate title="Sign In" className="custom-auth-template" data-testid="auth-template">
        <div>Form content</div>
      </AuthTemplate>,
    );

    expect(screen.getByTestId('auth-template')).toHaveClass('custom-auth-template');
  });

  it('has proper semantic structure', () => {
    render(
      <AuthTemplate title="Sign In" subtitle="Welcome back">
        <div>Form content</div>
      </AuthTemplate>,
    );

    // Check heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2 = screen.getByRole('heading', { level: 2 });

    expect(h1).toHaveTextContent('Tick-Tock');
    expect(h2).toHaveTextContent('Sign In');
  });

  it('includes branding elements', () => {
    render(
      <AuthTemplate title="Sign In">
        <div>Form content</div>
      </AuthTemplate>,
    );

    // Check for main brand heading
    expect(screen.getByRole('heading', { level: 1, name: 'Tick-Tock' })).toBeInTheDocument();

    // Check for page title
    expect(screen.getByRole('heading', { level: 2, name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders children content properly', () => {
    const complexContent = (
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="Enter your email" />
        <button type="submit">Submit</button>
      </form>
    );

    render(<AuthTemplate title="Login">{complexContent}</AuthTemplate>);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('handles all optional props together', () => {
    const footer = <span>Custom footer content</span>;

    render(
      <AuthTemplate
        title="Reset Password"
        subtitle="Enter your email to reset"
        backLink={{ to: '/login', label: 'Back to Login' }}
        footer={footer}
        className="full-featured-template"
        data-testid="full-template"
      >
        <form>
          <input type="email" placeholder="Email address" />
          <button type="submit">Reset Password</button>
        </form>
      </AuthTemplate>,
    );

    // Verify all content is rendered
    expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
    expect(screen.getByText('Enter your email to reset')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument();
    expect(screen.getByText('Custom footer content')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();

    // Verify custom class is applied
    expect(screen.getByTestId('full-template')).toHaveClass('full-featured-template');
  });

  it('handles subtitle without breaking layout', () => {
    // Test with subtitle
    const { rerender } = render(
      <AuthTemplate title="Sign In" subtitle="Welcome back">
        <div>Content</div>
      </AuthTemplate>,
    );

    expect(screen.getByText('Welcome back')).toBeInTheDocument();

    // Test without subtitle
    rerender(
      <AuthTemplate title="Sign In">
        <div>Content</div>
      </AuthTemplate>,
    );

    expect(screen.queryByText('Welcome back')).not.toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
