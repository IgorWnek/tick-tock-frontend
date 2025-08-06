import { Fragment } from 'react';
import { useNavigate } from '@tanstack/react-router';

import { AppLocale } from 'context/locale/AppLocale.enum';
import { useLocale } from 'hooks/useLocale/useLocale';
import { useAuth } from 'hooks/useAuth/useAuth';
import { useUsers } from 'hooks/useUsers/useUsers';

import { LocationInfo } from '@/components/ui/location-info';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { Loader } from '@/components/ui/loader';

export const Home = () => {
  const { locale, setLocale } = useLocale();
  const { user, login, logout, isAuthenticated, isAuthenticating } = useAuth();

  const {
    data: usersResponse,
    isFetching: isFetchingUsers,
    isFetched: areUsersFetched,
    hasNextPage: hasMoreUsers,
    fetchNextPage: loadMoreUsers,
    isFetchingNextPage,
    error: usersError,
    isError: hasUsersError,
  } = useUsers();

  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Home</h2>
        <div className="space-y-4">
          <p className="flex items-center gap-4">
            Hello World
            <span>←</span>
            <span>
              This text is translated using <strong>Translation</strong> component.
            </span>
            <span>
              Click{' '}
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-base"
                onClick={() => setLocale(locale === AppLocale.pl ? AppLocale.en : AppLocale.pl)}
              >
                here
              </Button>{' '}
              to change language.
            </span>
          </p>
          <p>This is a starter project for TSH React application. Click on navigation links above to learn more.</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <LocationInfo />
      </div>

      <div className="border-t pt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              User information <span>👤</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                disabled={isAuthenticating || isAuthenticated}
                onClick={() => login({ password: 'tsh-react-starter', username: 'tsh' })}
                variant={isAuthenticated ? 'secondary' : 'default'}
              >
                {isAuthenticating ? 'Logging in...' : 'Click to login'}
              </Button>
              <Button disabled={!isAuthenticated} onClick={logout} variant="outline">
                Click to logout
              </Button>
            </div>
            {isAuthenticating && <Loader text="Loading data about you..." />}
            {isAuthenticated && <CodeBlock variant="success">{JSON.stringify(user, null, 2)}</CodeBlock>}
          </CardContent>
        </Card>
      </div>

      <div className="border-t pt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              List of users <span>👤</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {isFetchingUsers && !areUsersFetched && <Loader text="Loading users..." />}
              {hasUsersError && (
                <div className="text-destructive">Error loading users: {usersError?.message || 'Unknown error'}</div>
              )}
              {areUsersFetched &&
                usersResponse?.pages &&
                usersResponse.pages.length > 0 &&
                usersResponse.pages.map((page) => (
                  <Fragment key={page.nextPage || 'last-page'}>
                    {page.users?.map((user) => (
                      <div key={user.id} className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate({ to: '/users/$id', params: { id: user.id } });
                          }}
                        >
                          User {user.id}
                        </Button>
                      </div>
                    ))}
                  </Fragment>
                ))}
              {areUsersFetched && (!usersResponse?.pages || usersResponse.pages.length === 0) && (
                <p className="text-muted-foreground">No users found</p>
              )}
            </div>
            {isFetchingNextPage && <Loader text="Loading more users..." />}
            <Button
              disabled={isFetchingNextPage || isFetchingUsers || !hasMoreUsers}
              onClick={() => loadMoreUsers()}
              variant="secondary"
            >
              Load more
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="border-t pt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Shadcn/UI Components Demo <span>🚀</span>
            </CardTitle>
            <CardDescription>Testing TailwindCSS 4 + Shadcn/UI integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Type something here..." />
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => navigate({ to: '/users' })}>Go to Users</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive" size="sm">
                Destructive
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
