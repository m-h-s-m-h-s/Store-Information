# Development Guide

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- VS Code (recommended) or another TypeScript-capable IDE

### Initial Setup

1. **Fork and clone the repository:**
```bash
git clone https://github.com/yourusername/Store-Information.git
cd Store-Information
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

4. **Run in development mode:**
```bash
npm run dev
```

## Development Workflow

### Code Structure

```
src/
├── types/          # TypeScript interfaces and types
├── services/       # Business logic and API integrations
├── utils/          # Utility functions and helpers
├── cli.ts          # CLI interface implementation
└── index.ts        # Application entry point
```

### TypeScript Guidelines

1. **Strict Mode**: The project uses TypeScript strict mode. All code must pass strict type checking.

2. **Type Imports**: Use type imports when importing only types:
```typescript
import type { StoreInfoResponse } from '../types/index.js';
```

3. **Explicit Return Types**: Always specify return types for functions:
```typescript
function calculateScore(data: number[]): number {
  return data.reduce((a, b) => a + b, 0);
}
```

4. **Avoid `any`**: Use `unknown` instead of `any` when type is truly unknown:
```typescript
catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

### Code Style

The project uses ESLint and Prettier for consistent code style.

**Before committing:**
```bash
npm run lint        # Check for linting errors
npm run format      # Auto-format code
```

**ESLint Rules:**
- No unused variables (except those prefixed with `_`)
- Explicit function return types
- No console.log in production code
- Consistent naming conventions

**Prettier Configuration:**
- Single quotes
- Semicolons required
- 2-space indentation
- Trailing commas (ES5)
- 80-character line width

### Git Workflow

1. **Branch Naming:**
   - Features: `feature/store-name-validation`
   - Bugs: `fix/api-timeout-error`
   - Docs: `docs/update-readme`

2. **Commit Messages:**
   - Use conventional commits format
   - Examples:
     - `feat: add store name validation`
     - `fix: handle API timeout errors`
     - `docs: update API documentation`
     - `refactor: simplify error handling`

3. **Pull Request Process:**
   - Create feature branch from `main`
   - Make changes and commit
   - Run tests and linting
   - Push branch and create PR
   - Ensure all checks pass
   - Request review

## Adding New Features

### 1. Add New Store Information Type

To add a new type of store information:

```typescript
// src/types/index.ts
export interface StoreMetrics {
  employeeCount?: number;
  yearFounded?: number;
  revenue?: string;
}

// Update StoreInfoResponse
export interface StoreInfoResponse {
  // ... existing fields
  metrics?: StoreMetrics;
}
```

### 2. Create a New Service

```typescript
// src/services/metrics.service.ts
import { StoreMetrics } from '../types/index.js';

export class MetricsService {
  async getStoreMetrics(storeName: string): Promise<StoreMetrics> {
    // Implementation
  }
}
```

### 3. Add New CLI Commands

```typescript
// src/cli.ts
const { action } = await inquirer.prompt([
  {
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'Get store information',
      'Get store metrics', // New option
      'Exit'
    ]
  }
]);
```

## Testing

### Running Tests

```bash
npm test                # Run all tests
npm test -- --watch    # Run tests in watch mode
npm test -- --coverage # Run tests with coverage
```

### Writing Tests

Create test files next to the source files:
```
src/
├── services/
│   ├── store-info.service.ts
│   └── store-info.service.test.ts
```

Example test:
```typescript
import { StoreInfoService } from './store-info.service';

describe('StoreInfoService', () => {
  let service: StoreInfoService;

  beforeEach(() => {
    service = new StoreInfoService({
      apiKey: 'test-key',
      model: 'gpt-5-nano'
    });
  });

  it('should validate store names', async () => {
    await expect(service.getStoreInfo('')).rejects.toThrow('Store name cannot be empty');
  });
});
```

### Mocking

Mock external dependencies:
```typescript
jest.mock('openai');

import OpenAI from 'openai';
const MockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;
```

## Debugging

### VS Code Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Application",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Debug Logging

Use the logger utility with NODE_ENV=development:
```bash
NODE_ENV=development npm run dev
```

Debug logs will appear in development mode:
```typescript
logger.debug('API Request', { storeName, model });
```

## Performance Optimization

### 1. Caching

Consider implementing caching for frequently requested stores:
```typescript
const cache = new Map<string, StoreInfoResponse>();
const CACHE_TTL = 3600000; // 1 hour

if (cache.has(storeName)) {
  const cached = cache.get(storeName)!;
  if (Date.now() - cached.timestamp.getTime() < CACHE_TTL) {
    return cached;
  }
}
```

### 2. Rate Limiting

Implement rate limiting to avoid API throttling:
```typescript
import { RateLimiter } from 'limiter';

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute'
});

await limiter.removeTokens(1);
```

### 3. Concurrent Requests

Handle multiple stores efficiently:
```typescript
const results = await Promise.allSettled(
  stores.map(store => service.getStoreInfo(store))
);
```

## Common Issues

### TypeScript Module Resolution

If you encounter module resolution issues:
1. Ensure all imports use `.js` extension
2. Check `tsconfig.json` module settings
3. Verify Node.js version supports ES modules

### API Key Issues

1. Check `.env` file exists and contains valid key
2. Ensure `.env` is not committed to git
3. Verify API key has proper permissions

### Build Errors

1. Delete `dist/` folder and rebuild
2. Clear TypeScript cache: `rm -rf node_modules/.cache`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

## Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Run full test suite
4. Build production bundle
5. Create git tag
6. Push to repository
7. Create GitHub release

```bash
npm version patch/minor/major
npm run build
git push && git push --tags
```
