---
applyTo: "**/*.{ts,tsx,js,jsx}"
description: "TanStack Query best practices for server state management, caching strategies, and data synchronization patterns"
---

# TanStack Query Instructions for GitHub Copilot

## Context
TanStack Query serves as our client-side server state management and caching layer. It's crucial that our implementation works identically with MSW (development) and real APIs (production). TanStack Query acts as a sophisticated data store that automatically handles caching, synchronization, and invalidation.

## Core Principles

### 1. TanStack Query as a Data Store
- **Treat TanStack Query as your primary data store** for server state
- **Never duplicate server state** in local React state (useState/useReducer)
- **Use cache as single source of truth** for data consistency across components
- **Design MSW handlers to work exactly like real APIs** for seamless transition

### 2. Cache Invalidation is Critical
- **Always invalidate related caches** after mutations that change server state
- **Use broad invalidation patterns** to ensure data consistency
- **Invalidate parent and related queries** to maintain referential integrity
- **Prefer over-invalidation to under-invalidation** to avoid stale data

## Query Organization

### Query Factories Pattern
Always use query factories for consistent query key management:

```typescript
// ✅ Good: Centralized query key management
export const userQueries = {
  all: () => ['users'],
  lists: () => [...userQueries.all(), 'list'],
  list: (filters: UserFilters) => [...userQueries.lists(), filters],
  details: () => [...userQueries.all(), 'detail'],
  detail: (id: string) => [...userQueries.details(), id],
};

// ✅ Good: Consistent query factory usage
export const useUser = (id: string) => {
  return useQuery(userQueries.detail(id));
};
```

### Query Key Hierarchy
Structure query keys hierarchically for effective invalidation:

```typescript
// ✅ Good: Hierarchical structure
['time-logs']                          // Root
['time-logs', 'calendar']              // Calendar data
['time-logs', 'calendar', '2025-07']   // Specific month
['time-logs', 'day']                   // Day entries
['time-logs', 'day', '2025-07-31']     // Specific day
```

## Mutation Patterns

### Comprehensive Cache Invalidation
After mutations, invalidate all related data:

```typescript
// ✅ Good: Comprehensive invalidation
export const useCreateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation('createTimeEntry', {
    onSuccess: (data, variables) => {
      const { date } = variables;
      const month = date.substring(0, 7);

      // Invalidate all related queries
      queryClient.invalidateQueries({
        queryKey: ['time-logs'], // Broad invalidation
      });

      // Specific invalidations for optimization
      queryClient.invalidateQueries({
        queryKey: [...calendarQueries.calendar(), month],
      });

      queryClient.invalidateQueries({
        queryKey: [...calendarQueries.days(), date],
      });
    },
  });
};
```

### Optimistic Updates (Advanced)
For immediate UI feedback, use optimistic updates:

```typescript
// ✅ Good: Optimistic updates with rollback
export const useCreateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation('createTimeEntry', {
    onMutate: async (newEntry) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['time-logs', 'day', newEntry.date]);

      // Snapshot previous value
      const previousEntries = queryClient.getQueryData(['time-logs', 'day', newEntry.date]);

      // Optimistically update
      queryClient.setQueryData(['time-logs', 'day', newEntry.date], (old: TimeEntry[]) => [
        ...old,
        { ...newEntry, id: 'temp-' + Date.now() }
      ]);

      return { previousEntries };
    },
    onError: (err, newEntry, context) => {
      // Rollback on error
      queryClient.setQueryData(['time-logs', 'day', newEntry.date], context?.previousEntries);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['time-logs']);
    },
  });
};
```

## MSW Integration

### Data Store Consistency
Ensure MSW handlers use shared data stores that persist across requests:

```typescript
// ✅ Good: Shared persistent store
class MockDataStore {
  private readonly entries: Map<string, TimeEntry[]> = new Map();

  addEntries(date: string, entries: TimeEntry[]): void {
    // Implementation that persists data
  }

  getEntries(date: string): TimeEntry[] {
    // Implementation that retrieves persisted data
  }
}

export const mockDataStore = new MockDataStore(); // Singleton
```

### Handler Implementation
MSW handlers should mirror real API behavior:

```typescript
// ✅ Good: Realistic API simulation
export const timeLogsHandlers = {
  async createEntry(data: CreateEntryRequest): Promise<CreateEntryResponse> {
    // Simulate realistic processing time
    await new Promise(resolve => setTimeout(resolve, 800));

    // Store in persistent mock store
    const entry = await mockDataStore.addEntry(data);

    // Return realistic response structure
    return {
      success: true,
      entry,
      message: 'Entry created successfully'
    };
  }
};
```

