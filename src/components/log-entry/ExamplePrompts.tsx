import React from 'react';
import { Lightbulb, Clock, Users, Code, Coffee } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExamplePrompt {
  id: string;
  icon: React.ReactNode;
  title: string;
  example: string;
  description: string;
}

const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    id: 'development',
    icon: <Code className="h-4 w-4" />,
    title: 'Development Work',
    example:
      'Worked on XYZ-1111 for 3 hours implementing authentication, then spent 30 minutes on XYZ-2222 code review',
    description: 'Multiple tasks with specific durations',
  },
  {
    id: 'meetings',
    icon: <Users className="h-4 w-4" />,
    title: 'Meetings & Collaboration',
    example: 'Had 1 hour standup meeting about PROJ-456, then 2 hours pair programming on PROJ-789',
    description: 'Team activities with time tracking',
  },
  {
    id: 'research',
    icon: <Lightbulb className="h-4 w-4" />,
    title: 'Research & Planning',
    example: 'Spent the morning researching API patterns for STORY-123, took 4 hours total',
    description: 'Exploration work with total time',
  },
  {
    id: 'mixed',
    icon: <Clock className="h-4 w-4" />,
    title: 'Mixed Activities',
    example: 'Started with BUG-999 debugging (2h), lunch break, then FEAT-111 implementation (3.5h)',
    description: 'Complex day with multiple activities',
  },
];

interface ExamplePromptsProps {
  onSelectExample: (example: string) => void;
  className?: string;
}

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onSelectExample, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Coffee className="h-4 w-4" />
        Example Messages
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <Card
            key={prompt.id}
            className="transition-all duration-200 hover:shadow-md hover:border-primary/50 cursor-pointer group"
          >
            <CardContent className="p-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  {prompt.icon}
                  {prompt.title}
                </div>
                <div className="text-xs text-foreground leading-relaxed bg-muted/30 p-2 rounded border">
                  &ldquo;{prompt.example}&rdquo;
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{prompt.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onSelectExample(prompt.example)}
                  >
                    Use this
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
