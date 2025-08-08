# Frontend Development Tasks - Tick-Tock MVP

## Project Overview

This document outlines the frontend development tasks for the Tick-Tock MVP, based on the specifications in `mvp.md`.
All tasks use MSW (Mock Service Worker) for API mocking during development.

## Tech Stack Integration

- **React 19**: Components, hooks, actions, and transitions
- **TypeScript**: Full type safety and strict m## Development Tasks Overview

### 🧹 Immediate Cleanup Required

**Before starting MVP development**, remove all boilerplate routes and components that are not part of the Tick-Tock MVP:

- **Remove**: Demo, About, Users, Help routes (not in MVP spec)
- **Update**: Layout component to reflect Tick-Tock branding instead of React starter
- **Create**: Missing routes for `/log-entry` and `/day/$date`
- **Convert**: Home component to proper Dashboard with calendar grid

### 🚀 PoC Enhancement Options ✅ COMPLETED

**Enhanced UI Components & Modern Features** - COMPLETED

- [x] **Progress Bars** - Added ShadCN Progress component for dashboard stats
- [x] **Tooltips** - Added ShadCN Tooltip component for interactive help
- [x] **Alerts** - Added ShadCN Alert component for user feedback
- [x] **Calendar Component** - ✅ **ENHANCED**: Advanced Split-View Calendar with inline details implemented
- [x] **TailwindCSS 4 Animations** - Added custom keyframe animations and transitions
- [x] **Badge Components** - Enhanced dashboard with status badges
- [x] **Responsive Design** - Mobile-first layout with backdrop blur effects

**✅ ACCOMPLISHED**: Dashboard enhanced with modern UI components, animations, TailwindCSS 4 features, and advanced Split-View Calendar implementation. Core calendar functionality completed with innovative design solutions.

**Tech Stack Integration**:

- **TanStack Router**: File-based routing with type-safe navigation
- **TanStack Query**: Server state management with MSW integration
- **TailwindCSS 4**: Modern styling with CSS variables
- **ShadCN/UI**: Component library for consistent design
- **MSW**: API mocking for all backend interactions

---

## Phase 1: Core MVP Features (Priority Tasks)

### 🧹 Cleanup & Foundation (Priority: High)

#### 0. Remove Boilerplate Routes & Layout ✅ COMPLETED

**Priority**: High | **Effort**: Small | **PoC Value**: Medium

- [x] Remove unnecessary boilerplate routes:
  - Delete `/demo` route and `ShadcnDemo` component
  - **Keep `/about` but update content** to describe Tick-Tock + tech stack
  - Delete `/users` routes and `UsersList`/`User` components
  - Delete `/help` route and `Help` component
- [x] Clean up main layout:
  - Remove React/Vite branding from header
  - Replace generic navigation with Tick-Tock appropriate nav
  - Update layout styling for time tracking app
  - Remove boilerplate CSS classes and styling
- [x] Update home route to be the dashboard
- [x] **Testing**: Ensure removed routes don't break navigation

**✅ COMPLETED**: All boilerplate routes removed, layout updated with Tick-Tock branding, home converted to dashboard with enhanced UI components.

**Files to delete**:

- `src/routes/demo.tsx`
- `src/routes/-components/ShadcnDemo.tsx`
- `src/routes/users/` (entire folder)
- `src/routes/help/` (entire folder)

**Files to modify**:

- `src/routes/-layout/Layout.tsx` (complete rewrite for Tick-Tock)
- `src/routes/-layout/Layout.css` (update styling)
- `src/routes/-components/Home.tsx` (convert to Dashboard)
- `src/routes/about/-components/About.tsx` (update to describe Tick-Tock + keep tech stack)

### 🎯 Essential Features

#### 1. Dashboard Calendar Grid ✅ COMPLETED

**Priority**: High | **Effort**: Medium | **PoC Value**: High

- [x] Create `Calendar` component with monthly grid layout ✅ ShadCN Calendar component created
- [x] Implement date navigation (previous/next month) ✅ Month-based navigation implemented
- [x] Add today's date highlighting ✅ Current day highlighting implemented
- [x] Implement status color coding system:
  - 🟠 Orange: No logs (working days only) ✅ Implemented
  - 🔵 Blue: Draft logs exist ✅ Implemented
  - 🟢 Green: Logs completed ✅ Implemented
