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

## Project Structure

```
src/
├── components/       # React components
│   ├── App.jsx
│   └── SubscriptionForm.jsx
├── hooks/            # Custom React hooks
│   └── useSubscription.js
├── services/         # API services
│   └── api.js
├── stores/           # Elf state management
│   └── subscriptionStore.js
├── setupTests.js     # Test setup
└── main.jsx          # Entry point

e2e/                  # Playwright E2E tests
├── app.spec.js
├── subscription.spec.js
└── integration.spec.js
```

## Quick Start

### Development (Frontend Only - Mocked API)
```bash
npm install
npm run dev
# Open http://localhost:5173
```

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

## Scripts

```bash
# Development
npm run dev           # Start dev server (http://localhost:5173)
npm run build         # Build for production
npm run preview       # Preview production build

# Testing
npm test              # Run unit tests (watch mode)
npm run test:run      # Run unit tests once
npm run e2e           # Run E2E tests (headless)
npm run e2e:ui        # Run E2E tests with visual UI

# Linting
npm run lint          # Run ESLint
```

## Testing

### Unit Tests (Vitest)
```bash
npm run test:run
```
- 25 tests across stores, services, hooks, and components
- Uses Testing Library for component tests

### E2E Tests (Playwright)

```bash
# Run all E2E tests (headless)
npm run e2e

# Run with visual UI (click to run tests)
npm run e2e:ui

# Watch tests run in browser (slow motion, one at a time)
npx playwright test e2e/subscription.spec.js --project=chromium-slow --headed --workers=1

# Run single test by name
npx playwright test --project=chromium-slow --headed --grep "success"
npx playwright test --project=chromium-slow --headed --grep "error"
npx playwright test --project=chromium-slow --headed --grep "loading"

# Run all visual tests in parallel
npx playwright test e2e/subscription.spec.js --project=chromium-slow --headed
```

**Available test projects:**
- `chromium` - Fast headless Chrome
- `chromium-slow` - Slow motion (500ms delay) for visual debugging
- `mobile-chrome` - Mobile viewport (Pixel 5)

**E2E Test Coverage:**
- Display subscription form
- Load websites in dropdown
- Success message on subscription
- Error message (already subscribed)
- Loading state (Subscribing... button)
- Mobile responsive layout

### Integration Tests (Real API)

Requires Laravel backend running at localhost:8000.

```bash
# Terminal 1: Start backend
cd ../testDesc && php artisan serve

# Terminal 2: Run integration tests
npx playwright test e2e/integration.spec.js --project=chromium-slow --headed
```

## Environment Variables

Create `.env.local` for local development:

```bash
VITE_API_URL=http://localhost:8000  # Backend API URL
```

## Test Summary

| Type | Count | Command |
|------|-------|---------|
| Unit Tests | 25 | `npm run test:run` |
| E2E Tests (mocked) | 16 | `npm run e2e` |
| Integration Tests | 2 | See above |

## Code Quality

### Git Hooks (Husky)

| Hook | When | What Runs |
|------|------|-----------|
| `pre-commit` | On commit | ESLint --fix (auto-fix + fail on errors) |
| `pre-push` | On push | Unit tests (`npm run test:run`) |

### SonarCloud

Analysis runs on every push/PR to master via GitHub Actions:
- Lint check
- Unit tests with coverage
- SonarQube scan

## Related

- Backend: [testDesc](../testDesc) - Laravel API
