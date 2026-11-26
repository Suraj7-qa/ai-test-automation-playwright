import { test } from '@playwright/test';
import { ElectronicsPageSteps } from '../../page-objects/page-steps';

test.describe('Electronics module - risk-based regression', () => {
  let electronicsSteps: ElectronicsPageSteps;

  test.beforeEach(async ({ page }) => {
    electronicsSteps = new ElectronicsPageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  // Navigation tests
  test('ELEC-001: Access Electronics from header menu @smoke @regression', async () => {
    await electronicsSteps.navigateFromHeader();
  });

  test('ELEC-002: Access Electronics from sidebar @regression', async () => {
    await electronicsSteps.verifyElectronicsPageLoaded();
  });

  test('ELEC-003: Access Electronics category via direct URL @smoke @regression', async () => {
    await electronicsSteps.verifyElectronicsPageLoaded();
  });

  test('ELEC-030: Verify Electronics subcategory links @regression', async () => {
    await electronicsSteps.verifyElectronicsSubcategoryLinks();
  });

  // Camera, photo subcategory tests
  test('ELEC-004: Verify Camera, photo subcategory catalogue @smoke @regression', async () => {
    await electronicsSteps.verifyCameraPhotoCatalogue();
  });

  test('ELEC-005: Verify Cell phones subcategory catalogue @smoke @regression', async () => {
    await electronicsSteps.verifyCellPhonesCatalogue();
  });

  test('ELEC-031: Filter Camera, photo products under 500.00 @regression', async () => {
    await electronicsSteps.verifyCameraPhotoUnder500Filter();
  });

  test('ELEC-032: Filter Camera, photo products over 500.00 @regression', async () => {
    await electronicsSteps.verifyCameraPhotoOver500Filter();
  });

  test('ELEC-006: Sort Camera, photo by Name: A to Z @regression', async () => {
    await electronicsSteps.verifySortCameraPhoto('Name: A to Z');
  });

  test('ELEC-007: Sort Camera, photo by Price: Low to High @regression', async () => {
    await electronicsSteps.verifySortCameraPhoto('Price: Low to High');
  });

  test('ELEC-008: Sort Camera, photo by Price: High to Low @regression', async () => {
    await electronicsSteps.verifySortCameraPhoto('Price: High to Low');
  });

  test('ELEC-009: Change display view and page size @regression', async () => {
    await electronicsSteps.verifyDisplayViewAndPageSize();
  });

  // Product detail and add to cart
  test('ELEC-010: Add Handycam to cart from Camera, photo @smoke @regression @critical', async () => {
    await electronicsSteps.verifyAddHandycamToCart();
  });

  test('ELEC-011: Add Smartphone to cart from Cell phones @smoke @regression @critical', async () => {
    await electronicsSteps.verifyAddSmartphoneToCart();
  });

  // Email a friend
  test('ELEC-012: Open Email a Friend for Handycam @regression', async () => {
    await electronicsSteps.verifyEmailFriendHandycam();
  });

  // Compare list
  test('ELEC-013: Add Handycam to compare list @regression', async () => {
    await electronicsSteps.verifyCompareListHandycam();
  });

  // Reviews
  test('ELEC-014: View reviews for Handycam @regression', async () => {
    await electronicsSteps.verifyReviewsHandycam();
  });

  // Search
  test('ELEC-015: Search for electronics from category page @regression', async () => {
    await electronicsSteps.verifySearchElectronics();
  });
});