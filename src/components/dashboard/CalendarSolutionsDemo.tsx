import React, { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from '@tanstack/react-router';

import { MinimalistCalendar } from './MinimalistCalendar';
import { DashboardCalendar } from './DashboardCalendar';

import { SplitViewCalendar } from '@/design-system/organisms/SplitViewCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const CalendarSolutionsDemo: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'minimalist' | 'dashboard' | 'split'>('minimalist');

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    navigate({
      to: '/day/$date',
      params: { date: dateStr },
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🎨 Calendar Component Solutions</CardTitle>
          <p className="text-muted-foreground">
            Three innovative approaches to eliminate navigation duplication and improve UX
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={activeView === 'minimalist' ? 'default' : 'outline'}
              onClick={() => setActiveView('minimalist')}
              size="sm"
            >
              Minimalist Enhanced
            </Button>
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveView('dashboard')}
              size="sm"
            >
              Dashboard Multi-View
            </Button>
            <Button
              variant={activeView === 'split' ? 'default' : 'outline'}
              onClick={() => setActiveView('split')}
              size="sm"
            >
              Compact Split-View
            </Button>
          </div>

          {activeView === 'minimalist' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">✨ Minimalist Enhanced Calendar</h3>
                <p className="text-muted-foreground">
                  Clean, streamlined design leveraging ShadCN Calendar&apos;s built-in navigation. Enhanced status
                  visualization with floating legend.
                </p>
                <div className="flex gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Single navigation</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Enhanced visuals</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Dropdown month selector</span>
                </div>
              </div>
              <MinimalistCalendar onDayClick={handleDayClick} />
            </div>
          )}

          {activeView === 'dashboard' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">📊 Dashboard Multi-View Calendar</h3>
                <p className="text-muted-foreground">
                  Comprehensive dashboard widget with Month/Week toggle, integrated stats, and rich interactive
                  features.
                </p>
                <div className="flex gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Week/Month views</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Integrated stats</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Custom navigation</span>
                </div>
              </div>
              <DashboardCalendar onDayClick={handleDayClick} />
            </div>
          )}

          {activeView === 'split' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">🔄 Compact Split-View Calendar</h3>
                <p className="text-muted-foreground">
                  Two-column layout optimizing space. Compact month calendar with detailed status panel showing selected
                  day information and actual time entries.
                </p>
                <div className="flex gap-2 text-sm">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Split layout</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Month focus</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Status panel</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Inline details</span>
                </div>
              </div>
              <SplitViewCalendar showInlineDetails={true} maxHeight="h-[650px]" />
            </div>
          )}

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">🎯 Implementation Recommendation</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Minimalist Enhanced:</strong> Best for simple, clean UI that focuses on the calendar itself
              </p>
              <p>
                <strong>Dashboard Multi-View:</strong> Perfect for power users who want rich analytics and multiple view
                modes
              </p>
              <p>
                <strong>Compact Split-View:</strong> Ideal for space-efficient layouts with detailed day information,
                full month view, and inline time entry management with consistent height
              </p>
            </div>
            <div className="mt-4">
              <Button onClick={() => navigate({ to: '/' })} variant="outline">
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
