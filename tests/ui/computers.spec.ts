import { test, expect } from '@playwright/test';
import { ComputersPageSteps } from '../../page-objects/page-steps';

test.describe('Computers module - risk-based regression', () => {
  let computersSteps: ComputersPageSteps;

  test.beforeEach(async ({ page }) => {
    computersSteps = new ComputersPageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  // Navigation tests
  test('DWS-COMP-001: Open Computers from main menu @smoke @regression', async () => {
    await computersSteps.navigateToComputersFromHeader();
  });

  test('DWS-COMP-002: Verify Computers subcategories @smoke @regression', async () => {
    await computersSteps.verifyComputersSubcategories();
  });

  test('DWS-COMP-003: Open each subcategory from sidebar @regression', async () => {
    await computersSteps.verifySubcategoryFromSidebar('Desktops');
    await computersSteps.verifySubcategoryFromSidebar('Notebooks');
    await computersSteps.verifySubcategoryFromSidebar('Accessories');
  });

  // Catalogue tests
  test('DWS-COMP-005: Verify desktop products and prices @smoke @regression', async () => {
    await computersSteps.verifyDesktopCatalogue();
  });

  test('DWS-COMP-006: Verify notebook catalogue @smoke @regression', async () => {
    await computersSteps.verifyNotebookCatalogue();
  });

  test('DWS-COMP-007: Verify accessories catalogue @regression', async () => {
    await computersSteps.verifyAccessoriesCatalogue();
  });

  // Catalogue controls
  test('DWS-COMP-008: Sort desktops by price low to high @regression', async () => {
    await computersSteps.verifyDesktopSort('Price: Low to High');
  });

  test('DWS-COMP-009: Sort desktops by price high to low @regression', async () => {
    await computersSteps.verifyDesktopSort('Price: High to Low');
  });

  test('DWS-COMP-010: Switch desktop catalogue between grid and list @regression', async () => {
    await computersSteps.verifyDisplayViewAndPageSize();
  });

  test('DWS-COMP-011: Change the number of desktop products per page @regression', async () => {
    // Covered in DWS-COMP-010
  });

  // Filters
  test('DWS-COMP-012: Filter desktops by price range @regression', async () => {
    await computersSteps.verifyDesktopPriceFilters();
  });

  test('DWS-COMP-013: Filter notebooks by Intel CPU @regression', async () => {
    await computersSteps.verifyNotebookAttributeFilter('Intel');
  });

  test('DWS-COMP-014: Filter notebooks by 3 GB memory @regression', async () => {
    await computersSteps.verifyNotebookAttributeFilter('3 GB');
  });

  // Product details
  test('DWS-COMP-015: Verify configurable desktop product details @regression', async () => {
    await computersSteps.page.goto('/build-your-own-computer', { waitUntil: 'domcontentloaded' });
    await expect(computersSteps.elements.getLocator('desktopProductDetailHeading')).toHaveText('Build your own computer');
    await expect(computersSteps.elements.getLocator('desktopProductDetailsForm')).toBeVisible();
    await expect(computersSteps.elements.getLocator('ramSelect')).toBeVisible();
    await expect(computersSteps.elements.getLocator('desktopHddOption')).toBeVisible();
    await expect(computersSteps.elements.getLocator('desktopOsOption')).toBeVisible();
    await expect(computersSteps.elements.getLocator('desktopSoftwareOptions')).toBeVisible();
  });

  // DWS-COMP-016: RAM price change - SKIPPED: Demo site doesn't update price via AJAX
  test.skip('DWS-COMP-016: Verify RAM selection changes desktop price @regression @demo-limitation', async () => {
    await computersSteps.verifyRamSelectionChangesPrice();
  });

  // Shopping cart
  test('DWS-COMP-017: Add configured desktop to cart @smoke @regression @critical', async () => {
    await computersSteps.verifyConfiguredDesktopAddedToCart(1);
  });

  test('DWS-COMP-018: Add multiple desktop units to cart @regression', async () => {
    await computersSteps.verifyConfiguredDesktopAddedToCart(2);
  });

  test('DWS-COMP-019: Quick-add a simple desktop from the category page @smoke @regression', async () => {
    await computersSteps.verifyQuickAddDesktop();
  });

  test('DWS-COMP-020: Reject a zero quantity for a desktop product @negative @regression', async () => {
    await computersSteps.verifyRejectZeroQuantity();
  });

  // Compare products - SKIPPED: Demo site doesn't have compare button on category page
  test.skip('DWS-COMP-021: Add a desktop to the comparison list @regression @demo-limitation', async () => {
    await computersSteps.verifyAddToCompare();
  });

  // Product reviews
  test('DWS-COMP-022: Open reviews for a desktop product @regression', async () => {
    await computersSteps.verifyOpenReviews();
  });

  // Email a friend - SKIPPED: Demo site doesn't have email-friend button on product page
  test.skip('DWS-COMP-023: Open Email a Friend for a desktop product @regression @demo-limitation', async () => {
    await computersSteps.verifyOpenEmailFriend();
  });

  // Cart persistence
  test('DWS-COMP-024: Preserve cart while browsing Computers categories @regression', async () => {
    await computersSteps.verifyCartPersistsAcrossComputerCategories();
  });

  // Breadcrumb navigation
  test('DWS-COMP-004: Navigate from a desktop product back to Computers @smoke @regression', async () => {
    await computersSteps.verifyBreadcrumbFromProduct();
  });
});