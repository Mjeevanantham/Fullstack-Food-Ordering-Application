# Contributing to Slooze

Thank you for your interest in contributing to Slooze! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone <your-fork-url>
   cd Slooze
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` files to `.env` in respective directories
   - Configure database and API keys

4. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd apps/backend
   pnpm start:dev

   # Terminal 2: Frontend
   cd apps/frontend
   pnpm dev
   ```

## Code Style

- **TypeScript**: Use strict mode, no `any` types
- **Formatting**: Prettier (run `pnpm format`)
- **Linting**: ESLint (run `pnpm lint`)
- **Naming**: Use descriptive names, follow conventions

## Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Write clean, tested code
   - Follow existing patterns
   - Update documentation if needed

3. **Commit changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   
   Commit message format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `test:` - Tests
   - `refactor:` - Code refactoring
   - `chore:` - Maintenance

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Testing

### Backend Tests
```bash
cd apps/backend
pnpm test              # Unit tests
pnpm test:e2e          # E2E tests
pnpm test:cov          # Coverage (aim for 80%+)
```

### Frontend Tests
```bash
cd apps/frontend
pnpm test              # Component tests
pnpm test:coverage     # Coverage report
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update CHANGELOG** if applicable
5. **Create PR** with clear description

## Code Review

- All PRs require review
- Address feedback promptly
- Keep PRs focused and small
- Update PR description if scope changes

## Questions?

Feel free to open an issue for questions or clarifications.

