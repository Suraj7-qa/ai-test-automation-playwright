import { Page, Locator, expect } from '@playwright/test';
import { WebCommons } from '../../commons/ui/web-commons';
import { loadPageElements, ElementHelper } from '../../utilities/element-loader';
import { loadTestData } from '../../utilities/test-data-loader';

export class LoginPageSteps {
  private page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;
  private testData: any;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'login-page');
    this.pageElements = loadPageElements('login-page');
    this.testData = loadTestData('ui');
  }

  // Navigate to login page
  async navigate(): Promise<void> {
    await this.commons.navigate(this.pageElements.pageUrl);
    await this.commons.waitForPageLoad();
    await this.commons.assertTitle(/Login/);
  }

  // Navigate to login page via URL
  async navigateDirect(): Promise<void> {
    await this.page.goto(this.pageElements.pageUrl, { waitUntil: 'networkidle' });
    await this.commons.waitForPageLoad();
  }

  // Fill email
  async enterEmail(email: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('emailInput'), email);
  }

  // Fill password
  async enterPassword(password: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('passwordInput'), password);
  }

  // Check/Uncheck Remember Me
  async setRememberMe(checked: boolean): Promise<void> {
    const checkbox = this.elements.getLocator('rememberMeCheckbox');
    const isChecked = await checkbox.isChecked();
    if (checked !== isChecked) {
      await this.commons.click(checkbox);
    }
  }

  // Click login button
  async clickLogin(): Promise<void> {
    await this.commons.click(this.elements.getLocator('loginButton'));
    await this.commons.waitForPageLoad();
  }

  // Complete login flow
  async login(email: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    if (rememberMe) {
      await this.setRememberMe(true);
    }
    await this.clickLogin();
  }

  // Login with valid credentials from test data
  async loginWithValidCredentials(): Promise<void> {
    await this.login(
      this.testData.validUser.email,
      this.testData.validUser.password
    );
  }

  // Click forgot password link
  async clickForgotPassword(): Promise<void> {
    await this.commons.click(this.elements.getLocator('forgotPasswordLink'));
    await this.commons.waitForPageLoad();
  }

  // Click register link
  async clickRegister(): Promise<void> {
    await this.commons.click(this.elements.getLocator('registerLink'));
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
  async verifyFieldError(fieldName: 'email' | 'password', expectedMessage: string): Promise<void> {
    const errorLocator = fieldName === 'email'
      ? this.elements.getLocator('emailFieldError')
      : this.elements.getLocator('passwordFieldError');
    await this.commons.waitForVisible(errorLocator);
    await this.commons.assertContainsText(errorLocator, expectedMessage);
  }

  // Verify successful login (redirect to home page)
  async verifyLoginSuccess(): Promise<void> {
    await this.commons.waitForURL(/\/$/);
    await this.commons.assertURL(/\/$/);
  }

  // Verify user is logged in (check header elements)
  async verifyUserLoggedIn(): Promise<void> {
    const homeElements = new ElementHelper(this.page, 'home-page');
    await this.commons.waitForVisible(homeElements.getLocator('logoutLink'));
    await this.commons.waitForVisible(homeElements.getLocator('userEmail'));
    await this.commons.assertVisible(homeElements.getLocator('logoutLink'));
    await this.commons.assertVisible(homeElements.getLocator('userEmail'));
  }

  // Verify user email in header
  async verifyUserEmail(expectedEmail: string): Promise<void> {
    const homeElements = new ElementHelper(this.page, 'home-page');
    await this.commons.waitForVisible(homeElements.getLocator('userEmail'));
    await this.commons.assertContainsText(homeElements.getLocator('userEmail'), expectedEmail);
  }

  // Verify login page is loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Login/);
    await this.commons.assertVisible(this.elements.getLocator('pageTitle'));
    await this.commons.assertVisible(this.elements.getLocator('emailInput'));
    await this.commons.assertVisible(this.elements.getLocator('passwordInput'));
    await this.commons.assertVisible(this.elements.getLocator('loginButton'));
  }

  // Verify remember me checkbox state
  async verifyRememberMeChecked(): Promise<boolean> {
    const checkbox = this.elements.getLocator('rememberMeCheckbox');
    return await checkbox.isChecked();
  }

  // Clear form
  async clearForm(): Promise<void> {
    await this.elements.getLocator('emailInput').clear();
    await this.elements.getLocator('passwordInput').clear();
    const checkbox = this.elements.getLocator('rememberMeCheckbox');
    if (await checkbox.isChecked()) {
      await this.commons.uncheck(checkbox);
    }
  }

  // Get email input value
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
}