- [x] Add responsive design for mobile/desktop ✅ Responsive split-view layout
- [x] **MSW**: Mock calendar data API endpoint ✅ Integrated with existing hooks
- [ ] **Testing**: Unit tests for date calculations and status display

**✅ COMPLETED**: Advanced Split-View Calendar implemented with full month view, inline day details, status color coding, consistent height management, Monday-first week layout, and integrated directly into homepage dashboard.

**Enhanced Implementation**:
- **Split-View Layout**: Two-column design with month calendar + day details panel
- **Inline Details**: Click any day to see details without navigation
- **Height Consistency**: Fixed height layout preventing layout shifts
- **Parent-Controlled Sizing**: Configurable height via props
- **Calendar Solutions Demo**: Reference implementation with 3 different calendar approaches preserved

**Files created/modified**:
- `src/components/dashboard/SplitViewCalendar.tsx` ✅ Created
- `src/components/dashboard/CalendarSolutionsDemo.tsx` ✅ Created
- `src/routes/-components/Home.tsx` ✅ Updated to use SplitViewCalendar
- `src/routes/calendar-solutions.tsx` ✅ Demo route for reference

#### 2. Create Missing Routes for MVP

**Priority**: High | **Effort**: Small | **PoC Value**: High

- [ ] Create `/log-entry` or `/log-today` route for time log input
- [ ] Create `/day/$date` route for day detail view
- [ ] Update route tree generation and navigation
- [ ] Add proper TypeScript route typing
- [ ] **Testing**: Route navigation and parameter handling

**Files to create**:

- `src/routes/log-entry.tsx` (or `log-today.tsx`)
- `src/routes/day/$date.tsx`
- Update `src/routeTree.gen.ts`

#### 3. "Log Today's Work" Button & Navigation ✅ COMPLETED

**Priority**: High | **Effort**: Small | **PoC Value**: Medium

- [x] Add prominent CTA button to dashboard ✅ Implemented with tooltip
- [x] Implement TanStack Router navigation to log entry page ✅ Routes to `/log-entry`
- [x] Add hover effects and loading states ✅ Hover animations implemented
- [x] Ensure button accessibility (ARIA labels, keyboard navigation) ✅ Tooltips and proper ARIA
- [x] **MSW**: No additional mocking needed ✅ Navigation working
- [ ] **Testing**: Navigation and accessibility tests

**✅ COMPLETED**: Prominent "Log Today's Work" button integrated into homepage header with tooltip, hover effects, TanStack Router navigation, and accessibility features.

**Files created/modified**:
- `src/routes/-components/Home.tsx` ✅ CTA button integrated in header

#### 4. Time Log Input Interface

**Priority**: High | **Effort**: Medium | **PoC Value**: High

- [ ] Create natural language input form with large text area
- [ ] Implement Jira ID pattern detection and highlighting
- [ ] Add example prompts and helper text
- [ ] Character/word counter component
- [ ] Form validation with React 19 form actions
- [ ] Loading states during "parsing"
- [ ] **MSW**: Mock message parsing API endpoint
- [ ] **Testing**: Form validation and submission tests

**Files to create/modify**:

- `src/components/log-entry/MessageInput.tsx`
- `src/components/log-entry/JiraIdHighlighter.tsx`
- `src/components/log-entry/ExamplePrompts.tsx`
- `src/api/mocks/parsing.handlers.ts`

#### 5. Draft Review Interface

**Priority**: High | **Effort**: Medium | **PoC Value**: High

- [ ] Create draft time entries display cards
- [ ] Implement "🚀 Ship It" button with random encouraging messages
- [ ] Implement "🧐 Refine" button with modal/expansion
- [ ] Add entry details (task ID, description, duration)
- [ ] Status indicators and visual feedback
- [ ] Smooth animations between states
- [ ] **MSW**: Mock draft creation and refinement endpoints
- [ ] **Testing**: User interaction and state management tests

**Files to create/modify**:

- `src/components/log-entry/DraftReview.tsx`
- `src/components/log-entry/TimeEntryCard.tsx`
- `src/components/log-entry/ShipItButton.tsx`
- `src/components/log-entry/RefineButton.tsx`

---

## Phase 2: Full MVP Implementation

### 🏗️ Core Application Structure

#### 6. Application Layout & Navigation

