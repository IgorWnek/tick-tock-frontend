---
applyTo: 'src/design-system/organisms/**/*.test.{tsx,ts}'
description: 'Testing patterns for organism-level components: data fetching, complex state, user interactions, loading states, and integration with TanStack Query'
---

# Organism Testing Instructions

Organism components are complex, functional sections that often include data fetching, state management, and multiple user interactions. This instruction file provides specific patterns for testing organisms effectively.

References:
- General testing patterns: `./testing.instructions.md`
- Template testing (for layout-focused organisms): `./testing-templates.instructions.md`
- Data architecture: `./data-architecture.instructions.md`
- Atomic Design responsibilities: `./atomic-design.instructions.md`

## Testing Approach for Organisms

Organisms can use **either** testing approach depending on their complexity:

### Option 1: Custom Test Helper (Recommended for Data-Heavy Organisms)

Use the custom `tests` helper when your organism:
- Fetches data with TanStack Query
- Requires authentication context
- Needs complex router state
- Uses multiple context providers

```tsx
import { render, screen } from 'tests';
import { YourOrganism } from './YourOrganism';

test('renders with data', async () => {
  render(<YourOrganism />);
  await screen.findByText('Data loaded');
});
```

### Option 2: Direct RTL Imports (For Layout-Focused Organisms)

Use direct imports when your organism:
- Primarily handles layout/composition
- Minimal data fetching
- Simple state management
- Navigation-focused

```tsx
import { render, screen } from '@testing-library/react';
import { YourOrganism } from './YourOrganism';

test('renders layout correctly', () => {
  render(<YourOrganism {...props} />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});
```

## Core Testing Patterns for Organisms

### 1. Data Loading States

```tsx
describe('Data Loading', () => {
  it('should show loading state initially', () => {
    render(<UserDashboard />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show error state when data fails', async () => {
    // Mock failed API response
    server.use(
      http.get('**/users/**', () => {
        return HttpResponse.json({ error: 'Failed to load' }, { status: 500 });
      })
    );

    render(<UserDashboard />);

    await screen.findByRole('alert');
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it('should show data when loaded successfully', async () => {
    render(<UserDashboard />);

    await screen.findByText('Welcome, John Doe');
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });
});
```

### 2. User Interactions and State Changes

```tsx
describe('User Interactions', () => {
  it('should handle form submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByRole('textbox', { name: /name/i }), 'John Doe');
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await screen.findByText('Message sent successfully');
  });

  it('should validate form inputs', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('should handle optimistic updates', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(screen.getByRole('textbox', { name: /new todo/i }), 'Buy groceries');
    await user.click(screen.getByRole('button', { name: /add/i }));

    // Should immediately show optimistic update
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();

    // Should persist after server confirmation
    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
  });
});
```

### 3. Complex State Management

```tsx
describe('State Management', () => {
  it('should manage local state correctly', async () => {
    const user = userEvent.setup();
    render(<FilterableList />);

    // Test filter state
    await user.type(screen.getByRole('textbox', { name: /search/i }), 'react');

    expect(screen.getByText('React Component')).toBeInTheDocument();
    expect(screen.queryByText('Vue Component')).not.toBeInTheDocument();
  });

  it('should handle pagination state', async () => {
    const user = userEvent.setup();
    render(<PaginatedTable />);

    await screen.findByText('Page 1 of 5');

    await user.click(screen.getByRole('button', { name: /next page/i }));

    await screen.findByText('Page 2 of 5');
  });

  it('should persist state through interactions', async () => {
    const user = userEvent.setup();
    render(<ShoppingCart />);

    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.getByText('Cart (1)')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove from cart/i }));
    expect(screen.getByText('Cart (0)')).toBeInTheDocument();
  });
});
```

### 4. Integration with Child Components

```tsx
describe('Component Integration', () => {
  it('should pass data to child components correctly', async () => {
    render(<UserProfile userId="123" />);

    await screen.findByText('John Doe'); // From UserInfo child
    expect(screen.getByText('123-456-7890')).toBeInTheDocument(); // From ContactInfo child
    expect(screen.getByText('5 posts')).toBeInTheDocument(); // From UserStats child
  });

  it('should handle child component events', async () => {
    const user = userEvent.setup();
    render(<PostsList />);

    await screen.findByText('Latest Posts');

    // Interact with child component
    await user.click(screen.getByRole('button', { name: /load more/i }));

    await screen.findByText('Showing 20 of 50 posts');
  });
});
```

### 5. TanStack Query Integration

```tsx
describe('Data Fetching', () => {
  it('should handle query invalidation', async () => {
    const user = userEvent.setup();
    render(<UserManagement />);

    await screen.findByText('John Doe');

    // Trigger action that should invalidate
    await user.click(screen.getByRole('button', { name: /refresh/i }));

    // Should show loading then updated data
    expect(screen.getByRole('status')).toBeInTheDocument();
    await screen.findByText('John Doe'); // Re-fetched data
  });

  it('should handle mutations with optimistic updates', async () => {
    const user = userEvent.setup();
    render(<PostEditor />);

    await user.type(screen.getByRole('textbox', { name: /title/i }), 'New Post');
    await user.click(screen.getByRole('button', { name: /publish/i }));

    // Optimistic update
    expect(screen.getByText('Publishing...')).toBeInTheDocument();

    // Server confirmation
    await screen.findByText('Published successfully');
  });

  it('should handle concurrent mutations', async () => {
    const user = userEvent.setup();
    render(<BulkActions />);

    // Select multiple items
    await user.click(screen.getByRole('checkbox', { name: /item 1/i }));
    await user.click(screen.getByRole('checkbox', { name: /item 2/i }));

    // Trigger bulk action
    await user.click(screen.getByRole('button', { name: /delete selected/i }));

    await screen.findByText('2 items deleted');
  });
});
```

