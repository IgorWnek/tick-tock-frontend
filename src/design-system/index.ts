/**
 * Tick-Tock Design System
 *
 * Main entry point for the atomic design system. This file re-exports
 * all components, tokens, and utilities from their respective modules.
 *
 * Atomic Design Hierarchy:
 * - Tokens: Design values (colors, spacing, typography)
 * - Atoms: Basic building blocks (Button, Input, Label)
 * - Molecules: Simple combinations of atoms (FormField, UserInfo)
 * - Organisms: Complex sections (LoginForm, UserMenu)
 * - Templates: Page layouts and structure (AuthTemplate)
 * - Utilities: Helper functions and tools
 */

// Design tokens
export * from './tokens';

// Atoms - Basic building blocks
export * from './atoms';

// Molecules - Simple combinations
// export * from './molecules';

// Organisms - Complex sections
// export * from './organisms';

// Templates - Page layouts
// export * from './templates';

// Note: Molecule, organism, template exports are commented out
// until components are implemented. This prevents TypeScript compilation
// errors during development. Uncomment as components are created.
