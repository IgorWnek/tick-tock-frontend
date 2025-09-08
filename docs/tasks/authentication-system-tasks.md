# Authentication System Implementation Tasks

## Overview

This document outlines the tasks for implementing a comprehensive authentication system with login page, user management, and profile functionality following our atomic design methodology and existing architecture patterns.

## Context Analysis

- **Existing Infrastructure**: AuthContext, useAuth hook, login/logout mutations, MSW mocks already exist
- **Current Auth Flow**: Uses username/password (not email/password as initially requested)
- **Design System**: Currently uses `src/components/ui/` (legacy), migrating to `src/design-system/` structure
- **Framework**: TanStack Query, TanStack Router, shadcn/ui, Radix UI primitives

## Task Breakdown

### 1. Design System Foundation Setup

**🎯 Success Criteria:**

- [x] All components follow atomic design principles
- [x] Design system directory structure is established

#### 1.1 Create Design System Directory Structure

**Priority**: High | **Effort**: Medium | **Type**: Foundation

Create the complete atomic design directory structure with initial files and exports.

**Specific Actions**:

1. **Create directory structure**:

   ```bash
   mkdir -p src/design-system/{atoms,molecules,organisms,templates,tokens}
   mkdir -p src/design-system/atoms/{Button,Input,Label,Avatar}
   mkdir -p src/design-system/molecules/{FormField,DropdownMenu,UserInfo}
   mkdir -p src/design-system/organisms/{LoginForm,UserMenu,ProfileForm}
   mkdir -p src/design-system/templates/{AuthTemplate,ProfileTemplate}
   ```

2. **Create index.ts files in each level**:
   - `src/design-system/index.ts` - Root design system exports
   - `src/design-system/atoms/index.ts` - All atom exports
   - `src/design-system/molecules/index.ts` - All molecule exports
   - `src/design-system/organisms/index.ts` - All organism exports
   - `src/design-system/templates/index.ts` - All template exports

3. **Create design tokens file**:
   - `src/design-system/tokens/index.ts` - CSS custom properties and design tokens

**Requirements**:

- Follow atomic design hierarchy (atoms → molecules → organisms → templates)
- Use TypeScript-first approach with strict typing
- Named exports only, no default exports
- Each component in its own folder with `.tsx`, `.types.ts`, and `.test.tsx` files

**Definition of Done**:

- [x] All directories exist as specified above
- [x] All index.ts files exist with proper TypeScript exports (initially empty)
- [x] `src/design-system/tokens/index.ts` contains basic design token structure
- [x] Root `src/design-system/index.ts` re-exports all component categories
- [x] No TypeScript compilation errors
- [x] Directory structure matches atomic design principles exactly

#### 1.2 Migrate Essential UI Components to Atoms

**Priority**: High | **Effort**: Medium | **Type**: Migration

Migrate existing shadcn/ui components from `src/components/ui/` to the new atomic design structure.

**Source Components** (existing):

- `src/components/ui/button.tsx` → `src/design-system/atoms/Button/`
- `src/components/ui/input.tsx` → `src/design-system/atoms/Input/`
- `src/components/ui/label.tsx` → `src/design-system/atoms/Label/`

**Specific Actions for Each Component**:

1. **Button Migration**:
   - Copy `src/components/ui/button.tsx` as base
   - Create `src/design-system/atoms/Button/Button.tsx`
   - Create `src/design-system/atoms/Button/Button.types.ts`
   - Create `src/design-system/atoms/Button/Button.test.tsx`
   - Create `src/design-system/atoms/Button/index.ts` with named exports

2. **Input Migration**:
   - Copy `src/components/ui/input.tsx` as base
   - Create `src/design-system/atoms/Input/Input.tsx`
   - Create `src/design-system/atoms/Input/Input.types.ts`
   - Create `src/design-system/atoms/Input/Input.test.tsx`
   - Create `src/design-system/atoms/Input/index.ts` with named exports

3. **Label Migration**:
   - Copy `src/components/ui/label.tsx` as base
   - Create `src/design-system/atoms/Label/Label.tsx`
   - Create `src/design-system/atoms/Label/Label.types.ts`
   - Create `src/design-system/atoms/Label/Label.test.tsx`
   - Create `src/design-system/atoms/Label/index.ts` with named exports

**Requirements**:

- Maintain 100% API compatibility with existing components
- Convert to named exports (remove default exports)
- Use CVA (Class Variance Authority) for variants where applicable
- Add design tokens integration
- Include accessibility features (ARIA, keyboard support)
- Add comprehensive TypeScript types
- Preserve all existing prop interfaces

**Definition of Done**:

- [x] All 3 components (Button, Input, Label) exist in new atomic structure
- [x] Each component has all 4 required files (.tsx, .types.ts, .test.tsx, index.ts)
- [x] All existing props and variants work identically to original components
- [x] Components can be imported from `@/design-system/atoms/ComponentName`
- [x] All components use named exports only
- [x] TypeScript compilation passes without errors
- [x] All existing tests pass (or equivalent new tests)
- [x] Components integrate with design tokens system
- [x] Storybook stories work (if they existed for original components)

**Example Button structure**:

```tsx
// src/design-system/atoms/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = {
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof buttonVariants> & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ variant, size, className, children, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
    {children}
  </button>
);
```

#### 1.3 Create Avatar Atom Component

**Priority**: High | **Effort**: Low | **Type**: New Feature

Create a new Avatar atom component for user representation. This is appropriately atomic as it's a single, indivisible UI element.

**Specific Implementation**:

1. **Create Avatar files**:
   - `src/design-system/atoms/Avatar/Avatar.tsx` - Main component implementation
   - `src/design-system/atoms/Avatar/Avatar.types.ts` - TypeScript interfaces
   - `src/design-system/atoms/Avatar/Avatar.test.tsx` - Unit tests
   - `src/design-system/atoms/Avatar/index.ts` - Named exports

2. **Component Structure**:

   ```tsx
   export type AvatarProps = {
     firstName?: string;
     lastName?: string;
     src?: string;
     alt?: string;
     size?: 'sm' | 'md' | 'lg';
     className?: string;
   };

   export const Avatar = ({ firstName, lastName, src, alt, size = 'md', className }: AvatarProps) => {
     // Implementation with initials fallback
   };
   ```

3. **Required Functionality**:
   - Display user image when `src` is provided
   - Fall back to initials from `firstName` and `lastName`
   - Handle cases where names are missing (show generic icon or placeholder)
   - Size variants: sm (32px), md (40px), lg (48px)
   - Circular avatar shape with proper aspect ratio

**Requirements**:

- Support initials display when no image provided
- Fallback to user's first/last name initials (e.g., "John Doe" → "JD")
- Handle edge cases: single name, no names, empty strings
- Multiple sizes with consistent design tokens
- Accessible with proper ARIA labels and alt text
- Support for custom images (implementation ready, not required for MVP)
- Use CVA for size variants
- Integrate with design tokens for colors and spacing

**Design Requirements**:

- **Visual Style**:
  - Circular shape with `rounded-full` styling
  - Background: `bg-primary` for initials display
  - Text color: `text-primary-foreground` for high contrast
  - Font weight: `font-medium` for clear readability
  - Size variants: sm (32px), md (40px), lg (48px) using design tokens
  - Border: subtle `border border-border` for definition

- **Interaction States**:
  - No hover states (Avatar is display-only)
  - Focus states when part of interactive components (inherited from parent)
  - Loading state: skeleton with `animate-pulse` when image loading

- **Responsive Behavior**:
  - Maintains circular aspect ratio at all sizes
  - Touch-friendly minimum size (32px) for mobile interfaces
  - Scales proportionally with text size changes

- **Accessibility Visual**:
  - High contrast between background and text (WCAG AA: 4.5:1 minimum)
  - Clear visual hierarchy when used in components
  - Sufficient size for screen reader focus indication

- **Brand Consistency**:
  - Matches existing app's user representation patterns
  - Uses primary color scheme from design system
  - Consistent with header and navigation styling approach

