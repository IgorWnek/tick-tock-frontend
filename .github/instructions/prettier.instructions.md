---
applyTo: '**/*.{ts,tsx,js,jsx,json,css,scss,pcss,md,yml,yaml}'
description: 'Instructions for using Prettier to maintain consistent code formatting, including automatic formatting, VS Code integration, and configuration details'
---

# Code Formatting with Prettier

Instructions for maintaining consistent code formatting across the project using Prettier.

## Running Prettier

### Format All Files

Format all supported files in the project:

```bash
npx prettier --write .
```

### Format Specific Files

Format specific files or directories:

```bash
# Single file
npx prettier --write src/components/UserCard.tsx

# Directory
npx prettier --write src/components/

# Multiple patterns
npx prettier --write "src/**/*.{ts,tsx}"
```

### Check Formatting

Check if files are properly formatted without making changes:

```bash
npx prettier --check .
```

## Automated Formatting

### VS Code Integration

Prettier should format automatically on save when configured in VS Code:

1. Install the Prettier extension
2. Enable "Format On Save" in settings
3. Set Prettier as the default formatter

### Git Hooks (lint-staged)

Files are automatically formatted on commit via lint-staged:

- Automatically formats staged files before commit
- Ensures consistent formatting across the team
- Configured in `package.json` under `lint-staged`

## Prettier Configuration

The project uses these Prettier settings (`.prettierrc`):

```json
{
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "all",
  "proseWrap": "always",
  "editorconfig": true
}
```

### Configuration Details

- **printWidth**: Lines wrap at 120 characters
- **singleQuote**: Use single quotes instead of double quotes
- **trailingComma**: Add trailing commas everywhere possible
- **proseWrap**: Always wrap prose (markdown, etc.)
- **editorconfig**: Respect `.editorconfig` settings

## File Exclusions

Prettier ignores certain files (`.prettierignore`):

- `*.hbs` - Handlebars templates
- `*.js` - JavaScript files (use ESLint instead)
- `*.instructions.md` - Instruction files (to preserve formatting)

## Best Practices

### When to Format

1. **Before Committing**: Files are auto-formatted via git hooks
2. **During Development**: Enable format-on-save in your editor
3. **After Major Changes**: Run manual formatting for entire directories
4. **Code Reviews**: Ensure no formatting changes mixed with logic changes

### Integration with ESLint

- Prettier handles **formatting**
- ESLint handles **code quality** and **style rules**
- Both tools work together without conflicts
- Use `npm run lint:fix` for combined linting and formatting

### File Types Supported

Prettier formats these file types:
- TypeScript/JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`)
- JSON (`.json`)
- CSS/SCSS (`.css`, `.scss`, `.pcss`)
- Markdown (`.md`)
- YAML (`.yml`, `.yaml`)

### Manual Formatting Commands

```bash
# Format and watch for changes
npx prettier --write --watch src/

# Format with specific parser
npx prettier --write --parser typescript src/utils.ts

# Check specific file types only
npx prettier --check "src/**/*.tsx"
```

## Troubleshooting

### Common Issues

1. **Conflicting Extensions**: Disable other formatters in VS Code
2. **Format on Save Not Working**: Check VS Code settings and extension conflicts
3. **Git Hook Failures**: Ensure all files pass prettier check before committing

### Manual Override

To temporarily disable prettier for a code block:

```javascript
// prettier-ignore
const uglyFormatted = {
  a: 1,b: 2,c: 3
};
```

For entire files, add to `.prettierignore`:

```
# Temporary exclusion
src/legacy/old-file.js
```

## Integration Tips

### With Other Tools

1. **ESLint**: Use `eslint-config-prettier` to avoid conflicts
2. **Husky**: Automatically runs via pre-commit hooks
3. **CI/CD**: Add prettier checks to prevent unformatted code

### Performance

- Use `.prettierignore` for large files that don't need formatting
- Format incrementally during development rather than entire codebase
- Consider using `--cache` flag for large projects
