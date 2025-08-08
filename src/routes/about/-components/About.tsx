import {
  ExternalLink,
  Code,
  TestTube,
  Route,
  Globe,
  Cpu,
  Palette,
  Brush,
  Clock,
  Target,
  Zap,
  Brain,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LocationInfo } from '@/components/ui/location-info';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export const About = () => {
  const technologies = [
    {
      icon: Code,
      name: 'React 19',
      description: 'Latest React with new features like Actions, useActionState, and improved concurrent rendering',
      url: 'https://react.dev/',
      category: 'Framework',
    },
    {
      icon: Code,
      name: 'TypeScript',
      description: 'Typed superset of JavaScript that compiles to plain JavaScript',
      url: 'https://www.typescriptlang.org/',
      category: 'Language',
    },
    {
      icon: Route,
      name: 'TanStack Router',
      description:
        'A fully type-safe React router with built-in data fetching, stale-while revalidate caching and first-class search-param APIs',
      url: 'https://tanstack.com/router/latest',
      category: 'Routing',
    },
    {
      icon: Globe,
      name: 'TanStack Query',
      description: 'Powerful data synchronization for React with caching, background updates, and MSW integration',
      url: 'https://tanstack.com/query/latest',
      category: 'State Management',
    },
    {
      icon: Palette,
      name: 'TailwindCSS 4',
      description: 'A utility-first CSS framework for rapidly building modern websites',
      url: 'https://tailwindcss.com/',
      category: 'Styling',
    },
    {
      icon: Brush,
      name: 'Shadcn/UI',
      description: 'Beautifully designed components built with Radix UI and Tailwind CSS',
      url: 'https://ui.shadcn.com/',
      category: 'UI Components',
    },
    {
      icon: TestTube,
      name: 'MSW',
      description: 'Mock Service Worker for seamless API mocking during development and testing',
      url: 'https://mswjs.io/',
      category: 'Development',
    },
    {
      icon: TestTube,
      name: 'Vitest',
      description: 'Next generation testing framework powered by Vite',
      url: 'https://vitest.dev/',
      category: 'Testing',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Framework: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Language: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      Routing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'State Management': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
      Styling: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'UI Components': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      Development: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      Testing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          About Tick-Tock
        </h1>
        <p className="text-muted-foreground text-lg">
          Intelligent time logging that understands natural language and integrates seamlessly with Jira.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            What is Tick-Tock?
          </CardTitle>
          <CardDescription>Solving the developer pain point of time tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Tick-Tock is an intelligent time logging application designed specifically for developers who need to track
            time spent on tasks and meetings. Instead of complex time tracking interfaces, you simply write natural
            language messages (like a journal entry) that include Jira task IDs, and the system intelligently converts
            these into structured time logs.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Brain className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-1">Natural Language</h3>
              <p className="text-sm text-muted-foreground">
                Write time logs as simple messages instead of filling complex forms
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold mb-1">Intelligent Processing</h3>
              <p className="text-sm text-muted-foreground">
                AI automatically parses messages and creates structured time entries
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-1">Jira Integration</h3>
              <p className="text-sm text-muted-foreground">
                Direct synchronization with Jira time tracking via REST API
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Technology Stack
          </CardTitle>
          <CardDescription>Modern React development stack powering this application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {technologies.map((tech) => (
              <div key={tech.name} className="space-y-3 p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <tech.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{tech.name}</h3>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className={getCategoryColor(tech.category)}>
                            {tech.category}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click &quot;Learn More&quot; for detailed documentation</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>
                <Button variant="outline" size="sm" asChild>
                  <a href={tech.url} target="_blank" rel="noopener noreferrer">
                    Learn More <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
          <CardDescription>What makes this setup special</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4">
              <Code className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-1">React 19 Ready</h3>
              <p className="text-sm text-muted-foreground">Latest React features with actions and optimistic updates</p>
            </div>
            <div className="text-center p-4">
              <Palette className="h-8 w-8 mx-auto mb-2 text-cyan-500" />
              <h3 className="font-semibold mb-1">Modern Styling</h3>
              <p className="text-sm text-muted-foreground">TailwindCSS 4 with utility-first approach</p>
            </div>
            <div className="text-center p-4">
              <Brush className="h-8 w-8 mx-auto mb-2 text-pink-500" />
              <h3 className="font-semibold mb-1">Beautiful UI</h3>
              <p className="text-sm text-muted-foreground">Shadcn/UI components with Radix primitives</p>
            </div>
            <div className="text-center p-4">
              <TestTube className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-1">MSW Mocking</h3>
              <p className="text-sm text-muted-foreground">Seamless API mocking during development</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />
      <LocationInfo />
    </div>
  );
};