**Design Definition of Done**:

- [ ] Circular shape maintains perfect aspect ratio across all sizes
- [ ] Uses design system color tokens consistently (bg-primary, text-primary-foreground)
- [ ] Text size scales appropriately with container size
- [ ] Meets WCAG AA contrast requirements for text readability
- [ ] Visually consistent with existing app branding
- [ ] Loading states provide clear visual feedback
- [ ] Integrates seamlessly with header and menu contexts

**Definition of Done**:

- [x] Avatar component exists with all 4 required files
- [x] Component displays initials correctly from firstName/lastName props
- [x] All 3 size variants (sm, md, lg) work and use design tokens
- [x] Proper accessibility: ARIA labels, alt text for images
- [x] Handles edge cases: missing names, single names, empty props
- [x] Can be imported from `@/design-system/atoms/Avatar`
- [x] TypeScript compilation passes
- [x] Unit tests cover all scenarios: with names, without names, different sizes
- [x] Component integrates with existing design system colors
- [x] Circular shape maintains aspect ratio across all sizes

### 2. Authentication API Layer Updates

**🎯 Success Criteria:**

- [x] MSW mocks support all authentication scenarios

#### 2.1 Update MSW Mocks for Enhanced User Data

**Priority**: High | **Effort**: Low | **Type**: Enhancement

Update the existing MSW mock to support profile management functionality with comprehensive user data and validation.

**Specific Actions**:

1. **Create Enhanced User Data Structure**:

   ```typescript
   // Add to src/api/mocks/handlers.ts
   const testUsers = [
     {
       id: 'user-1',
       firstName: 'Test',
       lastName: 'User',
       username: 'user@email.com', // Use email as username for compatibility
       email: 'user@email.com',
       password: 'password' // Store in mock for validation
     },
     {
       id: 'user-2',
       firstName: 'John',
       lastName: 'Doe',
       username: 'john@example.com',
       email: 'john@example.com',
       password: 'admin123'
     }
   ];
   ```

2. **Update `/authorize` Endpoint**:
   - Replace current mock implementation with credential validation
   - Check username/password against testUsers array
   - Return proper error responses for invalid credentials
   - Maintain existing token structure

3. **Add Profile Management Endpoints**:
   - `PATCH /me` - Update user profile (firstName, lastName, email)
   - `PATCH /me/password` - Change user password
   - Include validation and error handling

4. **Update `/me` Endpoint**:
   - Add email field to response
   - Maintain compatibility with existing auth context

**Specific Implementation**:

```typescript
// Enhanced /authorize endpoint
const authorizeHandler = http.post<LoginMutationArguments, never, LoginMutationResponse>('/authorize', async ({ request }) => {
  const { username, password } = await request.json();
  const user = testUsers.find(u => u.username === username && u.password === password);

  if (!user) {
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  return HttpResponse.json({
    accessToken: 'MTQ0NjJkZmQ5OTM2NDE1ZTZjNGZmZjI3',
    tokenType: 'bearer',
    expires: 3600,
    refreshToken: 'IwOGYzYTlmM2YxOTQ5MGE3YmNmMDFkNTVk',
  });
});
```

**Requirements**:

- Add email field to user object (keep username for backward compatibility)
- Implement credential validation against test user database
- Add proper HTTP status codes (401 for invalid credentials, 200 for success)
- Include comprehensive error messages
- Support profile update operations
- Maintain data persistence within MSW session

**Definition of Done**:

- [x] testUsers array exists with at least 2 test accounts
- [x] `/authorize` endpoint validates credentials against testUsers
- [x] Invalid credentials return 401 with proper error message
- [x] Valid credentials return 200 with tokens
- [x] `/me` endpoint includes email field in response
- [x] `PATCH /me` endpoint exists and updates user profile
- [x] `PATCH /me/password` endpoint exists and validates current password
- [x] All endpoints return consistent error response format
- [x] Changes persist within the MSW session
- [x] No breaking changes to existing auth flow

#### 2.2 Extend Auth Types

**Priority**: High | **Effort**: Low | **Type**: Enhancement

Update auth types to support profile management functionality with comprehensive TypeScript definitions.

**Specific Actions**:

1. **Update Existing Types**:
   - Modify `GetMeQueryResponse` in `src/api/actions/auth/auth.types.ts`
   - Add email field while maintaining backward compatibility

2. **Add New Profile Management Types**:
   - `UpdateProfileMutationArguments` for profile updates
   - `UpdatePasswordMutationArguments` for password changes
   - `ProfileUpdateResponse` for update confirmations

3. **Add Validation Types**:
   - Error response types for validation failures
   - Success response types for profile operations

**Specific Implementation**:

```typescript
// Update existing type in src/api/actions/auth/auth.types.ts
export type GetMeQueryResponse = {
  id: string; // Add id field
  firstName: string;
  lastName: string;
  username: string;
  email: string; // Add email field
};

// Add new types for profile management
export type UpdateProfileMutationArguments = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type UpdatePasswordMutationArguments = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ProfileUpdateResponse = {
  success: boolean;
  message: string;
  user?: GetMeQueryResponse;
};

export type PasswordUpdateResponse = {
  success: boolean;
  message: string;
};

// Error response types
export type AuthErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
};
```

**Requirements**:

- Maintain 100% backward compatibility with existing types
- Add comprehensive TypeScript definitions for all new operations
- Include proper error typing for validation scenarios
- Support optional fields for partial profile updates
- Include confirmation fields for critical operations (password change)

**Definition of Done**:

- [x] `GetMeQueryResponse` includes id and email fields
- [x] `UpdateProfileMutationArguments` supports partial updates
- [x] `UpdatePasswordMutationArguments` includes confirmation field
- [x] Response types exist for all profile operations
- [x] Error types handle validation and auth failures
- [x] All types are exported from auth.types.ts
- [x] TypeScript compilation passes without errors
- [x] Types integrate with existing TanStack Query patterns
- [x] JSDoc comments document each type's purpose
- [x] No breaking changes to existing type consumers

#### 2.3 Create Profile API Actions

**Priority**: Medium | **Effort**: Medium | **Type**: New Feature

Create API actions for profile management.

**Files**:

- `src/api/actions/auth/profile.mutations.ts`
- `src/api/actions/auth/profile.queries.ts`

**Requirements**:

- `updateProfileMutation` for general profile updates
- `updatePasswordMutation` for password changes
- Integrate with existing TanStack Query patterns
- Include proper error handling and validation

**Definition of Done**:

- [x] Profile mutations file created with updateProfile and updatePassword functions
- [x] Profile queries file created with appropriate query structure
- [x] Mutations integrate with existing TanStack Query patterns
- [x] Functions use proper TypeScript types from auth.types.ts
- [x] Profile mutations exported in central mutations index
- [x] Error handling follows existing patterns
- [x] TypeScript compilation passes without errors
- [x] Functions accessible via useMutation hook
- [x] JSDoc comments document function purposes
- [x] Integration follows existing authentication architecture

### 3. Molecule Components

#### 3.1 Create FormField Molecule

**Priority**: High | **Effort**: Medium | **Type**: New Feature

Create a reusable form field molecule that composes Label and Input atoms with error handling and React Hook Form integration.

**Specific Actions**:

1. **Create FormField Files**:
   - `src/design-system/molecules/FormField/FormField.tsx` - Main component
   - `src/design-system/molecules/FormField/FormField.types.ts` - TypeScript definitions
   - `src/design-system/molecules/FormField/FormField.test.tsx` - Unit tests
   - `src/design-system/molecules/FormField/index.ts` - Named exports

