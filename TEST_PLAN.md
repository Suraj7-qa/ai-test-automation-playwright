# Demo Web Shop - Comprehensive Test Plan

**Version:** 1.0  
**Date:** 2026-11-26  
**Author:** Suraj Navgire QA  
**Application:** https://demowebshop.tricentis.com/

---

## 1. Executive Summary

This test plan defines the comprehensive test coverage strategy for the Tricentis Demo Web Shop e-commerce application. It documents current coverage, identifies gaps, and provides a prioritized roadmap for achieving complete functional, negative, boundary, accessibility, and automation test coverage.

### Current State (as of 2026-11-26)

| Metric | Value |
|--------|-------|
| **Total Manual Test Cases** | 408 (across 10 modules) |
| **Test Case Workbook** | `manual-test-cases/test-cases-auth.xlsx` |
| **Modules Covered** | Authentication, Navigation, Books, Computers, Electronics, Apparel & Shoes, Digital Downloads, Jewelry, Wishlist, Checkout |
| **Module In Progress** | Gift Cards (agent working) |
| **Automation Scripts** | 7/11 modules have Playwright specs |
| **Page Objects Framework** | Established (JSON locators + TypeScript steps) |

---

## 2. Application Module Inventory

### 2.1 Core Shopping Modules (7 Main Categories)

| Category | URL | Sub-Categories | Products | Test Cases | Status |
|----------|-----|----------------|----------|------------|--------|
| **Books** | `/books` | — | 6 | 40 | ✅ Complete |
| **Computers** | `/computers` | Desktops, Notebooks, Accessories | ~10 | 24 | ⚠️ Sub-cats missing |
| **Electronics** | `/electronics` | Camera/Photo, Cell Phones | ~5 | 32 | ⚠️ Sub-cats missing |
| **Apparel & Shoes** | `/apparel-shoes` | — | 14 (2 pages) | 30 | ⚠️ Pagination only |
| **Digital Downloads** | `/digital-downloads` | — | 3 | 40 | ✅ Complete |
| **Jewelry** | `/jewelry` | — | 5 | 60 | ✅ Complete |
| **Gift Cards** | `/gift-cards` | — | ~5 | ~0 | 🔄 In Progress |

### 2.2 Core User Journey Modules

| Module | URL | Test Cases | Status |
|--------|-----|------------|--------|
| **Authentication** | `/login`, `/register` | 49 | ✅ Complete |
| **Navigation** | Header, sidebar, breadcrumbs | 47 | ✅ Complete |
| **Shopping Cart** | `/cart` | 64 (in Checkout) | ⚠️ Partial (embedded) |
| **Checkout (6-step)** | `/cart` → `/checkout` | 64 | ✅ Complete |
| **Wishlist** | `/wishlist` | 22 | ✅ Complete |
| **My Account** | `/customer/*` | 0 | ❌ Missing |
| **Contact Us** | `/contactus` | 0 | ❌ Missing |

### 2.3 Supporting Pages (Static/Utility)

| Page | URL | Test Cases | Status |
|------|-----|------------|--------|
| Home Page | `/` | 0 | ❌ Missing |
| Search | `/search` | Partial | ⚠️ In Navigation |
| Sitemap | `/sitemap` | 0 | ❌ Missing |
| About Us | `/about-us` | 0 | ❌ Missing |
| Shipping & Returns | `/shipping-returns` | 0 | ❌ Missing |
| Privacy Notice | `/privacy-policy` | 0 | ❌ Missing |
| Conditions of Use | `/conditions-of-use` | 0 | ❌ Missing |
| News | `/news` | 0 | ❌ Missing |
| Blog | `/blog` | 0 | ❌ Missing |
| Recently Viewed | `/recentlyviewedproducts` | 0 | ❌ Missing |
| Compare Products | `/compareproducts` | 0 | ❌ Missing |
| New Products | `/newproducts` | 0 | ❌ Missing |
| Manufacturer | `/tricentis` | 0 | ❌ Missing |

### 2.4 Product-Level Features (Cross-Cutting)

