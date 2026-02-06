# Slagalica - Development Guide

## Project Overview
This is a Single Page Application (SPA) implementation of the popular Serbian quiz game "Slagalica" built with React.

## Technology Stack
- **Framework**: React
- **Runtime**: Node.js 25.6.0 (managed via nvm)
- **Package Manager**: Yarn 1.22.22
- **Language**: Typescript

## Best Practices

### Code Organization
- Follow component-based architecture
- Keep components small and focused on a single responsibility
- Use functional components with hooks over class components
- Organize files by feature rather than by type
- Keep shared utilities in a common directory

### Naming Conventions
- Components: PascalCase (e.g., `GameBoard.tsx`)
- Files: camelCase for utilities (e.g., `gameUtils.ts`)
- Functions: camelCase (e.g., `calculateScore`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_SCORE`)

### State Management
- Start with React's built-in state (useState, useReducer)
- Use Context API for shared state across multiple components
- Consider Redux or Zustand only if state complexity grows significantly

### Component Structure
```typescript
// 1. Imports
// 2. Component definition
// 3. Helper functions (or move to separate file)
// 4. PropTypes or TypeScript types
// 5. Export
```

### Styling
- Use CSS Modules or styled-components for component-scoped styles
- Keep global styles minimal
- Consider using a CSS framework like Tailwind CSS for rapid development
- Ensure responsive design for mobile and desktop

### Performance
- Memoize expensive computations with `useMemo`
- Prevent unnecessary re-renders with `React.memo` and `useCallback`
- Lazy load routes and heavy components with `React.lazy` and `Suspense`
- Optimize images and assets

### Testing
- Write unit tests for utility functions
- Write component tests for user interactions
- Use React Testing Library for component testing
- Aim for meaningful test coverage, not 100% coverage

### Git Workflow
- Write clear, descriptive commit messages
- Keep commits atomic and focused
- Use feature branches for new development
- Review code before merging to main

### Code Quality
- Use ESLint for linting
- Use Prettier for code formatting
- Enable pre-commit hooks to run linters
- Keep functions small and focused
- Write self-documenting code with clear variable names
- Add comments only when the code cannot be made clearer

### Dependencies
- Keep dependencies up to date
- Review package sizes before adding new dependencies
- Prefer well-maintained packages with active communities
- Lock dependency versions in production

### Build and Deployment
- Use environment variables for configuration
- Never commit sensitive data (.env files should be gitignored)
- Optimize build for production
- Test production builds locally before deployment

## Project Structure (Suggested)
```
slagalica/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   ├── features/        # Feature-specific components and logic
│   │   ├── asocijacije/
│   │   ├── moj-broj/
│   │   ├── skocko/
│   │   └── ...
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main app component
│   └── index.tsx        # Entry point
├── package.json
├── .gitignore
└── claude.md
```

## Game Modules to Implement
- Asocijacije (Associations)
- Moj Broj (My Number)
- Slagalica (Word puzzle)
- Skočko (Mastermind variant)
- Spojnice (Connections)
- Ko zna zna (General knowledge)

## Development Commands
- `yarn install` - Install dependencies
- `yarn start` - Start development server
- `yarn build` - Build for production
- `yarn test` - Run tests

## Resources
- [React Documentation](https://react.dev)
- [Slagalica Wikipedia](https://sr.wikipedia.org/wiki/Slagalica)