2. **Component Implementation**:

   ```tsx
   // src/design-system/molecules/FormField/FormField.tsx
   import React from 'react';
   import { Label } from '@/design-system/atoms/Label';
   import { Input } from '@/design-system/atoms/Input';
   import { cn } from '@/lib/utils';

   export type FormFieldProps = {
     name: string;
     label: string;
     type?: 'text' | 'email' | 'password' | 'tel' | 'url';
     placeholder?: string;
     value?: string;
     defaultValue?: string;
     error?: string;
     required?: boolean;
     disabled?: boolean;
     className?: string;
     onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
     onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
   } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type' | 'onChange' | 'onBlur'>;

   export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
     ({ name, label, error, required, className, ...inputProps }, ref) => {
       const errorId = error ? `${name}-error` : undefined;

       return (
         <div className={cn('space-y-2', className)}>
           <Label htmlFor={name} className={required ? "after:content-['*'] after:ml-0.5 after:text-destructive" : ''}>
             {label}
           </Label>
           <Input
             ref={ref}
             id={name}
             name={name}
             aria-describedby={errorId}
             aria-invalid={!!error}
             className={error ? 'border-destructive focus-visible:ring-destructive' : ''}
             {...inputProps}
           />
           {error && (
             <p id={errorId} className="text-sm text-destructive" role="alert">
               {error}
             </p>
           )}
         </div>
       );
     }
   );

   FormField.displayName = 'FormField';
   ```

3. **React Hook Form Integration**:
   - Support `react-hook-form` Controller pattern
   - Handle validation state and error display
   - Proper field registration and refs

**Requirements**:

- Compose Label and Input atoms (strict atomic design hierarchy)
- Support all common input types (text, email, password, etc.)
- Integrate seamlessly with React Hook Form
- Accessible error announcement (aria-describedby, role="alert")
- Visual error states with design system colors
- Required field indicators
- Support controlled and uncontrolled modes
- Forward refs properly for form libraries

**Design Requirements**:

- **Visual Style**:
  - Vertical layout with consistent `space-y-2` spacing
  - Label typography: `text-sm font-medium` for clear hierarchy
  - Required indicator: red asterisk (`text-destructive`) with `ml-0.5` spacing
  - Input inherits from Input atom styling
  - Error text: `text-sm text-destructive` for consistency

- **Interaction States**:
  - Normal state: clean, minimal styling
  - Focus state: inherits Input atom focus styles (`focus-visible:ring-2`)
  - Error state: red border (`border-destructive`) and red focus ring
  - Disabled state: inherits Input atom disabled styling

- **Responsive Behavior**:
  - Full width container (`w-full`) for consistent form layouts
  - Label text wraps appropriately on mobile
  - Touch-friendly input targets (minimum 44px height)
  - Error text wraps and doesn't break layout

- **Accessibility Visual**:
  - Clear visual hierarchy: Label → Input → Error
  - High contrast error states (red text/borders meet WCAG AA)
  - Required fields have clear visual indicator (asterisk)
  - Error messages are visually associated with inputs

- **Brand Consistency**:
  - Uses design system spacing tokens consistently
  - Error colors match existing validation patterns
  - Typography scale aligns with form standards
  - Consistent with other form elements in the app

**Design Definition of Done**:

- [x] Vertical spacing follows design system tokens (space-y-2)
- [x] Label typography matches design system standards
- [x] Required asterisk is clearly visible and properly styled
- [x] Error states use consistent destructive color tokens
- [x] Focus states provide clear visual feedback
- [x] Responsive layout works on all screen sizes
- [x] Visual hierarchy guides user attention properly

**Definition of Done**:

- [x] FormField component exists with all 4 required files
- [x] Component composes Label and Input atoms correctly
- [x] Supports all specified input types
- [x] Error states display with proper accessibility attributes
- [x] Required fields show visual indicator (asterisk)
- [x] Integrates with React Hook Form Controller
- [x] Can be imported from `@/design-system/molecules/FormField`
- [x] TypeScript compilation passes
- [x] Unit tests cover error states, required fields, and accessibility
- [x] Component follows design system spacing and colors
- [x] Supports both controlled and uncontrolled usage

#### 3.2 Create DropdownMenu Molecule

**Priority**: High | **Effort**: Medium | **Type**: New Feature

Create a dropdown menu component using Radix UI primitives.

**File**: `src/design-system/molecules/DropdownMenu/DropdownMenu.tsx`

**Requirements**:

- Use Radix UI Dropdown Menu primitive
- Support hover and click triggers
- Keyboard navigation support
- Proper focus management
- Customizable trigger and content
- Support for separators and different item types

**Definition of Done**:

- [x] DropdownMenu component exists with all required files (.tsx, .types.ts, .test.tsx, index.ts)
- [x] Uses Radix UI Dropdown Menu primitive as base
- [x] Supports variant prop for DropdownMenuItem (default, destructive)
- [x] All components exported: Root, Trigger, Content, Item, Separator, etc.
- [x] Keyboard navigation support implemented and tested
- [x] Proper focus management with Radix UI
- [x] TypeScript compilation passes without errors
- [x] All 4 tests passing including keyboard navigation and variant support
- [x] Accessible with proper ARIA attributes
- [x] Can be imported from `@/design-system/molecules/DropdownMenu`

#### 3.3 Create UserInfo Molecule

**Priority**: Medium | **Effort**: Low | **Type**: New Feature

Create a component to display user information (avatar + name/email).

**Requirements**:

- Compose Avatar atom with text display
- Support different layouts (horizontal, vertical)
- Truncate long emails/names appropriately
- Responsive design

**Design Requirements**:

- **Visual Style**:
  - Horizontal layout: Avatar + text with `flex items-center space-x-3`
  - Text container: `flex flex-col` for name/email stacking

- **Interaction States**:
  - Default: Clean, minimal display
  - Loading: Avatar shows loading state, text remains visible

- **Responsive Behavior**:
  - Desktop: Full name and email display
  - Text scales appropriately for different screen sizes

- **Accessibility Visual**:
  - High contrast text meets WCAG AA standards
  - Text remains readable when truncated

- **Brand Consistency**:
  - Uses design system spacing tokens (space-x-3, space-y-2)
  - Avatar styling consistent with Avatar atom specifications

**Design Definition of Done**:

- [x] Layout options (horizontal/vertical) work correctly
- [x] Text hierarchy creates clear user identification
- [x] Long text truncates gracefully without breaking layout
- [x] Avatar and text alignment is visually balanced
- [x] Color contrast meets accessibility standards
- [x] Responsive behavior maintains usability
- [x] Consistent with other user display components

**Definition of Done**:

- [x] UserInfo component exists with all required files (.tsx, .types.ts, .test.tsx, index.ts)
- [x] Composes Avatar atom with text display correctly
- [x] Supports different layouts (horizontal, vertical)
- [x] Handles text truncation for long names/emails
- [x] Responsive design works across screen sizes
- [x] TypeScript compilation passes without errors
- [x] All 32 tests passing including layout variants and text handling
- [x] Accessible with proper ARIA attributes
- [x] Can be imported from `@/design-system/molecules/UserInfo`

### 4. Organism Components

**🎯 Success Criteria:**

- [x] Users can log in with email/password (using username field)
- [x] User menu appears in header with functional logout
- [x] Components are fully accessible (keyboard navigation, screen readers)

#### 4.1 Create LoginForm Organism

**Priority**: High | **Effort**: High | **Type**: New Feature

Create the main login form organism that orchestrates FormField molecules with authentication logic.

**Specific Actions**:

1. **Create LoginForm Files**:
   - `src/design-system/organisms/LoginForm/LoginForm.tsx` - Main component
   - `src/design-system/organisms/LoginForm/LoginForm.types.ts` - TypeScript definitions
   - `src/design-system/organisms/LoginForm/LoginForm.test.tsx` - Unit tests
   - `src/design-system/organisms/LoginForm/index.ts` - Named exports

