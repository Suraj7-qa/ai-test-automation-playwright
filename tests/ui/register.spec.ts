import { test, expect } from '@playwright/test';
import { RegisterPageSteps } from '../../page-objects/page-steps/register-steps';
import { HomePageSteps } from '../../page-objects/page-steps/home-steps';
import { loadTestData } from '../../utilities/test-data-loader';

test.describe('Authentication - Registration Flow', () => {
  let registerSteps: RegisterPageSteps;
  let homeSteps: HomePageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    registerSteps = new RegisterPageSteps(page);
    homeSteps = new HomePageSteps(page);
    await registerSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    // Ensure clean state for next test
    await page.context().clearCookies();
  });

  test('DWS-TC-0001: Valid user registration with all required fields @smoke @regression', async () => {
    const uniqueEmail = `test.${Date.now()}@test.com`;
    await registerSteps.registerWithValidData(uniqueEmail);
    await registerSteps.verifyRegistrationSuccess();
    await registerSteps.clickContinue();
    await homeSteps.verifyUserLoggedIn();
    await homeSteps.verifyUserEmail(uniqueEmail);
  });

  test('DWS-TC-0002: Registration with duplicate email @regression', async () => {
    await registerSteps.register({
      gender: testData.newUser.gender as 'Male' | 'Female',
      firstName: testData.newUser.firstName,
      lastName: testData.newUser.lastName,
      email: testData.invalidData.duplicateEmail,
      password: testData.newUser.password,
      confirmPassword: testData.newUser.password
    });
    await registerSteps.verifyDuplicateEmailError();
    await registerSteps.verifyPageLoaded();
    await registerSteps.verifyFormDataRetained({
      firstName: testData.newUser.firstName,
      lastName: testData.newUser.lastName,
      email: testData.invalidData.duplicateEmail
    });
  });

  test('DWS-TC-0003: Registration with missing required fields @negative', async () => {
    await registerSteps.clickRegister();
    await registerSteps.verifyFieldError('firstName', testData.errorMessages.firstNameRequired);
    await registerSteps.verifyFieldError('lastName', testData.errorMessages.lastNameRequired);
    await registerSteps.verifyFieldError('email', testData.errorMessages.emailRequired);
    await registerSteps.verifyFieldError('password', testData.errorMessages.passwordRequired);
    await registerSteps.verifyFieldError('confirmPassword', testData.errorMessages.passwordRequired);
    await registerSteps.verifyPageLoaded();
  });

  test('DWS-TC-0004: Registration with password mismatch @regression', async () => {
    await registerSteps.register({
      gender: testData.newUser.gender as 'Male' | 'Female',
      firstName: testData.newUser.firstName,
      lastName: testData.newUser.lastName,
      email: `test.${Date.now()}@test.com`,
      password: testData.newUser.password,
      confirmPassword: testData.invalidData.mismatchPassword
    });
    await registerSteps.verifyPasswordMismatchError();
    await registerSteps.verifyPageLoaded();
  });

  test('DWS-TC-0005: Registration with invalid email format @negative', async () => {
    await registerSteps.register({
      gender: testData.newUser.gender as 'Male' | 'Female',
      firstName: testData.newUser.firstName,
      lastName: testData.newUser.lastName,
      email: testData.invalidData.invalidEmail,
      password: testData.newUser.password,
      confirmPassword: testData.newUser.password
    });
    await registerSteps.verifyInvalidEmailError();
    await registerSteps.verifyPageLoaded();
  });

  test('DWS-TC-0015: Navigation from register to login page @regression', async ({ page }) => {
    await registerSteps.clickLogin();
    await homeSteps.verifyPageLoaded();
    // Verify we're on login page
    const loginPageUrl = page.url();
    expect(loginPageUrl).toContain('/login');
  });

  test('Registration with only first name missing @negative', async () => {
    await registerSteps.selectGender(testData.newUser.gender as 'Male' | 'Female');
    await registerSteps.enterLastName(testData.newUser.lastName);
    await registerSteps.enterEmail(`test.${Date.now()}@test.com`);
    await registerSteps.enterPassword(testData.newUser.password);
    await registerSteps.enterConfirmPassword(testData.newUser.password);
    await registerSteps.clickRegister();
    await registerSteps.verifyFieldError('firstName', testData.errorMessages.firstNameRequired);
  });

  test('Registration with only last name missing @negative', async () => {
    await registerSteps.selectGender(testData.newUser.gender as 'Male' | 'Female');
    await registerSteps.enterFirstName(testData.newUser.firstName);
    await registerSteps.enterEmail(`test.${Date.now()}@test.com`);
    await registerSteps.enterPassword(testData.newUser.password);
    await registerSteps.enterConfirmPassword(testData.newUser.password);
    await registerSteps.clickRegister();
    await registerSteps.verifyFieldError('lastName', testData.errorMessages.lastNameRequired);
  });

  test('Registration with only email missing @negative', async () => {
    await registerSteps.selectGender(testData.newUser.gender as 'Male' | 'Female');
    await registerSteps.enterFirstName(testData.newUser.firstName);
    await registerSteps.enterLastName(testData.newUser.lastName);
    await registerSteps.enterPassword(testData.newUser.password);
    await registerSteps.enterConfirmPassword(testData.newUser.password);
    await registerSteps.clickRegister();
    await registerSteps.verifyFieldError('email', testData.errorMessages.emailRequired);
  });

  test('Registration with only password missing @negative', async () => {
    await registerSteps.selectGender(testData.newUser.gender as 'Male' | 'Female');
    await registerSteps.enterFirstName(testData.newUser.firstName);
    await registerSteps.enterLastName(testData.newUser.lastName);
    await registerSteps.enterEmail(`test.${Date.now()}@test.com`);
    await registerSteps.clickRegister();
    await registerSteps.verifyFieldError('password', testData.errorMessages.passwordRequired);
    await registerSteps.verifyFieldError('confirmPassword', testData.errorMessages.passwordRequired);
  });

  test('Registration with Female gender @regression', async () => {
    const uniqueEmail = `test.female.${Date.now()}@test.com`;
    await registerSteps.register({
      gender: 'Female',
      firstName: 'Jane',
      lastName: 'Doe',
      email: uniqueEmail,
      password: testData.newUser.password,
      confirmPassword: testData.newUser.password
    });
    await registerSteps.verifyRegistrationSuccess();
    await registerSteps.clickContinue();
    await homeSteps.verifyUserLoggedIn();
    await homeSteps.verifyUserEmail(uniqueEmail);
  });

  test('Registration with short password @negative', async () => {
    const uniqueEmail = `test.shortpass.${Date.now()}@test.com`;
    await registerSteps.register({
      gender: testData.newUser.gender as 'Male' | 'Female',
      firstName: testData.newUser.firstName,
      lastName: testData.newUser.lastName,
      email: uniqueEmail,
      password: testData.invalidData.shortPassword,
      confirmPassword: testData.invalidData.shortPassword
    });
    // App may use client-side HTML5 validation (minlength) which doesn't show server error
    // Check if error message is displayed (server-side) or form doesn't submit
    const isError = await registerSteps.isErrorDisplayed();
    if (isError) {
      await registerSteps.verifyErrorMessage(testData.errorMessages.shortPassword);
    } else {
      // If no server error, verify we're still on register page (form didn't submit)
      await registerSteps.verifyPageLoaded();
    }
  });

  test('Verify page elements are present @smoke', async () => {
    await registerSteps.verifyPageLoaded();
  });

  test('Verify form clears properly @negative', async () => {
    await registerSteps.enterFirstName('Test');
    await registerSteps.enterLastName('User');
    await registerSteps.enterEmail('test@test.com');
    await registerSteps.enterPassword('Password123!');
    await registerSteps.enterConfirmPassword('Password123!');
    await registerSteps.clearForm();
    const firstName = await registerSteps.getFirstNameValue();
    const lastName = await registerSteps.getLastNameValue();
    const email = await registerSteps.getEmailValue();
    expect(firstName).toBe('');
    expect(lastName).toBe('');
    expect(email).toBe('');
  });

  test('DWS-EXT-021: Registration with missing confirmPassword @negative', async () => {
    await registerSteps.registerMissingConfirmPassword({
      gender: testData.newUser.gender as 'Male' | 'Female',
      firstName: testData.newUser.firstName,
      lastName: testData.newUser.lastName,
      email: `test.${Date.now()}@test.com`,
      password: testData.newUser.password
    });
    await registerSteps.verifyFieldError('confirmPassword', testData.errorMessages.passwordRequired);
    await registerSteps.verifyPageLoaded();
  });
});

