import { ExternalLink, Terminal, TestTube, Package, Globe } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LocationInfo } from '@/components/ui/location-info';
import { CodeBlock } from '@/components/ui/code-block';
import { Button } from '@/components/ui/button';

export const Help = () => {
  const scripts = [
    {
      icon: Terminal,
      command: 'npm start',
      description: 'Runs the app in the development mode.',
      details:
        'Open http://localhost:3000 to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.',
    },
    {
      icon: TestTube,
      command: 'npm test',
      description: 'Launches the test runner in the interactive watch mode.',
      details: 'See the section about running tests for more information.',
      link: 'https://vitest.dev/guide/cli.html',
    },
    {
      icon: Package,
      command: 'npm run coverage',
      description: 'Launches the test runner in the coverage report generation mode.',
      details: 'Generates detailed test coverage reports.',
      link: 'https://vitest.dev/guide/coverage.html',
    },
    {
      icon: Package,
      command: 'npm run build',
      description: 'Builds the app for production to the build folder.',
      details:
        'It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed!',
      link: 'https://vitejs.dev/guide/static-deploy.html',
    },
  ];

  const resources = [
    {
      title: 'Vite Documentation',
      description: 'Learn about the build tool powering this project',
      url: 'https://vitejs.dev/guide/',
    },
    {
      title: 'React Documentation',
      description: 'Comprehensive guide to React development',
      url: 'https://reactjs.org/',
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Help & Documentation</h1>
        <p className="text-muted-foreground">
          This project was bootstrapped with{' '}
          <Button variant="link" asChild className="p-0 h-auto">
            <a href="https://github.com/vitejs/vite" target="_blank" rel="noopener noreferrer">
              Vite <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>{' '}
          and modified by TSH team.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Available Scripts
          </CardTitle>
          <CardDescription>In the project directory, you can run the following commands:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {scripts.map((script, index) => (
            <div key={script.command} className="space-y-3">
              <div className="flex items-center gap-3">
                <script.icon className="h-4 w-4 text-muted-foreground" />
                <CodeBlock variant="default" className="flex-1">
                  {script.command}
                </CodeBlock>
              </div>
              <div className="space-y-2 pl-7">
                <p className="font-medium">{script.description}</p>
                <p className="text-sm text-muted-foreground">{script.details}</p>
                {script.link && (
                  <Button variant="link" asChild className="p-0 h-auto text-sm">
                    <a href={script.link} target="_blank" rel="noopener noreferrer">
                      Learn more <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
              {index < scripts.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Learn More
          </CardTitle>
          <CardDescription>Helpful resources to expand your knowledge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {resources.map((resource) => (
              <div key={resource.title} className="space-y-2">
                <h4 className="font-medium">{resource.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                <Button variant="outline" size="sm" asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    Visit Documentation <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />
      <LocationInfo />
    </div>
  );
};
