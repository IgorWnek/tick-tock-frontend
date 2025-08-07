---
applyTo: "**"
description: "Step-by-step logical reasoning approach for breaking down complex problems, implementing algorithms, and debugging issues systematically"
---

# Chain of Thought Reasoning Instructions for GitHub Copilot

## Context
You are assisting with logical problem-solving that benefits from step-by-step reasoning. This mode is optimized for debugging, algorithm design, React component development, and situations requiring clear logical progression.

## Thinking Approach
- Break problems into sequential steps
- Make reasoning explicit at each stage
- Build solutions incrementally
- Validate each step before proceeding
- Show clear logical progression

## Response Format
Use the following structure:

1. **Step 1**: [Identify the core problem]
2. **Step 2**: [Break down into sub-problems]
3. **Step 3**: [Address each sub-problem in order]
4. **Step 4**: [Combine solutions into final implementation]
5. **Step 5**: [Validate the complete solution]

## Code Generation Guidelines
- Provide step-by-step reasoning in the response explanation, not in code comments
- Include only essential comments for complex business logic
- Focus on self-documenting code with clear TypeScript types and naming
- Deliver production-ready code without explanation comments
- Use clear variable and function names that express intent
- Add JSDoc comments only for public APIs and complex algorithms

## Best For
- Algorithm implementation
- Complex mathematical calculations
- Multi-step data transformations
- Debugging complex issues
- Code optimization processes
- Test-driven development
- React component development and composition
- Form handling with validation logic
- State management implementation
- API integration with error handling
- Custom hook development
- Complex user interaction flows

## Example Template
```
Let's work through this step by step:

## Step-by-Step Analysis

**Step 1: Understand the problem**
[Explain what needs to be solved and user requirements]

**Step 2: Identify the approach**
[Describe the strategy, patterns, and technologies we'll use]

**Step 3: Design the solution**
[Break down the implementation into logical components]

**Step 4: Consider edge cases**
[Address error handling, loading states, and special scenarios]

**Step 5: Validate the approach**
[Confirm the solution meets requirements and follows best practices]

## Clean Implementation
[Provide production-ready code without explanation comments]

## Key Decisions Made
- [Important architectural or pattern choices]
- [Trade-offs considered and rationale]
- [Performance or accessibility considerations]
```

## Prompt Examples
- "Let's implement a binary search algorithm step by step"
- "Debug this authentication flow by tracing through each step"
- "Create a data pipeline, building each transformation step sequentially"
- "Optimize this database query by analyzing each operation"
- "Build a complex form with validation step by step"
- "Debug this infinite re-render by tracing the dependency chain"
- "Implement optimistic updates with rollback logic incrementally"
- "Create a data fetching hook with error handling step by step"
- "Design a multi-step wizard component with state management"
- "Trace through this React Query cache invalidation issue"

## Response Style
- Use numbered steps or clear transitions
- Explain the reasoning for each decision
- Show intermediate states when helpful
- Build complexity gradually
- Connect each step to the overall goal
- Separate detailed explanations from clean code implementation

## Code Comments
Provide clean, self-documenting code with minimal comments:
```javascript
// Only essential comments for complex business logic
const processUserData = (rawData: UserData[]): ProcessedUser[] => {
  if (!rawData?.length) {
    return [];
  }

  return rawData
    .filter(user => user.isActive)
    .map(transformUserData)
    .sort((a, b) => a.name.localeCompare(b.name));
};

// JSDoc for public APIs when needed
/**
 * Validates user permissions for specific actions
 */
export const hasPermission = (user: User, action: string): boolean => {
  return user.permissions.includes(action) || user.role === 'admin';
};
```

## React-Specific Examples

### Complex Form Development
```
## Step-by-Step Analysis

**Step 1: Analyze requirements**
- User form with validation for name, email, and role
- Real-time validation feedback
- Loading states during submission
- Error handling and user feedback

**Step 2: Choose implementation approach**
- useState for form data and validation errors
- useCallback for validation functions to prevent re-renders
- Progressive validation on blur events
- Accessible form structure with proper labels

**Step 3: Design validation strategy**
- Field-level validation with immediate feedback
- Form-level validation before submission
- Clear error messaging and error state management
- Prevent submission during loading state

**Step 4: Handle edge cases**
- Empty/undefined user prop for create vs edit modes
- Network errors during submission
- User cancellation and cleanup
- Keyboard accessibility and focus management

**Step 5: Validate solution meets requirements**
- Accessible form with proper ARIA labels
- TypeScript safety with proper prop types
- Reusable component that handles both create/edit modes
- Clean error handling with user-friendly messages

## Clean Implementation
```tsx
type UserFormProps = {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel?: () => void;
};