## MSW Setup for Organisms

Organisms often need API mocking. Set up MSW handlers for your data:

```tsx
import { http, HttpResponse } from 'msw';
import { server } from '@/tests/msw-server';

beforeEach(() => {
  server.use(
    http.get('**/users/:id', ({ params }) => {
      return HttpResponse.json({
        id: params.id,
        name: 'John Doe',
        email: 'john@example.com'
      });
    }),

    http.post('**/posts', async ({ request }) => {
      const post = await request.json();
      return HttpResponse.json({
        id: Date.now(),
        ...post,
        createdAt: new Date().toISOString()
      });
    })
  );
});
```

## Testing Empty and Error States

```tsx
describe('Edge Cases', () => {
  it('should handle empty state', async () => {
    server.use(
      http.get('**/posts', () => {
        return HttpResponse.json([]);
      })
    );

    render(<PostsList />);

    await screen.findByText('No posts yet');
    expect(screen.getByText('Create your first post')).toBeInTheDocument();
  });

  it('should handle network errors gracefully', async () => {
    server.use(
      http.get('**/posts', () => {
        return HttpResponse.error();
      })
    );

    render(<PostsList />);

    await screen.findByRole('alert');
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should handle partial data loading', async () => {
    server.use(
      http.get('**/users/:id', () => {
        return HttpResponse.json({ id: '123', name: 'John Doe' }); // Missing email
      })
    );

    render(<UserProfile userId="123" />);

    await screen.findByText('John Doe');
    expect(screen.getByText('Email not provided')).toBeInTheDocument();
  });
});
```

## Accessibility Testing for Organisms

```tsx
describe('Accessibility', () => {
  it('should announce loading states to screen readers', () => {
    render(<DataTable />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText('Loading data')).toBeInTheDocument();
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<DataTable />);

    await screen.findByRole('table');

    await user.tab(); // Focus first cell
    await user.keyboard('{ArrowRight}'); // Move to next cell
    await user.keyboard('{Enter}'); // Activate

    expect(document.activeElement).toHaveAttribute('role', 'gridcell');
  });

  it('should provide proper ARIA labels', async () => {
    render(<SearchResults />);

    await screen.findByRole('region', { name: 'Search results' });
    expect(screen.getByText('5 results found')).toHaveAttribute('aria-live', 'polite');
  });
});
```

## Performance Testing Considerations

```tsx
describe('Performance', () => {
  it('should not cause excessive re-renders', async () => {
    const renderSpy = vi.fn();

    const TestComponent = () => {
      renderSpy();
      return <ExpensiveOrganism />;
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    await user.click(screen.getByRole('button', { name: /toggle/i }));

    // Should render efficiently
    expect(renderSpy).toHaveBeenCalledTimes(2); // Initial + state change
  });
});
```

## Complete Organism Test Example

```tsx
import { render, screen, waitFor } from 'tests';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/tests/msw-server';

import { UserDashboard } from './UserDashboard';

describe('UserDashboard', () => {
  beforeEach(() => {
    server.use(
      http.get('**/users/me', () => {
        return HttpResponse.json({
          id: '123',
          name: 'John Doe',
          email: 'john@example.com'
        });
      }),

      http.get('**/posts', () => {
        return HttpResponse.json([
          { id: '1', title: 'First Post', author: 'John Doe' },
          { id: '2', title: 'Second Post', author: 'John Doe' }
        ]);
      })
    );
  });

  describe('Data Loading', () => {
    it('should show loading then user data', async () => {
      render(<UserDashboard />);

      expect(screen.getByRole('status')).toBeInTheDocument();

      await screen.findByText('Welcome, John Doe');
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle post creation', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('**/posts', async ({ request }) => {
          const post = await request.json();
          return HttpResponse.json({
            id: Date.now().toString(),
            ...post,
            author: 'John Doe'
          });
        })
      );

      render(<UserDashboard />);

      await screen.findByText('Welcome, John Doe');

      await user.click(screen.getByRole('button', { name: /new post/i }));
      await user.type(screen.getByRole('textbox', { name: /title/i }), 'My New Post');
      await user.click(screen.getByRole('button', { name: /publish/i }));

      await screen.findByText('My New Post');
    });
  });
});
```

## Quick Checklist for Organism Tests

- [ ] Tests all data loading states (loading, success, error, empty)
- [ ] Covers user interactions and state changes
- [ ] Tests integration with child components
- [ ] Includes MSW mocking for API calls
- [ ] Tests optimistic updates when applicable
- [ ] Covers accessibility features
- [ ] Tests keyboard navigation
- [ ] Handles edge cases and error scenarios
- [ ] Uses appropriate test helper (custom vs direct RTL)
- [ ] Tests performance considerations when relevant

Organisms are the most complex components to test, but following these patterns ensures comprehensive coverage while maintaining test reliability and maintainability.
