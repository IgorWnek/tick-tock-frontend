import { ExternalLink, Code, TestTube, Route, Globe, Cpu, Palette, Brush } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { LocationInfo } from '@/components/ui/location-info';

export const About = () => {
  const technologies = [
    {
      icon: Code,
      name: 'TypeScript',
      description: 'Typed superset of JavaScript that compiles to plain JavaScript',
      url: 'https://www.typescriptlang.org/',
      category: 'Language',
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
      name: 'Vitest',
      description: 'Next generation testing framework powered by Vite',
      url: 'https://vitest.dev/',
      category: 'Testing',
    },
    {
      icon: TestTube,
      name: 'React Testing Library',
      description: 'Simple and complete React DOM testing utilities that encourage good testing practices',
      url: 'https://github.com/testing-library/react-testing-library',
      category: 'Testing',
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
      name: 'React Intl',
      description:
        'React components and an API to format dates, numbers, and strings, including pluralization and handling translations',
      url: 'https://github.com/formatjs/react-intl',
      category: 'Internationalization',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      Language: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Styling: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'UI Components': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      Testing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Routing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      Internationalization: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">About This Project</h1>
        <p className="text-muted-foreground">
          This project showcases a modern React development stack with recommended packages and tools for building
          scalable applications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Technology Stack
          </CardTitle>
          <CardDescription>Carefully selected tools and libraries that power this application</CardDescription>
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
                      <Badge variant="secondary" className={getCategoryColor(tech.category)}>
                        {tech.category}
                      </Badge>
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
              <h3 className="font-semibold mb-1">Type Safety</h3>
              <p className="text-sm text-muted-foreground">Full TypeScript integration with strict type checking</p>
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
              <h3 className="font-semibold mb-1">Testing Ready</h3>
              <p className="text-sm text-muted-foreground">Comprehensive testing setup with Vitest and RTL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />
      <LocationInfo />
    </div>
  );
};
