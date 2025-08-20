# GitHub Copilot Instructions Files Reorganization Tasks

## Overview

This document outlines the tasks for splitting the comprehensive GitHub Copilot instruction files into smaller, more focused and maintainable files. The reorganization will improve Copilot's context efficiency, make maintenance easier, and provide better targeted guidance for specific development scenarios.

## Current State

We currently have these instruction files:
- `reactjs.instructions.md` (large, comprehensive)
- `tanstack-query.instructions.md` (comprehensive)
- `development.instructions.md` (workflow-focused)
- `eslint.instructions.md` (code quality-focused)
- `prettier.instructions.md` (formatting-focused)

## Target Structure

Split the comprehensive files into focused, domain-specific instruction files that can be applied selectively based on file patterns and development context.

---

## Task 1: Create React Core Instructions

**File:** `.github/instructions/react-core.instructions.md`

**Source:** Extract from `reactjs.instructions.md`

**ApplyTo:** `**/*.tsx, **/*.ts`

**Description:** Core React 19 patterns, functional components, and TypeScript standards

**Content to Extract:**
- Core Principles (TypeScript First, Functional Components Only)
- Basic React 19 Patterns (Modern Hook Usage - excluding advanced features)
- Props and TypeScript patterns (basic prop handling)
- Basic event handling patterns
- Core anti-patterns to avoid (basic React violations)
- Summary focusing on React fundamentals

**Rules to Follow:**
- Follow `prettier.instructions.md` for code formatting in examples
- Follow `eslint.instructions.md` for code quality patterns
- Use TypeScript-first approach as established in current files
- Maintain consistency with existing React patterns

---

## Task 2: Create Atomic Design Instructions

**File:** `.github/instructions/atomic-design.instructions.md`

**Source:** Extract from `reactjs.instructions.md`

**ApplyTo:** `**/components/**/*.{tsx,ts}`

**Description:** Atomic design methodology, component organization, and hierarchy patterns

**Content to Extract:**
- File Organization Patterns (Atomic Design Component Structure)
- Atomic Design Component Guidelines (all atomic levels)
- Component composition patterns
- Import/Export patterns following atomic hierarchy
- File and folder naming conventions for atomic design
- Examples for each atomic level (Atoms, Molecules, Organisms, Templates, Pages)

**Rules to Follow:**
- Reference `tanstack-query.instructions.md` for data fetching patterns by atomic level
- Follow `prettier.instructions.md` for consistent code formatting
- Ensure alignment with existing atomic design patterns from migration guide
- Use clear examples that demonstrate proper atomic hierarchy

---

## Task 3: Create Design System & Theming Instructions

**File:** `.github/instructions/design-system.instructions.md`

**Source:** Extract from `reactjs.instructions.md`

**ApplyTo:** `**/components/**/*.{tsx,ts,css,scss}`

**Description:** Design tokens, CSS variables, TailwindCSS 4 patterns, and theming guidelines

**Content to Extract:**
- Enhanced Theming and Design Tokens section
- CSS Variables and Theme Integration
- TailwindCSS 4 with design tokens usage
- Component variant patterns (CVA integration)
- Theme consistency patterns
- Dark mode and theming examples

**Rules to Follow:**
- Follow `prettier.instructions.md` for CSS and styling formatting
- Ensure consistency with existing design system approach
- Reference atomic design principles for component theming
- Include comprehensive examples for design token usage

---

## Task 4: Create React 19 Advanced Features Instructions

**File:** `.github/instructions/react19-features.instructions.md`

**Source:** Extract from `reactjs.instructions.md`

**ApplyTo:** `**/*.tsx`

**Description:** React 19 specific features: Actions, useActionState, useOptimistic, useTransition, and modern patterns

**Content to Extract:**
- React 19 Actions and Form Handling
- useActionState patterns
- Optimistic Updates with useOptimistic
- Enhanced useTransition for Actions
- New Ref Callback Cleanup
- Direct Ref Props (No forwardRef needed)
- useFormStatus patterns
- Server Components preparation patterns

**Rules to Follow:**
- Follow `eslint.instructions.md` for modern React patterns
- Reference `tanstack-query.instructions.md` for data integration with React 19 features
- Follow `prettier.instructions.md` for code formatting
- Include comprehensive examples for each React 19 feature

---

## Task 5: Create Custom Hooks Instructions

**File:** `.github/instructions/hooks.instructions.md`

**Source:** Extract from `reactjs.instructions.md`

