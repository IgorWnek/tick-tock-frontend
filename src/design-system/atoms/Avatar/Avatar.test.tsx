import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Avatar } from './Avatar';

describe('Avatar', () => {
  describe('Initials Display', () => {
    it('displays initials from first and last name', () => {
      render(<Avatar firstName="John" lastName="Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('displays single initial from first name only', () => {
      render(<Avatar firstName="John" />);
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('displays single initial from last name only', () => {
      render(<Avatar lastName="Doe" />);
      expect(screen.getByText('D')).toBeInTheDocument();
    });

    it('displays fallback character when no names provided', () => {
      render(<Avatar />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('handles empty string names', () => {
      render(<Avatar firstName="" lastName="" />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('handles whitespace-only names', () => {
      render(<Avatar firstName="   " lastName="   " />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('displays uppercase initials', () => {
      render(<Avatar firstName="john" lastName="doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('renders with small size', () => {
      render(<Avatar firstName="John" lastName="Doe" size="sm" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('h-8', 'w-8', 'text-xs');
    });

    it('renders with medium size (default)', () => {
      render(<Avatar firstName="John" lastName="Doe" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('h-10', 'w-10', 'text-sm');
    });

    it('renders with large size', () => {
      render(<Avatar firstName="John" lastName="Doe" size="lg" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('h-12', 'w-12', 'text-base');
    });
  });

  describe('Image Display', () => {
    it('displays image when src is provided', () => {
      render(<Avatar firstName="John" lastName="Doe" src="https://example.com/avatar.jpg" alt="John's avatar" />);

      const image = screen.getByAltText("John's avatar");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('falls back to initials when image fails to load', () => {
      render(<Avatar firstName="John" lastName="Doe" src="invalid-url" />);

      const image = screen.getByAltText(/avatar for john doe/i);

      // Simulate image load error
      fireEvent.error(image);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('shows loading state when image is loading', () => {
      render(<Avatar firstName="John" lastName="Doe" src="https://example.com/avatar.jpg" />);

      // Initially, initials should not be visible since image is loading
      expect(screen.queryByText('JD')).not.toBeInTheDocument();

      // The avatar container should be present (target the div container, not the img)
      const avatarContainer = screen.getAllByRole('img', { name: /avatar for john doe/i })[0];
      expect(avatarContainer).toBeInTheDocument();
      expect(avatarContainer.tagName).toBe('DIV');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label with full name', () => {
      render(<Avatar firstName="John" lastName="Doe" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('aria-label', 'Avatar for John Doe');
    });

    it('has proper ARIA label with single name', () => {
      render(<Avatar firstName="John" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('aria-label', 'Avatar for John');
    });

    it('has proper ARIA label when no names provided', () => {
      render(<Avatar />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('aria-label', 'User avatar');
    });

    it('uses custom alt text when provided', () => {
      render(<Avatar firstName="John" lastName="Doe" alt="Custom description" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveAttribute('aria-label', 'Custom description');
    });

    it('hides initials text from screen readers', () => {
      render(<Avatar firstName="John" lastName="Doe" />);
      const initialsSpan = screen.getByText('JD');
      expect(initialsSpan).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Styling and Classes', () => {
    it('applies default styling classes', () => {
      render(<Avatar firstName="John" lastName="Doe" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-full',
        'bg-primary',
        'text-primary-foreground',
        'font-medium',
        'border',
        'border-border',
      );
    });

    it('supports custom className', () => {
      render(<Avatar firstName="John" lastName="Doe" className="custom-class" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('custom-class');
    });

    it('maintains circular shape', () => {
      render(<Avatar firstName="John" lastName="Doe" />);
      const avatar = screen.getByRole('img');
      expect(avatar).toHaveClass('rounded-full');
    });

    it('prevents text selection on initials', () => {
      render(<Avatar firstName="John" lastName="Doe" />);
      const initialsSpan = screen.getByText('JD');
      expect(initialsSpan).toHaveClass('select-none');
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Avatar ref={ref} firstName="John" lastName="Doe" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Edge Cases', () => {
    it('handles very long names gracefully', () => {
      render(
        <Avatar
          firstName="VeryLongFirstNameThatExceedsNormalLength"
          lastName="VeryLongLastNameThatExceedsNormalLength"
        />,
      );
      expect(screen.getByText('VV')).toBeInTheDocument();
    });

    it('handles names with special characters', () => {
      render(<Avatar firstName="José" lastName="García" />);
      expect(screen.getByText('JG')).toBeInTheDocument();
    });

    it('handles names with numbers', () => {
      render(<Avatar firstName="John2" lastName="Doe3" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });
});