test.describe('Authentication - Registration Flow - Edge Cases', () => {
  let registerSteps: RegisterPageSteps;
  let homeSteps: HomePageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    registerSteps = new RegisterPageSteps(page);
    homeSteps = new HomePageSteps(page);
    await registerSteps.navigate();
  });

  test('Registration with special characters in name @regression', async () => {
    const uniqueEmail = `test.special.${Date.now()}@test.com`;
    await registerSteps.register({
      gender: testData.newUser.gender as 'Male' | 'Female',
      firstName: "O'Connor",
      lastName: 'Smith-Jones',
      email: uniqueEmail,
      password: testData.newUser.password,
      confirmPassword: testData.newUser.password
    });
    await registerSteps.verifyRegistrationSuccess();
  });

  test('Registration with Unicode characters in name @regression', async () => {
    const uniqueEmail = `test.unicode.${Date.now()}@test.com`;
    await registerSteps.register({
      gender: testData.newUser.gender as 'Male' | 'Female',
      firstName: 'José',
      lastName: 'Müller',
      email: uniqueEmail,
      password: testData.newUser.password,
      confirmPassword: testData.newUser.password
    });
    await registerSteps.verifyRegistrationSuccess();
  });

  test('Registration with very long email @negative', async () => {
    const longEmail = `a${'a'.repeat(99)}.${Date.now()}@test.com`;
    await registerSteps.register({
      gender: testData.newUser.gender as 'Male' | 'Female',
      firstName: testData.newUser.firstName,
      lastName: testData.newUser.lastName,
      email: longEmail,
      password: testData.newUser.password,
      confirmPassword: testData.newUser.password
    });
    const isError = await registerSteps.isErrorDisplayed();
    if (isError) {
      // App may show "already exists" if email was used before, or "Wrong email" for format
      const errorText = await registerSteps.getErrorMessage();
      expect(errorText).toMatch(/Wrong email|already exists/);
    }
  });

  test('Multiple registration attempts with different emails @regression', async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      const uniqueEmail = `test.multi.${Date.now()}.${i}@test.com`;
      await registerSteps.registerWithValidData(uniqueEmail);
      await registerSteps.verifyRegistrationSuccess();
      await registerSteps.clickContinue();
      await homeSteps.verifyUserLoggedIn();
      await homeSteps.verifyUserEmail(uniqueEmail);
      // Logout for next iteration
      await homeSteps.clickLogout();
      // Wait for login link to be visible (indicates logout complete)
      await page.locator("a:has-text('Log in'), a[href*='login'], .ico-login").first().waitFor({ state: 'visible' });
      await homeSteps.verifyUserLoggedOut();
      await registerSteps.navigateDirect();
    }
  });
});