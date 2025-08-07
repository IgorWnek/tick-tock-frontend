---
applyTo: '**/*.{ts,tsx,js,jsx}'
description: 'Instructions for maintaining code quality using ESLint, including linting commands, auto-fixing issues, rule explanations, and best practices'
---

# ESLint Code Quality Instructions

Guidelines for maintaining code quality and consistency using ESLint in the project.

## Running ESLint

### Lint All Files

Check all TypeScript and TSX files for issues:

```bash
npm run lint
```

This command:
- Runs ESLint on all `.ts` and `.tsx` files in `src/`
- Runs Stylelint on CSS files
- Reports all errors and warnings
- Returns success message if no issues found

### Auto-fix Issues

Automatically fix ESLint and Stylelint issues where possible:

```bash
npm run lint:fix
```

This command:
- Fixes auto-fixable ESLint rules
- Fixes auto-fixable Stylelint rules
- Reports remaining issues that need manual attention

### Manual ESLint Commands

Run ESLint directly for more control:

```bash
# Check specific files
npx eslint src/components/UserCard.tsx

# Check with auto-fix
npx eslint --fix src/components/

# Check all TypeScript files
npx eslint "src/**/*.{ts,tsx}"

# Get detailed output
npx eslint --format=detailed src/

# Check and report unused directives
npx eslint --report-unused-disable-directives src/
```

## ESLint Configuration

The project uses comprehensive ESLint configuration with these rule sets:

### Core Rule Sets

- **@typescript-eslint**: TypeScript-specific rules
- **react**: React best practices and patterns
- **react-hooks**: React Hooks rules
- **jsx-a11y**: Accessibility rules
- **import**: Import/export best practices
- **testing-library**: Testing best practices
- **vitest**: Vitest testing framework rules

### Key Rules Enforced

1. **TypeScript Rules**:
   - No `any` types (`@typescript-eslint/no-explicit-any`)
   - Consistent type imports
   - Prefer nullish coalescing
   - No unused variables

2. **React Rules**:
   - No prop spreading (`react/jsx-props-no-spreading`)
   - Prefer functional components
   - Proper JSX formatting
   - No array index as keys

3. **Import Rules**:
   - Consistent import order
   - No duplicate imports
   - Proper grouping of imports

4. **Testing Rules**:
   - Prefer user-event over fireEvent
   - Proper async testing patterns
   - Screen queries best practices

## Common Issues and Fixes

### TypeScript Issues

```typescript
// ❌ Bad - Using any type
const handleClick = (event: any) => {};

// ✅ Good - Proper typing
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {};
```

### React Issues

```tsx
// ❌ Bad - Prop spreading
<Component {...props} />

// ✅ Good - Explicit props
<Component prop1={value1} prop2={value2} />
```

### Import Issues

```tsx
// ❌ Bad - Unorganized imports
import { useState } from 'react';
import './styles.css';
import { userQueries } from 'api/queries';
import { Button } from 'components/ui/button';

// ✅ Good - Organized imports
import { useState } from 'react';
import { Button } from 'components/ui/button';
import { userQueries } from 'api/queries';
import './styles.css';
```

### Testing Issues

```tsx
// ❌ Bad - Using fireEvent
fireEvent.click(button);

// ✅ Good - Using user-event
await userEvent.click(button);
```

## Disabling Rules

### Inline Disabling

Disable rules for specific lines:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const legacyApi = (data: any) => {};

// eslint-disable-next-line react/jsx-props-no-spreading
<LegacyComponent {...legacyProps} />
```

### Block Disabling

Disable rules for code blocks:

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
const legacyModule = {
  process: (data: any) => {},
  transform: (input: any) => {},
};
/* eslint-enable @typescript-eslint/no-explicit-any */
```

### File-level Disabling

For entire files (use sparingly):

```typescript
/* eslint-disable react/jsx-props-no-spreading */
// File content where prop spreading is necessary
```

## Integration with Development

### Git Hooks

ESLint runs automatically via lint-staged on commit:
- Only checks staged files
- Prevents commits with linting errors
- Auto-fixes issues where possible

### VS Code Integration

1. Install ESLint extension
2. Enable auto-fix on save:
   ```json
   {
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

### CI/CD Integration

ESLint checks run in CI pipeline:
- Blocks deployment if linting fails
- Generates reports for code quality metrics
- Ensures consistent code quality across team

## Best Practices

### During Development

1. **Fix as You Go**: Address ESLint warnings immediately
2. **Use Auto-fix**: Run `npm run lint:fix` regularly
3. **Understand Rules**: Don't blindly disable rules - understand why they exist
4. **Team Consistency**: Follow established patterns in the codebase

### Code Reviews

1. **No Linting Changes**: Don't mix formatting/linting fixes with logic changes
2. **Rule Discussions**: Discuss rule changes with the team
3. **Disable Justification**: Provide clear reasons for rule disabling

### Performance Tips

```bash
# Use cache for faster subsequent runs
npx eslint --cache src/

# Check only changed files
npx eslint $(git diff --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx)$')

# Parallel linting for large codebases
npx eslint --cache --max-warnings=0 src/
```

## Troubleshooting

### Common Problems

1. **Parser Errors**: Ensure TypeScript files are valid
2. **Rule Conflicts**: Check for conflicts between ESLint and Prettier
3. **Performance Issues**: Use `.eslintignore` for large files

### Configuration Files

- `.eslintrc.js` - Main ESLint configuration
- `.eslintignore` - Files to exclude from linting
- `package.json` - Script definitions and lint-staged config

### Getting Help

```bash
# Show ESLint version and configuration
npx eslint --print-config src/index.tsx

# List all available rules
npx eslint --print-config src/index.tsx | grep rules

# Debug configuration issues
npx eslint --debug src/components/
```

## Rule Customization

### Adding New Rules

When adding rules, consider:
1. Team consensus on the rule value
2. Auto-fixability for better developer experience
3. Impact on existing codebase
4. Documentation and training needs

### Rule Severity Levels

- **error** (2): Breaks the build, must be fixed
- **warn** (1): Shows warning, doesn't break build
- **off** (0): Rule is disabled

Example configuration:

```javascript
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "react/jsx-props-no-spreading": "warn",
    "prefer-const": "error"
  }
}
```
