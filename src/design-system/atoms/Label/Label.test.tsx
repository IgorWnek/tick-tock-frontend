import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { Label } from './Label';

describe('Label', () => {
  it('renders with default styling', () => {
    render(<Label>Test label</Label>);
    const label = screen.getByText(/test label/i);
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-sm', 'font-medium', 'flex', 'items-center');
  });

  it('associates with form controls using htmlFor', () => {
    render(
      <div>
        <Label htmlFor="test-input">Username</Label>
        <input id="test-input" type="text" />
      </div>,
    );

    const label = screen.getByText(/username/i);
    const input = screen.getByRole('textbox');

    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toHaveAttribute('id', 'test-input');
  });

  it('supports clicking to focus associated input', async () => {
    render(
      <div>
        <Label htmlFor="clickable-input">Click me</Label>
        <input id="clickable-input" type="text" />
      </div>,
    );

    const label = screen.getByText(/click me/i);
    const input = screen.getByRole('textbox');

    label.click();
    expect(input).toHaveFocus();
  });

  it('supports custom className', () => {
    render(<Label className="custom-class">Custom label</Label>);
    const label = screen.getByText(/custom label/i);
    expect(label).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref test</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('has proper accessibility attributes', () => {
    render(<Label>Accessible label</Label>);
    const label = screen.getByText(/accessible label/i);
    expect(label).toHaveAttribute('data-slot', 'label');
  });

  it('handles disabled state styling', () => {
    render(
      <div data-disabled="true" className="group">
        <Label>Disabled label</Label>
      </div>,
    );

    const label = screen.getByText(/disabled label/i);
    expect(label).toHaveClass('group-data-[disabled=true]:pointer-events-none');
  });

  it('supports peer disabled styling', () => {
    render(
      <div>
        <input disabled className="peer" />
        <Label>Peer disabled label</Label>
      </div>,
    );

    const label = screen.getByText(/peer disabled label/i);
    expect(label).toHaveClass('peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-50');
  });

  it('prevents text selection', () => {
    render(<Label>Non-selectable text</Label>);
    const label = screen.getByText(/non-selectable text/i);
    expect(label).toHaveClass('select-none');
  });

  it('supports gap spacing for icons', () => {
    render(
      <Label>
        <span>🔒</span>
        Password
      </Label>,
    );

    const label = screen.getByText(/password/i);
    expect(label).toHaveClass('gap-2');
  });

  it('maintains semantic structure', () => {
    render(<Label>Semantic label</Label>);
    const label = screen.getByText(/semantic label/i);
    expect(label.tagName).toBe('LABEL');
  });
});
