---
applyTo: 'src/design-system/templates/**/*.test.{tsx,ts}'
description: 'Testing patterns specifically for template-level components: direct RTL imports, TanStack Router mocking, layout testing, and responsive behavior validation'
---

# Template Testing Instructions

Template components require a specific testing approach that differs from the general testing patterns used for atoms, molecules, and organisms. This instruction file provides proven patterns for testing template-level components effectively.

References:
- General testing patterns: `./testing.instructions.md`
- Atomic Design responsibilities: `./atomic-design.instructions.md`
- Component architecture: `./react-core.instructions.md`

## Key Discovery: Direct RTL Imports Work Better

**Templates should use direct RTL imports instead of the custom `tests` helper.**

While the general `testing.instructions.md` recommends using `import { render, screen } from 'tests'`, our testing of template components (like ProfileTemplate) revealed that **direct Testing Library imports work more reliably** for template-level components.

## Required Testing Pattern for Templates

### Essential Imports

```tsx
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Component imports
import { YourTemplate } from './YourTemplate';
import type { YourTemplateProps } from './YourTemplate.types';
```

### TanStack Router Mocking (Required)

Templates typically use TanStack Router for navigation. Use this proven mocking pattern:

```tsx
// Mock TanStack Router with simple Link component
vi.mock('@tanstack/router', () => ({
  Link: ({
    to,
    children,
    className,
    onClick,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));
```

## Template Testing Structure

Templates should cover these specific areas:

### 1. Layout Structure Testing

```tsx
describe('Layout Structure', () => {
  it('should render main layout regions', () => {
    render(<YourTemplate {...defaultProps} />);

    // Test core layout landmarks
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    // Add other expected landmarks (header, aside, footer)
  });

  it('should render with proper heading hierarchy', () => {
    render(<YourTemplate {...defaultProps} />);

    // Verify h1, h2, h3 hierarchy is correct
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });
});
```

### 2. Navigation Testing

```tsx
describe('Navigation', () => {
  it('should render navigation sections', () => {
    render(<YourTemplate {...defaultProps} />);

    // Test navigation items
    expect(screen.getByRole('link', { name: 'Section 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Section 2' })).toBeInTheDocument();
  });

  it('should highlight active navigation section', () => {
    render(<YourTemplate {...defaultProps} activeSection="section1" />);

    const activeLink = screen.getByRole('link', { name: /section 1/i });
    expect(activeLink).toHaveClass('active', 'bg-primary'); // or your active classes
  });
});
```

### 3. Responsive Behavior Testing

```tsx
describe('Responsive Behavior', () => {
  it('should render mobile menu toggle', () => {
    render(<YourTemplate {...defaultProps} />);

    expect(screen.getByRole('button', { name: /toggle/i })).toBeInTheDocument();
  });

  it('should toggle mobile navigation', async () => {
    const user = userEvent.setup();
    render(<YourTemplate {...defaultProps} />);

    const toggleButton = screen.getByRole('button', { name: /toggle/i });
    await user.click(toggleButton);

    // Verify navigation is visible or state changed
    // Use aria-expanded or other state indicators
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });
});
```

### 4. Content Area Testing

```tsx
describe('Content Area', () => {
  it('should render children in main content area', () => {
    render(
      <YourTemplate {...defaultProps}>
        <div data-testid="custom-content">Test content</div>
      </YourTemplate>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should limit content width appropriately', () => {
    render(<YourTemplate {...defaultProps} />);

    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
    // Test for container classes if needed
  });
});
```

## Handling Multiple Similar Elements

Templates often have duplicate text (e.g., "Profile" in sidebar and breadcrumb). Use `within()` to scope queries:

```tsx
it('should render breadcrumb navigation', () => {
  render(<YourTemplate {...defaultProps} />);

  const breadcrumbNav = screen.getByRole('navigation', { name: 'Breadcrumb' });
  expect(breadcrumbNav).toBeInTheDocument();

  // Scope query to avoid conflicts with other "Profile" text
  expect(within(breadcrumbNav).getByText('Profile')).toBeInTheDocument();
});
```

## Accessibility Testing for Templates

Templates have special accessibility responsibilities:

```tsx
describe('Accessibility', () => {
  it('should have proper navigation landmarks', () => {
    render(<YourTemplate {...defaultProps} />);

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should provide screen reader text for interactive elements', () => {
    render(<YourTemplate {...defaultProps} />);

    expect(screen.getByText('Toggle sidebar')).toHaveClass('sr-only');
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<YourTemplate {...defaultProps} />);

    await user.tab(); // Focus first element
    await user.keyboard('{Enter}'); // Activate

    // Verify keyboard interaction works
  });
});
```

## Complete Template Test Example

```tsx
/**
 * YourTemplate component tests
 * Testing template-level component with layout structure and navigation
 */

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { YourTemplate } from './YourTemplate';
import type { YourTemplateProps } from './YourTemplate.types';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className, onClick }: any) => (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));

describe('YourTemplate', () => {
  const defaultProps: YourTemplateProps = {
    title: 'Page Title',
    sections: [
      { id: 'section1', label: 'Section 1', href: '/section1' },
      { id: 'section2', label: 'Section 2', href: '/section2' },
    ],
    activeSection: 'section1',
    children: <div>Template content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Layout Structure', () => {
    it('should render with required props', () => {
      render(<YourTemplate {...defaultProps} />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('Template content')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should render navigation sections', () => {
      render(<YourTemplate {...defaultProps} />);

      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle mobile interactions', async () => {
      const user = userEvent.setup();
      render(<YourTemplate {...defaultProps} />);

      const toggleButton = screen.getByRole('button', { name: /toggle/i });
      await user.click(toggleButton);

      // Verify responsive behavior
    });
  });

  describe('Accessibility', () => {
    it('should have proper landmarks', () => {
      render(<YourTemplate {...defaultProps} />);

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});
```

## Why This Pattern Works for Templates

1. **Simplified Setup**: Direct RTL imports avoid complex provider setup issues
2. **Router Compatibility**: Simple Link mocking works reliably with TanStack Router
3. **Layout Focus**: Templates are about layout/structure, not complex data flows
4. **Reduced Complexity**: Fewer moving parts = more stable tests

## When NOT to Use This Pattern

- **Atoms/Molecules**: Use general testing patterns from `testing.instructions.md`
- **Organisms with Data**: May need MSW mocking and custom providers
- **Complex State**: Components with heavy context or complex state management

## Anti-Patterns to Avoid

```tsx
// ❌ Don't use container.firstChild or direct DOM access
expect(container.firstChild).toHaveClass('some-class');

// ✅ Use data-testid or role-based queries instead
expect(screen.getByTestId('template-container')).toHaveClass('some-class');

// ❌ Don't use document.querySelector
const element = document.querySelector('.some-class');

// ✅ Use Testing Library queries with within() for specificity
const nav = screen.getByRole('navigation');
expect(within(nav).getByText('Item')).toBeInTheDocument();
```

## Quick Checklist for Template Tests

- [ ] Uses direct RTL imports (`render, screen, within`)
- [ ] Includes TanStack Router Link mocking
- [ ] Tests layout structure and landmarks
- [ ] Covers navigation functionality and active states
- [ ] Tests responsive behavior (mobile menu, etc.)
- [ ] Verifies accessibility (landmarks, screen reader text)
- [ ] Uses `within()` for scoped queries when needed
- [ ] Avoids direct DOM access violations
- [ ] Tests children rendering in content areas
- [ ] Covers prop forwarding and className application

This pattern ensures reliable, maintainable tests for template-level components while avoiding the complexity issues we discovered with custom test helpers.
