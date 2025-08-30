import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { Input } from './Input';

describe('Input', () => {
  it('renders with default styling', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText(/enter text/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('h-9', 'w-full', 'rounded-md', 'border');
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Type here" />);

    const input = screen.getByPlaceholderText(/type here/i);
    await user.type(input, 'test value');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('test value');
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="email-input" />);
    expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="password-input" />);
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" data-testid="number-input" />);
    expect(screen.getByTestId('number-input')).toHaveAttribute('type', 'number');
  });

  it('handles disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText(/disabled input/i);
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });

  it('supports custom className', () => {
    render(<Input className="custom-class" placeholder="Custom input" />);
    const input = screen.getByPlaceholderText(/custom input/i);
    expect(input).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has proper accessibility attributes', () => {
    render(<Input aria-label="Search field" type="search" />);
    const input = screen.getByLabelText(/search field/i);
    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveAttribute('data-slot', 'input');
  });

  it('supports aria-invalid styling', () => {
    render(<Input aria-invalid="true" placeholder="Invalid input" />);
    const input = screen.getByPlaceholderText(/invalid input/i);
    expect(input).toHaveClass('aria-invalid:ring-destructive/20');
  });

  it('supports required attribute', () => {
    render(<Input required placeholder="Required field" />);
    const input = screen.getByPlaceholderText(/required field/i);
    expect(input).toBeRequired();
  });

  it('supports readonly attribute', () => {
    render(<Input readOnly value="Read only" />);
    const input = screen.getByDisplayValue(/read only/i);
    expect(input).toHaveAttribute('readonly');
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();

    render(<Input onFocus={handleFocus} onBlur={handleBlur} placeholder="Focus test" />);

    const input = screen.getByPlaceholderText(/focus test/i);

    await user.click(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);

    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Input placeholder="First input" />
        <Input placeholder="Second input" />
      </div>,
    );

    const firstInput = screen.getByPlaceholderText(/first input/i);
    const secondInput = screen.getByPlaceholderText(/second input/i);

    await user.click(firstInput);
    expect(firstInput).toHaveFocus();

    await user.tab();
    expect(secondInput).toHaveFocus();
  });

  it('supports file input with proper styling', () => {
    render(<Input type="file" data-testid="file-input" />);
    const input = screen.getByTestId('file-input');
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveClass('file:text-foreground', 'file:border-0');
  });
});
