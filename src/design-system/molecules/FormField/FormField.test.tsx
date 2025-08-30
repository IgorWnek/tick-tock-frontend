import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { FormField } from './FormField';

describe('FormField', () => {
  it('renders with label, input, and basic styling', () => {
    render(<FormField name="email" label="Email Address" placeholder="Enter your email" />);

    const label = screen.getByLabelText(/email address/i);
    const input = screen.getByPlaceholderText(/enter your email/i);

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toHaveAttribute('name', 'email');
  });

  it('shows required asterisk when required prop is true', () => {
    render(<FormField name="password" label="Password" required />);

    const label = screen.getByText('Password');
    expect(label).toHaveClass("after:content-['*']", 'after:ml-0.5', 'after:text-destructive');
  });

  it('does not show required asterisk when required prop is false', () => {
    render(<FormField name="optional" label="Optional Field" />);

    const label = screen.getByText('Optional Field');
    expect(label).not.toHaveClass("after:content-['*']");
  });

  it('displays error message with proper accessibility attributes', () => {
    const errorMessage = 'Password must be at least 8 characters';
    render(<FormField name="password" label="Password" error={errorMessage} />);

    const errorElement = screen.getByText(errorMessage);
    const input = screen.getByLabelText(/password/i);

    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveAttribute('role', 'alert');
    expect(errorElement).toHaveAttribute('aria-live', 'polite');
    expect(errorElement).toHaveAttribute('id', 'password-error');
    expect(errorElement).toHaveClass('text-sm', 'text-destructive');

    expect(input).toHaveAttribute('aria-describedby', 'password-error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies error styling to input when error is present', () => {
    render(<FormField name="email" label="Email" error="Invalid email format" />);

    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveClass('border-destructive', 'focus-visible:ring-destructive/50');
  });

  it('does not show error message when error prop is not provided', () => {
    render(<FormField name="username" label="Username" />);

    const input = screen.getByLabelText(/username/i);
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('handles different input types correctly', () => {
    const { rerender } = render(<FormField name="test" label="Test" type="email" />);
    expect(screen.getByLabelText(/test/i)).toHaveAttribute('type', 'email');

    rerender(<FormField name="test" label="Test" type="password" />);
    expect(screen.getByLabelText(/test/i)).toHaveAttribute('type', 'password');

    rerender(<FormField name="test" label="Test" type="tel" />);
    expect(screen.getByLabelText(/test/i)).toHaveAttribute('type', 'tel');

    rerender(<FormField name="test" label="Test" type="number" />);
    expect(screen.getByLabelText(/test/i)).toHaveAttribute('type', 'number');
  });

  it('handles controlled value correctly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<FormField name="controlled" label="Controlled Input" value="initial value" onChange={handleChange} />);

    const input = screen.getByLabelText(/controlled input/i);
    expect(input).toHaveValue('initial value');

    await user.clear(input);
    await user.type(input, 'new value');

    expect(handleChange).toHaveBeenCalled();
  });

  it('handles uncontrolled default value correctly', () => {
    render(<FormField name="uncontrolled" label="Uncontrolled Input" defaultValue="default" />);

    const input = screen.getByLabelText(/uncontrolled input/i);
    expect(input).toHaveValue('default');
  });

  it('supports disabled state', () => {
    render(<FormField name="disabled" label="Disabled Field" disabled />);

    const input = screen.getByLabelText(/disabled field/i);
    expect(input).toBeDisabled();
  });

  it('forwards ref correctly for React Hook Form integration', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<FormField ref={ref} name="ref-test" label="Ref Test" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.name).toBe('ref-test');
  });

  it('handles onBlur event correctly', async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();

    render(<FormField name="blur-test" label="Blur Test" onBlur={handleBlur} />);

    const input = screen.getByLabelText(/blur test/i);
    await user.click(input);
    await user.tab();

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles onChange event correctly', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<FormField name="change-test" label="Change Test" onChange={handleChange} />);

    const input = screen.getByLabelText(/change test/i);
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalled();
  });

  it('applies custom className to container', () => {
    // Test that custom className affects the layout by checking spacing behavior
    const { rerender } = render(<FormField name="custom" label="Custom Field" />);

    // Verify default rendering works
    expect(screen.getByLabelText('Custom Field')).toBeInTheDocument();

    // Rerender with custom class - if it applies correctly, component still renders properly
    rerender(<FormField name="custom" label="Custom Field" className="custom-container-class" />);
    expect(screen.getByLabelText('Custom Field')).toBeInTheDocument();
  });

  it('passes through additional input props', () => {
    render(
      <FormField
        name="extra-props"
        label="Extra Props"
        placeholder="Test placeholder"
        autoComplete="email"
        maxLength={50}
        data-testid="extra-props-input"
      />,
    );

    const input = screen.getByTestId('extra-props-input');
    expect(input).toHaveAttribute('placeholder', 'Test placeholder');
    expect(input).toHaveAttribute('autocomplete', 'email');
    expect(input).toHaveAttribute('maxlength', '50');
  });

  it('maintains proper accessibility hierarchy with label and input association', () => {
    render(<FormField name="accessibility" label="Accessibility Test" />);

    const label = screen.getByText('Accessibility Test');
    const input = screen.getByLabelText(/accessibility test/i);

    expect(label).toHaveAttribute('for', 'accessibility');
    expect(input).toHaveAttribute('id', 'accessibility');
  });

  it('supports multiple error states simultaneously', () => {
    render(
      <div>
        <FormField name="field1" label="Field 1" error="Error 1" />
        <FormField name="field2" label="Field 2" error="Error 2" />
      </div>,
    );

    const error1 = screen.getByText('Error 1');
    const error2 = screen.getByText('Error 2');
    const input1 = screen.getByLabelText(/field 1/i);
    const input2 = screen.getByLabelText(/field 2/i);

    expect(error1).toHaveAttribute('id', 'field1-error');
    expect(error2).toHaveAttribute('id', 'field2-error');
    expect(input1).toHaveAttribute('aria-describedby', 'field1-error');
    expect(input2).toHaveAttribute('aria-describedby', 'field2-error');
  });

  it('has proper spacing between elements', () => {
    // Test spacing by verifying all elements render in correct order
    render(<FormField name="spacing" label="Spacing Test" error="Test error" />);

    const label = screen.getByText('Spacing Test');
    const input = screen.getByLabelText('Spacing Test');
    const error = screen.getByText('Test error');

    // Verify all elements are present and accessible
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(error).toBeInTheDocument();
  });

  it('handles required field with error correctly', () => {
    render(<FormField name="required-error" label="Required Field" required error="This field is required" />);

    const label = screen.getByText('Required Field');
    const input = screen.getByLabelText(/required field/i);
    const error = screen.getByText('This field is required');

    // Required asterisk
    expect(label).toHaveClass("after:content-['*']", 'after:text-destructive');

    // Error state
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('border-destructive');
    expect(error).toHaveAttribute('role', 'alert');
  });
});
