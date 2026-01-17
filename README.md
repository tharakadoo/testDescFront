# testDescFront

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=tharakadoo_testDescFront&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=tharakadoo_testDescFront)

React frontend for the testDesc subscription application.

## Tech Stack

| Category | Tool |
|----------|------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| State Management | @ngneat/elf + RxJS |
| Styling | Tailwind CSS 4 |
| Unit Testing | Vitest + Testing Library |
| E2E Testing | Playwright |

## Quick Start

### Full Stack Integration

**Terminal 1 - Start Laravel Backend:**
```bash
cd ../testDesc
php artisan serve
# Backend running at http://localhost:8000
```

**Terminal 2 - Start React Frontend:**
```bash
npm run dev
# Frontend running at http://localhost:5173
```

**Open:** http://localhost:5173

## Testing

### Unit Tests (Vitest)
```bash
npm run test:run
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests (headless)
npm run e2e

# Watch tests run in browser (slow motion, one at a time)
npx playwright test e2e/subscription.spec.js --project=chromium-slow --headed --workers=1

```

### Integration Tests (Real API)

```bash
# Terminal 2: Run integration tests
npx playwright test e2e/integration.spec.js --project=chromium-slow --headed
```

## Environment Variables

Create `.env.local` for local development:

```bash
VITE_API_URL=http://localhost:8000  # Backend API URL
```

## Code Quality & CI/CD

### Git Hooks (Husky)

| Hook | When | What Runs |
|------|------|-----------|
| `pre-commit` | On `git commit` | ESLint --fix (auto-fix + fail on errors) |
| `pre-push` | On `git push` | Unit tests (`npm run test:run`) |

**What runs on commit:**
- ESLint code style checks
- Auto-fixes formatting issues
- Fails if there are linting errors

**What runs on push:**
- All unit tests must pass
- Prevents pushing broken code to remote

### SonarCloud & GitHub Actions

**Project:** [tharakadoo_testDescFront](https://sonarcloud.io/summary/new_code?id=tharakadoo_testDescFront)

Automated CI/CD pipeline runs on every push:
- ESLint validation
- Unit tests with coverage report
- SonarCloud code quality analysis
- Quality gate checks

**Quality Gate Requirements:**
- ✅ All tests must pass
- ✅ Code must pass linting
- ✅ Code coverage thresholds

## Related

- **Backend:** [tharakadoo/testDesc](https://github.com/tharakadoo/testDesc) - Laravel API with Clean Architecture
