---
title: "Traceability Matrix"
module: "Authentication, Navigation"
version: "1.1"
date: "2026-11-22"
author: "Suraj Navgire"
status: "Planning"
auto_update: "Post-CI-run"
tags: ["traceability", "requirements", "test-cases", "authentication", "navigation"]
---

# Traceability Matrix - Demo Web Shop Authentication & Navigation

> **Framework:** Playwright TypeScript | **Modules:** Authentication, Navigation | **Auto-updated:** Post-CI-run

**Version:** 1.1 | **Date:** 2026-11-22 | **Author:** Suraj Navgire | **Status:** Planning (Auto-populated after each test run)

---

## Module-Level Traceability

| Module | Requirement ID | Requirement Description | Test Cases (Auto-populate) | Automation Status | Execution Status | Pass Rate | Defects | Notes |
|--------|---------------|------------------------|---------------------------|-------------------|------------------|-----------|---------|-------|
| **Authentication - Registration** | REQ-AUTH-001 | New User Registration | DWS-TC-0001 to DWS-TC-0005 + edge cases | Automated | Not Run | - | - | Update per sprint |
| **Authentication - Login** | REQ-AUTH-002 | User Login | DWS-TC-0006 to DWS-TC-0010 + edge cases | Automated | Not Run | - | - | Update per sprint |
| **Authentication - Logout** | REQ-AUTH-003 | User Logout | DWS-TC-0011 + edge cases | Automated | Not Run | - | - | Update per sprint |
| **Authentication - Password Recovery** | REQ-AUTH-004 | Forgot Password | DWS-TC-0012 to DWS-TC-0013 + edge cases | Automated | Not Run | - | - | Update per sprint |
| **Authentication - Navigation** | REQ-AUTH-005 | Login ↔ Register Navigation | DWS-TC-0014 to DWS-TC-0015 + edge cases | Automated | Not Run | - | - | Update per sprint |
| **Navigation - Header Menu** | REQ-NAV-001 | Main Category Navigation | DWS-NAV-001 to DWS-NAV-015 | Automated | Not Run | - | - | Update per sprint |
| **Navigation - Sub-categories** | REQ-NAV-002 | Sub-category Navigation (Computers) | DWS-NAV-008 to DWS-NAV-010 | Automated | Not Run | - | - | Update per sprint |
| **Navigation - Sidebar** | REQ-NAV-003 | Sidebar Category Navigation | DWS-NAV-016 to DWS-NAV-020 | Automated | Not Run | - | - | Update per sprint |
| **Navigation - Footer** | REQ-NAV-004 | Footer Links Navigation | DWS-NAV-021 to DWS-NAV-038 | Automated | Not Run | - | - | Update per sprint |
| **Navigation - Search** | REQ-NAV-005 | Search Functionality | DWS-NAV-039 to DWS-NAV-041 | Automated | Not Run | - | - | Update per sprint |
| **Navigation - Breadcrumbs** | REQ-NAV-006 | Breadcrumb Navigation | DWS-NAV-042 to DWS-NAV-044 | Automated | Not Run | - | - | Update per sprint |
| **Navigation - Cross-module** | REQ-NAV-007 | Cross-module Navigation | DWS-NAV-045 to DWS-NAV-047 | Automated | Not Run | - | - | Update per sprint |

---

## Detailed Test Case Mapping (Reference)

### REQ-AUTH-001: Registration
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-TC-0001 | Valid Registration | Positive | High | Automated | Not Run |
| DWS-TC-0002 | Duplicate Email | Negative | High | Automated | Not Run |
| DWS-TC-0003 | Missing Required Fields | Negative | High | Automated | Not Run |
| DWS-TC-0004 | Password Mismatch | Negative | High | Automated | Not Run |
| DWS-TC-0005 | Invalid Email Format | Negative | Medium | Automated | Not Run |
| *Extended* | Short Password | Negative | Medium | Automated | Not Run |
| *Extended* | Female Gender | Positive | Medium | Automated | Not Run |
| *Extended* | Special Characters in Name | Positive | Low | Automated | Not Run |
| *Extended* | Unicode Characters | Positive | Low | Automated | Not Run |
| *Extended* | Long Email | Negative | Low | Automated | Not Run |
| *Extended* | Multiple Registrations | Positive | Medium | Automated | Not Run |

