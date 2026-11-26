import { test, expect } from '@playwright/test';
import { LoginPageSteps } from '../../page-objects/page-steps/login-steps';
import { HomePageSteps } from '../../page-objects/page-steps/home-steps';
import { loadTestData } from '../../utilities/test-data-loader';

test.describe('Authentication - Login Flow', () => {
  let loginSteps: LoginPageSteps;
  let homeSteps: HomePageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    loginSteps = new LoginPageSteps(page);
    homeSteps = new HomePageSteps(page);
    await loginSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    // Ensure clean state for next test
    await page.context().clearCookies();
  });

  test('DWS-TC-0006: Valid user login with correct credentials @smoke @regression @critical', async () => {
    await loginSteps.loginWithValidCredentials();
    await loginSteps.verifyLoginSuccess();
    await homeSteps.verifyUserLoggedIn();
    await homeSteps.verifyUserEmail(testData.validUser.email);
  });

  test('DWS-TC-0007: Login with invalid password @regression', async () => {
    await loginSteps.login(testData.validUser.email, testData.invalidData.wrongPassword);
    await loginSteps.verifyErrorMessage(testData.errorMessages.invalidCredentials);
    await loginSteps.verifyPageLoaded();
  });

  test('DWS-TC-0008: Login with unregistered email @regression', async () => {
    await loginSteps.login(testData.invalidData.unregisteredEmail, testData.invalidData.wrongPassword);
    await loginSteps.verifyErrorMessage(testData.errorMessages.invalidCredentials);
    await loginSteps.verifyPageLoaded();
  });

  test('DWS-TC-0009: Login with empty credentials @negative', async () => {
    await loginSteps.clickLogin();
    // App shows server-side validation message when both fields empty
    await loginSteps.verifyErrorMessage('No customer account found');
    await loginSteps.verifyPageLoaded();
  });

  test('DWS-TC-0010: Login with Remember Me checked @regression', async () => {
    await loginSteps.login(
      testData.validUser.email,
      testData.validUser.password,
      true
    );
    await loginSteps.verifyLoginSuccess();
    await homeSteps.verifyUserLoggedIn();
    // Note: Full remember me verification requires browser restart which is manual
  });

  test('DWS-TC-0014: Navigation from login to register page @regression', async ({ page }) => {
    await loginSteps.clickRegister();
    await homeSteps.verifyPageLoaded();
    // Verify we're on register page
    const registerPageUrl = page.url();
    expect(registerPageUrl).toContain('/register');
  });

  test('Login with only email filled @negative', async () => {
    await loginSteps.enterEmail(testData.validUser.email);
    await loginSteps.clickLogin();
    // App shows server-side validation message
    await loginSteps.verifyErrorMessage('The credentials provided are incorrect');
  });

  test('Login with only password filled @negative', async () => {
    await loginSteps.enterPassword(testData.validUser.password);
    await loginSteps.clickLogin();
    // App shows server-side validation message
    await loginSteps.verifyErrorMessage('No customer account found');
  });

  test('Verify forgot password link navigation @regression', async ({ page }) => {
    await loginSteps.clickForgotPassword();
    const passwordRecoveryUrl = page.url();
    expect(passwordRecoveryUrl).toContain('/passwordrecovery');
  });

  test('Verify email field retains value after failed login @regression', async () => {
    await loginSteps.login(testData.validUser.email, testData.invalidData.wrongPassword);
    await loginSteps.verifyErrorMessage(testData.errorMessages.invalidCredentials);
    const emailValue = await loginSteps.getEmailValue();
    expect(emailValue).toBe(testData.validUser.email);
  });

  test('Verify page elements are present @smoke', async () => {
    await loginSteps.verifyPageLoaded();
  });

  test('DWS-EXT-008: Verify remember me checkbox can be set before login @regression', async () => {
    await loginSteps.setRememberMe(true);
    const isChecked = await loginSteps.verifyRememberMeChecked();
    expect(isChecked).toBeTruthy();
    await loginSteps.loginWithValidCredentials();
    await loginSteps.verifyLoginSuccess();
  });
});

test.describe('Authentication - Login Flow - Edge Cases', () => {
  let loginSteps: LoginPageSteps;
  let homeSteps: HomePageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    loginSteps = new LoginPageSteps(page);
    homeSteps = new HomePageSteps(page);
    await loginSteps.navigate();
  });

  test('Login with special characters in email @negative', async () => {
    await loginSteps.login('test+special@domain.com', testData.validUser.password);
    // Should either succeed or show appropriate error
    const isError = await loginSteps.isErrorDisplayed();
    if (isError) {
      await loginSteps.verifyErrorMessage(testData.errorMessages.invalidCredentials);
    }
  });

  test('Login with very long password @negative', async () => {
    const longPassword = 'a'.repeat(100);
    await loginSteps.login(testData.validUser.email, longPassword);
    const isError = await loginSteps.isErrorDisplayed();
    if (isError) {
      await loginSteps.verifyErrorMessage(testData.errorMessages.invalidCredentials);
    }
  });

  test('Multiple failed login attempts @negative', async () => {
    for (let i = 0; i < 3; i++) {
      await loginSteps.login(testData.validUser.email, `WrongPass${i}!`);
      await loginSteps.verifyErrorMessage(testData.errorMessages.invalidCredentials);
      await loginSteps.clearForm();
    }
    // Verify account is not locked (if applicable)
    await loginSteps.loginWithValidCredentials();
    await loginSteps.verifyLoginSuccess();
  });
});