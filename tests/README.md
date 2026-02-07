# Tests

This directory contains all test-related files for the Slagalica application.

## Directory Structure

```
tests/
├── fixtures/           # Test data and fixtures
│   └── test-values.json  # Sample game configurations for testing
├── unit/              # Unit tests (coming soon)
├── integration/       # Integration tests (coming soon)
└── e2e/              # End-to-end tests (coming soon)
```

## Test Frameworks

- **Jest**: For unit and integration tests
- **Playwright**: For end-to-end browser tests

## Fixtures

The `fixtures/` directory contains test data used across different test suites:
- `test-values.json`: Complete game configuration with sample data for all game modes

## Running Tests

```bash
# Run all tests
yarn test

# Run unit tests
yarn test:unit

# Run integration tests
yarn test:integration

# Run e2e tests
yarn test:e2e

# Run tests in watch mode
yarn test:watch
```

## Best Practices

- Keep test data in `fixtures/` for reusability
- Co-locate unit tests with components when appropriate (e.g., `Component.test.tsx` next to `Component.tsx`)
- Use this directory for integration and e2e tests
- Follow the AAA pattern: Arrange, Act, Assert
- Write descriptive test names that explain the expected behavior
