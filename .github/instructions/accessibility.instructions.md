---
applyTo: "**/*.tsx"
description: "WCAG-focused accessibility patterns: semantic HTML, ARIA, keyboard navigation, focus management, color contrast, and testing for React 19 + Atomic Design + Tailwind v4."
---

# Accessibility Instructions for GitHub Copilot

Make accessible-by-default components. Treat accessibility as a first-class requirement at every atomic level.

References:
- See `atomic-design.instructions.md` for responsibilities by level (atoms must be accessible by default).
- See `design-system.instructions.md` for theming and tokens; use tokens to maintain adequate contrast across themes.
- See `testing.instructions.md` for Testing Library + a11y testing patterns.

## Core principles

- Semantics first: Prefer native elements and attributes; add ARIA only when necessary.
- Keyboard first: Every interactive control must be reachable and operable via keyboard.
- Visible focus: Always show an obvious focus indicator; don’t remove outlines without proper replacement.
- Announce changes: Use proper semantics/ARIA to announce dynamic updates.
- Color is not meaning: Provide text/iconography or patterns beyond color; ensure sufficient contrast.

## Semantic HTML requirements and patterns

Prefer native elements:

```tsx
// ✅ Use button for actions, link for navigation
<button type="button" onClick={onSave}>Save</button>
<a href="/settings">Go to settings</a>

// ❌ Avoid divs with click handlers behaving like buttons
<div onClick={onSave}>Save</div>
```

Proper labelling:

```tsx
// Associate labels with inputs
<label htmlFor="email">Email</label>
<input id="email" name="email" type="email" />

// Or use aria-label only when no visible label fits
<button aria-label="Close dialog">×</button>
```

Landmarks and structure:

```tsx
// Use landmarks for page structure
<header />
<nav aria-label="Main" />
<main />
<footer />

// Use headings in order (h1..h6) without skipping for layout purposes
```

Lists and tables:
- Use `<ul>/<ol>` for lists; `<table>` only for tabular data with `<th scope>`.

## ARIA attributes usage guidelines

General rules:
- Don’t use ARIA when a native element provides the same semantics.
- If you add ARIA, ensure states/props stay in sync (e.g., `aria-expanded`, `aria-selected`).

Examples:

```tsx
// Disclosure button
const [open, setOpen] = React.useState(false);
<button aria-expanded={open} aria-controls="sect-details" onClick={() => setOpen((v) => !v)}>
  Details
</button>
<section id="sect-details" hidden={!open}>
  ...
</section>

// Tabs
<div role="tablist" aria-label="Projects">
  <button role="tab" aria-selected={tab==='active'} aria-controls="panel-active" id="tab-active">Active</button>
  <button role="tab" aria-selected={tab==='archived'} aria-controls="panel-archived" id="tab-archived">Archived</button>
  <div role="tabpanel" id="panel-active" aria-labelledby="tab-active" hidden={tab!=='active'}>
    ...
  </div>
  <div role="tabpanel" id="panel-archived" aria-labelledby="tab-archived" hidden={tab!=='archived'}>
    ...
  </div>
</div>
```

## Keyboard navigation patterns

All interactive components must be reachable with Tab and operable with Enter/Space as applicable.

Focus order:
- Reflect visual order; avoid tabindex > 0.
- Use `tabIndex={0}` for custom focusable elements only when necessary.

Keyboard handlers:

```tsx
// Activate with Enter/Space when role=button on a div (prefer <button/> though)
const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onActivate();
  }
};
<div role="button" tabIndex={0} onKeyDown={onKeyDown} onClick={onActivate} />
```

Roving tabindex (for composite widgets like menus/tabs):
- Manage one `tabIndex=0` (current), others `-1`, and move focus with Arrow keys.

## Screen reader support

Announcements:
- Use `aria-live` regions for async status (loading, success, error) when needed.

```tsx
// Live region for background operations
<div aria-live="polite" className="sr-only" data-testid="live-region">
  {statusMessage}
  {/* e.g., "Saved changes" */}
  {/* Keep content visible to SRs but not visually: use sr-only utility */}
  {/* In Tailwind v4, implement .sr-only via preflight or local CSS if missing */}
  {/* .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0 } */}
}
```

Names/Descriptions:
- Use `aria-describedby` to connect helper text or error messages to inputs.

```tsx
<label htmlFor="hours">Hours</label>
<input id="hours" aria-describedby="hours-hint hours-error" />
<p id="hours-hint">Enter hours in decimal format.</p>
{error && <p id="hours-error" role="alert">{error}</p>}
```

## Focus management strategies

Visible focus:
- Use design system focus ring tokens and utilities (see `design-system.instructions.md`).
- Do not remove outlines without providing a clear replacement.

Programmatic focus:

```tsx
// Focus the first error field after validation fails
const firstErrorRef = React.useRef<HTMLInputElement>(null);
React.useEffect(() => {
  if (hasErrors) firstErrorRef.current?.focus();
}, [hasErrors]);

// Trap focus in modals/dialogs (prefer a11y-ready components; otherwise implement focus trap)
```

Skip links:

```tsx
// Provide a skip link as the first focusable element
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground p-2 rounded">
  Skip to content
</a>
<main id="main">...</main>
```

## Color contrast and visual accessibility

Contrast ratios:
- Text must meet WCAG AA 4.5:1 (normal) or 3:1 (large text/icons). Ensure tokens in light/dark maintain contrast.
- Rely on tokens and avoid hardcoded colors; see `design-system.instructions.md` for OKLCH tokens.

Non-color cues:
- Use icons, labels, patterns in addition to color (e.g., success vs error badges).

Motion and prefers-reduced-motion:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
```

## Accessibility testing approaches

Testing Library:
- Select by role/name, not test IDs, to enforce semantics.
- Verify keyboard interactions with `userEvent.tab()`, `.keyboard('{Enter}')`, `.keyboard('{Space}')`.
- Assert ARIA state props (e.g., `aria-expanded`).

Examples:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('disclosure toggles with keyboard', async () => {
  render(<Disclosure />);
  const user = userEvent.setup();
  const button = screen.getByRole('button', { name: /details/i });
  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(button).toHaveAttribute('aria-expanded', 'true');
});
```

Announce updates:
- Assert live-region content changes when async ops complete.

Contrast checks (process-level):
- During design token updates, validate contrast (use design tools or automated checks) to ensure both themes comply.

## Atomic design alignment

- Atoms: provide accessible defaults (labels, roles, focus styles). Expose props to customize labelling and ARIA when needed.
- Molecules: compose atoms without breaking semantics; ensure the combined widget remains keyboard-operable.
- Organisms: manage complex widgets (dialogs, menus, tables) with robust keyboard and ARIA patterns; prefer using well-tested primitives or libraries where appropriate.
- Templates/Pages: ensure landmark structure, skip links, and heading hierarchy are correct.

## Anti-patterns

- Using non-semantic elements for interactive controls when native equivalents exist.
- Suppressing focus outlines without replacement.
- Relying on color alone to convey meaning.
- Incorrect ARIA roles/attributes that contradict native semantics.
- tabindex values > 0 that create confusing focus order.

## Checklist

- [ ] Uses semantic elements and proper labels.
- [ ] Fully keyboard navigable with visible focus.
- [ ] ARIA attributes only when necessary and kept in sync with state.
- [ ] Adequate color contrast in all themes (tokens-based).
- [ ] Dynamic updates announced as needed (aria-live/role=alert).
- [ ] Tests cover keyboard interactions and roles/names.
