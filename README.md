<p align="center">
 <img src=".github/images/tick-tock-logo.svg" alt="Tick-Tock Logo" />
</p>

# 🕐 Tick-Tock - Intelligent Time Logging

**Tick-Tock** is a modern time logging application that transforms the way developers track their work. Instead of complex time tracking interfaces, simply write natural language messages and let our intelligent system create structured time logs automatically.

Built with modern React 19 and TypeScript, powered by TanStack ecosystem for optimal performance and developer experience.

**🚀 Key Innovation**: Write time logs like journal entries, automatically sync with Jira, and manage everything through an intuitive calendar dashboard.

![Version](https://img.shields.io/github/package-json/v/IgorWnek/tick-tock-frontend)
![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.84.1-orange)
![License](https://img.shields.io/github/license/IgorWnek/tick-tock-frontend)

## ✨ Features

### 🤖 Natural Language Processing

Transform simple messages like "Worked on XYZ-1111 for 3 hours implementing authentication, had 1 hour meeting with team about XYZ-2222 planning" into structured time entries automatically.

### 📊 Visual Calendar Dashboard

- **Smart Status Indicators**: Orange (needs logging), Blue (draft entries), Green (completed)
- **Quick Navigation**: Click any day to view or edit time logs
- **Monthly Overview**: Clear visualization of your logging progress

### 🚀 Draft-First Workflow

- **Review Before Commit**: All logs start as drafts for your review
- **Intelligent Refinement**: Request changes in natural language
- **One-Click Sync**: Ship approved logs directly to Jira

### 🔗 Seamless Jira Integration

- **Direct API Integration**: Real-time synchronization with Jira time tracking
- **Task Validation**: Automatic verification of Jira task IDs
- **Error Handling**: Robust retry logic and user feedback

### 🎨 Modern User Experience

- **React 19 Features**: Actions, useActionState, and concurrent rendering
- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic theme switching
- **Accessibility First**: WCAG 2.1 AA compliant

## 🚀 Quick Start

Get Tick-Tock running locally in minutes:

### Prerequisites

- Node.js 20+ (required for optimal performance)
- npm or yarn
- Jira instance with API access (for production use)

### Installation

1. **Clone the repository**:

```shell
git clone https://github.com/IgorWnek/tick-tock-frontend.git
cd tick-tock-frontend
```

2. **Install dependencies**:

```shell
npm install
```

3. **Set up environment variables**:

```shell
cp .env.dist .env.local
```

4. **Start the development server**:

```shell
npm start
```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

🎉 **You're ready to start logging time!** The app runs with MSW (Mock Service Worker) by default, so you can test all features without a backend.

### Production Setup

For production deployment, configure these environment variables in `.env.local`:

- `VITE_API_BASE_URL` - Your backend API endpoint
- `VITE_JIRA_BASE_URL` - Your Jira instance URL
- `VITE_SENTRY_DSN` - Error monitoring (optional)

## 📜 Available Scripts

```shell
npm run [command]
```

### Development

- `start` - Launch development server with hot reloading on [http://localhost:3000](http://localhost:3000)
- `typecheck` - Run TypeScript type checking without emitting files
- `test` - Run unit tests with Vitest
- `coverage` - Generate test coverage report

### Building & Deployment

- `build` - Create optimized production build (includes TypeScript check)
- `build:ci` - Production build optimized for CI/CD pipelines
- `build:analyze` - Build with bundle analysis visualization
- `preview` - Preview production build locally

### Code Quality

- `lint` - Validate code with ESLint and Stylelint
- `lint:fix` - Auto-fix linting issues where possible

### Testing & E2E

- `e2e` - Run end-to-end tests (default browser)
- `e2e:firefox` - Run E2E tests in Firefox
- `e2e:chrome` - Run E2E tests in Chrome
- `e2e:safari` - Run E2E tests in Safari
- `e2e:debug` - Run E2E tests in debug mode

### Development Tools

- `plop` - Interactive code generation CLI
- `translations` - Fetch latest translations using Babelsheet

## 🏗️ Technology Stack

Tick-Tock is built with modern, battle-tested technologies:

### Core Framework

- **[React 19](https://react.dev/)** - Latest React with Actions, useActionState, and concurrent features
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Full type safety and modern JavaScript features
- **[Vite 5](https://vitejs.dev/)** - Lightning-fast build tool and development server

### Routing & State Management

- **[TanStack Router](https://tanstack.com/router/latest)** - Type-safe routing with built-in data fetching
- **[TanStack Query 5](https://tanstack.com/query/latest)** - Powerful server state management with caching
- **[TanStack Form](https://tanstack.com/form/latest)** - Performant, headless form state management

### UI & Styling

- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework with modern features
- **[Shadcn/UI](https://ui.shadcn.com/)** - Beautiful, accessible components built on Radix UI
- **[Lucide React](https://lucide.dev/)** - Modern icon library with 1000+ icons

### Development & Testing

- **[Vitest](https://vitest.dev/)** - Fast unit testing with native ESM support
- **[Testing Library](https://testing-library.com/)** - Simple and complete testing utilities
- **[MSW](https://mswjs.io/)** - API mocking for development and testing
- **[Playwright](https://playwright.dev/)** - Reliable end-to-end testing

### Quality & Performance

- **[ESLint](https://eslint.org/)** - Code linting with React 19 and TypeScript rules
- **[Prettier](https://prettier.io/)** - Consistent code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks for quality enforcement

## 📚 Documentation

1. [Technology Stack](/docs/01-technology-stack.md) - Detailed overview of all technologies used
2. [Application Structure](/docs/02-application-structure.md) - Code organization and architecture
3. [TanStack Query Integration](/docs/03-react-query-abstraction.md) - Data fetching patterns
4. [Code Generation](/docs/04-using-plop-commands.md) - Using Plop for rapid development
5. [E2E Testing](/docs/05-e2e-tests.md) - End-to-end testing setup and patterns

### Additional Resources

- [MVP Documentation](mvp.md) - Complete feature specifications and user flows
- [Shadcn/UI Integration](SHADCN_TAILWIND_INTEGRATION.md) - UI component library setup
- [Development Workflow](.github/instructions/development.instructions.md) - Complete development guide

## 🎯 Core User Flow

1. **Dashboard View**: See your time logging status at a glance
2. **Natural Input**: Write "Worked on XYZ-123 for 3 hours fixing bugs"
3. **AI Processing**: System creates structured time entries automatically
4. **Review & Refine**: Check drafts, request changes if needed
5. **One-Click Sync**: Ship approved logs directly to Jira

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code style and standards
- Development workflow
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🚀 What's Next

- **AI-Powered Parsing**: Enhanced natural language understanding
- **Team Collaboration**: Shared time tracking and reporting
- **Mobile App**: Native iOS and Android applications
- **Analytics Dashboard**: Advanced reporting and insights

---

**Built with ❤️ by [Igor Wnek](https://github.com/IgorWnek)** • [Project Repository](https://github.com/IgorWnek/tick-tock-frontend)

Check out the **IKcode GitHub profile** which contains most of the code related to my YouTube episodes: [IKcode](https://github.com/ikcode-dev)
