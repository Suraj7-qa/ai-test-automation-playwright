import { test, expect } from '@playwright/test';
import { LoginPageSteps } from '../../page-objects/page-steps/login-steps';
import { RegisterPageSteps } from '../../page-objects/page-steps/register-steps';
import { HomePageSteps } from '../../page-objects/page-steps/home-steps';
import { PasswordRecoveryPageSteps } from '../../page-objects/page-steps/password-recovery-steps';
import { loadTestData } from '../../utilities/test-data-loader';

test.describe('Authentication - Navigation Flow', () => {
  let loginSteps: LoginPageSteps;
  let registerSteps: RegisterPageSteps;
  let homeSteps: HomePageSteps;
  let recoverySteps: PasswordRecoveryPageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    loginSteps = new LoginPageSteps(page);
    registerSteps = new RegisterPageSteps(page);
    homeSteps = new HomePageSteps(page);
    recoverySteps = new PasswordRecoveryPageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-TC-0014: Navigation from login to register page @regression', async () => {
    await loginSteps.navigate();
    await loginSteps.clickRegister();
    await registerSteps.verifyPageLoaded();
    expect(page.url()).toContain('/register');
  });

  test('DWS-TC-0015: Navigation from register to login page @regression', async () => {
    await registerSteps.navigate();
    await registerSteps.clickLogin();
    await loginSteps.verifyPageLoaded();
    expect(page.url()).toContain('/login');
  });

  test('Navigation from home to login page @regression', async () => {
    await homeSteps.navigate();
    await homeSteps.clickLogin();
    await loginSteps.verifyPageLoaded();
    expect(page.url()).toContain('/login');
  });

  test('Navigation from home to register page @regression', async () => {
    await homeSteps.navigate();
    await homeSteps.clickRegister();
    await registerSteps.verifyPageLoaded();
    expect(page.url()).toContain('/register');
  });

  test('Navigation from login to password recovery @regression', async () => {
    await loginSteps.navigate();
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageLoaded();
    expect(page.url()).toContain('/passwordrecovery');
  });

  test('Navigation from password recovery back to login @regression', async () => {
    await recoverySteps.navigate();
    await recoverySteps.clickBackToLogin();
    await loginSteps.verifyPageLoaded();
    expect(page.url()).toContain('/login');
  });

  test('Full navigation cycle: Home -> Login -> Register -> Login -> Home @regression', async () => {
    await homeSteps.navigate();
    await homeSteps.clickLogin();
    await loginSteps.verifyPageLoaded();

    await loginSteps.clickRegister();
    await registerSteps.verifyPageLoaded();

    await registerSteps.clickLogin();
    await loginSteps.verifyPageLoaded();

    await loginSteps.loginWithValidCredentials();
    await loginSteps.verifyLoginSuccess();
    await homeSteps.verifyUserLoggedIn();

    await homeSteps.clickLogout();
    await homeSteps.verifyUserLoggedOut();
  });

  test('Verify all authentication pages accessible from home @smoke', async () => {
    await homeSteps.navigate();

    // Test login page
    await homeSteps.clickLogin();
    await loginSteps.verifyPageLoaded();
    await homeSteps.navigate();

    // Test register page
    await homeSteps.clickRegister();
    await registerSteps.verifyPageLoaded();
    await homeSteps.navigate();

    // Test password recovery (via login)
    await homeSteps.clickLogin();
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageLoaded();
  });
});