---
applyTo: '**/*'
description: 'Guidelines for running the development server, building the application, testing, and general development workflow commands'
---

# Development Workflow Instructions

Guidelines for running and developing the application effectively.

## Running the Application

### Development Server

Start the development server with hot reloading:

```bash
npm start
```

This command:
- Starts Vite development server
- Enables hot module replacement
- Serves the app typically on `http://localhost:3000`
- Provides React DevTools integration

### Production Build

Build the application for production:

```bash
npm run build
```

This command:
- Runs TypeScript compilation check
- Creates optimized production build in `build/` directory
- Minifies and optimizes assets

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### CI Build

For continuous integration environments:

```bash
npm run build:ci
```

### Bundle Analysis

Analyze the bundle size and dependencies:

```bash
npm run build:analyze
```

## Type Checking

Run TypeScript type checking without emitting files:

```bash
npm run typecheck
```

This is useful for:
- Checking types during development
- CI/CD pipelines
- Pre-commit hooks

## Testing

### Run Tests

Execute the test suite:

```bash
npm test
```

### Coverage Report

Generate test coverage report:

```bash
npm run coverage
```

### End-to-End Tests

Run E2E tests in different browsers:

```bash
# Default browser
npm run e2e

# Specific browsers
npm run e2e:firefox
npm run e2e:chrome
npm run e2e:safari

# Debug mode
npm run e2e:debug
```

## Translations

Fetch the latest translations:

```bash
npm run translations
```

## Best Practices

### Development Workflow

1. **Start Development**: Always use `npm start` for development
2. **Type Safety**: Run `npm run typecheck` before committing
3. **Testing**: Ensure tests pass with `npm test`
4. **Code Quality**: Use linting tools (see separate instructions)

### Performance Tips

- Use `npm run build:analyze` to monitor bundle size
- Check for unused dependencies regularly
- Monitor hot reload performance during development

### Debugging

- Use browser DevTools with React DevTools extension
- Enable React Query DevTools in development
- Use `npm run e2e:debug` for E2E test debugging
