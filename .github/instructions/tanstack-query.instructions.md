---
applyTo: "**/*.{ts,tsx,js,jsx}"
description: "TanStack Query best practices for server state management, caching strategies, and data synchronization patterns"
---

# TanStack Query Instructions for GitHub Copilot

## Context
TanStack Query serves as our client-side server state management and caching layer. It's crucial that our implementation works identically with MSW (development) and real APIs (production). TanStack Query acts as a sophisticated data store that automatically handles caching, synchronization, and invalidation.

Naming note: Throughout this document, “TanStack Query” refers to the React bindings `@tanstack/react-query` (previously called “React Query”). Use “TanStack Query” consistently in code comments and docs.

This guide incorporates **atomic design principles** to ensure data fetching patterns align with our component architecture, where atoms focus on display, molecules handle simple data, organisms manage complex business logic, and templates coordinate multiple data sources.

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

### 3. Atomic Design Data Flow
- **Atoms**: No data fetching, pure display components
- **Molecules**: Simple data fetching for self-contained functionality
- **Organisms**: Complex data fetching and business logic coordination
- **Templates**: Data orchestration for entire page layouts
- **Pages**: Route-specific data fetching and parameter handling

## Data Fetching Patterns by Atomic Level

### Atoms - No Data Fetching
Atoms should be pure display components that receive data via props:

```typescript
// ✅ Good - Atom receives data via props
export const UserAvatar = ({ user, size = 'md' }: UserAvatarProps) => {
  return (
    <Avatar className={avatarSizes[size]}>
      <AvatarImage src={user.avatar} alt={user.name} />
      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

// ✅ Good - Status badge atom with no data fetching
export const StatusBadge = ({ status, variant = 'default' }: StatusBadgeProps) => {
  return (
    <Badge variant={getStatusVariant(status)}>
      {status}
    </Badge>
  );
};
```

### Molecules - Simple Data Fetching
Molecules can fetch simple, self-contained data:

```typescript
// ✅ Good - Molecule with focused data fetching
export const UserSearchInput = ({ onUserSelect }: UserSearchInputProps) => {
  const [query, setQuery] = useState('');

  // Simple query for search suggestions
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsers(query),
    enabled: query.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });

  return (
    <div className="relative">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search users..."
        isLoading={isLoading}
      />
      {suggestions && (
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={onUserSelect}
        />
      )}
    </div>
  );
};

// ✅ Good - Form field molecule with validation data
export const EmailField = ({ value, onChange, userId }: EmailFieldProps) => {
  // Simple validation query
  const { data: isEmailAvailable, isLoading } = useQuery({
    queryKey: ['users', 'email-check', value],
    queryFn: () => checkEmailAvailability(value, userId),
    enabled: !!value && value.includes('@'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <FormField
      label="Email"
      error={isEmailAvailable === false ? 'Email already taken' : undefined}
    >
      <Input
        type="email"
        value={value}
        onChange={onChange}
        isLoading={isLoading}
      />
    </FormField>
  );
};
```

### Organisms - Complex Data Orchestration
Organisms handle complex data fetching and business logic:

```typescript
// ✅ Good - Organism managing complex user data
export const UserProfileCard = ({ userId }: UserProfileCardProps) => {
  // Multiple related queries
  const { data: user, isLoading: userLoading } = useQuery(userQueries.getById(userId));

  const { data: permissions } = useQuery({
    ...userQueries.getPermissions(userId),
    enabled: !!user,
  });

  const { data: activities } = useQuery({
    ...userQueries.getRecentActivity(userId),
    enabled: !!user,
  });

  // Mutations with comprehensive cache management
  const { mutateAsync: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedUser) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-activities'] });

      // Optimistic update for immediate feedback
      queryClient.setQueryData(['users', userId], updatedUser);
    },
  });

  const { mutateAsync: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      // Comprehensive invalidation after deletion
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['users', userId] });
      queryClient.removeQueries({ queryKey: ['user-permissions', userId] });
      queryClient.removeQueries({ queryKey: ['user-activities', userId] });
    },
  });

  if (userLoading) return <UserProfileCardSkeleton />;
  if (!user) return <UserNotFound />;

  return (
    <Card className="p-6">
      <CardHeader>
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" />
          <div className="flex-1">
            <Text variant="h3">{user.name}</Text>
            <Text variant="muted">{user.email}</Text>
            {permissions && (
              <div className="flex gap-2 mt-2">
                {permissions.map(permission => (
                  <StatusBadge key={permission} status={permission} />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {activities && (
          <UserActivityTimeline activities={activities} />
        )}
      </CardContent>

      <CardFooter>
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={() => updateUser({ ...user, lastActiveAt: new Date() })}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Activity'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteUser(userId)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
```

### Templates - Data Layout Coordination
Templates coordinate data for entire page sections:

```typescript
// ✅ Good - Template coordinating multiple data sources
export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  // Layout-level data fetching
  const { data: currentUser } = useQuery(userQueries.getCurrent());
  const { data: notifications } = useQuery(notificationQueries.getUnread());
  const { data: navigationItems } = useQuery(navigationQueries.getForUser(currentUser?.id));

  // Global error handling for layout
  const queryClient = useQueryClient();
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'queryError') {
        // Handle global query errors
        toast.error('Failed to load data');
      }
    });

    return unsubscribe;
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        user={currentUser}
        notifications={notifications}
      />
      <div className="flex">
        <DashboardSidebar
          navigationItems={navigationItems}
          currentUser={currentUser}
        />
        <main className="flex-1 p-6">
          <ErrorBoundary fallback={<DashboardErrorFallback />}>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
```

### Pages - Route-Specific Data Fetching
Pages handle route parameters and coordinate page-level data:

```typescript
// ✅ Good - Page component with route-specific data fetching
export const UserManagementPage = () => {
  const { page = 1, search = '' } = useSearch({ from: '/users' });

  // Page-level data coordination
  const {
    data: usersData,
    isLoading,
    isError
  } = useQuery({
    ...userQueries.getPaginated({ page, search }),
    // v5: prefer structural sharing (default) or placeholderData to keep prior page visible
    placeholderData: (prev) => prev,
  });

  const { data: userStats } = useQuery(userQueries.getStats());

  // Page-level mutations
  const { mutateAsync: bulkDeleteUsers } = useMutation({
    mutationFn: deleteMultipleUsers,
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    },
  });

  if (isError) return <UserManagementErrorPage />;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UserManagementHeader stats={userStats} />

        <UserSearchAndFilters
          initialSearch={search}
          onFiltersChange={(newFilters) => {
            // Update URL with new filters
            navigate({ search: newFilters });
          }}
        />

        {isLoading ? (
          <UserTableSkeleton />
        ) : (
          <UserManagementTable
            users={usersData?.users}
            totalCount={usersData?.totalCount}
            currentPage={page}
            onBulkDelete={bulkDeleteUsers}
          />
        )}

        <UserTablePagination
          currentPage={page}
          totalPages={usersData?.totalPages}
          onPageChange={(newPage) => {
            navigate({ search: { ...search, page: newPage } });
          }}
        />
      </div>
    </DashboardLayout>
  );
};
```

## Query Organization

### Query Factories Pattern
Always use query factories for consistent query key management across atomic levels:

```typescript
// ✅ Good: Centralized query key management organized by feature
export const userQueries = {
  // Base keys
  all: () => ['users'],
  lists: () => [...userQueries.all(), 'list'],
  details: () => [...userQueries.all(), 'detail'],

  // Specific queries for different atomic levels
  list: (filters: UserFilters) => [...userQueries.lists(), filters],
  detail: (id: string) => [...userQueries.details(), id],
  permissions: (id: string) => [...userQueries.details(), id, 'permissions'],
  activities: (id: string) => [...userQueries.details(), id, 'activities'],

  // Search queries for molecules
  search: (query: string) => [...userQueries.all(), 'search', query],
  emailCheck: (email: string, excludeId?: string) => [
    ...userQueries.all(), 'email-check', email, excludeId
  ],

  // Page-level queries
  paginated: (params: PaginationParams) => [...userQueries.lists(), 'paginated', params],
  stats: () => [...userQueries.all(), 'stats'],

  // Current user (for layouts and global state)
  current: () => [...userQueries.all(), 'current'],
};

// ✅ Good: Query factory usage in molecule
export const useUserSearch = (query: string) => {
  return useQuery({
    queryKey: userQueries.search(query),
    queryFn: () => searchUsers(query),
    enabled: query.length >= 2,
  });
};

// ✅ Good: Query factory usage in organism
export const useUserWithPermissions = (id: string) => {
  const userQuery = useQuery({
    queryKey: userQueries.detail(id),
    queryFn: () => fetchUser(id),
  });

  const permissionsQuery = useQuery({
    queryKey: userQueries.permissions(id),
    queryFn: () => fetchUserPermissions(id),
    enabled: !!userQuery.data,
  });

  return {
    user: userQuery.data,
    permissions: permissionsQuery.data,
    isLoading: userQuery.isLoading || permissionsQuery.isLoading,
    isError: userQuery.isError || permissionsQuery.isError,
  };
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

## Mutation Patterns by Atomic Level

### Molecules - Simple Mutations
Molecules handle focused, single-responsibility mutations:

```typescript
// ✅ Good - Molecule with focused mutation
export const UserEmailForm = ({ userId, currentEmail }: UserEmailFormProps) => {
  const [email, setEmail] = useState(currentEmail);

  const { mutateAsync: updateEmail, isPending } = useMutation({
    mutationFn: (newEmail: string) => updateUserEmail(userId, newEmail),
    onSuccess: (updatedUser) => {
      // Targeted invalidation for molecules
      queryClient.invalidateQueries({ queryKey: userQueries.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userQueries.emailCheck(email) });

      toast.success('Email updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update email: ${error.message}`);
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      updateEmail(email);
    }}>
      <FormField label="Email Address">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </FormField>
      <Button type="submit" disabled={isPending || email === currentEmail}>
        {isPending ? 'Updating...' : 'Update Email'}
      </Button>
    </form>
  );
};
```

### Organisms - Complex Business Logic Mutations
Organisms handle complex mutations with comprehensive cache management:

```typescript
// ✅ Good - Organism with comprehensive mutation handling
export const UserManagementCard = ({ user }: UserManagementCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Complex mutation with multiple side effects
  const { mutateAsync: updateUserProfile, isPending: isUpdating } = useMutation({
    mutationFn: updateUserWithValidation,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userQueries.detail(user.id) });

      // Snapshot previous value for rollback
      const previousUser = queryClient.getQueryData(userQueries.detail(user.id));

      // Optimistic update
      queryClient.setQueryData(userQueries.detail(user.id), {
        ...user,
        ...variables,
        updatedAt: new Date().toISOString(),
      });

      return { previousUser };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(userQueries.detail(user.id), context.previousUser);
      }

      toast.error(`Update failed: ${error.message}`);
    },
    onSuccess: (updatedUser) => {
      // Comprehensive cache invalidation
      queryClient.invalidateQueries({ queryKey: userQueries.lists() });
      queryClient.invalidateQueries({ queryKey: userQueries.stats() });

      // Update related caches
      queryClient.setQueryData(userQueries.detail(user.id), updatedUser);

      toast.success('User profile updated successfully');
    },
  });

  // Deletion with cleanup
  const { mutateAsync: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      // Remove all user-related data from cache
      queryClient.removeQueries({ queryKey: userQueries.detail(user.id) });
      queryClient.removeQueries({ queryKey: userQueries.permissions(user.id) });
      queryClient.removeQueries({ queryKey: userQueries.activities(user.id) });

      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: userQueries.lists() });
      queryClient.invalidateQueries({ queryKey: userQueries.stats() });

      // Navigate away after deletion
      navigate({ to: '/users' });
      toast.success('User account deleted');
    },
    onError: (error) => {
      toast.error(`Deletion failed: ${error.message}`);
    },
  });

  const handleDelete = useCallback(async () => {
    const confirmed = await showConfirmDialog({
      title: 'Delete User Account',
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmText: 'Delete',
      variant: 'destructive',
    });

    if (confirmed) {
      await deleteUser(user.id);
    }
  }, [deleteUser, user.id, user.name]);

  return (
    <Card>
      <CardContent>
        <UserProfileDisplay user={user} />
        <UserPermissionsList userId={user.id} />
        <UserActivityTimeline userId={user.id} />
      </CardContent>

      <CardFooter>
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={() => updateUserProfile({ lastActiveAt: new Date() })}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Mark Active'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
```
### Templates & Pages - Coordinated Mutations
Templates and pages handle mutations that affect multiple data sources:

```typescript
// ✅ Good - Page-level bulk operations
export const UserManagementPage = () => {
  const queryClient = useQueryClient();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Bulk operations mutation
  const { mutateAsync: bulkUpdateUsers, isPending: isBulkUpdating } = useMutation({
    mutationFn: ({ userIds, updates }: BulkUpdateParams) =>
      updateMultipleUsers(userIds, updates),
    onSuccess: (updatedUsers, { userIds }) => {
      // Update individual user caches
      updatedUsers.forEach((user) => {
        queryClient.setQueryData(userQueries.detail(user.id), user);
      });

      // Invalidate list views and stats
      queryClient.invalidateQueries({ queryKey: userQueries.lists() });
      queryClient.invalidateQueries({ queryKey: userQueries.stats() });

      // Clear selection
      setSelectedUsers([]);

      toast.success(`Updated ${updatedUsers.length} users successfully`);
    },
  });

  const { mutateAsync: bulkDeleteUsers, isPending: isBulkDeleting } = useMutation({
    mutationFn: deleteMultipleUsers,
    onSuccess: (_, deletedUserIds) => {
      // Remove all deleted users from cache
      deletedUserIds.forEach((userId) => {
        queryClient.removeQueries({ queryKey: userQueries.detail(userId) });
        queryClient.removeQueries({ queryKey: userQueries.permissions(userId) });
        queryClient.removeQueries({ queryKey: userQueries.activities(userId) });
      });

      // Invalidate aggregated data
      queryClient.invalidateQueries({ queryKey: userQueries.lists() });
      queryClient.invalidateQueries({ queryKey: userQueries.stats() });

      setSelectedUsers([]);
      toast.success(`Deleted ${deletedUserIds.length} users`);
    },
  });

  // ... component implementation
};
```

### Cache Invalidation Strategy

Follow hierarchical invalidation patterns based on atomic design levels:

```typescript
// ✅ Good: Hierarchical cache invalidation
export const useCreateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimeEntry,
    onSuccess: (newEntry, variables) => {
      const { date } = variables;
      const month = date.substring(0, 7);

      // Level 1: Specific invalidation (molecules/organisms)
      queryClient.invalidateQueries({
        queryKey: [...calendarQueries.days(), date],
      });

      // Level 2: Feature invalidation (organisms/templates)
      queryClient.invalidateQueries({
        queryKey: [...calendarQueries.calendar(), month],
      });

      // Level 3: Global invalidation (pages/templates)
      queryClient.invalidateQueries({
        queryKey: ['time-logs'], // Broad invalidation for safety
      });

      // Level 4: Related feature invalidation
      queryClient.invalidateQueries({
        queryKey: ['user-stats'], // User statistics affected
      });
      queryClient.invalidateQueries({
        queryKey: ['project-stats'], // Project statistics affected
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
  gcTime: 10 * 60 * 1000, // 10 minutes (v5 name; was cacheTime)
  }),

  dayEntries: (date: string) => ({
    queryKey: ['time-logs', 'day', date],
    queryFn: () => fetchDayEntries(date),
    staleTime: 1 * 60 * 1000,  // 1 minute (changes more frequently)
  gcTime: 5 * 60 * 1000,  // 5 minutes (v5 name; was cacheTime)
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

### v5 pagination patterns (smooth UX)
Use placeholderData to retain the previous page while the new page loads, or rely on structural sharing when staleTime makes the transition seamless.

```ts
// Hook: usePaginatedUsers.ts
export const usePaginatedUsers = (page: number, search: string) =>
  useQuery({
    ...userQueries.getPaginated({ page, search }),
    placeholderData: (prev) => prev, // keeps prior page visible during refetch
    staleTime: 30_000,
  });
```

Minimal test sketch:

```ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

test('pagination keeps previous page visible', async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  const { result, rerender } = renderHook(
    ({ page }) => usePaginatedUsers(page, ''),
    { wrapper, initialProps: { page: 1 } }
  );

  await waitFor(() => expect(result.current.isSuccess).toBeTruthy());
  const first = result.current.data;

  rerender({ page: 2 });
  // While page 2 loads, placeholderData returns previous data
  expect(result.current.data).toBe(first);
});
```

## Anti-Patterns to Avoid

### ❌ Don't Violate Atomic Design Data Principles

```typescript
// ❌ Bad: Atom fetching data directly
export const UserAvatar = ({ userId }: { userId: string }) => {
  const { data: user } = useQuery(['users', userId]); // Atoms shouldn't fetch data
  return <Avatar src={user?.avatar} />;
};

// ❌ Bad: Molecule handling complex business logic
export const SimpleUserCard = ({ userId }: { userId: string }) => {
  const { data: user } = useQuery(['users', userId]);
  const { data: permissions } = useQuery(['permissions', userId]);
  const { data: activities } = useQuery(['activities', userId]);
  const { data: projects } = useQuery(['projects', userId]);
  // Too much complexity for a molecule
};

// ❌ Bad: Inconsistent cache invalidation across atomic levels
export const useUpdateUser = () => {
  return useMutation({
    onSuccess: () => {
      // Molecule only invalidating its own cache - missing related data
      queryClient.invalidateQueries(['users', userId]);
      // Missing: user lists, stats, related features
    },
  });
};

// ❌ Bad: Page component with no data coordination
export const UserListPage = () => {
  // Page should coordinate data, not leave it to organisms
  return <UserListOrganism />; // Organism handling page-level concerns
};
```

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

1. **Follow Atomic Design Data Patterns** - Atoms display data, molecules fetch simple data, organisms handle complex business logic, templates coordinate multiple sources, pages manage route-specific data
2. **TanStack Query IS your data store** for server state - don't duplicate it in local state
3. **Hierarchical cache invalidation** - invalidate specific → feature → global → related features based on atomic level
4. **MSW should mirror real API behavior** exactly for consistent development experience
5. **Use query factories** for maintainable and consistent query key management across all atomic levels
6. **Configure appropriate cache times** based on data update frequency and component level
7. **Test cache invalidation patterns** to ensure data consistency across atomic hierarchy
8. **Coordinate data fetching by responsibility** - let each atomic level handle appropriate complexity
9. **Optimize for user experience** - use optimistic updates in organisms, loading states in molecules
10. **Maintain cache hygiene** - clean up unused queries and invalidate comprehensively

Remember: The goal is seamless transition from development (MSW) to production (real API) with zero code changes in your React components, while maintaining clear data flow that aligns with atomic design principles.