### REQ-AUTH-002: Login
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-TC-0006 | Valid Login | Positive | Critical | Automated | Not Run |
| DWS-TC-0007 | Invalid Password | Negative | High | Automated | Not Run |
| DWS-TC-0008 | Unregistered Email | Negative | High | Automated | Not Run |
| DWS-TC-0009 | Empty Credentials | Negative | Medium | Automated | Not Run |
| DWS-TC-0010 | Remember Me | Positive | Medium | Manual | Not Run |
| *Extended* | Special Characters Email | Negative | Low | Automated | Not Run |
| *Extended* | Long Password | Negative | Low | Automated | Not Run |
| *Extended* | Multiple Failed Attempts | Negative | Medium | Automated | Not Run |

### REQ-AUTH-003: Logout
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-TC-0011 | Successful Logout | Positive | High | Automated | Not Run |
| *Extended* | Redirect to Home | Positive | Medium | Automated | Not Run |
| *Extended* | Links Visible After | Positive | Medium | Automated | Not Run |
| *Extended* | Email Hidden After | Positive | Medium | Automated | Not Run |
| *Extended* | Cart Shows 0 | Positive | Low | Automated | Not Run |

### REQ-AUTH-004: Password Recovery
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-TC-0012 | Valid Recovery | Positive | High | Automated | Not Run |
| DWS-TC-0013 | Unregistered Email | Negative | Medium | Automated | Not Run |
| *Extended* | Empty Email | Negative | Medium | Automated | Not Run |
| *Extended* | Invalid Email Format | Negative | Medium | Automated | Not Run |
| *Extended* | Back to Login | Positive | Low | Automated | Not Run |
| *Extended* | Page Elements | Positive | Low | Automated | Not Run |
| *Extended* | Email Retained After Error | Negative | Low | Automated | Not Run |

### REQ-AUTH-005: Auth Navigation
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-TC-0014 | Login → Register | Positive | Low | Automated | Not Run |
| DWS-TC-0015 | Register → Login | Positive | Low | Automated | Not Run |
| *Extended* | Home → Login | Positive | Low | Automated | Not Run |
| *Extended* | Home → Register | Positive | Low | Automated | Not Run |
| *Extended* | Login → Recovery | Positive | Low | Automated | Not Run |
| *Extended* | Recovery → Login | Positive | Low | Automated | Not Run |
| *Extended* | Full Cycle | Positive | Medium | Automated | Not Run |

---

### REQ-NAV-001: Header Menu - Main Categories
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-001 | Navigate to Books | Positive | High | Automated | Not Run |
| DWS-NAV-002 | Navigate to Computers | Positive | High | Automated | Not Run |
| DWS-NAV-003 | Navigate to Electronics | Positive | High | Automated | Not Run |
| DWS-NAV-004 | Navigate to Apparel & Shoes | Positive | High | Automated | Not Run |
| DWS-NAV-005 | Navigate to Digital downloads | Positive | Medium | Automated | Not Run |
| DWS-NAV-006 | Navigate to Jewelry | Positive | Medium | Automated | Not Run |
| DWS-NAV-007 | Navigate to Gift Cards | Positive | Medium | Automated | Not Run |

### REQ-NAV-002: Header Menu - Sub-categories
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-008 | Navigate to Desktops | Positive | Medium | Automated | Not Run |
| DWS-NAV-009 | Navigate to Notebooks | Positive | Medium | Automated | Not Run |
| DWS-NAV-010 | Navigate to Accessories | Positive | Medium | Automated | Not Run |

### REQ-NAV-001: Header Menu - Top Links
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-011 | Click Register link | Positive | Medium | Automated | Not Run |
| DWS-NAV-012 | Click Log in link | Positive | Medium | Automated | Not Run |
| DWS-NAV-013 | Click Shopping cart link | Positive | Medium | Automated | Not Run |
| DWS-NAV-014 | Click Wishlist link | Positive | Medium | Automated | Not Run |

### REQ-NAV-001: Header Menu - Logo
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-015 | Click Logo navigates to Home | Positive | High | Automated | Not Run |

