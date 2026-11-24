# 📚 Documentation Index

Welcome to the AI-Powered Playwright Test Automation Framework documentation.

---

## 🚀 Quick Navigation

| Document | Purpose | Audience |
|----------|---------|----------|
| [🏃 Local Execution](./runbooks/local-execution.md) | Run tests locally (headed, debug, tags) | Developers, QA |
| [🔄 CI/CD Execution](./runbooks/ci-execution.md) | GitHub Actions, GitLab CI, Azure DevOps | DevOps, QA Leads |
| [🐛 Debug Failures](./runbooks/debug-failures.md) | Troubleshooting flaky tests, locators, common issues | QA Engineers |
| [📋 Test Plan](./Test-Plan-E2E.md) | E2E strategy, scope, schedule, risks, reporting | QA Leads, Managers |
| [🔗 Traceability Matrix](./Traceability-Matrix.md) | Requirements ↔ Test Cases mapping | QA, Business Analysts |

---

## 🎯 Framework at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                    TEST EXECUTION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  Tests   │───▶│  Page Steps  │───▶│  Page Elements   │  │
│  │ (*.spec) │    │ (*.steps.ts) │    │ (*.json)         │  │
│  └──────────┘    └──────────────┘    └──────────────────┘  │
│       │                │                     │              │
│       ▼                ▼                     ▼              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              TEST DATA (data.json)                    │  │
│  └──────────────────────────────────────────────────────┘  │
│       │                                                    │
│       ▼                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           PLAYWRIGHT CORE + BROWSERS                  │  │
│  │  Chromium • Firefox • WebKit • Mobile Chrome • iOS   │  │
│  └──────────────────────────────────────────────────────┘  │
│       │                                                    │
│       ▼                                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              REPORTERS                                │  │
│  │  HTML • JSON • JUnit • Allure-ready • Screenshots    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Test Coverage Summary (169 Tests)

| Module | Test File | Tests | Test Case IDs |
|--------|-----------|-------|---------------|
| **Authentication** | login.spec.ts | 15 | DWS-TC-0006–0010, 0014 |
| **Authentication** | register.spec.ts | 19 | DWS-TC-0001–0005, 0015 |
| **Authentication** | logout.spec.ts | 6 | DWS-TC-0011 |
| **Authentication** | password-recovery.spec.ts | 8 | DWS-TC-0012–0013 |
| **Books** | books.spec.ts | 42 | DWS-BOOKS-001–042 |
| **Computers** | computers.spec.ts | 17 | DWS-COMP-002–024 |
| **Electronics** | electronics.spec.ts | 5 | ELEC-003, 030–032 |
| **Navigation** | navigation.spec.ts | 47 | DWS-NAV-001–047 |
| **Navigation** | navigation-module.spec.ts | 10 | DWS-TC-0014–0015 + nav flows |
| **TOTAL** | **9 files** | **169** | **136 unique TCs** |

---

## 🏷️ Test Organization

### Test Tags
| Tag | Description | Use Case | Approx. Tests |
|-----|-------------|----------|---------------|
| `@smoke` | Critical path, fast feedback | Pre-merge, daily | ~35 |
| `@regression` | Full feature coverage | Release, scheduled | 169 |
| `@negative` | Error handling, invalid inputs | Regression runs | ~25 |
| `@critical` | Business-critical flows | Hotfix validation | ~8 |

### Test Naming Convention
```typescript
// Format: MODULE-ID: Description @tags
test('DWS-TC-0006: Valid user login with correct credentials @smoke @regression @critical', async () => {
  // ...
});

test('DWS-BOOKS-009: Add Computing and Internet book to cart @smoke @regression @critical', async () => {
  // ...
});

test('DWS-COMP-017: Add configured desktop to cart @smoke @regression @critical', async () => {
  // ...
});

test('DWS-NAV-001: Navigate to Books category from header @smoke @regression', async () => {
  // ...
});
```

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `playwright.config.ts` | Main Playwright configuration (5-browser matrix) |
| `config/config.json` | Framework-specific settings |
| `.env` | Environment variables (not committed) |
| `.env.example` | Template for environment config |
| `tsconfig.json` | TypeScript compilation settings |
| `package.json` | Dependencies & scripts |

---

## 📊 Reports & Artifacts

| Report | Location | Description |
|--------|----------|-------------|
| HTML Report | `playwright-report/index.html` | Interactive test results |
| JSON Results | `test-results/results.json` | Machine-readable results |
| JUnit XML | `test-results/results.xml` | CI/CD integration |
| Screenshots | `test-results/**/*.png` | Failure screenshots |
| Videos | `test-results/**/*.webm` | Failure recordings |
| Traces | `test-results/**/*.zip` | Debug traces (first retry) |

---

## 🤖 AI-Assisted Development

This framework was built with **GitHub Copilot** assistance:

- **Test Generation** - Copilot generated test specs from requirements
- **Page Objects** - Copilot created page steps from JSON locators
- **Locators** - Copilot suggested resilient selectors (data-testid → ARIA → CSS)
- **Documentation** - Copilot drafted README, runbooks, inline comments
- **CI/CD** - Copilot created GitHub Actions workflow with matrix strategy
- **Refactoring** - Copilot Chat for code improvements and bug fixes

---

## 📞 Support

| Channel | Purpose |
|---------|---------|
| GitHub Issues | Bug reports, feature requests |
| GitHub Discussions | Questions, ideas, showcase |
| Pull Requests | Contributions, fixes |

---

## 🔗 External Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)