| Feature | Coverage | Status |
|---------|----------|--------|
| Product Reviews | Jewelry only | ⚠️ Partial |
| Email a Friend | Jewelry only | ⚠️ Partial |
| Add to Compare | Jewelry only | ⚠️ Partial |
| Product Tags | Jewelry only | ⚠️ Partial |
| Newsletter Subscription | Multiple pages | ⚠️ Partial |
| Community Poll | Home page only | ❌ Missing |

---

## 3. Current Test Case Distribution

### 3.1 By Module

| Module | Total | Functional | Negative | Boundary | Accessibility | Edge Cases |
|--------|-------|------------|----------|----------|---------------|------------|
| Authentication | 49 | 25 | 15 | 5 | 2 | 2 |
| Navigation | 47 | 30 | 10 | 4 | 2 | 1 |
| Books | 40 | 22 | 8 | 5 | 3 | 2 |
| Computers | 24 | 15 | 5 | 2 | 1 | 1 |
| Electronics | 32 | 20 | 7 | 3 | 1 | 1 |
| Apparel & Shoes | 30 | 18 | 6 | 3 | 2 | 1 |
| Digital Downloads | 40 | 25 | 8 | 4 | 2 | 1 |
| Jewelry | 60 | 57 | 0 | 0 | 3 | 0 |
| Wishlist | 22 | 15 | 4 | 2 | 1 | 0 |
| Checkout | 64 | 35 | 15 | 8 | 4 | 2 |
| **TOTAL** | **408** | **262** | **78** | **36** | **21** | **11** |

### 3.2 By Automation Tag

| Module | Automated | Manual | % Automated |
|--------|-----------|--------|-------------|
| Authentication | 48 | 1 | 98% |
| Navigation | 47 | 0 | 100% |
| Books | 40 | 0 | 100% |
| Computers | 0 | 24 | 0% |
| Electronics | 4 | 0 | 100%* |
| Apparel & Shoes | 14 | 16 | 47% |
| Digital Downloads | 0 | 40 | 0% |
| Jewelry | 0 | 60 | 0% |
| Wishlist | 0 | 22 | 0% |
| Checkout | 45 | 19 | 70% |
| **TOTAL** | **198** | **182** | **52%** |

> *Note: "Automated" tag in workbook is aspirational. Only 7 modules have actual Playwright `.spec.ts` files.

---

## 4. Gap Analysis

### 4.1 Critical Gaps (P0 - Must Have)

| Gap ID | Area | Missing Coverage | Est. Test Cases | Priority |
|--------|------|------------------|-----------------|----------|
| GAP-001 | Computers Sub-categories | Desktops, Notebooks, Accessories category pages + products | 30-40 | P0 |
| GAP-002 | Electronics Sub-categories | Camera/Photo, Cell Phones category pages + products | 20-30 | P0 |
| GAP-003 | My Account Module | Info, Orders, Addresses pages | 25-35 | P0 |
| GAP-004 | Contact Us | Form validation, submission, error handling | 15-20 | P0 |
| GAP-005 | Static Info Pages | About, Shipping, Privacy, Conditions, Sitemap | 20-25 | P0 |
| GAP-006 | Shopping Cart (Standalone) | Empty cart, qty updates, remove, coupons, shipping estimate | 20-25 | P0 |
| GAP-007 | Advanced Search | Category filter, manufacturer filter, price range, auto-complete | 15-20 | P0 |

### 4.2 High Gaps (P1 - Should Have)

| Gap ID | Area | Missing Coverage | Est. Test Cases | Priority |
|--------|------|------------------|-----------------|----------|
| GAP-008 | News/Blog | Article listing, detail, search | 10-15 | P1 |
| GAP-009 | Compare Products | Add/remove, comparison view | 8-12 | P1 |
| GAP-010 | Recently Viewed | Display, clear, navigation | 5-8 | P1 |
| GAP-011 | New Products | Listing, pagination | 5-8 | P1 |
| GAP-012 | Community Poll | Vote, results display | 5-8 | P1 |
| GAP-013 | Manufacturer Page | Tricentis products listing | 5-8 | P1 |

### 4.3 Medium Gaps (P2 - Nice to Have)

