# Demo Web Shop - Playwright TypeScript Automation Framework

![Tests](https://img.shields.io/badge/Tests-47-blue)
![Automated](https://img.shields.io/badge/Automated-46/47-brightgreen)
![Coverage](https://img.shields.io/badge/Coverage-Auth%20Module-orange)
![Node](https://img.shields.io/badge/Node-18+-green)
![Playwright](https://img.shields.io/badge/Playwright-1.45+-blue)

A comprehensive Playwright TypeScript automation framework for testing the Demo Web Shop application (https://demowebshop.tricentis.com).

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📖 Docs Index](./docs/index.md) | **Start here** - Overview, quick start, navigation |
| [📋 Test Plan](./docs/Test-Plan-E2E.md) | E2E strategy, scope, schedule, risks, reporting |
| [🔗 Traceability Matrix](./docs/Traceability-Matrix.md) | Requirements ↔ Test Cases mapping |
| [🏃 Local Execution](./docs/runbooks/local-execution.md) | Run tests locally (headed, debug, tags) |
| [🔄 CI/CD Execution](./docs/runbooks/ci-execution.md) | GitHub Actions, GitLab CI, Azure DevOps |
| [🐛 Debug Failures](./docs/runbooks/debug-failures.md) | Troubleshooting flaky tests, locators, common issues |

## Framework Structure

```
demo-web-shop-playwright/
├── .env                              # Environment variables
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
├── README.md
├── config/
│   └── config.json                   # Framework configuration
├── commons/
│   ├── ui/
│   │   ├── web-commons.ts            # Common UI interactions
│   │   └── index.ts
│   ├── api/
│   ├── db/
│   └── jmeter/
├── page-objects/
│   ├── page-elements/                # JSON locator mappings
│   │   ├── login-page.json
│   │   ├── register-page.json
│   │   ├── home-page.json
│   │   └── password-recovery-page.json
│   ├── page-steps/                   # Business actions (TypeScript)
│   │   ├── login-steps.ts
│   │   ├── register-steps.ts
│   │   ├── home-steps.ts
│   │   ├── password-recovery-steps.ts
│   │   └── index.ts
├── testdata/
│   ├── ui/
│   │   └── data.json                 # UI test data
│   ├── api/
│   └── db/
├── tests/
│   ├── ui/                           # UI test suites
│   │   ├── login.spec.ts
│   │   ├── register.spec.ts
│   │   ├── logout.spec.ts
│   │   ├── password-recovery.spec.ts
│   │   └── navigation.spec.ts
│   └── api/
└── utilities/
    ├── element-loader.ts             # Page element loader
    ├── test-data-loader.ts           # Test data loader
    └── index.ts
```

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Configuration

1. Copy `.env.example` to `.env` and update values:
```env
BASE_URL=https://demowebshop.tricentis.com
LOGIN_URL=https://demowebshop.tricentis.com/login
TEST_USER_EMAIL=your-email@example.com
TEST_USER_PASSWORD=your-password
ENVIRONMENT=qa
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run UI tests only
```bash
npm run test:ui
```

### Run tests in headed mode (visible browser)
```bash
npm run test:headed
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/ui/login.spec.ts
```

### Run specific test
```bash
npx playwright test tests/ui/login.spec.ts -g "DWS-TC-0006"
```

### Run with specific project (browser)
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### View test report
```bash
npm run test:report
```

## Test Tags

Tests are tagged for easy filtering:

- `@smoke` - Critical path tests
- `@regression` - Full regression suite
- `@negative` - Negative test cases
- `@critical` - Business critical tests

Run by tag:
```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
```

## Page Object Model

### Page Elements (JSON)
Locator definitions stored in `page-objects/page-elements/*.json` with:
- Primary locator (preferred: data-testid, ARIA roles)
- Fallback locators for resilience
- Element type and description

### Page Steps (TypeScript)
Business actions in `page-objects/page-steps/*.ts`:
- Encapsulate user interactions
- Use WebCommons for common operations
- Load locators from JSON files
- Load test data from testdata files

### Example Usage

```typescript
import { test } from '@playwright/test';
import { LoginPageSteps } from '@page-objects/page-steps/login-steps';
import { HomePageSteps } from '@page-objects/page-steps/home-steps';

test('Valid login', async ({ page }) => {
  const loginSteps = new LoginPageSteps(page);
  const homeSteps = new HomePageSteps(page);

  await loginSteps.navigate();
  await loginSteps.loginWithValidCredentials();
  await loginSteps.verifyLoginSuccess();
  await homeSteps.verifyUserLoggedIn();
});
```

## Test Data

Test data stored in `testdata/ui/data.json`:
- Valid user credentials
- New user registration data
- Invalid test data
- Expected error/success messages

## Common Web Actions (WebCommons)

The `WebCommons` class provides reusable UI interactions:

### Navigation
- `navigate(url)` - Navigate to URL
- `waitForPageLoad()` - Wait for network idle
- `waitForURL(url)` - Wait for specific URL
- `goBack()`, `goForward()`, `reload()`

### Element Interactions
- `click(locator)` - Click element
- `fill(locator, value)` - Fill input
- `type(locator, value)` - Type with delay
- `selectOption(locator, value)` - Select dropdown
- `check/uncheck(locator)` - Checkbox/radio
- `hover(locator)` - Hover element

### Wait Utilities
- `waitForVisible/hidden(locator)`
- `waitForText(locator, text)`
- `waitForCount(locator, count)`
- `waitForEnabled/disabled/checked(locator)`

### Assertions
- `assertVisible/hidden/enabled/disabled/checked(locator)`
- `assertText/containsText/notContainsText(locator, text)`
- `assertValue(locator, value)`
- `assertAttribute(locator, attr, value)`
- `assertCount(locator, count)`
- `assertTitle(title)`
- `assertURL(url)`

### Utility
- `getText/attribute/value(locator)`
- `isVisible/enabled/checked(locator)`
- `count(locator)`
- `takeScreenshot(name)`
- `acceptDialog/dismissDialog()`
- `scrollToElement/top/bottom()`

## Adding New Tests

1. Add test data to `testdata/ui/data.json` if needed
2. Add page elements to `page-objects/page-elements/<page>.json`
3. Create page steps in `page-objects/page-steps/<page>-steps.ts`
4. Write test spec in `tests/ui/<feature>.spec.ts`

## Locator Strategy

Priority order for selector generation:
1. `data-testid`, `data-cy`, `data-qa`, `data-test`, `test-id`
2. ARIA role + accessible name
3. Semantic HTML + visible text
4. CSS fallback (nth-child, classes, IDs)

## CI/CD Integration

The framework includes:
- HTML, JSON, and JUnit reporters
- Screenshots on failure
- Videos on failure
- Traces on first retry
- Parallel execution support
- Multi-browser testing (Chromium, Firefox, WebKit)
- Mobile viewport testing

## Troubleshooting

### Tests fail with timeout
- Increase timeout in `playwright.config.ts`
- Check if elements have correct locators
- Verify application is accessible

### Locators not found
- Check page-elements JSON for correct selectors
- Use Playwright inspector: `npx playwright test --debug`
- Verify application hasn't changed

### Authentication issues
- Verify credentials in `.env`
- Check if user account exists
- Clear cookies between tests

## License

MIT