2. **Component Implementation**:

   ```tsx
   // src/design-system/organisms/LoginForm/LoginForm.tsx
   import React from 'react';
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { z } from 'zod';
   import { useAuth } from '@/hooks/useAuth';
   import { FormField } from '@/design-system/molecules/FormField';
   import { Button } from '@/design-system/atoms/Button';

   const loginSchema = z.object({
     email: z.string().min(1, 'Email is required').email('Invalid email format'),
     password: z.string().min(6, 'Password must be at least 6 characters'),
   });

   type LoginFormData = z.infer<typeof loginSchema>;

   export type LoginFormProps = {
     onSuccess?: () => void;
     className?: string;
   };

   export const LoginForm = ({ onSuccess, className }: LoginFormProps) => {
     const { login, isAuthenticating } = useAuth();
     const [loginError, setLoginError] = React.useState<string>('');

     const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
       resolver: zodResolver(loginSchema),
     });

     const onSubmit = async (data: LoginFormData) => {
       try {
         setLoginError('');
         await login({ username: data.email, password: data.password });
         onSuccess?.();
       } catch (error) {
         setLoginError('Invalid email or password. Please try again.');
       }
     };

     return (
       <form onSubmit={handleSubmit(onSubmit)} className={className} noValidate>
         <div className="space-y-4">
           <FormField
             {...register('email')}
             name="email"
             label="Email Address"
             type="email"
             placeholder="Enter your email"
             error={errors.email?.message}
             required
             autoComplete="email"
           />

           <FormField
             {...register('password')}
             name="password"
             label="Password"
             type="password"
             placeholder="Enter your password"
             error={errors.password?.message}
             required
             autoComplete="current-password"
           />

           {loginError && (
             <div className="text-sm text-destructive" role="alert">
               {loginError}
             </div>
           )}

           <Button
             type="submit"
             disabled={isAuthenticating}
             className="w-full"
           >
             {isAuthenticating ? 'Signing in...' : 'Sign In'}
           </Button>
         </div>
       </form>
     );
   };
   ```

3. **Integration Requirements**:
   - Use existing `useAuth` hook for authentication
   - Handle loading states during authentication
   - Navigate on successful login (via onSuccess callback)
   - Support proper form validation with Zod schema

**Requirements**:

- Use FormField molecules for email/password inputs (strict atomic design)
- Integrate with React Hook Form for validation
- Use existing `useAuth` hook for login functionality
- Handle loading states during authentication with disabled button
- Display API error messages from authentication failures
- Form validation: email format, password minimum length, required fields
- Accessible form with proper labels, ARIA attributes, and error announcements
- Support autocomplete attributes for password managers
- Proper form submission handling (prevent default, validation)

**Design Requirements**:

- **Visual Style**:
  - Form container with `space-y-4` for clean field separation
  - Full-width submit button (`w-full`) for strong call-to-action
  - Error messages in destructive color (`text-destructive`) with alert role
  - Loading state shows "Signing in..." text and disabled state
  - Consistent padding and spacing throughout form

- **Interaction States**:
  - Normal: Clean, minimal form styling
  - Loading: Button disabled with loading text, form fields remain accessible
  - Error: Global error message displayed prominently above submit button
  - Validation: Real-time field validation with immediate error feedback
  - Focus: Clear focus indicators on all form elements

- **Responsive Behavior**:
  - Full-width form layout for consistent alignment
  - Touch-friendly input targets (minimum 44px height)
  - Button maintains accessible size across all devices
  - Form scales appropriately on mobile and desktop

- **Accessibility Visual**:
  - Clear visual hierarchy: Fields → Error → Submit
  - Error messages visually associated with form
  - High contrast error styling meets WCAG AA standards
  - Loading states clearly communicated to all users

- **Brand Consistency**:
  - Uses design system color tokens for errors and buttons
  - Form styling matches other authentication forms
  - Typography scale aligns with application standards
  - Consistent with global form patterns

**Design Definition of Done**:

- [x] Form spacing creates clear visual hierarchy
- [x] Submit button provides strong visual call-to-action
- [x] Error states are prominently displayed and accessible
- [x] Loading states clearly communicate progress
- [x] Form elements meet minimum touch target sizes
- [x] Visual design matches authentication flow standards
- [x] High contrast ratios meet accessibility requirements

**Definition of Done**:

- [x] LoginForm component exists with all 4 required files
- [x] Uses FormField molecules for email and password inputs
- [x] Integrates with TanStack Form and zod validation (migrated from React Hook Form)
- [x] Uses existing useAuth hook for authentication
- [x] Displays loading state while authenticating
- [x] Shows API error messages for invalid credentials
- [x] Form validation covers email format and password length
- [x] Accessible with proper ARIA labels and error announcements
- [x] Can be imported from `@/design-system/organisms/LoginForm`
- [x] TypeScript compilation passes
- [x] Unit tests cover form submission, validation, and error states
- [x] Supports keyboard navigation and form accessibility
- [x] Integrates with password managers (autocomplete attributes)

#### 4.2 Create UserMenu Organism

**Priority**: High | **Effort**: High | **Type**: New Feature

Create the user dropdown menu for the header.

**File**: `src/design-system/organisms/UserMenu/UserMenu.tsx`

**Requirements**:

- Use DropdownMenu molecule as base
- Use UserInfo molecule for trigger
- Show user's email and avatar in trigger
- Menu items:
  - User email (read-only, disabled item)
  - Separator
  - "Profile" link (future: navigate to profile page)
  - "Logout" button (functional)
- Hover trigger with appropriate delays
- Mobile-friendly (click to open on touch devices)
- Proper positioning (right-aligned)

**Design Requirements**:

- **Visual Style**:
  - Dropdown positioned top-right with subtle shadow (`shadow-lg`)
  - Menu items with consistent padding (`px-3 py-2`)
  - User email styled as muted text (`text-muted-foreground`)
  - Profile link uses default menu item styling
  - Logout button uses destructive color scheme (`text-destructive`)
  - Separator provides clear visual division

- **Interaction States**:
  - Trigger hover: subtle background change or avatar border
  - Menu open: backdrop overlay with appropriate z-index
  - Menu items hover: background highlight (`hover:bg-accent`)
  - Active focus: clear keyboard navigation indicators
  - Mobile: touch-friendly tap targets (minimum 44px)

- **Responsive Behavior**:
  - Desktop: hover to open with delay, click to select
  - Mobile: tap to open, tap to select or tap outside to close
  - Menu width adapts to content but maintains minimum width
  - Proper positioning on small screens (avoid overflow)

- **Accessibility Visual**:
  - Clear visual focus indicators for keyboard navigation
  - Menu items have sufficient contrast ratios
  - Destructive actions (logout) clearly styled in red
  - Disabled items (email) visually distinct but readable

- **Brand Consistency**:
  - Uses design system elevation tokens for dropdown shadow
  - Menu styling matches other dropdown components
  - Color scheme aligns with navigation patterns
  - Avatar styling consistent with other user representations

**Design Definition of Done**:

- [x] Dropdown positioning and shadows match design system
- [x] Menu items have appropriate hover and focus states
- [x] Logout action clearly styled as destructive
- [x] Mobile interaction patterns are touch-friendly
- [x] Keyboard navigation provides clear visual feedback
- [x] Visual hierarchy guides user attention appropriately
- [x] Consistent with other dropdown components in app

**Integration**:

- Use `useAuth` hook for user data and logout function
- Use TanStack Router for navigation

**Definition of Done**:

- [x] UserMenu component exists with all required files (.tsx, .types.ts, .test.tsx, index.ts)
- [x] Uses DropdownMenu molecule as base component
- [x] Uses UserInfo molecule for trigger display
- [x] Shows user's avatar and info in trigger
- [x] Menu items implemented: user email (read-only), profile link, logout button
- [x] Logout button uses variant="destructive" for proper styling
- [x] Mobile-friendly with proper touch targets
- [x] Proper positioning (right-aligned dropdown)
- [x] Integrates with useAuth hook for user data and logout function
- [x] TypeScript compilation passes without errors
- [x] All 8 tests passing including accessibility and keyboard navigation
- [x] Accessible with proper ARIA attributes and keyboard support
- [x] Can be imported from `@/design-system/organisms/UserMenu`

#### 4.3 Create ProfileForm Organism

**Priority**: Medium | **Effort**: High | **Type**: New Feature

Create the profile management form.

**File**: `src/design-system/organisms/ProfileForm/ProfileForm.tsx`

**Requirements**:

- Use FormField molecules for all inputs
- Separate sections for:
  - Personal Information (firstName, lastName, email)
  - Password Change (current password, new password, confirm password)
- Form validation with React Hook Form
- Use profile update mutations
- Success/error message handling
- Save/Cancel buttons
- Dirty state detection (show unsaved changes warning)

**Design Requirements**:

- **Visual Style**:
  - Two-section layout with clear visual separation
  - Section headers: `text-lg font-semibold mb-4` for clear hierarchy
  - Form sections: `space-y-6` for generous section spacing
  - Form fields within sections: `space-y-4` for field separation
  - Action buttons: horizontal layout with `space-x-3` spacing
  - Save button: primary variant, Cancel button: outline variant

- **Interaction States**:
  - Clean state: All fields editable, save button disabled
  - Dirty state: Save button enabled, unsaved changes warning visible
  - Loading state: Form disabled, save button shows loading spinner
  - Success state: Brief success message, form reset to clean state
  - Error state: Section-specific error messages displayed prominently

- **Responsive Behavior**:
  - Mobile: Single column layout with full-width fields
  - Tablet: Maintains single column with better spacing
  - Desktop: Two-column layout for personal info fields when space allows
  - Action buttons: Stack vertically on mobile, horizontal on desktop

- **Accessibility Visual**:
  - Clear section headings provide page structure
  - Password section visually distinct from personal info
  - Unsaved changes warning prominently displayed
  - Error messages clearly associated with relevant sections
  - Success feedback clearly visible and announced

- **Brand Consistency**:
  - Section headers use consistent typography scale
  - Form styling matches other profile management patterns
  - Button styling consistent with form action patterns
  - Color scheme aligns with settings/profile sections

**Design Definition of Done**:

- [x] Two-section layout provides clear information architecture
- [x] Section headers use consistent typography scale (h2/h3 elements)
- [ ] Visual separation between sections (borders, spacing, or background) - *See task 4.4 for enhancement*
- [x] Save button uses primary variant, Cancel button uses outline variant
- [x] Mobile: Single column layout with full-width fields
- [x] Desktop: Proper spacing and alignment for larger screens
- [x] Action buttons stack vertically on mobile, horizontal on desktop
- [x] Form spacing follows design system tokens consistently
- [x] Error states use consistent destructive color tokens
- [x] Success states provide clear visual feedback
- [x] Loading states clearly communicate progress to users

**Definition of Done**:

- [x] ProfileForm component exists with all 4 required files (.tsx, .types.ts, .test.tsx, index.ts)
- [x] Uses FormField molecules for all input fields (strict atomic design hierarchy)
- [x] Two separate form sections: Personal Information and Password Change
- [x] Personal Information section: firstName, lastName, email fields with validation
- [x] Password Change section: currentPassword, newPassword, confirmPassword fields
- [x] Integrates with TanStack Form for consistency with LoginForm organism
- [x] Uses Zod validation schemas for both form sections
- [x] Integrates with profile update mutations (updateProfile, updatePassword)
- [x] Displays loading states during mutation operations
- [x] Shows API error messages for validation and server errors
- [x] Shows success messages for completed updates
- [x] Save/Cancel buttons with proper enabled/disabled states
- [x] Dirty state detection prevents accidental navigation away
- [x] Form validation covers all required fields and formats
- [x] Accessible with proper ARIA labels, headings, and error announcements
- [x] Can be imported from `@/design-system/organisms/ProfileForm`
- [x] TypeScript compilation passes without errors
- [x] Unit tests cover form submission, validation, error states, and accessibility

**✅ COMPLETED**: Task 4.3 ProfileForm implementation is complete with comprehensive visual verification. Component fully functional with TanStack Form integration, proper validation, error handling, and accessibility features. Demo route created at `/profile-demo` for testing. Screenshots captured at all breakpoints confirming responsive design and interaction states.

- [x] Supports keyboard navigation and screen reader compatibility
- [x] Initial data loading from useAuth hook for current user information
- [x] Proper form reset functionality after successful updates
- [x] Mobile-responsive design works across all screen sizes
- [ ] Visual verification completed with Playwright screenshots at all breakpoints
- [x] Section headers create proper visual hierarchy
- [x] Dirty state warning is prominently displayed
- [x] Action buttons provide clear call-to-action hierarchy
- [x] Responsive layout maintains usability across devices
- [x] Error and success states are clearly communicated
- [x] Visual design matches other profile/settings forms

#### 4.4 Enhance Password Section Visual Distinction

**Priority**: Low | **Effort**: Low | **Type**: Enhancement

Enhance the visual distinction between Personal Information and Password Change sections in the ProfileForm component.

**Specific Actions**:

1. **Add Subtle Background Distinction**:
   - Apply subtle background color to Password Change section container
   - Use design system background tokens (e.g., `bg-muted/10` or `bg-secondary/20`)
   - Maintain accessibility contrast ratios

2. **Update ProfileForm Component**:
   - Modify `src/design-system/organisms/ProfileForm/ProfileForm.tsx`
   - Wrap Password Change section in container with background styling
   - Ensure proper padding and spacing maintain visual hierarchy

**Specific Implementation**:

```tsx
// Enhanced Password Change section styling
<div className="space-y-4 p-6 bg-muted/10 rounded-lg border border-border/50">
  <h2 className="text-lg font-semibold">Change Password</h2>
  <p className="text-sm text-muted-foreground mb-4">
    Update your password to keep your account secure.
  </p>
  {/* Password form fields */}
</div>
```

**Requirements**:

- Subtle background that enhances without overwhelming
- Maintains all existing accessibility standards
- Uses design system color tokens consistently
- Preserves responsive behavior across all breakpoints
- Enhances visual hierarchy without disrupting form flow

**Design Requirements**:

- **Visual Style**:
  - Background: Very subtle (`bg-muted/10` or similar low opacity)
  - Border: Optional subtle border (`border-border/50`) for definition
  - Rounded corners: `rounded-lg` for modern feel
  - Padding: `p-6` for comfortable internal spacing
  - Maintains existing typography and spacing within section

- **Interaction States**:
  - Background remains consistent across all form states
  - Focus states on inputs remain unchanged and accessible
  - Error states maintain proper contrast against new background

- **Responsive Behavior**:
  - Background styling adapts to mobile layout gracefully
  - Padding adjusts appropriately for smaller screens (`p-4` on mobile)
  - Maintains visual distinction without breaking mobile UX

- **Accessibility Visual**:
  - Background color meets contrast requirements with text
  - Doesn't interfere with focus indicators or error states
  - Enhances rather than reduces readability

- **Brand Consistency**:
  - Uses design system background tokens
  - Matches styling patterns used elsewhere for section distinction
  - Subtle enough to feel native to the existing design

**Design Definition of Done**:

- [x] Password section has subtle background distinction from Personal Information
- [x] Background uses design system color tokens (bg-muted/10 or similar)
- [x] Visual hierarchy enhanced without overwhelming the form
- [x] All accessibility standards maintained (contrast, focus, etc.)
- [x] Responsive behavior works across all breakpoints
- [x] Styling feels native and consistent with app design language

**Definition of Done**:

- [x] ProfileForm component updated with enhanced Password section styling
- [x] Uses design system background tokens for subtle distinction
- [x] Maintains all existing accessibility standards
- [x] Responsive layout works across mobile, tablet, and desktop
- [x] Visual enhancement improves UX without disrupting functionality
- [x] TypeScript compilation passes without errors
- [x] Existing tests continue to pass
- [x] Visual verification completed with updated screenshots
- [x] Background styling uses appropriate opacity/color values
- [x] Integration with existing form states (error, loading, success)

### 5. Template Components

#### 5.1 Create AuthTemplate ✅ COMPLETED

**Priority**: High | **Effort**: Medium | **Type**: New Feature

Create a template for authentication-related pages.

**Files Created**:

- `src/design-system/templates/AuthTemplate/AuthTemplate.tsx` ✅
- `src/design-system/templates/AuthTemplate/AuthTemplate.types.ts` ✅
- `src/design-system/templates/AuthTemplate/AuthTemplate.test.tsx` ✅
- `src/design-system/templates/AuthTemplate/index.ts` ✅

