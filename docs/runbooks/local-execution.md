# 🏃 Local Execution Runbook

> **Purpose:** Run tests locally with visible browser (headed mode) for development and debugging.

---

## 📋 Prerequisites

```bash
# One-time setup
cd C:\Users\suraj\Demo-Web-Shop\Demo-Web-Shop
npm install                 # Install dependencies
npx playwright install      # Install browsers (Chromium, Firefox, WebKit)
```

Verify:
```bash
npx playwright --version    # Should show 1.45+
```

---

## 🎯 Common Commands

| Goal | Command |
|------|---------|
| **All tests, headed** | `npm run test:headed` |
| **Smoke only, headed** | `npx playwright test --grep @smoke --headed` |
| **Regression only** | `npx playwright test --grep @regression` |
| **Single module (Login)** | `npx playwright test tests/ui/login.spec.ts --headed` |
| **Single test** | `npx playwright test tests/ui/login.spec.ts -g "DWS-TC-0006" --headed` |
| **Debug mode (step-by-step)** | `npm run test:debug` |
| **Specific browser** | `npx playwright test --project=chromium --headed` |
| **Mobile viewport** | `npx playwright test --project=mobile-chrome --headed` |

---

## 🖥️ Headed vs Headless

| Mode | Command | Use Case |
|------|---------|----------|
| **Headed** | `--headed` | Development, debugging, visual verification |
| **Headless** | (default) | CI, fast execution, no UI needed |
| **Debug** | `--debug` | Step-through with Playwright Inspector |

---

## 🔧 Useful Flags

```bash
# Slow down actions (ms)
npx playwright test --headed --slow-mo=500

# Run specific project(s)
npx playwright test --project=chromium --project=firefox --headed

# Retry failed tests locally
npx playwright test --retries=2 --headed

# Generate trace for all tests
npx playwright test --trace=on --headed

# Output video on failure only
npx playwright test --video=retain-on-failure --headed
```

---

## 📊 Viewing Results

### HTML Report (Best for review)
```bash
npm run test:report
# Opens: http://localhost:9323
```

### JSON Report (For scripting)
```bash
npx playwright test --reporter=json --output=test-results/results.json
```

### JUnit (For CI integration)
```bash
npx playwright test --reporter=junit --output=test-results/results.xml
```

---

## 🐛 Debugging Tips

### 1. Playwright Inspector (Best for debugging)
```bash
npx playwright test tests/ui/login.spec.ts --debug
# Opens inspector - step through, explore DOM, test locators
```

### 2. Trace Viewer (Post-run analysis)
```bash
# Run with trace
npx playwright test --trace=on

# View trace
npx playwright show-trace test-results/<test-name>/trace.zip
```

### 3. Console Logs
```bash
# See console.log from tests
npx playwright test --reporter=list
```

### 4. Screenshots/Video on Failure
Automatically saved to `test-results/` when using config defaults.

---

## ⚡ Pro Tips

| Tip | Command |
|-----|---------|
| Run only failed tests from last run | `npx playwright test --last-failed` |
| Update snapshots (visual) | `npx playwright test --update-snapshots` |
| List all tests without running | `npx playwright test --list` |
| Show config | `npx playwright test --show-config` |

---

## 🚨 Common Issues

| Issue | Fix |
|-------|-----|
| `browser not found` | Run `npx playwright install` |
| `timeout` | Increase timeout in `playwright.config.ts` or test |
| `locator not found` | Check `page-objects/page-elements/<page>.json` fallbacks |
| `test data collision` | Use timestamp emails (already in `register-steps.ts`) |
| `port in use` | Kill existing node processes: `taskkill /f /im node.exe` |

---

## 📝 Quick Reference Card

```bash
# DAILY DEVELOPMENT
npm run test:headed                    # All tests, watch browser
npx playwright test --grep @smoke --headed   # Quick smoke check

# BEFORE COMMIT
npx playwright test --grep @regression       # Full regression

# DEBUGGING SPECIFIC FAILURE
npx playwright test tests/ui/login.spec.ts -g "DWS-TC-0006" --debug

# CI SIMULATION
npx playwright test --reporter=html,json,junit
```

---

> **Last Updated:** 2026-11-22 | **Owner:** Suraj Navgire