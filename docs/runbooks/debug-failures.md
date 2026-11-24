# 🐛 Debug Failures Runbook

> **Purpose:** Systematic troubleshooting for flaky tests, locator issues, and common failures.

---

## 🔍 Debugging Workflow

```
Test Fails
    │
    ▼
1. Check HTML Report (playwright-report/index.html)
    │
    ▼
2. Run with --debug (Playwright Inspector)
    │
    ▼
3. Check Trace (trace.zip) → npx playwright show-trace
    │
    ▼
4. Check Screenshots/Video in test-results/
    │
    ▼
5. Run Locally with --headed --slow-mo=500
    │
    ▼
6. Fix → Re-run → Update Traceability Matrix
```

---

## 🛠️ Debug Commands

| Scenario | Command |
|----------|---------|
| **Step-through debug** | `npx playwright test tests/ui/login.spec.ts -g "DWS-TC-0006" --debug` |
| **Headed + slow** | `npx playwright test tests/ui/login.spec.ts --headed --slow-mo=500` |
| **Show trace** | `npx playwright show-trace test-results/<test>/trace.zip` |
| **Inspector mode** | `npx playwright test --ui` (GUI test runner) |
| **List tests** | `npx playwright test --list` |
| **Run failed only** | `npx playwright test --last-failed` |

---

## 📋 Common Failure Patterns & Fixes

### 1. Locator Not Found (`TimeoutError: locator.waitFor`)

**Symptoms:**
```
Error: Timed out 15000ms waiting for locator('input[id="Email"]')
```

**Root Causes & Fixes:**

| Cause | Fix |
|-------|-----|
| Element not rendered yet | Add `await commons.waitForVisible(locator)` before action |
| Wrong selector | Check `page-objects/page-elements/<page>.json` - verify fallback locators |
| Element in iframe | Use `await commons.getFrame(frameLocator).locator(...)` |
| Dynamic ID/class | Use data-testid, ARIA role, or text-based locators |
| Page not loaded | `await commons.waitForPageLoad()` after navigation |

**Debug Steps:**
```bash
# 1. Open inspector
npx playwright test tests/ui/login.spec.ts --debug

# 2. In inspector: hover element → copy stable selector
# 3. Update page-elements JSON with new locator
# 4. Add as fallback (not primary)
```

### 2. Element Not Interactable (`Element is not attached` / `Element is not visible`)

**Fixes:**
```typescript
// Wait for element to be ready
await commons.waitForEnabled(locator);
await commons.waitForVisible(locator);

// Force click if obscured
await commons.click(locator, { force: true });

// Scroll into view first
await commons.scrollToElement(locator);
await commons.click(locator);
```

### 3. Flaky Tests (Pass sometimes, fail others)

**Common Causes:**

| Cause | Detection | Fix |
|-------|-----------|-----|
| Race condition | Fails on fast runs | Add explicit waits: `waitForPageLoad`, `waitForVisible` |
| Animation timing | Fails on slow machines | Increase timeout, disable animations: `await page.addStyleTag({content: '* {animation: none !important; transition: none !important;}'})` |
| Test data collision | Fails in parallel | Unique data per test (timestamp emails) |
| Shared state | Fails after other tests | `test.beforeEach` → clear cookies, navigate fresh |

**Quick Fixes:**
```typescript
// In playwright.config.ts
retries: 2,                    // Retry flaky tests
timeout: 60000,                // More time
expect: { timeout: 10000 },    // Assertion timeout

// In test
test('flaky test', async ({ page }) => {
  // Disable animations
  await page.addStyleTag({ content: '* {animation: none !important; transition: none !important;}' });
  // ... rest of test
});
```

### 4. Navigation/Redirect Issues

**Symptoms:** Test expects URL A but gets URL B

**Fixes:**
```typescript
// Wait for specific URL pattern
await commons.waitForURL(/\/dashboard/);

// Wait for network idle after click
await commons.click(button);
await commons.waitForPageLoad();  // Waits for networkidle

// Check for intermediate pages (loading, consent)
await commons.waitForVisible(locator);  // Wait for actual target
```

