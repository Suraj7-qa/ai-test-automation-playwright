import { test } from '@playwright/test';
import { JewelryPageSteps } from '../../page-objects/page-steps';

test.describe('Jewelry module - risk-based regression', () => {
  let jewelrySteps: JewelryPageSteps;

  test.beforeEach(async ({ page }) => {
    jewelrySteps = new JewelryPageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-JEW-001: Open Jewelry from header @smoke @regression', async () => {
    await jewelrySteps.navigateFromHeader();
  });

  test('DWS-JEW-002: Verify Jewelry products and prices @smoke @regression', async () => {
    await jewelrySteps.verifyListing();
  });

  test('DWS-JEW-003: Sort Jewelry by price low to high @regression', async () => {
    await jewelrySteps.verifyPriceSort();
  });

  test('DWS-JEW-005: Paginate Jewelry results @regression', async () => {
    await jewelrySteps.verifyPagination();
  });

  test('DWS-JEW-007: Reject missing length for configurable jewelry @negative @critical', async () => {
    await jewelrySteps.rejectInvalidLength('');
  });

  test('DWS-JEW-008: Add configured jewelry to cart @smoke @critical', async () => {
    await jewelrySteps.addConfiguredJewelry();
  });

  test('DWS-JEW-009: Verify out-of-stock jewelry cannot be added @negative @smoke', async () => {
    await jewelrySteps.verifyOutOfStockProduct();
  });

  test('DWS-JEW-010: Filter Jewelry products under 500 @regression', async () => {
    await jewelrySteps.verifyPriceFilter();
  });

  test('DWS-JEW-023: Add diamond heart with quantity 2 @smoke @critical', async () => {
    await jewelrySteps.addDiamondHeartQuantity(2);
  });
});
