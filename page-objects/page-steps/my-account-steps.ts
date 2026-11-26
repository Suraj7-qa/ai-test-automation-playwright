import { Page, Locator, expect } from '@playwright/test';
import { WebCommons } from '../../commons/ui/web-commons';
import { loadPageElements, ElementHelper } from '../../utilities/element-loader';
import { loadTestData } from '../../utilities/test-data-loader';

export class MyAccountPageSteps {
  private page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;
  private testData: any;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'my-account-page');
    this.pageElements = loadPageElements('my-account-page');
    this.testData = loadTestData('ui');
  }

  // Navigate to My Account page via URL
  async navigate(): Promise<void> {
    await this.commons.navigate(this.pageElements.pageUrl);
    await this.commons.waitForPageLoad();
    await this.verifyPageLoaded();
  }

  // Navigate to My Account page directly via URL
  async navigateDirect(): Promise<void> {
    await this.page.goto(this.pageElements.pageUrl, { waitUntil: 'networkidle' });
    await this.commons.waitForPageLoad();
    await this.verifyPageLoaded();
  }

  // Verify My Account page is loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Account/);
    await this.commons.assertVisible(this.elements.getLocator('pageTitle'));
    await this.commons.assertURL(/\/customer\/info/);
  }

  // Verify account info section is visible
  async verifyAccountInfoSection(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('accountInfoSection'));
    await this.commons.assertVisible(this.elements.getLocator('accountInfoSection'));
  }

  // Verify user email is displayed correctly
  async verifyUserEmail(expectedEmail: string): Promise<void> {
    const emailLocator = this.elements.getLocator('emailDisplay');
    await this.commons.waitForVisible(emailLocator);
    const actualEmail = await this.commons.getValue(emailLocator);
    expect(actualEmail).toBe(expectedEmail);
  }

  // Verify user first name is displayed correctly
  async verifyUserFirstName(expectedFirstName: string): Promise<void> {
    const firstNameLocator = this.elements.getLocator('firstNameDisplay');
    await this.commons.waitForVisible(firstNameLocator);
    const actualFirstName = await this.commons.getValue(firstNameLocator);
    expect(actualFirstName).toBe(expectedFirstName);
  }

  // Verify user last name is displayed correctly
  async verifyUserLastName(expectedLastName: string): Promise<void> {
    const lastNameLocator = this.elements.getLocator('lastNameDisplay');
    await this.commons.waitForVisible(lastNameLocator);
    const actualLastName = await this.commons.getValue(lastNameLocator);
    expect(actualLastName).toBe(expectedLastName);
  }

  // Verify all account info fields are displayed
  async verifyAccountInfoDisplayed(
    expectedEmail: string,
    expectedFirstName: string,
    expectedLastName: string
  ): Promise<void> {
    await this.verifyAccountInfoSection();
    await this.verifyUserEmail(expectedEmail);
    await this.verifyUserFirstName(expectedFirstName);
    await this.verifyUserLastName(expectedLastName);
  }

  // Click Orders link
  async clickOrders(): Promise<void> {
    await this.commons.click(this.elements.getLocator('ordersLink'));
    await this.commons.waitForPageLoad();
  }

  // Click Addresses link
  async clickAddresses(): Promise<void> {
    await this.commons.click(this.elements.getLocator('addressesLink'));
    await this.commons.waitForPageLoad();
  }

  // Click Shopping Cart link
  async clickShoppingCart(): Promise<void> {
    await this.commons.click(this.elements.getLocator('shoppingCartLink'));
    await this.commons.waitForPageLoad();
  }

  // Click Wishlist link
  async clickWishlist(): Promise<void> {
    await this.commons.click(this.elements.getLocator('wishlistLink'));
    await this.commons.waitForPageLoad();
  }

  // Click Downloadable Products link
  async clickDownloadableProducts(): Promise<void> {
    await this.commons.click(this.elements.getLocator('downloadableProductsLink'));
    await this.commons.waitForPageLoad();
  }

  // Click Reward Points link
  async clickRewardPoints(): Promise<void> {
    await this.commons.click(this.elements.getLocator('rewardPointsLink'));
    await this.commons.waitForPageLoad();
  }

  // Click Change Password link
  async clickChangePassword(): Promise<void> {
    await this.commons.click(this.elements.getLocator('changePasswordLink'));
    await this.commons.waitForPageLoad();
  }

  // Verify all navigation links are present and visible
  async verifyNavigationLinks(): Promise<void> {
    const links = [
      'ordersLink',
      'addressesLink',
      'shoppingCartLink',
      'wishlistLink',
      'downloadableProductsLink',
      'rewardPointsLink',
      'changePasswordLink'
    ];

    for (const link of links) {
      await this.commons.waitForVisible(this.elements.getLocator(link));
      await this.commons.assertVisible(this.elements.getLocator(link));
    }
  }

  // Verify Orders link is present
  async verifyOrdersLink(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('ordersLink'));
    await this.commons.assertVisible(this.elements.getLocator('ordersLink'));
  }

  // Verify Addresses link is present
  async verifyAddressesLink(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('addressesLink'));
    await this.commons.assertVisible(this.elements.getLocator('addressesLink'));
  }

  // Verify Shopping Cart link is present
  async verifyShoppingCartLink(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('shoppingCartLink'));
    await this.commons.assertVisible(this.elements.getLocator('shoppingCartLink'));
  }

  // Verify Wishlist link is present
  async verifyWishlistLink(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('wishlistLink'));
    await this.commons.assertVisible(this.elements.getLocator('wishlistLink'));
  }

  // Verify Downloadable Products link is present
  async verifyDownloadableProductsLink(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('downloadableProductsLink'));
    await this.commons.assertVisible(this.elements.getLocator('downloadableProductsLink'));
  }

  // Verify Reward Points link is present
  async verifyRewardPointsLink(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('rewardPointsLink'));
    await this.commons.assertVisible(this.elements.getLocator('rewardPointsLink'));
  }

  // Verify Change Password link is present
  async verifyChangePasswordLink(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('changePasswordLink'));
    await this.commons.assertVisible(this.elements.getLocator('changePasswordLink'));
  }

  // Verify account navigation sidebar is visible
  async verifyAccountNavigationSidebar(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('accountNavigationSidebar'));
    await this.commons.assertVisible(this.elements.getLocator('accountNavigationSidebar'));
  }

  // Get email value from account info
  async getEmailValue(): Promise<string> {
    return await this.commons.getValue(this.elements.getLocator('emailDisplay'));
  }

  // Get first name value from account info
  async getFirstNameValue(): Promise<string> {
    return await this.commons.getValue(this.elements.getLocator('firstNameDisplay'));
  }

  // Get last name value from account info
  async getLastNameValue(): Promise<string> {
    return await this.commons.getValue(this.elements.getLocator('lastNameDisplay'));
  }

  // Click Edit button (if available)
  async clickEdit(): Promise<void> {
    await this.commons.click(this.elements.getLocator('editButton'));
    await this.commons.waitForPageLoad();
  }

  // Click Save button
  async clickSave(): Promise<void> {
    await this.commons.click(this.elements.getLocator('saveButton'));
    await this.commons.waitForPageLoad();
  }

  // Verify breadcrumbs are visible
  async verifyBreadcrumbs(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('breadcrumbs'));
    await this.commons.assertVisible(this.elements.getLocator('breadcrumbs'));
  }

  // Verify breadcrumb contains specific text
  async verifyBreadcrumbContains(text: string): Promise<void> {
    const breadcrumb = this.elements.getLocator('breadcrumbs');
    await this.commons.waitForVisible(breadcrumb);
    await this.commons.assertContainsText(breadcrumb, text);
  }

  // Check if breadcrumbs are visible
  async areBreadcrumbsVisible(): Promise<boolean> {
    return await this.commons.isVisible(this.elements.getLocator('breadcrumbs'));
  }
}