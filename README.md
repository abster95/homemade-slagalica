# Slagalica

A Single Page Application (SPA) implementation of the popular Serbian quiz game "Slagalica" built with React and TypeScript.

## Project Structure

```
slagalica/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   ├── features/        # Feature-specific components and logic
│   │   ├── asocijacije/ # Associations game
│   │   ├── moj-broj/    # My Number game
│   │   ├── slagalica/   # Word puzzle game
│   │   ├── skocko/      # Mastermind variant
│   │   ├── spojnice/    # Connections game
│   │   ├── ko-zna-zna/  # General knowledge
│   │   └── game-master/ # Game master mode
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utility functions
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── tests/               # Test files and fixtures
│   ├── fixtures/        # Test data
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   └── e2e/             # End-to-end tests
├── package.json
├── .gitignore
└── claude.md           # Development guidelines
```

## Game Modes

### Game Master Mode
Set up game parameters and clues for each game module:
- Define associations and final answers
- Set target numbers and available numbers for Moj Broj
- Choose words for Slagalica
- Configure Skočko patterns
- Set up Spojnice pairs
- Create Ko zna zna questions

### Play Mode
Two players alternate between answering questions in various game modules.

## Getting Started

### Install Dependencies
```bash
yarn install
```

### Development Server
```bash
yarn dev
```

### Build for Production
```bash
yarn build
```

### Preview Production Build
```bash
yarn preview
```

### Lint Code
```bash
yarn lint
```

## Technology Stack

- **Framework**: React 19
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 6
- **Router**: React Router 7
- **Linting**: ESLint 9
- **Node**: 25.6.0 (managed via nvm)
- **Package Manager**: Yarn 1.22.22

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vite.dev)
- [Slagalica Wikipedia](https://sr.wikipedia.org/wiki/Slagalica)
