import { test, expect } from '@playwright/test';
import { LoginPageSteps } from '../../page-objects/page-steps/login-steps';
import { HomePageSteps } from '../../page-objects/page-steps/home-steps';
import { loadTestData } from '../../utilities/test-data-loader';

test.describe('Authentication - Logout Flow', () => {
  let loginSteps: LoginPageSteps;
  let homeSteps: HomePageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    loginSteps = new LoginPageSteps(page);
    homeSteps = new HomePageSteps(page);
    // Login first
    await loginSteps.navigate();
    await loginSteps.loginWithValidCredentials();
    await loginSteps.verifyLoginSuccess();
    await homeSteps.verifyUserLoggedIn();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-TC-0011: Successful user logout @smoke @regression', async () => {
    await homeSteps.clickLogout();
    await homeSteps.verifyUserLoggedOut();
    await homeSteps.verifyPageLoaded();
  });

  test('Verify logout redirects to home page @regression', async () => {
    await homeSteps.clickLogout();
    await homeSteps.verifyPageLoaded();
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/$/);
  });

  test('Verify login and register links visible after logout @regression', async () => {
    await homeSteps.clickLogout();
    await homeSteps.verifyUserLoggedOut();
    expect(await homeSteps.isLoginLinkVisible()).toBeTruthy();
    expect(await homeSteps.isRegisterLinkVisible()).toBeTruthy();
  });

  test('Verify user email not displayed after logout @regression', async () => {
    await homeSteps.clickLogout();
    expect(await homeSteps.isUserEmailVisible()).toBeFalsy();
  });

  test('Verify shopping cart shows 0 after logout @regression', async () => {
    await homeSteps.clickLogout();
    await homeSteps.verifyCartCount(0);
  });
});