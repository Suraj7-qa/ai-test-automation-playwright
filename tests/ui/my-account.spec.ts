import { test, expect } from '@playwright/test';
import { LoginPageSteps } from '../../page-objects/page-steps/login-steps';
import { HomePageSteps } from '../../page-objects/page-steps/home-steps';
import { MyAccountPageSteps } from '../../page-objects/page-steps/my-account-steps';
import { loadTestData } from '../../utilities/test-data-loader';

test.describe('My Account - Account Page Navigation', () => {
  let loginSteps: LoginPageSteps;
  let homeSteps: HomePageSteps;
  let myAccountSteps: MyAccountPageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    loginSteps = new LoginPageSteps(page);
    homeSteps = new HomePageSteps(page);
    myAccountSteps = new MyAccountPageSteps(page);
    // Login first
    await loginSteps.navigate();
    await loginSteps.loginWithValidCredentials();
    await loginSteps.verifyLoginSuccess();
    await homeSteps.verifyUserLoggedIn();
  });

  test.afterEach(async ({ page }) => {
    // Ensure clean state for next test
    await page.context().clearCookies();
  });

  test('DWS-MYACC-024: Navigate to My Account page after login @regression @critical', async ({ page }) => {
    // Click email link in header to navigate to My Account page
    await homeSteps.clickUserAccount();
    // Verify My Account page loaded
    await myAccountSteps.verifyPageLoaded();
    // Verify URL is correct
    expect(page.url()).toContain('/customer/info');
  });

  test('DWS-MYACC-025: Verify My Account page sections @regression', async () => {
    // Navigate to My Account page
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    // Verify account info section
    await myAccountSteps.verifyAccountInfoSection();
    // Verify user account details are displayed correctly
    await myAccountSteps.verifyAccountInfoDisplayed(
      testData.validUser.email,
      testData.validUser.firstName,
      testData.validUser.lastName
    );
    // Verify navigation links
    await myAccountSteps.verifyNavigationLinks();
  });

  test('Verify My Account page heading @smoke @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    // Page title is verified in verifyPageLoaded()
  });

  test('Verify account info section displays user data @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    // Verify email
    await myAccountSteps.verifyUserEmail(testData.validUser.email);
    // Verify first name
    await myAccountSteps.verifyUserFirstName(testData.validUser.firstName);
    // Verify last name
    await myAccountSteps.verifyUserLastName(testData.validUser.lastName);
  });

  test('Verify Orders navigation link @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.verifyOrdersLink();
  });

  test('Verify Addresses navigation link @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.verifyAddressesLink();
  });

  test('Verify Shopping Cart navigation link @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.verifyShoppingCartLink();
  });

  test('Verify Wishlist navigation link @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.verifyWishlistLink();
  });

  test('Verify Downloadable Products navigation link @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.verifyDownloadableProductsLink();
  });

  test('Verify Reward Points navigation link @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.verifyRewardPointsLink();
  });

  test('Verify Change Password navigation link @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.verifyChangePasswordLink();
  });

  test('Verify account navigation sidebar @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.verifyAccountNavigationSidebar();
  });

  test('Navigate to Orders page from My Account @regression', async ({ page }) => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.clickOrders();
    // Verify navigation to orders page
    expect(page.url()).toContain('/customer/orders');
  });

  test('Navigate to Addresses page from My Account @regression', async ({ page }) => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.clickAddresses();
    // Verify navigation to addresses page
    expect(page.url()).toContain('/customer/addresses');
  });

  test('Navigate to Shopping Cart from My Account @regression', async ({ page }) => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.clickShoppingCart();
    // Verify navigation to cart page
    expect(page.url()).toContain('/cart');
  });

  test('Navigate to Wishlist from My Account @regression', async ({ page }) => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.clickWishlist();
    // Verify navigation to wishlist page
    expect(page.url()).toContain('/wishlist');
  });

  test('Verify breadcrumbs on My Account page @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    // Breadcrumbs may not be present on My Account page, verify if they exist
    const isVisible = await myAccountSteps.areBreadcrumbsVisible();
    if (isVisible) {
      await myAccountSteps.verifyBreadcrumbs();
      await myAccountSteps.verifyBreadcrumbContains('My account');
    }
  });
});

test.describe('My Account - Session Persistence', () => {
  let loginSteps: LoginPageSteps;
  let homeSteps: HomePageSteps;
  let myAccountSteps: MyAccountPageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    loginSteps = new LoginPageSteps(page);
    homeSteps = new HomePageSteps(page);
    myAccountSteps = new MyAccountPageSteps(page);
    // Login first
    await loginSteps.navigate();
    await loginSteps.loginWithValidCredentials();
    await loginSteps.verifyLoginSuccess();
    await homeSteps.verifyUserLoggedIn();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-MYACC-022: Session persists after page refresh @regression', async ({ page }) => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    // Refresh the page
    await page.reload({ waitUntil: 'networkidle' });
    // Verify still logged in and on My Account page
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.verifyUserEmail(testData.validUser.email);
    await myAccountSteps.verifyUserFirstName(testData.validUser.firstName);
    await myAccountSteps.verifyUserLastName(testData.validUser.lastName);
  });

  test('Verify session persists when navigating away and back @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    // Navigate to home page
    await homeSteps.clickLogo();
    await homeSteps.verifyPageLoaded();
    // Navigate back to My Account
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    await myAccountSteps.verifyUserEmail(testData.validUser.email);
  });
});

test.describe('My Account - Edge Cases', () => {
  let loginSteps: LoginPageSteps;
  let homeSteps: HomePageSteps;
  let myAccountSteps: MyAccountPageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    loginSteps = new LoginPageSteps(page);
    homeSteps = new HomePageSteps(page);
    myAccountSteps = new MyAccountPageSteps(page);
    // Login first
    await loginSteps.navigate();
    await loginSteps.loginWithValidCredentials();
    await loginSteps.verifyLoginSuccess();
    await homeSteps.verifyUserLoggedIn();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('Direct navigation to My Account page without login @negative', async ({ page }) => {
    // Logout first
    await homeSteps.clickLogout();
    await homeSteps.verifyUserLoggedOut();
    // Try to access My Account page directly
    await page.goto('/customer/info', { waitUntil: 'networkidle' });
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveTitle(/Login/);
  });

  test('Verify My Account page data consistency @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    // Get displayed values
    const displayedEmail = await myAccountSteps.getEmailValue();
    const displayedFirstName = await myAccountSteps.getFirstNameValue();
    const displayedLastName = await myAccountSteps.getLastNameValue();
    // Verify they match test data
    expect(displayedEmail).toBe(testData.validUser.email);
    expect(displayedFirstName).toBe(testData.validUser.firstName);
    expect(displayedLastName).toBe(testData.validUser.lastName);
  });

  test('Multiple navigation clicks should not break page @regression', async () => {
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
    // Click multiple navigation links and verify each returns to My Account
    await myAccountSteps.clickOrders();
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();

    await myAccountSteps.clickAddresses();
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();

    await myAccountSteps.clickShoppingCart();
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();

    await myAccountSteps.clickWishlist();
    await homeSteps.clickUserAccount();
    await myAccountSteps.verifyPageLoaded();
  });
});