**Requirements**:

- ✅ Centered layout for auth forms (max-w-md mx-auto)
- ✅ Consistent branding (Tick-Tock logo with Clock icon)
- ✅ Responsive design (px-4 py-8, mobile-first)
- ✅ Background styling consistent with app theme (gradient from-background to-background/95)
- ✅ Support for different form sizes (flexible children prop)
- ✅ Optional navigation links (backLink prop with TanStack Router integration)

**Design Requirements**:

- **Visual Style**:
  - Full viewport height layout (`min-h-screen`) with centered content
  - Main container: `max-w-md mx-auto px-4` for optimal form width
  - Card styling for auth forms with subtle elevation
  - Brand logo prominently displayed above forms
  - Background: subtle gradient or solid color matching app theme
  - Clean, minimal typography hierarchy

- **Interaction States**:
  - Static template with no direct interactions
  - Smooth transitions for content changes
  - Responsive behavior for different screen orientations
  - Support for focus management within contained forms

- **Responsive Behavior**:
  - Mobile: Full-width with appropriate padding (`px-4`)
  - Tablet: Centered with max-width constraints
  - Desktop: Centered with optimal reading width
  - Maintains aspect ratios for branding elements

- **Accessibility Visual**:
  - High contrast between background and content areas
  - Clear visual hierarchy: Logo → Title → Form
  - Sufficient white space for easy scanning
  - Brand elements don't interfere with form accessibility

- **Brand Consistency**:
  - Uses primary brand colors for background/accents
  - Logo sizing and positioning matches brand guidelines
  - Typography scale aligns with brand standards
  - Consistent with overall application visual language

**Design Definition of Done**:

- [x] Centered layout works across all screen sizes
- [x] Brand logo is appropriately sized and positioned
- [x] Background styling enhances rather than distracts
- [x] Form containers have proper visual emphasis
- [x] Layout maintains accessibility and usability
- [x] Visual hierarchy guides user attention effectively
- [x] Consistent with application's overall design language

**Definition of Done**:

- [x] AuthTemplate component exists with all 4 required files (.tsx, .types.ts, .test.tsx, index.ts)
- [x] Centered layout for auth forms with responsive design
- [x] Consistent branding with Tick-Tock logo and Clock icon
- [x] Background styling consistent with app theme (gradient matching Layout)
- [x] Support for different form sizes via children prop
- [x] Optional navigation links (backLink prop) implemented
- [x] Full viewport height layout with centered content
- [x] Card styling with subtle elevation for form containers
- [x] Proper semantic HTML structure (H1 for brand, H2 for page title)
- [x] Optional subtitle and footer content support
- [x] Accessible with proper ARIA semantics and keyboard navigation
- [x] Animation support (animate-fade-in for content entrance)
- [x] Can be imported from `@/design-system/templates/AuthTemplate`
- [x] TypeScript compilation passes without errors
- [x] All 12 tests passing covering all features and edge cases
- [x] Mobile-responsive design with proper touch targets
- [x] Integrates with TanStack Router for navigation
- [x] Exported from main design system index for easy access
- [x] Ready for use in authentication routes (Task 6.1)

#### 5.2 Create ProfileTemplate ✅ COMPLETED

**Priority**: Medium | **Effort**: Medium | **Type**: New Feature

Create a template for profile-related pages.

**Files Created**:

- `src/design-system/templates/ProfileTemplate/ProfileTemplate.tsx` ✅
- `src/design-system/templates/ProfileTemplate/ProfileTemplate.types.ts` ✅
- `src/design-system/templates/ProfileTemplate/ProfileTemplate.test.tsx` ✅
- `src/design-system/templates/ProfileTemplate/index.ts` ✅

**Requirements**:

- ✅ Standard app layout with header integration
- ✅ Sidebar navigation for different profile sections
- ✅ Main content area for forms
- ✅ Breadcrumb navigation with TanStack Router
- ✅ Responsive layout (mobile-first with sidebar collapse)

**Design Requirements**:

- **Visual Style**:
  - Standard app layout using existing Layout component as base
  - Two-column layout: sidebar navigation + main content area
  - Sidebar width: `w-64` on desktop, collapsible on mobile
  - Main content: flexible width with proper padding
  - Breadcrumb navigation for context and navigation
  - Consistent spacing and typography throughout

- **Layout Structure**:
  - Header: Uses existing app header (inherited from Layout)
  - Sidebar: Navigation for profile sections (Account, Security, etc.)
  - Main: Content area for forms and profile information
  - Responsive: Mobile-first approach with proper breakpoints

- **Interaction States**:
  - Sidebar: Active section highlighting
  - Mobile: Collapsible sidebar with hamburger menu
  - Navigation: Smooth transitions between sections
  - Focus management for keyboard navigation

- **Responsive Behavior**:
  - Desktop: Two-column layout with persistent sidebar
  - Tablet: Sidebar remains visible but narrower
  - Mobile: Collapsible sidebar that overlays content
  - Content adapts to available width gracefully

- **Accessibility**:
  - Proper landmark roles (navigation, main, complementary)
  - Skip links for keyboard users
  - ARIA labels for navigation sections
  - Focus management when switching sections

- **Brand Consistency**:
  - Uses existing app layout patterns
  - Consistent with other settings/admin sections
  - Matches navigation patterns used elsewhere
  - Integrates seamlessly with app's visual language

**Navigation Sections**:

- Account: Personal information, basic settings
- Security: Password, authentication settings
- Preferences: App-specific user preferences
- (Future: Notifications, Privacy, etc.)

**Design Definition of Done**:

- [ ] Two-column layout works across all screen sizes
- [ ] Sidebar navigation is properly structured and accessible
- [ ] Main content area adapts to different form sizes
- [ ] Breadcrumb navigation provides clear context
- [ ] Mobile layout gracefully handles sidebar collapse
- [ ] Active section highlighting works correctly
- [ ] Responsive breakpoints maintain usability
- [ ] Layout integrates seamlessly with existing app design

**Definition of Done**:

- [x] ProfileTemplate component exists with all 4 required files (.tsx, .types.ts, .test.tsx, index.ts)
- [x] Uses standard app layout with header integration
- [x] Sidebar navigation for different profile sections implemented
- [x] Main content area for forms with proper spacing
- [x] Breadcrumb navigation component integrated
- [x] Responsive layout works on mobile, tablet, and desktop
- [x] Sidebar collapses properly on mobile devices
- [x] Navigation sections clearly defined and accessible
- [x] Active section highlighting implemented
- [x] Proper ARIA landmarks and accessibility features
- [x] Can be imported from `@/design-system/templates/ProfileTemplate`
- [x] TypeScript compilation passes without errors
- [x] Comprehensive tests covering layout and navigation (25 tests passing)
- [x] Integrates with TanStack Router for section navigation
- [ ] Ready for use in profile routes (Task 6.3)
- [x] Mobile-responsive with proper touch targets
- [x] Focus management for keyboard users

**Testing Accomplishments**:

✅ **Template Testing Patterns Established**: Created comprehensive testing instruction files (`testing-templates.instructions.md`) that codify the successful patterns used for ProfileTemplate testing, including:

- Direct RTL imports approach for template components
- TanStack Router mocking patterns
- Mobile interaction testing strategies
- Common pitfall avoidance (test logic contradictions, multiple element disambiguation)

✅ **Quality Assurance**: All 25 ProfileTemplate tests passing with full coverage of:

- Basic rendering and layout structure
- Sidebar navigation and active states
- Breadcrumb navigation functionality
- Mobile behavior and responsive design
- Content area rendering and accessibility
- ARIA landmarks and keyboard navigation
- Styling and layout responsiveness

✅ **Code Quality**: Resolved all Testing Library linting violations while maintaining test functionality and accessibility standards.

### 6. Route and Authentication Integration

**🎯 Success Criteria:**

