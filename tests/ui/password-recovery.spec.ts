import { test, expect } from '@playwright/test';
import { LoginPageSteps } from '../../page-objects/page-steps/login-steps';
import { PasswordRecoveryPageSteps } from '../../page-objects/page-steps/password-recovery-steps';
import { loadTestData } from '../../utilities/test-data-loader';

test.describe('Authentication - Password Recovery Flow', () => {
  let loginSteps: LoginPageSteps;
  let recoverySteps: PasswordRecoveryPageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    loginSteps = new LoginPageSteps(page);
    recoverySteps = new PasswordRecoveryPageSteps(page);
    await loginSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-TC-0012: Valid password recovery with registered email @regression', async () => {
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageLoaded();
    await recoverySteps.recoverPassword(testData.validUser.email);
    await recoverySteps.verifySuccessMessage();
  });

  test('DWS-TC-0013: Password recovery with unregistered email @negative', async () => {
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageLoaded();
    await recoverySteps.recoverPassword(testData.invalidData.unregisteredEmail);
    await recoverySteps.verifyEmailNotFoundError();
  });

  test('Password recovery with empty email @negative', async () => {
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageLoaded();
    await recoverySteps.clickRecover();
    // App shows "Enter your email" for empty email validation
    await recoverySteps.verifyErrorMessage('Enter your email');
  });

  test('Password recovery with invalid email format @negative', async () => {
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageLoaded();
    await recoverySteps.enterEmail(testData.invalidData.invalidEmail);
    await recoverySteps.clickRecover();
    await recoverySteps.verifyErrorMessage(testData.errorMessages.invalidEmailFormat);
  });

  test('Navigation back to login from password recovery @regression', async () => {
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageLoaded();
    await recoverySteps.clickBackToLogin();
    await loginSteps.verifyPageLoaded();
  });

  test('Verify password recovery page elements @smoke', async () => {
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageLoaded();
  });

  test('Verify email field retains value after failed recovery @negative', async () => {
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageLoaded();
    await recoverySteps.enterEmail(testData.invalidData.unregisteredEmail);
    await recoverySteps.clickRecover();
    await recoverySteps.verifyEmailNotFoundError();
    const emailValue = await recoverySteps.getEmailValue();
    expect(emailValue).toBe(testData.invalidData.unregisteredEmail);
  });

  test('DWS-EXT-030: Verify password recovery page elements @smoke', async () => {
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageElementsPresent();
  });

  test('Verify email field retains value after successful recovery @regression', async () => {
    await loginSteps.clickForgotPassword();
    await recoverySteps.verifyPageLoaded();
    await recoverySteps.recoverPassword(testData.validUser.email);
    await recoverySteps.verifySuccessMessage();
    // App retains email after successful submission
    const emailValue = await recoverySteps.getEmailValue();
    expect(emailValue).toBe(testData.validUser.email);
  });
});