### 5. Authentication/Session Issues

**Symptoms:** Logged in test fails, or logout doesn't work

**Fixes:**
```typescript
// Clear state before each test
test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.context().clearPermissions();
});

// Use storageState for logged-in tests
// In playwright.config.ts:
use: {
  storageState: 'auth/storageState.json'  // Pre-authenticated
}

// Or login in beforeEach
test.beforeEach(async ({ page }) => {
  const login = new LoginPageSteps(page);
  await login.navigate();
  await login.loginWithValidCredentials();
});
```

### 6. File Upload/Download Issues

```typescript
// Upload
await commons.uploadFile('input[type="file"]', 'path/to/file.pdf');

// Download
const [download] = await Promise.all([
  page.waitForEvent('download'),
  commons.click('button:has-text("Download")')
]);
await download.saveAs('downloads/file.pdf');
```

---

## 🔧 Locator Debugging Cheatsheet

### Find Stable Selectors (in Inspector)
```bash
# 1. Run inspector
npx playwright test --debug

# 2. In browser: DevTools → Elements → Right-click → Copy → Copy selector
# 3. Test in console: $$('your-selector')
# 4. Prefer (in order):
#    - data-testid="unique-id"
#    - role="button"[name="Submit"]
#    - label="Email"
#    - text="Login"
#    - CSS fallback
```

### Update Page Elements JSON
```json
{
  "elements": {
    "emailInput": {
      "locator": "input[data-testid='email-input']",
      "fallbackLocators": [
        "input[id='Email']",
        "input[name='Email']",
        "input[type='email']"
      ],
      "type": "textbox",
      "description": "Email address input field"
    }
  }
}
```

---

## 📊 Trace Analysis

### What to Look For in Trace Viewer

| Tab | What to Check |
|-----|---------------|
| **Timeline** | Gaps between actions, long waits |
| **Network** | Failed requests, slow responses, 4xx/5xx |
| **Console** | JS errors, warnings, `console.log` from app |
| **Sources** | DOM state at each step |
| **Metadata** | Viewport, browser, test duration |

### Export for Sharing
```bash
# Trace is auto-saved on failure (config: trace: 'on-first-retry')
# Share: test-results/<test-name>/trace.zip
```

---

## 🚨 Emergency Quick Fixes

| Problem | One-Liner Fix |
|---------|---------------|
| Test too slow | `--slow-mo=0` (remove) or increase timeout |
| Can't find element | Add 3 fallback locators in JSON |
| Flaky click | `await commons.click(locator, { force: true, timeout: 30000 })` |
| Animation interference | `await page.addStyleTag({content: '* {animation:none!important}'})` |
| Cookie/session bleed | `await page.context().clearCookies()` in `beforeEach` |
| Wrong URL after click | `await commons.waitForURL(/expected-pattern/)` |

---

## 📝 Debugging Checklist

When a test fails:

- [ ] Check HTML report for error message + screenshot
- [ ] Run with `--debug` to step through
- [ ] Check trace.zip for network/console/timeline
- [ ] Verify locators in `page-elements` JSON (add fallbacks)
- [ ] Check test data in `testdata/ui/data.json`
- [ ] Run in headed mode to see visually
- [ ] Check for animations/timing issues
- [ ] Verify no test pollution (clear cookies in `beforeEach`)
- [ ] Update traceability matrix with findings
- [ ] Document fix in PR/commit message

---

## 🔗 Useful Resources

| Resource | Link |
|----------|------|
| Playwright Trace Viewer | https://trace.playwright.dev/ |
| Locator Best Practices | https://playwright.dev/docs/locators |
| Test Configuration | https://playwright.dev/docs/test-configuration |
| Debugging Guide | https://playwright.dev/docs/debug |
| CI/CD Recipes | https://playwright.dev/docs/ci |

---

> **Last Updated:** 2026-11-22 | **Owner:** Suraj Navgire