| Gap ID | Area | Missing Coverage | Est. Test Cases | Priority |
|--------|------|------------------|-----------------|----------|
| GAP-014 | Product Reviews (All) | View, add, pagination for all products | 20-30 | P2 |
| GAP-015 | Email a Friend (All) | Form validation, submission for all products | 15-20 | P2 |
| GAP-016 | Product Tags (All) | Tag cloud, tag filtering | 10-15 | P2 |
| GAP-017 | Newsletter (Standalone) | Subscribe/unsubscribe, validation | 8-12 | P2 |
| GAP-018 | Home Page | Featured products, poll, recently viewed | 10-15 | P2 |

---

## 5. Automation Coverage Plan

### 5.1 Current Playwright Specs

| Spec File | Module | Page Objects | Steps | Status |
|-----------|--------|--------------|-------|--------|
| `login.spec.ts` | Authentication | ✅ | ✅ | ✅ Complete |
| `register.spec.ts` | Authentication | ✅ | ✅ | ✅ Complete |
| `password-recovery.spec.ts` | Authentication | ✅ | ✅ | ✅ Complete |
| `logout.spec.ts` | Authentication | ✅ | ✅ | ✅ Complete |
| `navigation.spec.ts` | Navigation | ✅ | ✅ | ✅ Complete |
| `navigation-module.spec.ts` | Navigation | ✅ | ✅ | ✅ Complete |
| `books.spec.ts` | Books | ✅ | ✅ | ✅ Complete |
| `computers.spec.ts` | Computers | ✅ | ✅ | ⚠️ Workbook says Manual |
| `electronics.spec.ts` | Electronics | ✅ | ✅ | ✅ Complete |
| `apparel-shoes.spec.ts` | Apparel & Shoes | ✅ | ✅ | ✅ Complete |
| `digital-downloads.spec.ts` | Digital Downloads | ✅ | ✅ | ⚠️ Workbook says Manual |

### 5.2 Missing Automation (Priority Order)

| Priority | Module | Test Cases to Automate | Page Objects Needed | Steps Needed | Spec File |
|----------|--------|------------------------|---------------------|--------------|-----------|
| **P0** | **Checkout** | 45 | `checkout-page.json` | `checkout-steps.ts` | `checkout.spec.ts` |
| **P0** | **Jewelry** | 60 | `jewelry-page.json`, `jewelry-product-detail-page.json` | `jewelry-steps.ts` | `jewelry.spec.ts` |
| **P0** | **Wishlist** | 22 | `wishlist-page.json` | `wishlist-steps.ts` | `wishlist.spec.ts` |
| **P1** | **Gift Cards** | TBD | `gift-cards-page.json`, `gift-card-detail-page.json` | `gift-cards-steps.ts` | `gift-cards.spec.ts` |
| **P1** | **Digital Downloads** | 40 | ✅ Exist | ✅ Exist | `digital-downloads.spec.ts` (update tags) |
| **P1** | **Computers** | 24 | ✅ Exist | ✅ Exist | `computers.spec.ts` (update tags) |
| **P2** | **My Account** | 25-35 | `my-account-page.json`, `orders-page.json`, `addresses-page.json` | `my-account-steps.ts` | `my-account.spec.ts` |
| **P2** | **Contact Us** | 15-20 | `contact-us-page.json` | `contact-us-steps.ts` | `contact-us.spec.ts` |
| **P2** | **Shopping Cart** | 20-25 | `shopping-cart-page.json` | `shopping-cart-steps.ts` | `shopping-cart.spec.ts` |
| **P2** | **Search** | 15-20 | `search-page.json` | `search-steps.ts` | `search.spec.ts` |
| **P3** | **Static Pages** | 20-25 | `static-pages.json` | `static-pages-steps.ts` | `static-pages.spec.ts` |

### 5.3 Automation Framework Standards

All new automation must follow the established pattern:

```
page-objects/page-elements/<module>-page.json      # Playwright locators (getByRole, getByLabel, getByText, getByTestId, getByPlaceholder)
page-objects/page-steps/<module>-steps.ts           # Page Object Model classes with TypeScript
tests/ui/<module>.spec.ts                           # Test specs using page-steps
```

