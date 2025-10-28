# Development Commands

## Build & Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Testing
- `npx playwright test` - Run all E2E tests
- `npx playwright test [filename]` - Run single test file
- `npx playwright test --project=chromium` - Run tests in specific browser
- `npm test` - Run unit tests (if configured)

# Code Style Guidelines

## Imports & Formatting
- Use absolute imports with `@/` prefix for internal modules
- Group imports: React/external libs → internal modules → types
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Follow Next.js App Router conventions

## TypeScript & Types
- Strict TypeScript enabled - always type props and interfaces
- Use `React.forwardRef` for UI components with ref forwarding
- Define interfaces in `lib/types.ts` for shared data structures
- Use `React.ButtonHTMLAttributes` for extending HTML element props

## Component Patterns
- Use `'use client'` directive for client components
- Implement proper error boundaries and loading states
- Use TanStack Query for data fetching with proper query keys
- Follow existing component structure in `components/ui/`

## Styling
- Use Tailwind CSS with custom color palette (primary, secondary, success, warning, danger)
- Apply responsive design with mobile-first approach
- Use custom shadows: `soft`, `card`, `card-hover`
- Implement animations: `fade-in`, `slide-in`, `blob`

## Naming Conventions
- PascalCase for components and interfaces
- camelCase for variables and functions
- kebab-case for file names and CSS classes
- Use descriptive names for query keys and API endpoints