- [ ] Unauthenticated users are redirected to login page
- [ ] Profile page allows email, username, and password changes

#### 6.1 Create Login Route

**Priority**: High | **Effort**: Medium | **Type**: New Feature

Create the login page route with proper authentication flow and redirect handling.

**Specific Actions**:

1. **Create Login Route File**:
   - `src/routes/login.tsx` - TanStack Router route definition

2. **Route Implementation**:

   ```tsx
   // src/routes/login.tsx
   import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
   import { AuthTemplate } from '@/design-system/templates/AuthTemplate';
   import { LoginForm } from '@/design-system/organisms/LoginForm';

   type LoginSearchParams = {
     redirect?: string;
   };

   export const Route = createFileRoute('/login')({
     validateSearch: (search: Record<string, unknown>): LoginSearchParams => ({
       redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
     }),
     beforeLoad: ({ context }) => {
       // Redirect authenticated users to dashboard
       if (context.auth.isAuthenticated) {
         throw redirect({ to: '/' });
       }
     },
     component: LoginPage,
   });

   function LoginPage() {
     const navigate = useNavigate();
     const { redirect } = Route.useSearch();

     const handleLoginSuccess = () => {
       // Navigate to intended destination or dashboard
       navigate({ to: redirect || '/' });
     };

     return (
       <AuthTemplate title="Sign In" subtitle="Welcome back to Tick-Tock">
         <LoginForm onSuccess={handleLoginSuccess} />
       </AuthTemplate>
     );
   }
   ```

3. **Integration with Auth Context**:
   - Check authentication state in `beforeLoad`
   - Handle redirect parameter for post-login navigation
   - Integrate with existing auth infrastructure

4. **Route Configuration**:
   - Public route (accessible without authentication)
   - Redirect authenticated users to prevent duplicate login
   - Support return-to-intended-page functionality

**Requirements**:

- Public route accessible without authentication
- Use AuthTemplate + LoginForm composition (atomic design)
- **Template-Based Layout**: Route uses AuthTemplate (no main nav), not conditional Layout
- Redirect authenticated users to dashboard automatically
- Handle login success redirects (return to intended page)
- Support search params for redirect URL
- Integrate with existing auth context via beforeLoad
- Proper TypeScript typing for search parameters
- Clean route structure for internal app navigation
- **Layout Separation**: AuthTemplate provides complete page layout without main app header/navigation

**Definition of Done**:

- [x] Login route exists at `/login` path
- [x] Uses AuthTemplate and LoginForm components
- [x] **Template-Based Layout**: AuthTemplate provides complete page layout (no main app navigation visible)
- [x] Redirects authenticated users to dashboard
- [x] Supports redirect search parameter (?redirect=/intended-page)
- [x] Handles successful login navigation
- [x] Auth context integration pending Task 6.2 (Route Protection)
- [x] TypeScript compilation passes
- [x] Route is accessible without authentication
- [x] Supports keyboard navigation and accessibility
- [x] Mobile-responsive layout via AuthTemplate
- [x] Proper error boundaries for auth failures
- [x] **Layout Separation**: Login page shows no main app header/navigation (clean auth experience)

#### 6.1.1 Create AppTemplate for Main App Routes

**Priority**: High | **Effort**: Medium | **Type**: New Feature

Create an AppTemplate that provides the main app layout with navigation header for authenticated routes.

**Specific Actions**:

1. **Create AppTemplate Files**:
   - `src/design-system/templates/AppTemplate/AppTemplate.tsx` - Main app layout template
   - `src/design-system/templates/AppTemplate/AppTemplate.types.ts` - TypeScript interfaces
   - `src/design-system/templates/AppTemplate/AppTemplate.test.tsx` - Component tests
   - `src/design-system/templates/AppTemplate/index.ts` - Named exports

2. **AppTemplate Implementation**:
   - Move main app header/navigation from Layout component to AppTemplate
   - Provide children slot for page content
   - Include proper authentication-aware header (future UserMenu integration)
   - Responsive design with mobile navigation support

3. **Refactor Existing Routes**:
   - Update dashboard route (`src/routes/index.tsx`) to use AppTemplate
   - Update other main app routes to use AppTemplate instead of relying on Layout

**Requirements**:

- **Template-Based Layout**: Complete page layout including header, navigation, and main content area
- **Navigation Header**: Include main app navigation (Dashboard, About links)
- **Brand Identity**: Logo, title, and tagline in header
- **Responsive Design**: Mobile-friendly navigation and layout
- **Authentication Ready**: Structure prepared for UserMenu integration (Task 6.4)
- **Content Area**: Proper main content container with consistent spacing
- **Accessibility**: Proper landmark structure (header, nav, main)
- **Future Extension**: Easy integration point for user menu and auth-specific navigation

**Design Requirements**:

- **Visual Style**:
  - Header: `border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40`
  - Container: `container mx-auto px-4 py-4` for consistent spacing
  - Main content: `container mx-auto px-4 py-6` for content area

- **Interaction States**:
  - Navigation links: hover and active states with animated underlines
  - Logo: subtle pulse animation maintained

- **Responsive Behavior**:
  - Tagline hidden on small screens (`hidden sm:inline`)
  - Navigation adapts to mobile layouts

- **Accessibility Visual**:
  - Clear visual hierarchy: Logo → Navigation → Content
  - Focus indicators for all interactive elements

- **Brand Consistency**:
  - Maintains existing Tick-Tock branding and styling
  - Consistent with current header design patterns

**Definition of Done**:

- [x] AppTemplate component exists with all 4 required files (.tsx, .types.ts, .test.tsx, index.ts)
- [x] Template includes complete header with logo, title, and navigation
- [x] Main content area with proper container and spacing
- [x] Responsive design works across all screen sizes
- [x] Navigation links maintain existing styling and behavior
- [x] TypeScript compilation passes without errors
- [ ] Component tests cover layout structure and navigation
- [x] Can be imported from `@/design-system/templates/AppTemplate`
- [x] Ready for UserMenu integration in navigation header
- [x] Accessible with proper landmark structure (header, nav, main)
- [x] Dashboard route updated to use AppTemplate
- [x] Other main app routes updated to use AppTemplate

#### 6.1.2 Simplify Layout Component

**Priority**: High | **Effort**: Low | **Type**: Refactor

Simplify the Layout component to minimal routing shell since templates now handle layout.

**Specific Actions**:

1. **Simplify Layout**:
   - Remove conditional authentication route logic
   - Remove header/navigation (moved to AppTemplate)
   - Provide minimal container for `<Outlet />`

2. **Clean Implementation**:

   ```tsx
   // src/routes/-layout/Layout.tsx
   export const Layout = () => {
     return (
       <div className="min-h-screen">
         <Outlet />
       </div>
     );
   };
   ```

**Requirements**:

- **Minimal Shell**: Simple container for route outlet
- **No Layout Logic**: Templates handle all layout concerns
- **Clean Separation**: Layout is just routing infrastructure

**Definition of Done**:

- [x] Layout component simplified to minimal outlet container
- [x] No conditional logic for auth routes
- [x] No header/navigation in Layout (moved to AppTemplate)
- [x] TypeScript compilation passes
- [x] All routes continue to work with simplified Layout
- [x] Clean separation between routing and layout concerns

#### 6.2 Implement Route Protection

**Priority**: High | **Effort**: High | **Type**: Enhancement

Add authentication checks to protect routes.

**Files to modify**:

- `src/routes/__root.tsx`
- All existing routes that need protection

**Requirements**:

- Add auth context to route context
- Implement `beforeLoad` guards on protected routes
- Redirect unauthenticated users to `/login`
- Preserve intended destination for post-login redirect
- Handle loading states during auth checks

**Root route enhancement**:

```tsx
// src/routes/__root.tsx
export const Route = createRootRoute({
  beforeLoad: ({ context }) => {
    // Add auth to context for all routes
    return {
      auth: context.auth,
    };
  },
  component: RootComponent,
});
```

**Protected route example**:

```tsx
export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: '/' } });
    }
  },
  component: DashboardPage,
});
```

