# Tick-Tock MVP - Time Logging Made Simple

## Project Overview

**Tick-Tock** is an intelligent time logging application that solves the real developer pain point of tracking time
spent on tasks and meetings. Instead of complex time tracking interfaces, developers simply write natural language
messages (like a journal entry) that include Jira task IDs, and the system intelligently converts these into structured
time logs.

## Core Value Proposition

- **Natural Language Input**: Write time logs as simple messages instead of filling complex forms
- **Intelligent Processing**: Backend automatically parses messages and creates structured time entries
- **Draft-First Approach**: All logs start as drafts, giving users control before committing to Jira
- **Visual Calendar Dashboard**: Clear overview of logging status across working days
- **Seamless Jira Integration**: Direct synchronization with Jira time tracking via REST API

## User Journey

### Primary Flow: Logging Today's Work

1. User clicks "Log Today's Work" from dashboard
2. User writes a natural message like: "Worked on XYZ-1111 for 3 hours implementing authentication, had 1 hour meeting
   with team about XYZ-2222 planning"
3. Backend processes message and creates draft time entries
4. User reviews draft entries in clean interface
5. User has two options:
   - **🚀 Ship It** (green button): Send logs to Jira and mark as "logged"
   - **🧐 Refine** (blue button): Request modifications to the time log

### Refinement Flow

1. User clicks "🧐 Refine" button
2. Screen scrolls to show message input with prompt: "Describe what changes should be made to today's time log"
3. User writes refinement request (e.g., "Split the XYZ-1111 task into 2 hours for coding and 1 hour for testing")
4. Backend processes refinement and generates new draft
5. User can repeat until satisfied, then use "🚀 Ship It"

## Core Features

### 1. Dashboard (Calendar View)

- **Default View**: Current month with today's date highlighted
- **Status Color Coding**:
  - 🟠 Orange: Working days with no logs (needs attention)
  - 🔵 Blue: Days with draft logs (pending review)
  - 🟢 Green: Days with logged entries (completed)
- **Quick Action**: Prominent "Log Today's Work" button
- **Navigation**: Click any day to view/edit that day's logs

### 2. Time Log Input Interface

- **Clean Text Area**: Large, friendly input for natural language messages
- **Jira ID Validation**: Real-time highlighting/validation of task IDs (XYZ-NNNN format)
- **Example Prompts**: Helpful examples of how to format messages
- **Character Counter**: Optional word/character count for user awareness

### 3. Draft Review Interface

- **Structured Display**: Clean presentation of parsed time entries
- **Entry Details**: Task ID, description, duration, time period
- **Action Buttons**:
  - 🚀 **Ship It**: Large, prominent green button with encouraging random messages
  - 🧐 **Refine**: Smaller, interesting blue button for modifications
- **Status Indicators**: Clear visual feedback of current state

### 4. Refinement Interface

- **Contextual Input**: Message box with clear instructions
- **Previous Context**: Display current draft for reference
- **Processing Feedback**: Loading states and confirmation messages

## Technical Architecture

### Frontend (React 19 + TypeScript)

- **Component Structure**:
  - Dashboard with calendar grid
  - Time log input form with validation
  - Draft review cards with action buttons
  - Refinement modal/interface
- **State Management**: TanStack Query for server state, React 19 actions for form handling
- **Routing**: TanStack Router for navigation between dashboard and log views
- **Styling**: TailwindCSS 4 + ShadCN/UI components
- **Development**: MSW for API mocking during development

### Backend (Node.js + Express 5)

- **Message Processing**: NLP service to parse natural language into structured time entries
- **Jira Integration**: REST API client using user's API token
- **Database Schema**:
  - Users (with Jira credentials)
  - Time logs (with status: draft/logged)
  - Refinement history
- **Data Persistence**: TypeORM + PostgreSQL
- **Infrastructure**: Docker + docker-compose for development

## Data Models

### Time Log Entry

```typescript
interface TimeLogEntry {
  id: string;
  userId: string;
  date: Date;
  jiraTaskId: string;
  description: string;
  duration: number; // minutes
  status: 'draft' | 'logged';
  originalMessage: string;
  refinementHistory?: string[];
  createdAt: Date;
  loggedAt?: Date;
}
```

### User

```typescript
interface User {
  id: string;
  email: string;
  jiraApiToken: string;
  jiraBaseUrl: string;
  preferences: {
    defaultWorkingHours: number;
    timezone: string;
  };
}
```

## API Endpoints

### Core Endpoints

- `POST /api/time-logs/parse` - Parse natural language message into draft entries
- `POST /api/time-logs/refine` - Refine existing draft based on user feedback
- `POST /api/time-logs/ship` - Send draft logs to Jira and update status
- `GET /api/time-logs/calendar/:month` - Get calendar data for dashboard
- `GET /api/time-logs/day/:date` - Get specific day's logs

### Jira Integration

- `GET /api/jira/validate-token` - Validate user's Jira API token
- `POST /api/jira/log-time` - Send time entry to Jira
- `GET /api/jira/tasks/:taskId` - Validate task ID exists

## Success Metrics

### User Experience

- Time from idea to logged entry < 2 minutes
- Refinement cycles average < 2 iterations
- User satisfaction with parsing accuracy > 90%

### Technical Performance

- Message parsing response time < 3 seconds
- Jira API integration success rate > 95%
- Dashboard load time < 1 second

## Development Phases

### Phase 1: Core MVP

- Basic dashboard with calendar view
- Simple time log input and parsing
- Draft review with ship/refine actions
- Mocked Jira integration for PoC

### Phase 2: Jira Integration

- Real Jira API integration
- User authentication and token management
- Error handling and retry logic

### Phase 3: Enhancement

- Advanced parsing with AI/ML
- Team collaboration features
- Analytics and reporting
- Mobile responsiveness

## Risks & Considerations

### Technical Risks

- **Parsing Accuracy**: Natural language processing may not capture user intent perfectly
- **Jira API Limits**: Rate limiting and token management complexity
- **User Adoption**: Learning curve for effective message writing

### Mitigation Strategies

- Start with simple pattern matching, evolve to AI
- Implement proper caching and batch operations
- Provide clear examples and real-time feedback

## PoC Development Scenarios

### Scenario 1: First-Time User

1. Show empty dashboard (orange days indicating no logs)
2. Click "Log Today's Work"
3. Enter: "Worked on PROJ-123 for 4 hours fixing authentication bugs, 30 min standup for PROJ-124"
4. Show parsed draft entries
5. Click "🚀 Ship It" to complete

### Scenario 2: Refinement Flow

1. Show existing draft
2. Click "🧐 Refine"
3. Enter: "Actually, split the 4 hours into 3 hours for bug fixing and 1 hour for code review"
4. Show updated draft
5. Ship the refined version

This MVP description provides a clear foundation for task breakdown and development.
