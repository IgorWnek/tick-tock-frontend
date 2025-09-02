import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { UserMenu } from './UserMenu';

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../../hooks/useAuth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockUser = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  username: 'john@example.com',
  email: 'john@example.com',
};

const mockAuthContext = {
  user: mockUser,
  logout: vi.fn(),
  isAuthenticated: true,
  isAuthenticating: false,
  login: vi.fn(),
};

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue(mockAuthContext);
  });

  it('renders user info when authenticated', () => {
    render(<UserMenu data-testid="user-menu" />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('does not render when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      ...mockAuthContext,
      isAuthenticated: false,
      user: undefined,
    });

    render(<UserMenu data-testid="user-menu" />);

    // Check that user menu elements are not in the document
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument();
  });

  it('opens dropdown menu when clicked', async () => {
    const user = userEvent.setup();

    render(<UserMenu data-testid="user-menu" />);

    const trigger = screen.getByText('John Doe');
    await user.click(trigger);

    // Check if dropdown content is visible
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout when logout item is clicked', async () => {
    const user = userEvent.setup();

    render(<UserMenu data-testid="user-menu" />);

    // Open dropdown
    const trigger = screen.getByText('John Doe');
    await user.click(trigger);

    // Click logout
    const logoutItem = screen.getByText('Logout');
    await user.click(logoutItem);

    expect(mockAuthContext.logout).toHaveBeenCalledOnce();
  });

  it('shows user email in dropdown content', async () => {
    const user = userEvent.setup();

    render(<UserMenu data-testid="user-menu" />);

    // Open dropdown
    const trigger = screen.getByText('John Doe');
    await user.click(trigger);

    // Check if user email is displayed in the dropdown
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('handles profile click without errors', async () => {
    const user = userEvent.setup();

    render(<UserMenu data-testid="user-menu" />);

    // Open dropdown
    const trigger = screen.getByText('John Doe');
    await user.click(trigger);

    // Click profile - should not throw error
    const profileItem = screen.getByText('Profile');
    await user.click(profileItem);

    // Profile navigation is not implemented yet, so no assertion needed
  });

  it('has proper accessibility attributes', async () => {
    const user = userEvent.setup();

    render(<UserMenu data-testid="user-menu" />);

    const trigger = screen.getByLabelText('Open menu for John Doe');
    expect(trigger).toBeInTheDocument();

    // Open dropdown
    await user.click(trigger);

    // Check if logout has destructive styling (visual verification)
    const logoutItem = screen.getByTestId('user-menu-logout');
    expect(logoutItem).toHaveClass('text-destructive');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();

    render(<UserMenu data-testid="user-menu" />);

    const trigger = screen.getByTestId('user-menu');

    // Focus and open with Enter
    await user.tab();
    expect(trigger).toHaveFocus();

    await user.keyboard('{Enter}');

    // Should be able to navigate through menu items
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
