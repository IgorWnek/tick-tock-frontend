import { useNavigate, getRouteApi } from '@tanstack/react-router';
import { Users, ChevronLeft, ChevronRight, ArrowUpDown, User } from 'lucide-react';

import { useQuery } from 'hooks/useQuery/useQuery';
import { UserSortType } from 'routes/users';
import { authQueries } from 'api/actions/auth/auth.queries';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CodeBlock } from '@/components/ui/code-block';
import { Loader } from '@/components/ui/loader';

const routeApi = getRouteApi('/users/');

export const UsersList = () => {
  const { sort, page } = routeApi.useSearch();
  const navigate = useNavigate({ from: '/users' });

  const {
    data: usersResponse,
    isFetched: areUsersFetched,
    isLoading,
  } = useQuery({
    ...authQueries.list({ page: page.toString() }),
    select: (data) => {
      return { ...data, users: data.users.toSorted((a, b) => (sort === 'desc' ? +b.id - +a.id : +a.id - +b.id)) };
    },
  });

  const sortUsers = (type: UserSortType) => {
    navigate({
      search: (prev) => ({
        ...prev,
        sort: type,
      }),
    });
  };

  const goToNextPage = () => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: page + 1,
      }),
    });
  };

  const goToPrevPage = () => {
    const newPage = page <= 1 ? 1 : page - 1;

    navigate({
      search: (prev) => ({
        ...prev,
        page: newPage,
      }),
    });
  };

  const totalUsers = usersResponse?.users.length || 0;
  const hasNextPage = Boolean(usersResponse?.nextPage);
  const hasPrevPage = page > 1;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8" />
          Users Management
        </h1>
        <p className="text-muted-foreground">
          This demonstrates how to use useSearch() from TanStack Router for URL state management.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Search Parameters
          </CardTitle>
          <CardDescription>
            Current search parameters provided by{' '}
            <a
              href="https://tanstack.com/router/latest/docs/framework/react/guide/search-params#search-params-in-components"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              useSearch() hook
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock variant="default">{JSON.stringify({ sort, page }, null, 2)}</CodeBlock>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User List
              </CardTitle>
              <CardDescription>
                {isLoading ? 'Loading users...' : `Showing ${totalUsers} users on page ${page}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-medium">
                  Sort by:
                </label>
                <Select value={sort} onValueChange={(value: string) => sortUsers(value as UserSortType)}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">ASC</SelectItem>
                    <SelectItem value="desc">DESC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="secondary">Page {page}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader variant="spinner" />
            </div>
          ) : (
            <>
              {areUsersFetched && usersResponse?.users && usersResponse.users.length > 0 ? (
                <div className="space-y-2">
                  {usersResponse.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                        </div>
                      </div>
                      <Badge variant="outline">User</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button onClick={goToPrevPage} disabled={!hasPrevPage} variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button onClick={goToNextPage} disabled={!hasNextPage} variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {hasNextPage && 'More users available'} {!hasNextPage && page > 1 && 'No more users'}
                  {page === 1 && !hasNextPage && totalUsers > 0 && 'All users shown'}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
