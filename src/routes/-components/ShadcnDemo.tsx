import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ShadcnDemo = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Basic TailwindCSS Test */}
      <div className="bg-red-500 text-white p-4 rounded-lg">
        <h2 className="text-2xl font-bold">TailwindCSS Test</h2>
        <p>If you can see this with red background, TailwindCSS is working!</p>
      </div>

      <div className="bg-blue-100 p-4 border-2 border-blue-500 rounded">
        <h3 className="text-lg text-blue-800">Basic Test</h3>
        <p className="text-blue-600">This should be styled with TailwindCSS classes</p>
      </div>

      {/* Shadcn/UI Components */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Shadcn/UI + TailwindCSS 4 Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates the integration of Shadcn/UI components with TailwindCSS 4 in this React 19 project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Button Components</CardTitle>
            <CardDescription>Various button styles and sizes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🚀</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Input Components</CardTitle>
            <CardDescription>Form inputs with TailwindCSS styling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Enter your name" />
            <Input type="email" placeholder="Enter your email" />
            <Input type="password" placeholder="Enter your password" />
            <Input disabled placeholder="Disabled input" />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>TailwindCSS 4 Features</CardTitle>
            <CardDescription>Modern CSS features powered by TailwindCSS 4</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <h3 className="font-semibold mb-2">CSS-first Configuration</h3>
                <p className="text-sm opacity-90">Configuration is now done directly in CSS using @theme directive</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 text-white">
                <h3 className="font-semibold mb-2">Zero Configuration</h3>
                <p className="text-sm opacity-90">No complex JavaScript configuration needed</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <h3 className="font-semibold mb-2">Modern CSS Features</h3>
                <p className="text-sm opacity-90">Uses native cascade layers and custom properties</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dark Mode Support</CardTitle>
          <CardDescription>Toggle dark mode to see the theme changes</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => document.documentElement.classList.toggle('dark')} variant="outline">
            Toggle Dark Mode
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