**Locator Priority (Playwright Best Practices):**
1. `getByRole()` - ARIA roles
2. `getByLabel()` - Form labels
3. `getByText()` - Visible text
4. `getByTestId()` - data-testid attributes
5. `getByPlaceholder()` - Input placeholders
6. CSS/XPath - Only as last resort

---

## 6. Test Case Creation Roadmap

### Phase 1: Complete Core Category Coverage (Weeks 1-2)
| Task | Module | Test Cases | Owner | Dependencies |
|------|--------|------------|-------|--------------|
| 1.1 | Gift Cards | ~40-50 | Manual Test Case Generator | — |
| 1.2 | Computers Sub-cats | 30-40 | Manual Test Case Generator | — |
| 1.3 | Electronics Sub-cats | 20-30 | Manual Test Case Generator | — |

### Phase 2: Core User Journey Gaps (Weeks 2-3)
| Task | Module | Test Cases | Owner | Dependencies |
|------|--------|------------|-------|--------------|
| 2.1 | My Account | 25-35 | Manual Test Case Generator | — |
| 2.2 | Contact Us | 15-20 | Manual Test Case Generator | — |
| 2.3 | Static Info Pages | 20-25 | Manual Test Case Generator | — |
| 2.4 | Shopping Cart (Standalone) | 20-25 | Manual Test Case Generator | — |
| 2.5 | Advanced Search | 15-20 | Manual Test Case Generator | — |

### Phase 3: Supporting Features (Weeks 3-4)
| Task | Module | Test Cases | Owner | Dependencies |
|------|--------|------------|-------|--------------|
| 3.1 | News/Blog | 10-15 | Manual Test Case Generator | — |
| 3.2 | Compare Products | 8-12 | Manual Test Case Generator | — |
| 3.3 | Recently Viewed | 5-8 | Manual Test Case Generator | — |
| 3.4 | New Products | 5-8 | Manual Test Case Generator | — |
| 3.4 | Community Poll | 5-8 | Manual Test Case Generator | — |
| 3.5 | Manufacturer Page | 5-8 | Manual Test Case Generator | — |

### Phase 4: Cross-Cutting Product Features (Weeks 4-5)
| Task | Module | Test Cases | Owner | Dependencies |
|------|--------|------------|-------|--------------|
| 4.1 | Product Reviews (All) | 20-30 | Manual Test Case Generator | — |
| 4.2 | Email a Friend (All) | 15-20 | Manual Test Case Generator | — |
| 4.3 | Product Tags (All) | 10-15 | Manual Test Case Generator | — |
| 4.4 | Newsletter (Standalone) | 8-12 | Manual Test Case Generator | — |
| 4.5 | Home Page | 10-15 | Manual Test Case Generator | — |

### Phase 5: Automation Implementation (Parallel, Weeks 2-6)
| Sprint | Module | Automation Tasks |
|--------|--------|------------------|
| Sprint 1 | Checkout | Page objects → Steps → Spec (45 tests) |
| Sprint 2 | Jewelry | Page objects → Steps → Spec (60 tests) |
| Sprint 3 | Wishlist | Page objects → Steps → Spec (22 tests) |
| Sprint 4 | Gift Cards | Page objects → Steps → Spec (TBD tests) |
| Sprint 5 | My Account | Page objects → Steps → Spec (25-35 tests) |
| Sprint 6 | Cart, Search, Contact | Page objects → Steps → Spec |

---

## 7. Test Execution Strategy

### 7.1 Manual Test Execution

| Cycle | Scope | Duration | Entry Criteria | Exit Criteria |
|-------|-------|----------|----------------|---------------|
| **Sanity** | Critical path: Browse → Cart → Checkout | 2 hours | Build deployed | 0 P0/P1 failures |
| **Regression** | All 408+ test cases | 2 days | Sanity passed | 0 Critical/High defects |
| **Module-Specific** | Single module deep dive | 4 hours | Module code complete | Module coverage 100% |
| **Accessibility** | All pages (WCAG 2.1 AA) | 1 day | UI stable | 0 Critical a11y issues |

### 7.2 Automated Test Execution

