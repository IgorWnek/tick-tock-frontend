import { Link, Outlet } from '@tanstack/react-router';
import { Clock } from 'lucide-react';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary animate-pulse" />
                <h1 className="text-xl font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  Tick-Tock
                </h1>
              </div>
              <span className="text-sm text-muted-foreground hidden sm:inline">Time Logging Made Simple</span>
            </div>
            <nav>
              <ul className="flex items-center gap-6">
                <li>
                  <Link
                    to="/"
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
                    activeProps={{
                      className: 'text-primary after:w-full',
                    }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
                    activeProps={{
                      className: 'text-primary after:w-full',
                    }}
                  >
                    About
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
