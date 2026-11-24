# 📚 Demo Web Shop - Test Documentation

> **Framework:** Playwright TypeScript | **Pattern:** Page Object Model | **Application:** https://demowebshop.tricentis.com

---

## 🎯 Quick Navigation

| Document | Description | Status |
|----------|-------------|--------|
| [Test Plan](./Test-Plan-E2E.md) | Complete E2E strategy, scope, schedule, risks, reporting | ✅ v1.0 |
| [Traceability Matrix](./Traceability-Matrix.md) | Requirements ↔ Test Cases mapping (auto-updated post-run) | ✅ v1.1 |
| [Local Execution Guide](./runbooks/local-execution.md) | Run tests locally (headed, debug, tags) | ✅ v1.0 |
| [CI Execution Guide](./runbooks/ci-execution.md) | GitHub Actions / GitLab CI setup | ✅ v1.0 |
| [Debug Failures](./runbooks/debug-failures.md) | Troubleshooting flaky tests, locator issues | ✅ v1.0 |

---

## 📊 Project Metrics (Auto-updated after CI run)

![Tests](https://img.shields.io/badge/Tests-94-blue)
![Automated](https://img.shields.io/badge/Automated-93/94-brightgreen)
![Modules](https://img.shields.io/badge/Modules-12-orange)
![Coverage](https://img.shields.io/badge/Coverage-Auth%20%2B%20Nav-lightgrey)

> **Last CI Run:** `Not yet executed`  
> **Next Update:** After first pipeline execution

---

## 🏗️ Framework Structure

```text
Demo-Web-Shop/
├── tests/ui/                    # 94 test cases across 10 suites
│   ├── login.spec.ts            # 12 tests (@smoke, @regression, @critical)
│   ├── register.spec.ts         # 16 tests (@smoke, @regression, @negative)
│   ├── logout.spec.ts           # 5 tests (@smoke, @regression)
│   ├── password-recovery.spec.ts # 7 tests (@regression, @negative)
│   ├── navigation.spec.ts       # 7 tests (@regression)
│   └── navigation-module.spec.ts # 47 tests (@smoke, @regression, @negative)
├── page-objects/
│   ├── page-elements/           # JSON locator repository (4 pages)
│   └── page-steps/              # Business action classes (4 pages)
├── testdata/ui/data.json        # Test data (valid, invalid, messages)
├── commons/ui/web-commons.ts    # 100+ reusable web actions
├── utilities/                   # Element & test data loaders
├── config/config.json           # Centralized configuration
└── docs/                        # 📍 YOU ARE HERE
```

---

## 🚀 Quick Start

```bash
# Install (one-time)
npm install
npx playwright install

# Run all tests (headed - visible browser)
npm run test:headed

# Run smoke only
npx playwright test --grep @smoke --headed

# Run specific module
npx playwright test tests/ui/login.spec.ts --headed
npx playwright test tests/ui/navigation-module.spec.ts --headed

# View HTML report
npm run test:report
```

---

## 🏷️ Test Tags

| Tag | Count | Purpose |
|-----|-------|---------|
| `@smoke` | 15 | Critical path - run on every commit |
| `@regression` | 75 | Full functional - run nightly |
| `@negative` | 19 | Boundary/invalid inputs |
| `@critical` | 1 | Business-blocking (valid login) |

---

## 📋 Module Coverage

| Module | Requirements | Test Cases | Status |
|--------|--------------|------------|--------|
| **Authentication - Registration** | REQ-AUTH-001 | 11 (5 base + 6 extended) | ✅ Automated |
| **Authentication - Login** | REQ-AUTH-002 | 8 (5 base + 3 extended) | ✅ Automated |
| **Authentication - Logout** | REQ-AUTH-003 | 5 (1 base + 4 extended) | ✅ Automated |
| **Authentication - Password Recovery** | REQ-AUTH-004 | 7 (2 base + 5 extended) | ✅ Automated |
| **Authentication - Navigation** | REQ-AUTH-005 | 7 (2 base + 5 extended) | ✅ Automated |
| **Navigation - Header Menu** | REQ-NAV-001 | 15 (7 main + 3 sub + 4 top + 1 logo) | ✅ Automated |
| **Navigation - Sidebar** | REQ-NAV-003 | 5 | ✅ Automated |
| **Navigation - Footer** | REQ-NAV-004 | 18 (6 info + 3 service + 5 account + 4 social) | ✅ Automated |
| **Navigation - Search** | REQ-NAV-005 | 3 | ✅ Automated |
| **Navigation - Breadcrumbs** | REQ-NAV-006 | 3 | ✅ Automated |
| **Navigation - Cross-module** | REQ-NAV-007 | 3 | ✅ Automated |

---

## 📝 For Contributors

| Task | Document |
|------|----------|
| Add new test case | [Test Plan - Section 12](./Test-Plan-E2E.md#12-test-cases-reference) |
| Update locators | `page-objects/page-elements/<page>.json` |
| Add test data | `testdata/ui/data.json` |
| Update traceability | [Traceability Matrix](./Traceability-Matrix.md) |
| Debug failure | [Debug Failures Runbook](./runbooks/debug-failures.md) |

---

## 📌 Version & Ownership

| Doc | Version | Last Updated | Owner | Review Cycle |
|-----|---------|--------------|-------|--------------|
| Test Plan | 1.0 | 2026-11-22 | Suraj Navgire | Per release |
| Traceability Matrix | 1.1 | 2026-11-22 | Suraj Navgire | Post CI run |
| Runbooks | 1.0 | 2026-11-22 | Suraj Navgire | As needed |

---

> **💡 Tip:** Open this folder in VS Code (`code docs/`) for best Markdown rendering with Mermaid diagrams and table formatting.