**ApplyTo:** `**/hooks/**/*.{ts,tsx}`

**Description:** Custom hooks development, composition patterns, and testing strategies

**Content to Extract:**
- Hook Composition with Atomic Design
- Atomic hooks vs Molecular hooks vs Organism hooks patterns
- Hook naming conventions
- Return value patterns and TypeScript typing
- Custom Hook Testing patterns
- Performance considerations for hooks

**Rules to Follow:**
- Reference `tanstack-query.instructions.md` for data fetching hooks
- Follow `eslint.instructions.md` for hook-specific rules
- Reference atomic design principles for hook organization
- Include testing patterns following established test structure

---

## Task 6: Create Testing Instructions

**File:** `.github/instructions/testing.instructions.md`

**Source:** Extract from `reactjs.instructions.md`

**ApplyTo:** `**/*.test.{tsx,ts}, **/*.spec.{tsx,ts}`

**Description:** Testing patterns for React components, hooks, and integration tests

**Content to Extract:**
- Component Testing with Atomic Design considerations
- Testing patterns for different atomic levels
- Integration Testing patterns
- Custom Hook Testing (comprehensive examples)
- MSW integration in tests
- Accessibility testing approaches
- Testing Library best practices

**Rules to Follow:**
- Follow `eslint.instructions.md` for testing-specific rules
- Reference `tanstack-query.instructions.md` for testing data fetching
- Follow `development.instructions.md` for test execution patterns
- Include atomic design specific testing strategies

---

## Task 7: Create State Management Instructions

**File:** `.github/instructions/state-management.instructions.md`

**Source:** Extract from `reactjs.instructions.md`

**ApplyTo:** `**/contexts/**/*.{tsx,ts}, **/stores/**/*.{tsx,ts}`

**Description:** Context patterns, state management, and data flow guidelines

**Content to Extract:**
- Context and State Management patterns
- Context Controller pattern
- useReducer patterns and best practices
- State composition strategies
- Performance optimization for context
- State management integration with atomic design

**Rules to Follow:**
- Reference `tanstack-query.instructions.md` for server state vs local state
- Follow React 19 patterns for state management
- Follow `eslint.instructions.md` for state management code quality
- Include examples that work with atomic design hierarchy

---

## Task 8: Create Performance Instructions

**File:** `.github/instructions/performance.instructions.md`

**Source:** Extract from `reactjs.instructions.md`

**ApplyTo:** `**/*.tsx`

**Description:** Performance optimization, memoization, code splitting, and rendering optimization

**Content to Extract:**
- Memoization strategies (useMemo, useCallback, memo)
- Code Splitting patterns for React applications
- Lazy loading components
- Bundle optimization techniques
- Rendering optimization patterns
- Performance monitoring approaches

**Rules to Follow:**
- Reference `development.instructions.md` for build and bundle analysis
- Follow atomic design principles for performance optimization
- Reference `tanstack-query.instructions.md` for data fetching performance
- Include practical examples with performance metrics

---

## Task 9: Create Accessibility Instructions

**File:** `.github/instructions/accessibility.instructions.md`

**Source:** Extract from `reactjs.instructions.md`

**ApplyTo:** `**/*.tsx`

**Description:** WCAG compliance, semantic HTML, ARIA attributes, and keyboard navigation

**Content to Extract:**
- Semantic HTML requirements and patterns
- ARIA attributes usage guidelines
- Keyboard navigation patterns
- Screen reader support implementation
- Focus management strategies
- Color contrast and visual accessibility
- Accessibility testing approaches

**Rules to Follow:**
- Follow atomic design principles for accessible components
- Reference testing instructions for accessibility testing
- Include comprehensive examples for each accessibility pattern
- Ensure compatibility with design system theming

---

## Task 10: Create Code Quality Instructions

**File:** `.github/instructions/code-quality.instructions.md`

**Source:** Consolidate from `reactjs.instructions.md`, `eslint.instructions.md`, `prettier.instructions.md`

**ApplyTo:** `**/*.{ts,tsx}`

**Description:** ESLint rules, documentation standards, and code organization patterns

**Content to Extract:**
- ESLint Rules Compliance (from eslint.instructions.md)
- Prettier integration patterns (from prettier.instructions.md)
- Documentation standards (JSDoc patterns)
- File naming conventions
- Import organization rules
- Code review checklist
- Common anti-patterns and fixes

**Rules to Follow:**
- Consolidate existing ESLint and Prettier guidelines
- Reference atomic design for file organization
- Include comprehensive examples for code quality patterns
- Maintain consistency with existing quality standards

