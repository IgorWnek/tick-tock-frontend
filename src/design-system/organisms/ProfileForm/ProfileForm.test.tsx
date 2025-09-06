import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ProfileForm } from './ProfileForm';

// Mock the useAuth hook
const mockUser = {
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  username: 'john@example.com',
};

const mockLogin = vi.fn();
const mockLogout = vi.fn();

// Mock mutations
const mockUpdateProfile = vi.fn();
const mockUpdatePassword = vi.fn();

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useAuth: () => ({
      user: mockUser,
      login: mockLogin,
      logout: mockLogout,
      isAuthenticating: false,
      isAuthenticated: true,
    }),
    useMutation: vi.fn().mockImplementation((mutationKey: string) => {
      if (mutationKey === 'updateProfile') {
        return {
          mutateAsync: mockUpdateProfile.mockResolvedValue({
            message: 'Profile updated successfully',
          }),
          isPending: false,
          isSuccess: false,
          isError: false,
          data: undefined,
          error: null,
          mutate: vi.fn(),
          reset: vi.fn(),
        };
      }
      if (mutationKey === 'updatePassword') {
        return {
          mutateAsync: mockUpdatePassword.mockResolvedValue({
            message: 'Password updated successfully',
          }),
          isPending: false,
          isSuccess: false,
          isError: false,
          data: undefined,
          error: null,
          mutate: vi.fn(),
          reset: vi.fn(),
        };
      }
      return {
        mutateAsync: vi.fn().mockResolvedValue({}),
        isPending: false,
        isSuccess: false,
        isError: false,
        data: undefined,
        error: null,
        mutate: vi.fn(),
        reset: vi.fn(),
      };
    }),
  };
});

describe('ProfileForm', () => {
  const defaultProps = {
    onProfileUpdate: vi.fn(),
    onPasswordUpdate: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders component without crashing', () => {
    render(<ProfileForm {...defaultProps} />);
    expect(screen.getByTestId('profile-form')).toBeInTheDocument();
  });
});
