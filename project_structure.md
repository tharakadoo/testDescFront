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