---

## Task 11: Split TanStack Query Instructions

**File:** `.github/instructions/data-fetching-atoms.instructions.md`

**Source:** Extract from `tanstack-query.instructions.md`

**ApplyTo:** `**/components/atoms/**/*.{tsx,ts}, **/components/molecules/**/*.{tsx,ts}`

**Description:** Data fetching patterns for atoms and molecules

**Content to Extract:**
- Atoms - No Data Fetching patterns
- Molecules - Simple Data Fetching patterns
- Basic query organization for simple components
- Simple mutation patterns
- Error handling for basic components

**Rules to Follow:**
- Maintain consistency with atomic design principles
- Reference core React patterns for component structure
- Follow code quality guidelines for data fetching code

---

## Task 12: Split TanStack Query Instructions (Complex)

**File:** `.github/instructions/data-fetching-organisms.instructions.md`

**Source:** Extract from `tanstack-query.instructions.md`

**ApplyTo:** `**/components/organisms/**/*.{tsx,ts}, **/components/templates/**/*.{tsx,ts}, **/routes/**/*.{tsx,ts}`

**Description:** Complex data fetching for organisms, templates, and pages

**Content to Extract:**
- Organisms - Complex Data Orchestration
- Templates - Data Layout Coordination
- Pages - Route-Specific Data Fetching
- Complex mutation patterns
- Cache invalidation strategies
- Performance optimization for complex components

**Rules to Follow:**
- Reference atomic design principles for complex components
- Follow React 19 patterns for advanced data handling
- Include comprehensive cache management strategies

---

## Task 13: Create Data Architecture Instructions

**File:** `.github/instructions/data-architecture.instructions.md`

**Source:** Extract from `tanstack-query.instructions.md`

**ApplyTo:** `**/api/**/*.{ts,tsx}, **/hooks/**/*.{ts,tsx}`

**Description:** Query factories, cache management, and data architecture patterns

**Content to Extract:**
- Query Organization and Query Factories Pattern
- Query Key Hierarchy
- Cache Invalidation Strategy
- MSW Integration patterns
- Error Handling consistency
- Performance Optimization for data layer
- Development vs Production patterns

**Rules to Follow:**
- Reference atomic design for data flow architecture
- Follow TypeScript patterns for type safety
- Include comprehensive testing patterns for data layer

---

## Implementation Guidelines

### File Structure
Each instruction file should follow this structure:
```markdown
---
applyTo: 'file-pattern'
description: 'Brief description'
---

# Title

## Context
Brief explanation of when/how to use these instructions

## Core Principles
Key principles specific to this domain

## Patterns
Detailed patterns with code examples

## Best Practices
Practical guidelines for implementation

## Anti-Patterns
What to avoid with examples

## Integration
How this integrates with other instruction files

## Summary
Key takeaways
```

### Cross-References
Each file should include clear cross-references to related instruction files:
```markdown
## Related Instructions
- [Atomic Design](./atomic-design.instructions.md) for component organization
- [Testing](./testing.instructions.md) for testing these patterns
```

### Code Examples
- All code examples must follow `prettier.instructions.md` formatting
- All code examples must pass `eslint.instructions.md` rules
- Include TypeScript types for all examples
- Use atomic design principles in component examples

### Testing Strategy
After creating each instruction file:
1. Test with existing components to ensure patterns work
2. Verify cross-references are accurate
3. Ensure no conflicting guidance between files
4. Test Copilot suggestions with new instruction files

## Success Criteria

- ✅ Each instruction file is focused on a single domain
- ✅ All content from original files is preserved and reorganized
- ✅ Cross-references between files are clear and accurate
- ✅ ApplyTo patterns are specific and non-overlapping where appropriate
- ✅ Code examples follow all established quality guidelines
- ✅ Atomic design principles are consistently applied
- ✅ Instructions are actionable and specific
- ✅ No duplicate or conflicting guidance between files

## Migration Plan

1. **Phase 1:** Create core instruction files (Tasks 1-5)
2. **Phase 2:** Create specialized instruction files (Tasks 6-10)
3. **Phase 3:** Split TanStack Query files (Tasks 11-13)
4. **Phase 4:** Test and validate all instruction files
5. **Phase 5:** Update documentation and deprecate old files

---

*This reorganization will provide more focused, maintainable, and efficient GitHub Copilot instruction files that better serve our development workflow and atomic design architecture.*
