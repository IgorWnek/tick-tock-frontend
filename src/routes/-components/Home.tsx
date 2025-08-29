import { Plus, TrendingUp, Clock, CalendarDays, Info, Palette } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SplitViewCalendar } from '@/design-system/organisms/SplitViewCalendar';

export const Home = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Alert */}
      <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle className="text-blue-900 dark:text-blue-100">Welcome to Tick-Tock!</AlertTitle>
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          Start by clicking &quot;Log Today&apos;s Work&quot; to track your time with natural language. The calendar
          will show your progress across the month.
        </AlertDescription>
      </Alert>

      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track your time and manage your work logs</p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link to="/calendar-solutions">
                  <Palette className="h-4 w-4" />
                  Calendar Solutions
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View 3 innovative calendar design solutions</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="lg" className="gap-2 hover:scale-105 transition-transform duration-200" asChild>
                <Link to="/log-entry">
                  <Plus className="h-4 w-4" />
                  Log Today&apos;s Work
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start logging your time with natural language input</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Split-View Calendar */}
      <SplitViewCalendar showInlineDetails={true} maxHeight="h-[650px]" />

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">3/5</div>
                <Badge variant="outline">60%</Badge>
              </div>
              <Progress value={60} className="h-1" />
              <p className="text-xs text-muted-foreground">Days logged this week</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">12/22</div>
                <Badge variant="outline">55%</Badge>
              </div>
              <Progress value={55} className="h-1" />
              <p className="text-xs text-muted-foreground">Working days logged</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Draft Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">2</div>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="animate-pulse">
                      Pending
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Review and ship your draft time entries</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
