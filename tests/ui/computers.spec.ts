import { test } from '@playwright/test';
import { ComputersPageSteps } from '../../page-objects/page-steps';

test.describe('Computers module - risk-based regression', () => {
  let computersSteps: ComputersPageSteps;

  test.beforeEach(async ({ page }) => {
    computersSteps = new ComputersPageSteps(page);
  });

  test('DWS-COMP-002: Verify Computers subcategories @smoke @regression', async () => {
    await computersSteps.verifyComputersSubcategories();
  });

  test('DWS-COMP-005: Verify desktop products and prices @smoke @regression', async () => {
    await computersSteps.verifyDesktopCatalogue();
  });

  test('DWS-COMP-006: Verify notebook catalogue @smoke @regression', async () => {
    await computersSteps.verifyNotebookCatalogue();
  });

  test('DWS-COMP-007: Verify accessories catalogue @regression', async () => {
    await computersSteps.verifyAccessoriesCatalogue();
  });

  test('DWS-COMP-008: Sort desktops by price low to high @regression', async () => {
    await computersSteps.verifyDesktopSort('Price: Low to High');
  });

  test('DWS-COMP-009: Sort desktops by price high to low @regression', async () => {
    await computersSteps.verifyDesktopSort('Price: High to Low');
  });

  test('DWS-COMP-012: Filter desktops by price range @regression', async () => {
    await computersSteps.verifyDesktopPriceFilters();
  });

  test('DWS-COMP-013: Filter notebooks by Intel CPU @regression', async () => {
    await computersSteps.verifyNotebookAttributeFilter('Intel');
  });

  test('DWS-COMP-014: Filter notebooks by 3 GB memory @regression', async () => {
    await computersSteps.verifyNotebookAttributeFilter('3 GB');
  });

  test('DWS-COMP-016: Verify RAM selection changes desktop price @regression', async () => {
    await computersSteps.verifyRamSelectionChangesPrice();
  });

  test('DWS-COMP-017: Add configured desktop to cart @smoke @regression @critical', async () => {
    await computersSteps.verifyConfiguredDesktopAddedToCart(1);
  });

  test('DWS-COMP-018: Add multiple desktop units to cart @regression', async () => {
    await computersSteps.verifyConfiguredDesktopAddedToCart(2);
  });

  test('DWS-COMP-024: Preserve cart while browsing Computers categories @regression', async () => {
    await computersSteps.verifyCartPersistsAcrossComputerCategories();
  });
});