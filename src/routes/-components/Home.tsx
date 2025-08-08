import { Calendar, Plus, TrendingUp, Clock, CalendarDays, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="lg" className="gap-2 hover:scale-105 transition-transform duration-200">
              <Plus className="h-4 w-4" />
              Log Today&apos;s Work
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Start logging your time with natural language input</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Calendar Grid Placeholder */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Time Log Calendar
          </CardTitle>
          <CardDescription>Track your daily time logging progress across the month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96 bg-gradient-to-br from-muted via-muted/80 to-muted/60 rounded-lg relative overflow-hidden">
            {/* Background pattern for visual interest */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/5 to-background/10" />
            <div className="relative text-center space-y-4 z-10">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto animate-pulse-slow" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-muted-foreground">Calendar grid will be implemented here</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 hover:scale-110 transition-transform duration-200">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-muted-foreground">No logs</span>
                  </div>
                  <div className="flex items-center gap-2 hover:scale-110 transition-transform duration-200">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-muted-foreground">Draft logs</span>
                  </div>
                  <div className="flex items-center gap-2 hover:scale-110 transition-transform duration-200">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-muted-foreground">Completed logs</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground max-w-md">
                  The calendar will show your daily time logging status and allow quick navigation to any day
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
