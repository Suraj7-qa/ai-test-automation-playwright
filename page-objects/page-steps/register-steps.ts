import { Page, Locator, expect } from '@playwright/test';
import { WebCommons } from '../../commons/ui/web-commons';
import { loadPageElements, ElementHelper } from '../../utilities/element-loader';
import { loadTestData } from '../../utilities/test-data-loader';

export class RegisterPageSteps {
  private page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;
  private testData: any;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'register-page');
    this.pageElements = loadPageElements('register-page');
    this.testData = loadTestData('ui');
  }

  // Navigate to register page
  async navigate(): Promise<void> {
    await this.commons.navigate(this.pageElements.pageUrl);
    await this.commons.waitForPageLoad();
    await this.commons.assertTitle(/Register/);
  }

  // Navigate to register page via URL
  async navigateDirect(): Promise<void> {
    await this.page.goto(this.pageElements.pageUrl, { waitUntil: 'networkidle' });
    await this.commons.waitForPageLoad();
  }

  // Select gender
  async selectGender(gender: 'Male' | 'Female'): Promise<void> {
    const radioLocator = gender === 'Male'
      ? this.elements.getLocator('genderMaleRadio')
      : this.elements.getLocator('genderFemaleRadio');
    await this.commons.click(radioLocator);
  }

  // Fill first name
  async enterFirstName(firstName: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('firstNameInput'), firstName);
  }

  // Fill last name
  async enterLastName(lastName: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('lastNameInput'), lastName);
  }

  // Fill email
  async enterEmail(email: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('emailInput'), email);
  }

  // Fill password
  async enterPassword(password: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('passwordInput'), password);
  }

  // Fill confirm password
  async enterConfirmPassword(confirmPassword: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('confirmPasswordInput'), confirmPassword);
  }

  // Click register button
  async clickRegister(): Promise<void> {
    await this.commons.click(this.elements.getLocator('registerButton'));
    await this.commons.waitForPageLoad();
  }

  // Complete registration flow
  async register(userData: {
    gender: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.selectGender(userData.gender);
    await this.enterFirstName(userData.firstName);
    await this.enterLastName(userData.lastName);
    await this.enterEmail(userData.email);
    await this.enterPassword(userData.password);
    await this.enterConfirmPassword(userData.confirmPassword);
    await this.clickRegister();
  }

  // Register with valid data from test data
  async registerWithValidData(uniqueEmail?: string): Promise<void> {
    const email = uniqueEmail || `test.${Date.now()}@test.com`;
    await this.register({
      gender: this.testData.newUser.gender as 'Male' | 'Female',
      firstName: this.testData.newUser.firstName,
      lastName: this.testData.newUser.lastName,
      email: email,
      password: this.testData.newUser.password,
      confirmPassword: this.testData.newUser.password
    });
  }

  // Click login link
  async clickLogin(): Promise<void> {
    await this.commons.click(this.elements.getLocator('loginLink'));
    await this.commons.waitForPageLoad();
  }

  // Verify error message
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('errorMessage'));
    await this.commons.assertContainsText(this.elements.getLocator('errorMessage'), expectedMessage);
  }

  // Verify validation summary contains error
  async verifyValidationError(expectedMessage: string): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('validationSummary'));
    await this.commons.assertContainsText(this.elements.getLocator('validationSummary'), expectedMessage);
  }

  // Verify specific field error
  async verifyFieldError(fieldName: 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword', expectedMessage: string): Promise<void> {
    const errorLocatorMap: Record<string, Locator> = {
      firstName: this.elements.getLocator('firstNameFieldError'),
      lastName: this.elements.getLocator('lastNameFieldError'),
      email: this.elements.getLocator('emailFieldError'),
      password: this.elements.getLocator('passwordFieldError'),
      confirmPassword: this.elements.getLocator('confirmPasswordFieldError')
    };

    const errorLocator = errorLocatorMap[fieldName];
    if (!errorLocator) {
      throw new Error(`Unknown field name: ${fieldName}`);
    }

    await this.commons.waitForVisible(errorLocator);
    await this.commons.assertContainsText(errorLocator, expectedMessage);
  }

  // Verify password mismatch error
  async verifyPasswordMismatchError(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('passwordMismatchError'));
    await this.commons.assertContainsText(this.elements.getLocator('passwordMismatchError'), 'match');
  }

  // Verify duplicate email error
  async verifyDuplicateEmailError(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('duplicateEmailError'));
    await this.commons.assertContainsText(this.elements.getLocator('duplicateEmailError'), 'already exists');
  }

  // Verify invalid email error
  async verifyInvalidEmailError(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('invalidEmailError'));
    await this.commons.assertContainsText(this.elements.getLocator('invalidEmailError'), 'Wrong email');
  }

  // Verify successful registration
  async verifyRegistrationSuccess(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('successMessage'));
    await this.commons.assertContainsText(this.elements.getLocator('successMessage'), 'Your registration completed');
  }

  // Click continue button after successful registration
  async clickContinue(): Promise<void> {
    await this.commons.click(this.elements.getLocator('continueButton'));
    await this.commons.waitForPageLoad();
  }

  // Verify register page is loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Register/);
    await this.commons.assertVisible(this.elements.getLocator('pageTitle'));
    await this.commons.assertVisible(this.elements.getLocator('genderMaleRadio'));
    await this.commons.assertVisible(this.elements.getLocator('genderFemaleRadio'));
    await this.commons.assertVisible(this.elements.getLocator('firstNameInput'));
    await this.commons.assertVisible(this.elements.getLocator('lastNameInput'));
    await this.commons.assertVisible(this.elements.getLocator('emailInput'));
    await this.commons.assertVisible(this.elements.getLocator('passwordInput'));
    await this.commons.assertVisible(this.elements.getLocator('confirmPasswordInput'));
    await this.commons.assertVisible(this.elements.getLocator('registerButton'));
  }

  // Clear form
  async clearForm(): Promise<void> {
    await this.elements.getLocator('firstNameInput').clear();
    await this.elements.getLocator('lastNameInput').clear();
    await this.elements.getLocator('emailInput').clear();
    await this.elements.getLocator('passwordInput').clear();
    await this.elements.getLocator('confirmPasswordInput').clear();
    // Uncheck radio buttons by clicking the other one and back
    const maleRadio = this.elements.getLocator('genderMaleRadio');
    const femaleRadio = this.elements.getLocator('genderFemaleRadio');
    if (await maleRadio.isChecked()) {
      await this.commons.click(femaleRadio);
    } else if (await femaleRadio.isChecked()) {
      await this.commons.click(maleRadio);
    }
  }

  // Get field values
  async getFirstNameValue(): Promise<string> {
    return await this.commons.getValue(this.elements.getLocator('firstNameInput'));
  }

  async getLastNameValue(): Promise<string> {
    return await this.commons.getValue(this.elements.getLocator('lastNameInput'));
  }

  async getEmailValue(): Promise<string> {
    return await this.commons.getValue(this.elements.getLocator('emailInput'));
  }

  // Check if error message is displayed
  async isErrorDisplayed(): Promise<boolean> {
    return await this.commons.isVisible(this.elements.getLocator('errorMessage'));
  }

  // Get error message text
  async getErrorMessage(): Promise<string> {
    return await this.commons.getText(this.elements.getLocator('errorMessage'));
  }

  // Verify form retains data after error
  async verifyFormDataRetained(expectedData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<void> {
    if (expectedData.firstName) {
      await this.commons.assertValue(this.elements.getLocator('firstNameInput'), expectedData.firstName);
    }
    if (expectedData.lastName) {
      await this.commons.assertValue(this.elements.getLocator('lastNameInput'), expectedData.lastName);
    }
    if (expectedData.email) {
      await this.commons.assertValue(this.elements.getLocator('emailInput'), expectedData.email);
    }
  }

  // ===== EXTENDED AUTHENTICATION TEST METHODS =====

  // Register with only first name missing
  async registerMissingFirstName(userData: {
    gender: 'Male' | 'Female';
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.selectGender(userData.gender);
    await this.enterLastName(userData.lastName);
    await this.enterEmail(userData.email);
    await this.enterPassword(userData.password);
    await this.enterConfirmPassword(userData.confirmPassword);
    await this.clickRegister();
  }

  // Register with only last name missing
  async registerMissingLastName(userData: {
    gender: 'Male' | 'Female';
    firstName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.selectGender(userData.gender);
    await this.enterFirstName(userData.firstName);
    await this.enterEmail(userData.email);
    await this.enterPassword(userData.password);
    await this.enterConfirmPassword(userData.confirmPassword);
    await this.clickRegister();
  }

  // Register with only email missing
  async registerMissingEmail(userData: {
    gender: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.selectGender(userData.gender);
    await this.enterFirstName(userData.firstName);
    await this.enterLastName(userData.lastName);
    await this.enterPassword(userData.password);
    await this.enterConfirmPassword(userData.confirmPassword);
    await this.clickRegister();
  }

  // Register with only password missing
  async registerMissingPassword(userData: {
    gender: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    email: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.selectGender(userData.gender);
    await this.enterFirstName(userData.firstName);
    await this.enterLastName(userData.lastName);
    await this.enterEmail(userData.email);
    await this.enterConfirmPassword(userData.confirmPassword);
    await this.clickRegister();
  }

  // Register with only confirm password missing
  async registerMissingConfirmPassword(userData: {
    gender: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<void> {
    await this.selectGender(userData.gender);
    await this.enterFirstName(userData.firstName);
    await this.enterLastName(userData.lastName);
    await this.enterEmail(userData.email);
    await this.enterPassword(userData.password);
    await this.clickRegister();
  }

  // Register with Female gender
  async registerWithFemaleGender(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.selectGender('Female');
    await this.enterFirstName(userData.firstName);
    await this.enterLastName(userData.lastName);
    await this.enterEmail(userData.email);
    await this.enterPassword(userData.password);
    await this.enterConfirmPassword(userData.confirmPassword);
    await this.clickRegister();
  }

  // Register with short password
  async registerWithShortPassword(userData: {
    gender: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.register(userData);
  }

  // Verify all page elements are present
  async verifyPageElementsPresent(): Promise<void> {
    await this.commons.assertVisible(this.elements.getLocator('pageTitle'));
    await this.commons.assertVisible(this.elements.getLocator('genderMaleRadio'));
    await this.commons.assertVisible(this.elements.getLocator('genderFemaleRadio'));
    await this.commons.assertVisible(this.elements.getLocator('firstNameInput'));
    await this.commons.assertVisible(this.elements.getLocator('lastNameInput'));
    await this.commons.assertVisible(this.elements.getLocator('emailInput'));
    await this.commons.assertVisible(this.elements.getLocator('passwordInput'));
    await this.commons.assertVisible(this.elements.getLocator('confirmPasswordInput'));
    await this.commons.assertVisible(this.elements.getLocator('registerButton'));
  }

  // Verify form clears properly
  async verifyFormCleared(): Promise<void> {
    const firstName = await this.getFirstNameValue();
    const lastName = await this.getLastNameValue();
    const email = await this.getEmailValue();
    expect(firstName).toBe('');
    expect(lastName).toBe('');
    expect(email).toBe('');
  }

  // Register with special characters in name
  async registerWithSpecialCharsName(userData: {
    gender: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.register(userData);
  }

  // Register with very long email
  async registerWithLongEmail(userData: {
    gender: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<void> {
    await this.register(userData);
  }

  // Multiple registration attempts with different emails
  async multipleRegistrationAttempts(baseUserData: {
    gender: 'Male' | 'Female';
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  }, emails: string[]): Promise<void> {
    for (const email of emails) {
      await this.clearForm();
      await this.register({
        ...baseUserData,
        email,
        confirmPassword: baseUserData.password
      });
      // Check if successful or duplicate
      await this.page.waitForTimeout(500);
    }
  }
}