## Error Handling

### Consistent Error Patterns
Handle errors consistently across queries and mutations:

```typescript
// ✅ Good: Consistent error handling
export const useTimeEntries = (date: string) => {
  return useQuery({
    queryKey: ['time-logs', 'day', date],
    queryFn: () => fetchTimeEntries(date),
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error.status >= 400 && error.status < 500) return false;
      return failureCount < 3;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## Performance Optimization

### Cache Configuration
Configure appropriate cache times based on data characteristics:

```typescript
// ✅ Good: Appropriate cache configuration
export const calendarQueries = {
  calendar: (month: string) => ({
    queryKey: ['time-logs', 'calendar', month],
    queryFn: () => fetchCalendarData(month),
    staleTime: 5 * 60 * 1000,  // 5 minutes (changes infrequently)
    cacheTime: 10 * 60 * 1000, // 10 minutes
  }),

  dayEntries: (date: string) => ({
    queryKey: ['time-logs', 'day', date],
    queryFn: () => fetchDayEntries(date),
    staleTime: 1 * 60 * 1000,  // 1 minute (changes more frequently)
    cacheTime: 5 * 60 * 1000,  // 5 minutes
  }),
};
```

### Selective Invalidation
When possible, use targeted invalidation over broad invalidation:

```typescript
// ✅ Good: Selective invalidation for performance
onSuccess: (data, variables) => {
  const { date } = variables;
  const month = date.substring(0, 7);

  // Target specific affected queries
  queryClient.invalidateQueries({
    queryKey: ['time-logs', 'calendar', month],
  });

  queryClient.invalidateQueries({
    queryKey: ['time-logs', 'day', date],
  });

  // Only use broad invalidation when necessary
  if (data.affectsMultipleMonths) {
    queryClient.invalidateQueries({
      queryKey: ['time-logs'],
    });
  }
},
```

## Anti-Patterns to Avoid

### ❌ Don't Store Server State in Local State
```typescript
// ❌ Bad: Duplicating server state
const [timeEntries, setTimeEntries] = useState([]);
const { data } = useTimeEntries(date);

useEffect(() => {
  if (data) setTimeEntries(data.entries);
}, [data]);
```

```typescript
// ✅ Good: Use TanStack Query as source of truth
const { data: timeEntries } = useTimeEntries(date);
```

### ❌ Don't Skip Cache Invalidation
```typescript
// ❌ Bad: Missing invalidation leads to stale data
export const useCreateEntry = () => {
  return useMutation('createEntry', {
    // Missing onSuccess invalidation
  });
};
```

### ❌ Don't Use Inconsistent Query Keys
```typescript
// ❌ Bad: Inconsistent key structure
useQuery(['time-logs', date]);        // Different structure
useQuery(['timeEntries', date]);      // Different naming
useQuery(['time-logs', 'day', date]); // Good structure
```

## Development vs Production

### Environment Consistency
Ensure identical behavior between MSW and real APIs:

```typescript
// ✅ Good: Environment-agnostic implementation
export const useTimeEntries = (date: string) => {
  // Same hook works with both MSW and real API
  return useQuery({
    queryKey: ['time-logs', 'day', date],
    queryFn: () => apiClient.get(`/time-logs/day/${date}`),
    // Configuration works for both environments
  });
};
```

### Testing Patterns
Test with the same patterns used in production:

```typescript
// ✅ Good: Test cache invalidation behavior
test('creating entry invalidates calendar cache', async () => {
  const queryClient = new QueryClient();

  // Setup initial cache
  queryClient.setQueryData(['time-logs', 'calendar', '2025-07'], mockCalendarData);

  // Perform mutation
  await createEntry({ date: '2025-07-31' });

  // Verify cache invalidation
  expect(queryClient.getQueryState(['time-logs', 'calendar', '2025-07'])?.isInvalidated).toBe(true);
});
```

## Key Takeaways

1. **TanStack Query IS your data store** for server state - don't duplicate it
2. **Cache invalidation is crucial** - always invalidate related queries after mutations
3. **MSW should mirror real API behavior** exactly for consistent development experience
4. **Use query factories** for maintainable and consistent query key management
5. **Configure appropriate cache times** based on data update frequency
6. **Test cache invalidation patterns** to ensure data consistency
7. **Avoid local state for server data** - let TanStack Query manage it

Remember: The goal is seamless transition from development (MSW) to production (real API) with zero code changes in your React components.
