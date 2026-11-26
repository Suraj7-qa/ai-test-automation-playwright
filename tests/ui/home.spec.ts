import { test } from '@playwright/test';
import { HomePageSteps } from '../../page-objects/page-steps';

test.describe('Home module - risk-based regression', () => {
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    homeSteps = new HomePageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-HOME-001: Load Home page from direct URL @smoke @regression', async () => {
    await homeSteps.verifyHomePageLoaded();
  });

  test('DWS-HOME-002: Verify guest header links @smoke @regression', async () => {
    await homeSteps.verifyGuestHeader();
  });

  test('DWS-HOME-004: Navigate to Home using logo @regression', async () => {
    await homeSteps.verifyLogoNavigation();
  });

  test('DWS-HOME-005: Search from Home with valid keyword @smoke @regression', async () => {
    await homeSteps.searchForLaptop();
  });

  test('DWS-HOME-006: Search from Home with empty keyword @negative @regression', async () => {
    await homeSteps.searchWithEmptyKeyword();
  });

  test('DWS-HOME-008: Verify featured product cards @smoke @regression', async () => {
    await homeSteps.verifyWelcomeAndFeaturedProducts();
  });

  test('DWS-HOME-010: Add featured Simple Computer to cart @smoke @critical', async () => {
    await homeSteps.verifyFeaturedProductCart();
  });

  test('DWS-HOME-012: Reject empty newsletter email @negative @regression', async () => {
    await homeSteps.verifyEmptyNewsletterEmail();
  });

  test('DWS-HOME-013: Reject malformed newsletter email @negative @regression', async () => {
    await homeSteps.verifyInvalidNewsletterEmail();
  });

  test('DWS-HOME-015: Navigate to Jewelry from sidebar @regression', async () => {
    await homeSteps.verifySidebarJewelryNavigation();
  });

  test('DWS-HOME-021: Verify Home page mobile layout @responsive @regression', async () => {
    await homeSteps.verifyMobileLayout();
  });

  test('DWS-HOME-023: Verify Welcome to our store heading @regression', async () => {
    await homeSteps.navigate();
    await homeSteps.verifyWelcomeMessage();
  });
});