**Priority**: Medium | **Effort**: Medium | **PoC Value**: Medium

- [ ] Create main app layout with navigation
- [ ] Implement responsive sidebar/header
- [ ] Add breadcrumb navigation
- [ ] User profile dropdown (mocked user)
- [ ] Dark/light mode toggle (bonus for PoC enhancement)
- [ ] **MSW**: Mock user profile endpoint
- [ ] **Testing**: Layout responsiveness and navigation

**Files to create/modify**:

- `src/components/layout/AppLayout.tsx`
- `src/components/layout/Navigation.tsx`
- `src/components/layout/UserProfile.tsx`

#### 7. Refinement Interface

**Priority**: Medium | **Effort**: Medium | **PoC Value**: High

- [ ] Create refinement input modal/page
- [ ] Display current draft context
- [ ] Implement refinement message input
- [ ] Show processing states and feedback
- [ ] Handle multiple refinement cycles
- [ ] Success/error messaging
- [ ] **MSW**: Mock refinement processing endpoint
- [ ] **Testing**: Modal behavior and refinement flow

**Files to create/modify**:

- `src/components/log-entry/RefinementModal.tsx`
- `src/components/log-entry/RefinementInput.tsx`

#### 8. Calendar Day Detail View

**Priority**: Medium | **Effort**: Small | **PoC Value**: Medium

- [ ] Create day detail page/modal
- [ ] Display all entries for selected day
- [ ] Edit/delete draft entries
- [ ] View logged entries (read-only)
- [ ] Navigation between days
- [ ] **MSW**: Mock day-specific data endpoint
- [ ] **Testing**: Day navigation and data display

**Files to create/modify**:

- `src/routes/day/$date.tsx`
- `src/components/day-detail/DayView.tsx`

### 🔧 State Management & Data Flow

#### 9. TanStack Query Integration

**Priority**: High | **Effort**: Medium | **PoC Value**: Low

- [ ] Set up query client with proper caching
- [ ] Create custom hooks for all API calls:
  - `useCalendarData(month)`
  - `useParseMessage()`
  - `useRefineEntry()`
  - `useShipEntry()`
  - `useDayEntries(date)`
- [ ] Implement optimistic updates for better UX
- [ ] Error boundary integration
- [ ] **MSW**: Ensure all endpoints return proper data structures
- [ ] **Testing**: Query hook behavior and caching

**Files to create/modify**:

- `src/hooks/useCalendarData.ts`
- `src/hooks/useParseMessage.ts`
- `src/hooks/useRefineEntry.ts`
- `src/hooks/useShipEntry.ts`
- `src/hooks/useDayEntries.ts`

#### 10. MSW API Mocking Setup

**Priority**: High | **Effort**: Medium | **PoC Value**: Low

- [ ] Set up comprehensive MSW handlers for all endpoints:
  - `GET /api/time-logs/calendar/:month`
  - `POST /api/time-logs/parse`
  - `POST /api/time-logs/refine`
  - `POST /api/time-logs/ship`
  - `GET /api/time-logs/day/:date`
  - `GET /api/jira/validate-token`
- [ ] Create realistic mock data generators
- [ ] Implement artificial delays for realistic UX
- [ ] Add error scenarios for testing
- [ ] **Testing**: Mock data consistency and edge cases

**Files to create/modify**:

- `src/api/mocks/handlers.ts`
- `src/api/mocks/data/calendar.ts`
- `src/api/mocks/data/timeEntries.ts`
- `src/api/mocks/data/users.ts`

### 🎨 UI/UX Polish

#### 11. Design System Integration

**Priority**: Medium | **Effort**: Small | **PoC Value**: Medium

- [ ] Set up ShadCN/UI theme configuration
- [ ] Create custom component variants
- [ ] Implement consistent spacing and typography
- [ ] Add loading skeletons for all data states
- [ ] Implement proper focus management
- [ ] **Testing**: Visual regression tests

**Files to create/modify**:

- `src/components/ui/LoadingSkeleton.tsx`
- `tailwind.config.ts` updates

#### 12. Error Handling & User Feedback

**Priority**: Medium | **Effort**: Small | **PoC Value**: Low

- [ ] Create error boundary components
- [ ] Implement toast notifications for actions
- [ ] Add form validation feedback
- [ ] Network error handling with retry options
- [ ] Empty states for all data views
- [ ] **MSW**: Error scenario handlers
- [ ] **Testing**: Error state coverage

