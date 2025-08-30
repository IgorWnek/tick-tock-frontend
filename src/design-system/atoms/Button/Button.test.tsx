import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { Button } from './Button';

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground', 'h-9');
  });

  it('renders with destructive variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive', 'text-white');
  });

  it('renders with outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button', { name: /outline/i });
    expect(button).toHaveClass('border', 'bg-background');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
  });

  it('renders with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button', { name: /ghost/i });
    expect(button).toHaveClass('hover:bg-accent');
  });

  it('renders with link variant', () => {
    render(<Button variant="link">Link</Button>);
    const button = screen.getByRole('button', { name: /link/i });
    expect(button).toHaveClass('text-primary', 'underline-offset-4');
  });

  it('renders with small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveClass('h-8', 'px-3');
  });

  it('renders with large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('h-10', 'px-6');
  });

  it('renders with icon size', () => {
    render(
      <Button size="icon" aria-label="Icon button">
        +
      </Button>,
    );
    const button = screen.getByRole('button', { name: /icon button/i });
    expect(button).toHaveClass('size-9');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('custom-class');
  });

  it('supports asChild prop with Slot', () => {
    render(
      <Button asChild>
        <a href="/test">Link as button</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: /link as button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('has proper accessibility attributes', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('data-slot', 'button');
  });

  it('supports aria-invalid styling', () => {
    render(<Button aria-invalid="true">Invalid</Button>);
    const button = screen.getByRole('button', { name: /invalid/i });
    expect(button).toHaveClass('aria-invalid:ring-destructive/20');
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Keyboard test</Button>);

    const button = screen.getByRole('button', { name: /keyboard test/i });
    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });
});
