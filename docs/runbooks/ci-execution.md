# 🔄 CI/CD Execution Runbook

> **Purpose:** Configure and run tests in CI/CD pipelines (GitHub Actions, GitLab CI, Azure DevOps).

---

## 🎯 Recommended: GitHub Actions

### `.github/workflows/playwright.yml`
```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Nightly at 2 AM
  workflow_dispatch:      # Manual trigger

env:
  BASE_URL: https://demowebshop.tricentis.com
  TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
  TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      matrix:
        project: [chromium, firefox, webkit]
        # project: [chromium, firefox, webkit, mobile-chrome, mobile-safari]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps ${{ matrix.project }}

      - name: Run Playwright tests
        run: npx playwright test --project=${{ matrix.project }}
        env:
          BASE_URL: ${{ env.BASE_URL }}

      - name: Upload HTML Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.project }}
          path: playwright-report/
          retention-days: 7

      - name: Upload Test Results (JSON/JUnit)
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.project }}
          path: test-results/
          retention-days: 7

      - name: Upload Traces (on failure)
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: traces-${{ matrix.project }}
          path: test-results/**/trace.zip
          retention-days: 7

  # Consolidate results
  summary:
    needs: test
    if: always()
    runs-on: ubuntu-latest
    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          pattern: playwright-report-*
          path: all-reports/

      - name: Merge Reports
        run: |
          # Use playwright merge-reports or custom script
          npx playwright merge-reports all-reports/ --output merged-report

      - name: Upload Merged Report
        uses: actions/upload-artifact@v4
        with:
          name: merged-playwright-report
          path: merged-report/
          retention-days: 30

      - name: Comment PR with Results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            // Post summary comment on PR
```

---

## 🔧 Required Secrets (GitHub)

| Secret | Value | Where |
|--------|-------|-------|
| `TEST_USER_EMAIL` | `surajnavgire2015@gmail.com` | Repo Settings → Secrets |
| `TEST_USER_PASSWORD` | `Suraj7616` | Repo Settings → Secrets |
| `BASE_URL` | `https://demowebshop.tricentis.com` | Repo Settings → Secrets (optional, in workflow) |

---

## 📊 GitLab CI Alternative

### `.gitlab-ci.yml`
```yaml
stages:
  - test

variables:
  BASE_URL: "https://demowebshop.tricentis.com"
  TEST_USER_EMAIL: $TEST_USER_EMAIL
  TEST_USER_PASSWORD: $TEST_USER_PASSWORD

playwright-test:
  stage: test
  image: mcr.microsoft.com/playwright:v1.45.0-focal
  before_script:
    - npm ci
    - npx playwright install --with-deps
  script:
    - npx playwright test
  artifacts:
    when: always
    expire_in: 1 week
    reports:
      junit: test-results/results.xml
    paths:
      - playwright-report/
      - test-results/
  parallel:
    matrix:
      - PROJECT: [chromium, firefox, webkit]
  script:
    - npx playwright test --project=$PROJECT
```

---

## ⚙️ Azure DevOps Pipeline

### `azure-pipelines.yml`
```yaml
trigger:
  - main
  - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  BASE_URL: 'https://demowebshop.tricentis.com'

stages:
  - stage: Test
    jobs:
      - job: Playwright
        strategy:
          matrix:
            chromium:
              PROJECT: 'chromium'
            firefox:
              PROJECT: 'firefox'
            webkit:
              PROJECT: 'webkit'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '20.x'
          - script: |
              npm ci
              npx playwright install --with-deps $(PROJECT)
            displayName: 'Install Dependencies'
          - script: |
              npx playwright test --project=$(PROJECT)
            displayName: 'Run Tests'
            env:
              BASE_URL: $(BASE_URL)
              TEST_USER_EMAIL: $(TEST_USER_EMAIL)
              TEST_USER_PASSWORD: $(TEST_USER_PASSWORD)
          - publish: playwright-report
            artifact: playwright-report-$(PROJECT)
            condition: always()
          - publish: test-results
            artifact: test-results-$(PROJECT)
            condition: always()
```

---

## 🏷️ CI-Specific Test Execution

### Smoke on Every PR (Fast)
```yaml
# In workflow - run only smoke tests on PR
- name: Run Smoke Tests
  run: npx playwright test --grep @smoke
```

### Full Regression Nightly
```yaml
# Scheduled workflow - full regression
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily
jobs:
  test:
    run: npx playwright test --grep @regression
```

### Tag-Based Execution
```bash
# In pipeline - pass tag as variable
npx playwright test --grep "$TEST_TAGS"
# TEST_TAGS="@smoke" or "@regression" or "@critical"
```

---

## 📈 Reporting in CI

### 1. HTML Report (Artifact)
```yaml
- uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

### 2. JUnit for Dashboard
```yaml
- name: Publish Test Results
  uses: actions/upload-artifact@v4
  with:
    name: junit-results
    path: test-results/results.xml
```

### 3. PR Comment Summary
```yaml
# Use github-script to post results on PR
- uses: actions/github-script@v7
  with:
    script: |
      const fs = require('fs');
      const results = JSON.parse(fs.readFileSync('test-results/results.json'));
      const passed = results.suites.reduce((acc, s) => acc + s.specs.filter(t => t.ok).length, 0);
      const failed = results.suites.reduce((acc, s) => acc + s.specs.filter(t => !t.ok).length, 0);
      // Post comment...
```

---

## 🔐 Security Best Practices

| Practice | Implementation |
|----------|----------------|
| **No hardcoded credentials** | Use secrets/variables |
| **Separate test accounts** | Dedicated CI test user |
| **Rotate passwords** | Quarterly via secret rotation |
| **Limit permissions** | Read-only CI token where possible |
| **Audit logs** | Enable CI audit logging |

---

## ⚡ Performance Optimization

| Optimization | Config |
|--------------|--------|
| **Parallel workers** | `workers: 4` in `playwright.config.ts` |
| **Sharding** | `npx playwright test --shard=1/4` |
| **Cache node_modules** | `actions/cache@v4` with `npm` key |
| **Cache browsers** | `actions/cache@v4` with `~/.cache/ms-playwright` |
| **Fail fast** | `forbidOnly: true` in config |

---

## 📋 CI Checklist

- [ ] Secrets configured (email, password, base URL)
- [ ] Browsers installed (`--with-deps`)
- [ ] Node cached
- [ ] Browsers cached
- [ ] Artifacts uploaded (report, results, traces)
- [ ] PR comments enabled
- [ ] Nightly schedule configured
- [ ] Failure notifications (Slack/Email/Teams)
- [ ] Test results dashboard accessible

---

> **Last Updated:** 2026-11-22 | **Owner:** Suraj Navgire