**Definition of Done**:

- [ ] Root route (`src/routes/__root.tsx`) enhanced with auth context
- [ ] Auth context available to all child routes
- [ ] Dashboard route (`src/routes/index.tsx`) protected with beforeLoad guard
- [ ] Unauthenticated users redirected to `/login` with redirect parameter
- [ ] Redirect parameter preserves intended destination (e.g., `?redirect=/dashboard`)
- [ ] Post-login redirect works correctly (users return to intended page)
- [ ] Loading states handled during authentication checks
- [ ] TypeScript compilation passes without errors
- [ ] All protected routes implement consistent beforeLoad pattern
- [ ] Authentication flow works end-to-end: login → redirect → access granted
- [ ] Manual testing confirms protection works (try accessing protected routes while logged out)
- [ ] Integration with existing auth context maintains all functionality

#### 6.3 Create Profile Route

**Priority**: Medium | **Effort**: Medium | **Type**: New Feature

Create the profile management page.

**File**: `src/routes/profile.tsx`

**Requirements**:

- Protected route (authentication required)
- Use ProfileTemplate + ProfileForm
- Handle form submission and updates
- Success/error messaging
- Navigation back to main app

**Definition of Done**:

- [ ] Profile route exists at `/profile` path
- [ ] Route is protected (requires authentication)
- [ ] Uses AppTemplate for consistent layout with main app
- [ ] ProfileForm organism integrated and functional
- [ ] Form submission updates user profile successfully
- [ ] Success messages displayed after successful updates
- [ ] Error messages displayed for validation failures or API errors
- [ ] Navigation back to main app works (breadcrumb, back button, or menu)
- [ ] Route integrates with route protection from Task 6.2
- [ ] TypeScript compilation passes without errors
- [ ] Form validation prevents invalid submissions
- [ ] Profile updates reflect in UserMenu and other user displays
- [ ] Mobile-responsive design maintains usability
- [ ] Accessible with proper focus management and ARIA labels

#### 6.4 Update Layout Component with UserMenu

**Priority**: High | **Effort**: Medium | **Type**: Enhancement

Integrate UserMenu into the main layout header.

**File**: `src/routes/-layout/Layout.tsx`

**Requirements**:

- Add UserMenu to header (top-right position)
- Show only when user is authenticated
- Update header layout to accommodate user menu
- Maintain responsive design
- Update navigation structure

**Layout update**:

```tsx
export const Layout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Existing logo and title */}
            </div>
            <div className="flex items-center gap-6">
              <nav>
                {/* Existing navigation */}
              </nav>
              {isAuthenticated && <UserMenu />}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
```

**Definition of Done**:

- [ ] UserMenu component integrated into Layout header (top-right position)
- [ ] UserMenu only visible when user is authenticated (`isAuthenticated` check)
- [ ] Header layout updated to accommodate UserMenu without breaking existing design
- [ ] Navigation structure maintains proper spacing and alignment
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] UserMenu displays user avatar and information correctly
- [ ] Dropdown menu functions properly (open/close, keyboard navigation)
- [ ] Logout functionality works from UserMenu
- [ ] Profile navigation link works from UserMenu (when Task 6.3 complete)
- [ ] TypeScript compilation passes without errors
- [ ] Visual integration matches design system patterns
- [ ] No layout shifts or visual bugs when UserMenu appears/disappears
- [ ] Accessibility maintained (proper focus management, ARIA attributes)
- [ ] Cross-browser compatibility verified

### 7. Hooks and State Management

#### 7.1 Create useProfile Hook

**Priority**: Medium | **Effort**: Medium | **Type**: New Feature

Create a custom hook for profile management operations.

**File**: `src/hooks/useProfile/useProfile.ts`

**Requirements**:

- Encapsulate profile update logic
- Use TanStack Query for caching
- Handle optimistic updates
- Error handling and rollback
- Integration with existing auth context

**API**:

```tsx
export const useProfile = () => {
  const updateProfile = useMutation({
    mutationFn: profileActions.updateProfile,
    onSuccess: () => {
      // Update auth context
      // Show success message
    },
  });

  const updatePassword = useMutation({
    mutationFn: profileActions.updatePassword,
    onSuccess: () => {
      // Show success message
      // Clear form
    },
  });

  return {
    updateProfile,
    updatePassword,
    isUpdatingProfile: updateProfile.isPending,
    isUpdatingPassword: updatePassword.isPending,
  };
};
```

### 8. Testing Implementation

**🎯 Success Criteria:**

- [ ] Tests provide good coverage of authentication flows
- [ ] Error handling is robust and user-friendly

#### 8.1 Component Tests

**Priority**: Medium | **Effort**: High | **Type**: Quality Assurance

Create comprehensive tests for all new components.

**Requirements for each component**:

- Unit tests with Testing Library
- Accessibility tests (screen reader compatibility)
- User interaction tests (keyboard navigation, form submission)
- Error state testing
- Loading state testing

**Key test files**:

- `LoginForm.test.tsx` - Form validation, submission, error handling
- `UserMenu.test.tsx` - Dropdown behavior, logout functionality
- `ProfileForm.test.tsx` - Form updates, validation, success/error states

#### 8.2 Integration Tests

**Priority**: Medium | **Effort**: Medium | **Type**: Quality Assurance

Create integration tests for authentication flow.

**File**: `e2e/tests/auth.test.ts`

**Test scenarios**:

- Complete login flow
- Logout functionality
- Route protection
- Profile updates
- Password changes

#### 8.3 MSW Mock Tests

**Priority**: Low | **Effort**: Low | **Type**: Quality Assurance

Ensure MSW mocks work correctly with new endpoints.

**Requirements**:

- Test all auth endpoints
- Verify error responses
- Test data persistence within session

### 9. Documentation and Migration

#### 9.1 Update Component Documentation

**Priority**: Low | **Effort**: Low | **Type**: Documentation

Document the new atomic design components.

**Requirements**:

- Storybook stories for all components (future enhancement)
- Usage examples in component files
- Props documentation with TypeScript types
- Integration examples

#### 9.2 Create Migration Guide

**Priority**: Low | **Effort**: Low | **Type**: Documentation

Document the migration from legacy components to new design system.

**File**: `docs/design-system-migration.md`

**Content**:

- Import path changes
- API differences
- Migration timeline
- Codemods for automated migration (future)

### 10. Error Handling and Edge Cases

#### 10.1 Implement Global Error Boundaries

**Priority**: Medium | **Effort**: Medium | **Type**: Quality Assurance

Add error boundaries for authentication-related errors.

**Requirements**:

- Catch and handle auth token expiration
- Network error handling
- Graceful degradation
- User-friendly error messages

#### 10.2 Handle Authentication Edge Cases

**Priority**: Medium | **Effort**: Medium | **Type**: Quality Assurance

Address various authentication scenarios.

**Scenarios**:

- Concurrent login sessions
- Token refresh failures
- Network connectivity issues
- Invalid credentials handling
- Session timeout warnings

## Technical Notes

1. **Email vs Username**: The current system uses `username` field but the user requested email-based auth. For backward compatibility, we're using the email as the username value in the MSW mock. ✅

2. **Design System Migration**: This implementation serves as a pilot for the full migration from `src/components/ui/` to `src/design-system/`. Other components can follow these patterns. ✅

3. **State Management**: We're leveraging existing AuthContext rather than rebuilding auth state management. ✅

4. **TanStack Form Migration**: Successfully migrated from React Hook Form to TanStack Form for modern form management. ✅

5. **Form Instructions**: Created comprehensive TanStack Form instruction file for GitHub Copilot guidance. ✅

6. **Accessibility**: All components must meet WCAG 2.1 AA standards with proper ARIA labels, keyboard navigation, and screen reader support. ✅

7. **Testing Strategy**: Component tests focus on behavior, integration tests cover user flows, and E2E tests verify the complete authentication experience. ✅

This comprehensive implementation will provide a solid foundation for user authentication while establishing patterns for the ongoing atomic design migration.
