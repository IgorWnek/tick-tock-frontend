import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { UserInfo } from './UserInfo';

import type { GetMeQueryResponse, User } from '@/api/actions/auth/auth.types';

// Test data
const simpleUser: User = {
  id: '1',
  name: 'John Doe',
};

const detailedUser: GetMeQueryResponse = {
  id: '2',
  firstName: 'Jane',
  lastName: 'Smith',
  username: 'jsmith',
  email: 'jane.smith@example.com',
};

const userWithSingleName: User = {
  id: '3',
  name: 'Madonna',
};

describe('UserInfo', () => {
  describe('User data handling', () => {
    it('should display simple user name correctly', () => {
      render(<UserInfo user={simpleUser} data-testid="user-info" />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('@')).not.toBeInTheDocument(); // No email
    });

    it('should display detailed user with full name', () => {
      render(<UserInfo user={detailedUser} data-testid="user-info" />);

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
    });

    it('should handle single name users correctly', () => {
      render(<UserInfo user={userWithSingleName} data-testid="user-info" />);

      expect(screen.getByText('Madonna')).toBeInTheDocument();
    });

    it('should pass firstName and lastName to Avatar for detailed users', () => {
      render(<UserInfo user={detailedUser} data-testid="user-info" />);

      // Avatar should show initials based on firstName and lastName
      const avatar = screen.getByRole('img', { name: /avatar for jane smith/i });
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent('JS');
    });

    it('should pass parsed names to Avatar for simple users', () => {
      render(<UserInfo user={simpleUser} data-testid="user-info" />);

      // Avatar should show initials parsed from full name
      const avatar = screen.getByRole('img', { name: /avatar for john doe/i });
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent('JD');
    });
  });

  describe('Layout variants', () => {
    it('should render horizontal layout by default', () => {
      render(<UserInfo user={simpleUser} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toHaveClass('flex-row');
    });

    it('should render vertical layout when specified', () => {
      render(<UserInfo user={simpleUser} layout="vertical" data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toHaveClass('flex-col');
      expect(container).toHaveClass('text-center');
    });

    it('should apply correct gap classes for each layout', () => {
      const { rerender } = render(<UserInfo user={simpleUser} layout="horizontal" data-testid="user-info" />);

      let container = screen.getByTestId('user-info');
      expect(container).toHaveClass('gap-3');

      rerender(<UserInfo user={simpleUser} layout="vertical" data-testid="user-info" />);
      container = screen.getByTestId('user-info');
      expect(container).toHaveClass('gap-2');
    });
  });

  describe('Size variants', () => {
    it('should render medium size by default', () => {
      render(<UserInfo user={simpleUser} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toHaveClass('text-base');
    });

    it('should apply small size classes', () => {
      render(<UserInfo user={simpleUser} size="sm" data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toHaveClass('text-sm');
    });

    it('should apply large size classes', () => {
      render(<UserInfo user={simpleUser} size="lg" data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toHaveClass('text-lg');
    });
  });

  describe('Email display', () => {
    it('should show email by default for detailed users', () => {
      render(<UserInfo user={detailedUser} data-testid="user-info" />);

      expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
    });

    it('should hide email when showEmail is false', () => {
      render(<UserInfo user={detailedUser} showEmail={false} data-testid="user-info" />);

      expect(screen.queryByText('jane.smith@example.com')).not.toBeInTheDocument();
    });

    it('should not show email for simple users even with showEmail true', () => {
      render(<UserInfo user={simpleUser} showEmail={true} data-testid="user-info" />);

      expect(screen.queryByText('@')).not.toBeInTheDocument();
    });
  });

  describe('Text truncation', () => {
    it('should apply truncate classes by default', () => {
      render(<UserInfo user={simpleUser} data-testid="user-info" />);

      const nameElement = screen.getByText('John Doe');
      expect(nameElement).toHaveClass('truncate');
    });

    it('should remove truncate classes when truncateText is false', () => {
      render(<UserInfo user={simpleUser} truncateText={false} data-testid="user-info" />);

      const nameElement = screen.getByText('John Doe');
      expect(nameElement).toHaveClass('whitespace-normal');
      expect(nameElement).toHaveClass('truncate'); // Still has base truncate class
    });
  });

  describe('Interactive behavior', () => {
    it('should render as div when not interactive', () => {
      render(<UserInfo user={simpleUser} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container.tagName).toBe('DIV');
      expect(container).not.toHaveClass('cursor-pointer');
    });

    it('should render as button when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<UserInfo user={simpleUser} onClick={handleClick} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container.tagName).toBe('BUTTON');
      expect(container).toHaveClass('cursor-pointer');
      expect(container).toHaveAttribute('type', 'button');
    });

    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<UserInfo user={simpleUser} onClick={handleClick} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      await user.click(container);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should have appropriate aria-label for interactive mode', () => {
      const handleClick = vi.fn();
      render(<UserInfo user={simpleUser} onClick={handleClick} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toHaveAttribute('aria-label', 'View John Doe profile');
    });

    it('should apply hover and focus styles for interactive mode', () => {
      const handleClick = vi.fn();
      render(<UserInfo user={simpleUser} onClick={handleClick} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toHaveClass('hover:bg-accent');
      expect(container).toHaveClass('focus-visible:bg-accent');
      expect(container).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Avatar integration', () => {
    it('should pass avatarSize to Avatar component', () => {
      render(<UserInfo user={detailedUser} avatarSize="lg" data-testid="user-info" />);

      // Avatar should receive the size prop and show larger size
      const avatar = screen.getByRole('img', { name: /avatar for jane smith/i });
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveClass('h-12', 'w-12'); // lg size classes
    });

    it('should center avatar in vertical layout', () => {
      render(<UserInfo user={simpleUser} layout="vertical" data-testid="user-info" />);

      const avatar = screen.getByRole('img', { name: /avatar for john doe/i });
      expect(avatar).toHaveClass('mx-auto');
    });

    it('should not center avatar in horizontal layout', () => {
      render(<UserInfo user={simpleUser} layout="horizontal" data-testid="user-info" />);

      const avatar = screen.getByRole('img', { name: /avatar for john doe/i });
      expect(avatar).not.toHaveClass('mx-auto');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible when interactive', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<UserInfo user={simpleUser} onClick={handleClick} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');

      // Should be focusable
      await user.tab();
      expect(container).toHaveFocus();

      // Should activate with Enter
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Should activate with Space
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('should not be focusable when not interactive', async () => {
      const user = userEvent.setup();
      render(<UserInfo user={simpleUser} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');

      // Try to tab to the element
      await user.tab();
      expect(container).not.toHaveFocus();
    });

    it('should have proper focus indicators', () => {
      const handleClick = vi.fn();
      render(<UserInfo user={simpleUser} onClick={handleClick} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toHaveClass('focus-visible:outline-none');
      expect(container).toHaveClass('focus-visible:ring-2');
      expect(container).toHaveClass('focus-visible:ring-ring');
    });
  });

  describe('Custom styling', () => {
    it('should accept custom className', () => {
      render(<UserInfo user={simpleUser} className="custom-class" data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      render(<UserInfo user={simpleUser} className="custom-class" data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toHaveClass('custom-class');
      expect(container).toHaveClass('flex');
      expect(container).toHaveClass('items-center');
    });
  });

  describe('Edge cases', () => {
    it('should handle user with empty name gracefully', () => {
      const emptyNameUser: User = { id: '4', name: '' };
      render(<UserInfo user={emptyNameUser} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toBeInTheDocument();
    });

    it('should handle detailed user with empty firstName/lastName', () => {
      const emptyDetailedUser: GetMeQueryResponse = {
        id: '5',
        firstName: '',
        lastName: '',
        username: 'empty',
        email: 'empty@example.com',
      };

      render(<UserInfo user={emptyDetailedUser} data-testid="user-info" />);

      const container = screen.getByTestId('user-info');
      expect(container).toBeInTheDocument();
      expect(screen.getByText('empty@example.com')).toBeInTheDocument();
    });

    it('should handle detailed user without email', () => {
      const noEmailUser: GetMeQueryResponse = {
        id: '6',
        firstName: 'No',
        lastName: 'Email',
        username: 'noemail',
        email: '',
      };

      render(<UserInfo user={noEmailUser} data-testid="user-info" />);

      expect(screen.getByText('No Email')).toBeInTheDocument();
      expect(screen.queryByText('@')).not.toBeInTheDocument();
    });
  });
});