**Files to create/modify**:

- `src/components/ui/ErrorBoundary.tsx`
- `src/components/ui/Toast.tsx`
- `src/components/ui/EmptyState.tsx`

---

## Phase 3: Enhancement & Polish

### 🚀 Advanced Features

#### 13. Keyboard Shortcuts & Accessibility

**Priority**: Low | **Effort**: Medium | **PoC Value**: Medium

- [ ] Implement keyboard navigation for calendar
- [ ] Add shortcuts for common actions (Ctrl+Enter to ship, etc.)
- [ ] Ensure WCAG 2.1 AA compliance
- [ ] Screen reader support
- [ ] Focus trap management in modals
- [ ] **Testing**: Accessibility automated tests

#### 14. Animations & Micro-interactions

**Priority**: Low | **Effort**: Small | **PoC Value**: High

- [ ] Add smooth transitions between states
- [ ] Implement hover effects and button animations
- [ ] Calendar date selection animations
- [ ] Draft card flip/slide animations
- [ ] Loading state animations
- [ ] **Testing**: Animation performance tests

#### 15. Mobile Optimization

**Priority**: Low | **Effort**: Medium | **PoC Value**: Medium

- [ ] Touch-friendly calendar navigation
- [ ] Mobile-optimized input interfaces
- [ ] Swipe gestures for navigation
- [ ] Responsive text sizing
- [ ] Mobile-specific layouts
- [ ] **Testing**: Mobile device testing

---

## Testing & Quality Assurance

### 🧪 Testing Strategy

#### 16. Unit Testing

**Priority**: Medium | **Effort**: Medium | **PoC Value**: Low

- [ ] Component testing with React Testing Library
- [ ] Hook testing for custom query hooks
- [ ] Utility function tests
- [ ] MSW integration tests
- [ ] Achieve >80% code coverage
- [ ] **Files**: `*.test.tsx` for all components

#### 17. Integration Testing

**Priority**: Medium | **Effort**: Medium | **PoC Value**: Low

- [ ] Full user flow testing
- [ ] API integration tests with MSW
- [ ] Router navigation tests
- [ ] Form submission end-to-end tests
- [ ] **Files**: `src/tests/integration/`

#### 18. E2E Testing Setup

**Priority**: Low | **Effort**: Medium | **PoC Value**: Low

- [ ] Playwright test configuration
- [ ] Critical path testing scenarios
- [ ] Cross-browser compatibility tests
- [ ] **Files**: `e2e/` directory tests

---

## Development Setup & Deployment

### 🔧 Development Tools

#### 19. Development Environment

**Priority**: High | **Effort**: Small | **PoC Value**: Low

- [ ] Hot reload configuration
- [ ] ESLint and Prettier setup validation
- [ ] TypeScript strict mode configuration
- [ ] Development scripts optimization
- [ ] **Files**: Configuration files

#### 20. Build & Deployment

**Priority**: Low | **Effort**: Small | **PoC Value**: Low

- [ ] Production build optimization
- [ ] Bundle size analysis setup
- [ ] Static asset optimization
- [ ] Environment variable configuration
- [ ] **Files**: Build configuration

---

## Development Tasks Overview

### � PoC Enhancement Options

1. **Add Dark Mode Toggle** - Quick theme implementation
2. **Implement Calendar Colors** - Visual status indication
3. **Add Form Validation** - Real-time input feedback
4. **Create Loading Animations** - UX polish
5. **Add Keyboard Shortcuts** - Power user features
6. **Implement Toast Notifications** - User feedback system

### 🔧 Development Preparation

- [ ] Set up calendar grid with mock data
- [ ] Prepare several parsing examples
- [ ] Set up multiple draft states for testing
- [ ] Test all MSW endpoints work consistently
- [ ] Validate application build and deployment

---

## Notes

- **All API calls use MSW**: No real backend dependency during development
- **TypeScript strict mode**: Ensure type safety throughout
- **Mobile-first design**: Start responsive, scale up
- **Accessibility focus**: WCAG compliance from the start
- **Performance conscious**: Monitor bundle size and Core Web Vitals

## Task Estimation Legend

- **Small**: Quick implementation
- **Medium**: Standard development task
- **Large**: Complex feature requiring significant effort
