import { Page, Locator, expect } from '@playwright/test';
import { WebCommons } from '../../commons/ui/web-commons';
import { loadPageElements, ElementHelper } from '../../utilities/element-loader';
import { loadTestData } from '../../utilities/test-data-loader';

export class PasswordRecoveryPageSteps {
  private page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;
  private testData: any;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'password-recovery-page');
    this.pageElements = loadPageElements('password-recovery-page');
    this.testData = loadTestData('ui');
  }

  // Navigate to password recovery page
  async navigate(): Promise<void> {
    await this.commons.navigate(this.pageElements.pageUrl);
    await this.commons.waitForPageLoad();
    await this.commons.assertTitle(/Password Recovery/);
  }

  // Navigate to password recovery page via URL
  async navigateDirect(): Promise<void> {
    await this.page.goto(this.pageElements.pageUrl, { waitUntil: 'networkidle' });
    await this.commons.waitForPageLoad();
  }

  // Fill email
  async enterEmail(email: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('emailInput'), email);
  }

  // Click recover button
  async clickRecover(): Promise<void> {
    await this.commons.click(this.elements.getLocator('recoverButton'));
    await this.commons.waitForPageLoad();
  }

  // Complete password recovery flow
  async recoverPassword(email: string): Promise<void> {
    await this.enterEmail(email);
    await this.clickRecover();
  }

  // Click back to login link
  async clickBackToLogin(): Promise<void> {
    await this.commons.click(this.elements.getLocator('backToLoginLink'));
    await this.commons.waitForPageLoad();
  }

  // Verify success message
  async verifySuccessMessage(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('successMessage'));
    await this.commons.assertContainsText(this.elements.getLocator('successMessage'), 'Email with instructions has been sent');
  }

  // Verify error message
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('errorMessage'));
    await this.commons.assertContainsText(this.elements.getLocator('errorMessage'), expectedMessage);
  }

  // Verify email not found error
  async verifyEmailNotFoundError(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('emailNotFoundError'));
    await this.commons.assertContainsText(this.elements.getLocator('emailNotFoundError'), 'Email not found');
  }

  // Verify page is loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Password Recovery/);
    await this.commons.assertVisible(this.elements.getLocator('pageTitle'));
    await this.commons.assertVisible(this.elements.getLocator('emailInput'));
    await this.commons.assertVisible(this.elements.getLocator('recoverButton'));
    await this.commons.assertVisible(this.elements.getLocator('backToLoginLink'));
  }

  // Clear form
  async clearForm(): Promise<void> {
    await this.elements.getLocator('emailInput').clear();
  }

  // Get email value
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