| Pipeline | Trigger | Scope | Duration |
|----------|---------|-------|----------|
| **CI - PR** | Pull Request | Auth, Navigation, Books, Electronics, Apparel | 15 min |
| **CI - Nightly** | Scheduled (2 AM) | All automated specs | 45 min |
| **Release** | Tag/Release | Full regression suite | 60 min |

### 7.3 Test Data Management

| Data Type | Strategy |
|-----------|----------|
| User Accounts | Pre-seeded: guest, registered, admin |
| Products | Use existing catalog (30+ products) |
| Coupons | Test-specific codes via DB seed |
| Gift Cards | Pre-created test cards |
| Payment | Test card numbers (4111 1111 1111 1111 for Visa) |

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gift Cards agent delays | Medium | High | Manual fallback; parallel manual creation |
| Sub-category pages have different structures | High | Medium | Explore each sub-category before test creation |
| My Account requires authenticated state | High | High | Create auth helpers in page-steps |
| Checkout flow changes break automation | Medium | High | Stable locators; page object abstraction |
| Static pages have no testable behavior | Low | Low | Focus on content verification, links |
| Test data pollution between runs | Medium | High | Cleanup in afterEach; isolated test data |

---

## 9. Success Metrics

### 9.1 Coverage Targets

| Metric | Current | Target (Phase 1) | Target (Final) |
|--------|---------|------------------|----------------|
| Manual Test Cases | 408 | 550+ | 600-650 |
| Modules with Test Cases | 10 | 13 | 20+ |
| Pages Covered | ~15 | 20+ | 25+ |
| Automation % (workbook) | 52% | 65% | 80% |
| Modules with Playwright Specs | 7 | 10 | 15+ |

### 9.2 Quality Targets

| Metric | Target |
|--------|--------|
| P0 Defect Leakage | 0 |
| P1 Defect Leakage | <2 |
| Test Case Review Coverage | 100% |
| Automation Flakiness | <2% |
| Test Execution Pass Rate | >95% |

---

## 10. Tooling & Infrastructure

| Tool | Purpose | Status |
|------|---------|--------|
| **Playwright MCP** | Browser inspection, exploration | ✅ Active |
| **Manual Test Case Generator Agent** | Workbook test case creation | ✅ Active |
| **Automation Test Generator Agent** | Playwright spec generation | ⚠️ Available |
| **openpyxl** | Workbook manipulation | ✅ Available |
| **Git** | Version control | ✅ Active |
| **VS Code** | IDE | ✅ Active |

---

## 11. Appendix: Quick Reference

### 11.1 Test Case ID Ranges

| Module | ID Prefix | Range |
|--------|-----------|-------|
| Authentication | DWS-TC | 0001-0049 |
| Navigation | DWS-NAV | 001-047 |
| Books | DWS-BOOKS | 001-040 |
| Computers | DWS-COMP | 001-024 |
| Electronics | ELEC | 001-032 |
| Apparel & Shoes | DWS-APPAREL | 001-030 |
| Digital Downloads | DD | 001-040 |
| Jewelry | DWS-JEW | 001-060 |
| Wishlist | DWS-WISH | 001-022 |
| Checkout | DWS-TC | 0050-0113 |
| Gift Cards | DWS-GC | 200+ (planned) |

### 11.2 Column Definitions (15-Column Workbook)

| Col | Header | Description |
|-----|--------|-------------|
| A | TC ID | Unique identifier |
| B | Module | Top-level module name |
| C | Feature | Functional area |
| D | Scenario | Brief test description |
| E | Preconditions | Required setup |
| F | Test Steps | Numbered steps |
| G | Expected Result | Pass criteria |
| H | Priority | High/Medium/Low |
| I | Status | Draft/Reviewed/Approved |
| J | Type | Functional/Negative/Boundary/Accessibility/Edge |
| K | Automation | Automated/Manual |
| L | Tags | Comma-separated labels |
| M | Requirements | Linked requirement IDs |
| N | Source File | Origin (Manual exploration, etc.) |
| O | Created By | Author |

---

## 12. Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Dev Lead | | | |
| Product Owner | | | |

---

*This is a living document. Update with each phase completion.*