import { test } from '@playwright/test';
import { ApparelShoesPageSteps } from '../../page-objects/page-steps';

test.describe('Apparel & Shoes module - risk-based regression', () => {
  let apparelSteps: ApparelShoesPageSteps;

  test.beforeEach(async ({ page }) => {
    apparelSteps = new ApparelShoesPageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  // Navigation tests
  test('DWS-APPAREL-001: Access Apparel & Shoes from header @smoke @regression', async () => {
    await apparelSteps.navigateFromHeader();
  });

  test('DWS-APPAREL-002: Access Apparel & Shoes from sidebar @regression', async () => {
    await apparelSteps.navigate();
  });

  test('DWS-APPAREL-003: Verify Apparel & Shoes products and prices @smoke @regression', async () => {
    await apparelSteps.verifyProductListing();
  });

  // Subcategory tests
  test('DWS-APPAREL-004: Verify Shoes subcategory @smoke @regression', async () => {
    await apparelSteps.verifyShoesCatalogue();
  });

  test('DWS-APPAREL-005: Navigate subcategories from sidebar @regression', async () => {
    await apparelSteps.verifySidebarSubcategories();
  });

  // Catalogue controls
  test('DWS-APPAREL-006: Sort products by price low to high @regression', async () => {
    await apparelSteps.verifyPriceSortLowToHigh();
  });

  test('DWS-APPAREL-007: Paginate the product list @regression', async () => {
    await apparelSteps.verifyPagination();
  });

  test('DWS-APPAREL-008: Change display view from Grid to List @regression', async () => {
    await apparelSteps.verifyDisplayViewChange();
  });

  // Product detail
  test('DWS-APPAREL-009: Open an Apparel & Shoes product detail page @smoke @regression', async () => {
    await apparelSteps.verifyProductDetail();
  });

  test('DWS-APPAREL-010: Verify size options on product detail @regression', async () => {
    await apparelSteps.verifySizeOptions();
  });

  test('DWS-APPAREL-011: Verify color options on product detail @regression', async () => {
    await apparelSteps.verifyColorOptions();
  });

  // Add to cart
  test('DWS-APPAREL-012: Add a product to cart from the listing @smoke @regression', async () => {
    await apparelSteps.addToCartFromListing();
  });

  test('DWS-APPAREL-013: Add a product to cart from its detail page @smoke @regression', async () => {
    await apparelSteps.addToCartFromDetail();
  });

  test('DWS-APPAREL-014: Add multiple products to cart @regression', async () => {
    await apparelSteps.verifyMultipleProductsToCart();
  });

  // Quantity validation (negative tests)
  test('DWS-APPAREL-015: Reject a quantity of zero @negative @regression', async () => {
    await apparelSteps.verifyInvalidQuantity('0');
  });

  test('DWS-APPAREL-016: Reject a negative quantity @negative @regression', async () => {
    await apparelSteps.verifyInvalidQuantity('-1');
  });

  test('DWS-APPAREL-017: Reject a non-numeric quantity @negative @regression', async () => {
    await apparelSteps.verifyInvalidQuantity('ABC');
  });

  test('DWS-APPAREL-018: Reject a blank quantity @negative @regression', async () => {
    await apparelSteps.verifyInvalidQuantity('');
  });

  test('DWS-APPAREL-019: Add five units and verify the cart total @regression', async () => {
    await apparelSteps.addFiveUnitsToCart();
  });

  // Out of stock
  test('DWS-APPAREL-020: Verify out-of-stock Custom T-Shirt cannot be added @regression', async () => {
    await apparelSteps.verifyOutOfStockCustomTShirt();
  });

  // Email a friend
  test('DWS-APPAREL-021: Open Email a Friend for Rockabilly Top @regression', async () => {
    await apparelSteps.verifyEmailFriendRockabilly();
  });

  // Compare list
  test('DWS-APPAREL-022: Add Rockabilly Top to compare list @regression', async () => {
    await apparelSteps.verifyCompareListRockabilly();
  });

  // Reviews
  test('DWS-APPAREL-023: View reviews for Rockabilly Top @regression', async () => {
    await apparelSteps.verifyReviewsRockabilly();
  });

  // Breadcrumb
  test('DWS-APPAREL-024: Navigate breadcrumb from product detail to category @smoke @regression', async () => {
    await apparelSteps.verifyBreadcrumbFromDetail();
  });

  // Search
  test('DWS-APPAREL-025: Search for apparel from category page @regression', async () => {
    await apparelSteps.verifySearchApparel();
  });
});