### REQ-NAV-003: Sidebar Categories
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-016 | Expand Computers shows sub-categories | Positive | Medium | Automated | Not Run |
| DWS-NAV-017 | Click Desktops from sidebar | Positive | Medium | Automated | Not Run |
| DWS-NAV-018 | All main categories present | Positive | High | Automated | Not Run |
| DWS-NAV-019 | Manufacturers section present | Positive | Low | Automated | Not Run |
| DWS-NAV-020 | Newsletter section present | Positive | Low | Automated | Not Run |

### REQ-NAV-004: Footer Links - Information
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-021 | Sitemap link | Positive | Low | Automated | Not Run |
| DWS-NAV-022 | Shipping & returns link | Positive | Low | Automated | Not Run |
| DWS-NAV-023 | Privacy notice link | Positive | Low | Automated | Not Run |
| DWS-NAV-024 | Conditions of Use link | Positive | Low | Automated | Not Run |
| DWS-NAV-025 | About us link | Positive | Low | Automated | Not Run |
| DWS-NAV-026 | Contact us link | Positive | Low | Automated | Not Run |

### REQ-NAV-004: Footer Links - Customer Service
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-027 | Search link | Positive | Low | Automated | Not Run |
| DWS-NAV-028 | Advanced search link | Positive | Low | Automated | Not Run |
| DWS-NAV-029 | Orders and returns link | Positive | Low | Automated | Not Run |

### REQ-NAV-004: Footer Links - My Account
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-030 | My account link | Positive | Low | Automated | Not Run |
| DWS-NAV-031 | Order history link | Positive | Low | Automated | Not Run |
| DWS-NAV-032 | Downloadable products link | Positive | Low | Automated | Not Run |
| DWS-NAV-033 | Newsletter link | Positive | Low | Automated | Not Run |
| DWS-NAV-034 | Reward points link | Positive | Low | Automated | Not Run |

### REQ-NAV-004: Footer Links - Follow Us
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-035 | Facebook link | Positive | Low | Automated | Not Run |
| DWS-NAV-036 | Twitter link | Positive | Low | Automated | Not Run |
| DWS-NAV-037 | YouTube link | Positive | Low | Automated | Not Run |
| DWS-NAV-038 | nopCommerce link | Positive | Low | Automated | Not Run |

### REQ-NAV-005: Search Functionality
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-039 | Search valid term | Positive | High | Automated | Not Run |
| DWS-NAV-040 | Search invalid term | Negative | Medium | Automated | Not Run |
| DWS-NAV-041 | Search empty term | Negative | Low | Automated | Not Run |

### REQ-NAV-006: Breadcrumbs
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-042 | Breadcrumbs on category page | Positive | Medium | Automated | Not Run |
| DWS-NAV-043 | Breadcrumbs on sub-category page | Positive | Medium | Automated | Not Run |
| DWS-NAV-044 | Click breadcrumb Home | Positive | Medium | Automated | Not Run |

### REQ-NAV-007: Cross-module Navigation
| Test Case ID | Scenario | Type | Priority | Automation | Status |
|-------------|----------|------|----------|------------|--------|
| DWS-NAV-045 | Navigate between categories | Positive | High | Automated | Not Run |
| DWS-NAV-046 | Navigation persists cart count | Positive | Medium | Automated | Not Run |
| DWS-NAV-047 | Navigation persists user session | Positive | Medium | Automated | Not Run |

---

## Summary Metrics (Auto-calculated after run)

| Metric | Value |
|--------|-------|
| Total Requirements | 12 (5 Auth + 7 Nav) |
| Total Test Cases (Base) | 15 (Auth) + 47 (Nav) = 62 |
| Total Test Cases (Extended) | 47 (Auth) + 47 (Nav) = 94 |
| Automated | 93 |
| Manual | 1 (Remember Me) |
| @smoke | 8 (Auth) + 7 (Nav) = 15 |
| @regression | 35 (Auth) + 40 (Nav) = 75 |
| @negative | 15 (Auth) + 4 (Nav) = 19 |
| @critical | 1 (Auth) |

---

## Update Instructions

**After each test run:**
1. Fill "Execution Status" (Pass/Fail/Blocked/Not Run)
2. Fill "Pass Rate" (Passed/Total per module)
3. Add Defect IDs in "Defects" column
3. Update "Notes" with any observations

**When adding new modules:**
1. Add row in Module-Level table
2. Add detailed mapping section
3. Update Summary Metrics