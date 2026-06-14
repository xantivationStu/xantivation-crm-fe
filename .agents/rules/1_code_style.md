---
trigger: always_on
---

# Project Coding Rules & Standards

This document outlines the coding standards and best practices for the Kingwork Timesheet Microservice. Adhering to these rules ensures code consistency, maintainability, and high quality.

## 1. Technology Stack

-   **Framework**: React 18+ (Functional Components with Hooks)
-   **Language**: TypeScript 5+ (Strict typing preferred)
-   **UI Library**: Ant Design 5.12+
-   **Date Library**: dayjs (Do NOT use Moment.js)
-   **Build Tool**: Webpack 5

## 2. Directory Structure

-   `src/pages`: Top-level page components (e.g., `TimesheetPage.tsx`, `LeaveOffPage.tsx`).
-   `src/components`: Reusable UI components.
-   `src/services`: API services and mock data (e.g., `mockTimesheetAPI.ts`, `mockData.ts`).
-   `src/constants`: Centralized constants.
    -   `enums.ts`: All enumerations (e.g., `UserStatus`, `RequestStatus`).
    -   `colors.ts`: centralized color palette.
    -   `fontSizes.ts`: standardized font sizes.
-   `src/types`: Shared TypeScript interfaces and types.

## 3. Naming Conventions

-   **Components**: PascalCase (e.g., `TimesheetHeader.tsx`, `LeaveRequestModal.tsx`).
-   **Functions & Variables**: camelCase (e.g., `fetchData`, `handleSubmit`, `isLoading`).
-   **Interfaces & Types**: PascalCase (e.g., `LeaveRecord`, `TimesheetSummary`).
-   **Enums**: PascalCase for name, UPPER_CASE for values (e.g., `UserStatus.ACTIVE`).
-   **Files**: PascalCase for React components, camelCase for utilities/hooks.

## 4. Coding Best Practices

### TypeScript
-   **Explicit Types**: Avoid `any` whenever possible. Define interfaces for props and state.
-   **Enums**: Use centralized enums from `src/constants/enums.ts` instead of hardcoded strings or numbers.

### React Pattern
-   **Functional Components**: Use `React.FC<Props>` or directly destructure props: `({ prop1, prop2 }: Props) => ...`.
-   **Hooks**: usage of `useState`, `useEffect`, `useMemo` should follow standard React rules.
-   **Effect Dependency**: Always include all dependencies in `useEffect` dependency arrays.

### UI & Styling
-   **Ant Design**: Prioritize using Ant Design components (`Row`, `Col`, `Card`, `Typography`, `Space`) over raw HTML/CSS.
-   **Styling**:
    -   Avoid inline styles for complex logic; use standardized constants.
    -   Use colors from `src/constants/colors.ts`.
    -   Use font sizes from `src/constants/fontSizes.ts`.
-   **Responsiveness**: Use Ant Design `Row`/`Col` grid system.
-   **Data Display**: Prefer **Table** component for displaying collections of data (e.g., lists of users, records) over List or Grid views, especially for management interfaces.

### Data Management
-   **Mocking**:
    -   **Strictly use `mockTimesheetAPI.ts`** (fetchApi mockup) for ALL data fetching.
    -   Do not use direct `fetch` or `axios` calls in components.
    -   Define mock data in `src/services/mockData.ts`.
    -   Simulate network delays to test loading states.
-   **Dates**: Always use `dayjs` for date manipulation. Handle timezones consistent with `dayjs`.

## 5. Workflow

-   **Linting**: Ensure no lint errors before committing.
-   **Components**: Keep components small and focused. Extract sub-components if a file exceeds ~200-300 lines unless necessary.
-   **Comments**: Add JSDoc comments for complex functions or business logic.
-   **Clean Imports**: Remove unused imports and variables regularly.
    -   Use IDE's "Organize Imports" feature (VS Code: Shift+Alt+O)
    -   Address TypeScript warnings for unused variables (`noUnusedLocals`, `noUnusedParameters`)
    -   Keep import statements minimal and relevant

## 6. How to Use This Document

-   **For AI Assistants**: Reference this file (`@rules.md`) to understand the project's unique conventions before generating code.
-   **For Developers**: Review this document when onboarding or starting a new feature.
-   **During Code Review**: Use these items as a checklist to ensure PRs meet the standard.


## 7. Datetime Formatting

-   **Standard Formats**: ALWAYS use centralized constants for date/time formatting strings.
-   **Library**: ALWAYS use `dayjs` for date manipulation.
-   **Constants**: Store format strings in `src/constants/dateFormats.ts`.
    -   Use `API_DATE` (`YYYY-MM-DD`) for backend interactions.
    -   Use `DISPLAY_DATE` (`DD/MM/YYYY`) for UI display.
    -   Use `DISPLAY_TIME` (`HH:mm`) for empty time slots.

## 8. Leave Group Configuration

-   **Month Range**: Leave groups support `startMonth` and `endMonth` fields (1-12) to define validity periods in months.
-   **Date Range**: Leave groups also support `startDate` and `endDate` for specific date ranges.
-   **Display**: Both month range and date range are displayed as tags in the group header when available.