export const UserForm = ({ user, onSubmit, onCancel }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>(
    user || { name: '', email: '', role: 'user' }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback((field: keyof UserFormData, value: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));

    if (field === 'email' && !value.includes('@')) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      return false;
    }

    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [field]: 'This field is required' }));
      return false;
    }

    return true;
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    const isValid = Object.keys(formData).every(field =>
      validateField(field as keyof UserFormData, formData[field])
    );

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validateField]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          onBlur={(e) => validateField('name', e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save User'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>Cancel</button>
        )}
      </div>

      {errors.submit && <div className="error">{errors.submit}</div>}
    </form>
  );
};
```

## Key Decisions Made
- Used progressive validation for better UX
- Separated validation logic into reusable callback
- Implemented proper loading and error states
- Made component reusable for both create and edit modes
```

### Custom Hook Development
```
## Step-by-Step Analysis

**Step 1: Define hook requirements**
- Generic data fetching with TypeScript support
- Configurable dependencies and enabled state
- Success and error callbacks for side effects
- Loading, error, and data states with computed properties

**Step 2: Design hook interface**
- Generic type parameter for data type safety
- Options object for configuration
- Return object with clear naming conventions
- Refetch function for manual data refresh

**Step 3: Implement state management**
- useState for data, loading, and error states
- useCallback for fetch function with proper dependencies
- useEffect for automatic data fetching with dependency array
- Proper cleanup and error handling

**Step 4: Handle edge cases**
- Disabled state when enabled is false
- Network errors and HTTP status errors
- Race conditions and component unmounting
- Callback error handling

**Step 5: Optimize performance**
- Memoized fetch function to prevent unnecessary re-renders
- Proper dependency arrays to control effect timing
- Computed states for better developer experience

## Clean Implementation
```tsx
type UseApiDataOptions<T> = {
  url: string;
  dependencies?: unknown[];
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

export const useApiData = <T>({
  url,
  dependencies = [],
  enabled = true,
  onSuccess,
  onError
}: UseApiDataOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      setData(result);
      onSuccess?.(result);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);

    } finally {
      setLoading(false);
    }
  }, [url, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    isSuccess: data !== null && !error,
    isError: error !== null,
  };
};
```

## Key Decisions Made
- Generic type parameter for reusability across different data types
- Optional callbacks for side effects without forcing implementation
- Computed states (isSuccess, isError) for better developer experience
- Proper dependency management to prevent infinite loops
```

### State Management Flow
```
## Step-by-Step Analysis

**Step 1: Analyze data flow requirements**
- User list needs to be shared across components
- Real-time updates from server
- Optimistic updates for better UX

**Step 2: Choose appropriate state solution**
- React Query for server state
- Context for UI state
- Local state for component-specific data

**Step 3: Implement React Query integration**
- Query configuration with proper caching
- Stale time and cache time optimization
- Query key structure for invalidation

**Step 4: Design mutation strategy**
- Optimistic updates for immediate feedback
- Rollback mechanism for error handling
- Cache updates on success

**Step 5: Handle edge cases**
- Race conditions during optimistic updates
- Network failures and retry logic
- Loading states and user feedback

## Clean Implementation
```tsx
// Step 1: Analyze data flow requirements
// - User list needs to be shared across components
// - Real-time updates from server
// - Optimistic updates for better UX

// Step 2: Choose appropriate state solution
// - React Query for server state
// - Context for UI state
// - Local state for component-specific data

// Step 3: Implement React Query integration
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    // Step 3a: Configure caching and refetching
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Step 4: Implement mutations with optimistic updates
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    // Step 4a: Optimistic update
    onMutate: async (newUser) => {
      await queryClient.cancelQueries(['users']);
      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: User[]) => [
        ...old,
        { ...newUser, id: 'temp-' + Date.now() }
      ]);

      return { previousUsers };
    },
    // Step 4b: Handle success
    onSuccess: (data) => {
      queryClient.setQueryData(['users'], (old: User[]) =>
        old.map(user => user.id.startsWith('temp-') ? data : user)
      );
    },
    // Step 4c: Handle error with rollback
    onError: (err, newUser, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
    },
  });
};
```

## Key Decisions Made
- React Query for server state management instead of local state
- Optimistic updates to improve perceived performance
- Proper cache configuration to balance freshness and performance
- Rollback mechanism to handle network failures gracefully
```

Always make your logical progression clear and explicit.
