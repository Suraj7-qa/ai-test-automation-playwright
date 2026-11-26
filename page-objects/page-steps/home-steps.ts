import { Page, Locator, expect } from '@playwright/test';
import { WebCommons } from '../../commons/ui/web-commons';
import { loadPageElements, ElementHelper } from '../../utilities/element-loader';

export class HomePageSteps {
  private page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'home-page');
    this.pageElements = loadPageElements('home-page');
  }

  // Navigate to home page
  async navigate(): Promise<void> {
    await this.commons.navigate(this.pageElements.pageUrl);
    await this.commons.waitForPageLoad();
  }

  // Navigate to home page via URL
  async navigateDirect(): Promise<void> {
    await this.page.goto(this.pageElements.pageUrl, { waitUntil: 'networkidle' });
    await this.commons.waitForPageLoad();
  }

  // Click login link
  async clickLogin(): Promise<void> {
    await this.commons.click(this.elements.getLocator('loginLink'));
    await this.commons.waitForPageLoad();
  }

  // Click register link
  async clickRegister(): Promise<void> {
    await this.commons.click(this.elements.getLocator('registerLink'));
    await this.commons.waitForPageLoad();
  }

  // Click logout link
  async clickLogout(): Promise<void> {
    await this.commons.click(this.elements.getLocator('logoutLink'));
    await this.commons.waitForPageLoad();
  }

  // Click user email/account link
  async clickUserAccount(): Promise<void> {
    await this.commons.click(this.elements.getLocator('userEmail'));
    await this.commons.waitForPageLoad();
  }

  // Click shopping cart link
  async clickShoppingCart(): Promise<void> {
    await this.commons.click(this.elements.getLocator('shoppingCartLink'));
    await this.commons.waitForPageLoad();
  }

  // Click wishlist link
  async clickWishlist(): Promise<void> {
    await this.commons.click(this.elements.getLocator('wishlistLink'));
    await this.commons.waitForPageLoad();
  }

  // Click logo
  async clickLogo(): Promise<void> {
    await this.commons.click(this.elements.getLocator('logoLink'));
    await this.commons.waitForPageLoad();
  }

  // Click category from header menu
  async clickCategory(categoryName: string): Promise<void> {
    const categoryLocator = this.page.locator(`ul[class*='top-menu'] a:has-text("${categoryName}")`).first();
    await this.commons.click(categoryLocator);
    await this.commons.waitForPageLoad();
  }

  // Hover over category to show sub-menu
  async hoverCategory(categoryName: string): Promise<void> {
    const categoryLocator = this.page.locator(`ul[class*='top-menu'] a:has-text("${categoryName}")`).first();
    await this.commons.hover(categoryLocator);
    await this.page.waitForTimeout(500); // Wait for sub-menu to appear
  }

  // Click sub-category from header dropdown
  async clickSubCategory(subCategoryName: string): Promise<void> {
    const subCategoryLocator = this.page.locator(`ul[class*='top-menu'] a:has-text("${subCategoryName}")`).first();
    await this.commons.click(subCategoryLocator);
    await this.commons.waitForPageLoad();
  }

  // Verify category page loaded
  async verifyCategoryPageLoaded(categoryName: string): Promise<void> {
    await this.commons.waitForPageLoad();
    await this.commons.assertTitle(new RegExp(categoryName, 'i'));
    await this.commons.assertVisible(this.page.locator('h1:has-text("' + categoryName + '")').first());
  }

  // Verify URL contains
  async verifyUrlContains(path: string): Promise<void> {
    await this.commons.waitForURL(new RegExp(path));
  }

  // Verify URL matches
  async verifyUrlMatches(path: string): Promise<void> {
    await this.commons.assertURL(new RegExp(path + '$'));
  }

  // Verify user is logged in
  async verifyUserLoggedIn(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('logoutLink'));
    await this.commons.waitForVisible(this.elements.getLocator('userEmail'));
    await this.commons.assertVisible(this.elements.getLocator('logoutLink'));
    await this.commons.assertVisible(this.elements.getLocator('userEmail'));
    await this.commons.assertHidden(this.elements.getLocator('loginLink'));
    await this.commons.assertHidden(this.elements.getLocator('registerLink'));
  }

  // Verify user email in header
  async verifyUserEmail(expectedEmail: string): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('userEmail'));
    await this.commons.assertContainsText(this.elements.getLocator('userEmail'), expectedEmail);
  }

  // Verify user is logged out
  async verifyUserLoggedOut(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('loginLink'));
    await this.commons.waitForVisible(this.elements.getLocator('registerLink'));
    await this.commons.assertVisible(this.elements.getLocator('loginLink'));
    await this.commons.assertVisible(this.elements.getLocator('registerLink'));
    await this.commons.assertHidden(this.elements.getLocator('logoutLink'));
    // Note: userEmail (.account link) is always visible, just changes text
    // Use verifyUserEmailNotDisplayed() to check email is not shown
  }

  // Verify user email is not displayed (account link doesn't contain email)
  async verifyUserEmailNotDisplayed(): Promise<void> {
    const accountLink = this.elements.getLocator('userEmail');
    await this.commons.waitForVisible(accountLink);
    const text = await this.commons.getText(accountLink);
    // Should not contain email pattern when logged out
    expect(text).not.toMatch(/@/);
  }

  // Verify shopping cart count
  async verifyCartCount(expectedCount: string | number): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('cartCount'));
    await this.commons.assertText(this.elements.getLocator('cartCount'), expectedCount.toString());
  }

  // Get cart count
  async getCartCount(): Promise<string> {
    return await this.commons.getText(this.elements.getLocator('cartCount'));
  }

  // Verify home page is loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Demo Web Shop/);
    await this.commons.assertVisible(this.elements.getLocator('header'));
    await this.commons.assertVisible(this.elements.getLocator('searchInput'));
  }

  // Verify welcome message
  async verifyWelcomeMessage(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('welcomeMessage'));
  }

  // Check if login link is visible
  async isLoginLinkVisible(): Promise<boolean> {
    return await this.commons.isVisible(this.elements.getLocator('loginLink'));
  }

  // Check if register link is visible
  async isRegisterLinkVisible(): Promise<boolean> {
    return await this.commons.isVisible(this.elements.getLocator('registerLink'));
  }

  // Check if logout link is visible
  async isLogoutLinkVisible(): Promise<boolean> {
    return await this.commons.isVisible(this.elements.getLocator('logoutLink'));
  }

  // Check if user email is visible
  async isUserEmailVisible(): Promise<boolean> {
    return await this.commons.isVisible(this.elements.getLocator('userEmail'));
  }

  // ========== Sidebar Categories ==========

  // Click sidebar category
  async clickSidebarCategory(categoryName: string): Promise<void> {
    const locator = this.page.locator(`div.block.block-category-navigation a:has-text("${categoryName}")`).first();
    await this.commons.click(locator);
    await this.commons.waitForPageLoad();
  }

  // Click sidebar sub-category
  async clickSidebarSubCategory(subCategoryName: string): Promise<void> {
    const locator = this.page.locator(`div.block.block-category-navigation a:has-text("${subCategoryName}")`).first();
    await this.commons.click(locator);
    await this.commons.waitForPageLoad();
  }

  // Verify sidebar category visible
  async verifySidebarCategoryVisible(categoryName: string): Promise<void> {
    const locator = this.page.locator(`div.block.block-category-navigation a:has-text("${categoryName}")`).first();
    await this.commons.assertVisible(locator);
  }

  // Verify sidebar category expanded (has sub-items visible)
  async verifySidebarCategoryExpanded(categoryName: string): Promise<void> {
    const parentLocator = this.page.locator(`div.block.block-category-navigation a:has-text("${categoryName}")`).first();
    const subList = parentLocator.locator('..').locator('ul').first();
    await this.commons.assertVisible(subList);
  }

  // Verify sidebar sub-category visible
  async verifySidebarSubCategoryVisible(subCategoryName: string): Promise<void> {
    const locator = this.page.locator(`div.block.block-category-navigation a:has-text("${subCategoryName}")`).first();
    await this.commons.assertVisible(locator);
  }

  // Verify sidebar section visible
  async verifySidebarSectionVisible(sectionName: string): Promise<void> {
    const locator = this.page.locator(`div.block:has(strong:has-text("${sectionName}"))`).first();
    await this.commons.assertVisible(locator);
  }

  // ========== Footer Links ==========

  // Click footer link
  async clickFooterLink(linkText: string): Promise<void> {
    const locator = this.page.locator(`div.footer a:has-text("${linkText}")`).first();
    await this.commons.click(locator);
    await this.commons.waitForPageLoad();
  }

  // Click footer social link
  async clickFooterSocialLink(socialName: string): Promise<void> {
    const locator = this.page.locator(`div.footer a:has-text("${socialName}")`).first();
    await this.commons.click(locator);
    await this.commons.waitForPageLoad();
  }

  // Verify external link
  async verifyExternalLink(domain: string): Promise<void> {
    await this.commons.waitForURL(new RegExp(domain));
  }

  // ========== Search ==========

  // Search
  async search(term: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('searchInput'), term);
    await this.commons.click(this.elements.getLocator('searchButton'));
    await this.commons.waitForPageLoad();
  }

  // Verify search results visible
  async verifySearchResultsVisible(): Promise<void> {
    await this.commons.waitForVisible(this.page.locator('.product-grid, .search-results, .products-container').first());
  }

  // Verify no search results
  async verifyNoSearchResults(): Promise<void> {
    await this.commons.waitForVisible(this.page.locator('.no-result, .content:has-text("No products")').first());
  }

  // ========== Breadcrumbs ==========

  // Verify breadcrumbs visible
  async verifyBreadcrumbsVisible(): Promise<void> {
    await this.commons.waitForVisible(this.page.locator('.breadcrumb, .breadcrumbs, [class*="breadcrumb"]').first());
  }

  // Verify breadcrumb contains text
  async verifyBreadcrumbContains(text: string): Promise<void> {
    const breadcrumb = this.page.locator('.breadcrumb, .breadcrumbs, [class*="breadcrumb"]').first();
    await this.commons.assertContainsText(breadcrumb, text);
  }

  // Click breadcrumb
  async clickBreadcrumb(text: string): Promise<void> {
    const locator = this.page.locator('.breadcrumb a, .breadcrumbs a, [class*="breadcrumb"] a').filter({ hasText: text }).first();
    await this.commons.click(locator);
    await this.commons.waitForPageLoad();
  }

  // ========== Home Page Smoke ==========

  async verifyHomePageLoaded(): Promise<void> {
    await this.navigate();
    await expect(this.page).toHaveURL(/\/$/);
    await expect(this.page).toHaveTitle(/Demo Web Shop/);
    await expect(this.elements.getLocator('header')).toBeVisible();
    await expect(this.elements.getLocator('searchInput')).toBeVisible();
  }

  async verifyGuestHeader(): Promise<void> {
    await this.navigate();
    await expect(this.elements.getLocator('registerLink')).toBeVisible();
    await expect(this.elements.getLocator('loginLink')).toBeVisible();
    await expect(this.page.locator('.header-links a.ico-cart').first()).toBeVisible();
    await expect(this.page.locator('.header-links a.ico-wishlist').first()).toBeVisible();
  }

  async verifyWelcomeAndFeaturedProducts(): Promise<void> {
    await this.navigate();
    await expect(this.elements.getLocator('welcomeHeading')).toBeVisible();
    const cards = this.page.locator(this.pageElements.elements.featuredProductCards.locator);
    await expect(cards).toHaveCount(6);

    const names = await cards.locator(this.pageElements.elements.featuredProductTitle.locator).allTextContents();
    expect(names).toEqual(expect.arrayContaining([
      '$25 Virtual Gift Card',
      '14.1-inch Laptop',
      'Build your own cheap computer',
      'Build your own computer',
      'Build your own expensive computer',
      'Simple Computer'
    ]));
  }

  async searchFromHome(term: string, expectedUrl: RegExp): Promise<void> {
    await this.navigate();
    await this.elements.fill('searchInput', term);
    await this.elements.click('searchButton');
    await expect(this.page).toHaveURL(expectedUrl);
  }

  async searchForLaptop(): Promise<void> {
    await this.searchFromHome('laptop', /\/search\?q=laptop/);
    await expect(this.page.locator('.product-title')).toContainText(['14.1-inch Laptop']);
  }

  async searchWithEmptyKeyword(): Promise<void> {
    await this.navigate();
    await this.elements.fill('searchInput', '');
    await this.elements.click('searchButton');
    await expect(this.page).toHaveURL(/\/$/);
  }

  async verifyEmptyNewsletterEmail(): Promise<void> {
    await this.navigate();
    await this.elements.fill('newsletterEmail', '');
    await this.elements.click('newsletterSubscribeButton');
    await expect(this.elements.getLocator('newsletterResult')).toHaveText(/Enter valid email/);
  }

  async verifyInvalidNewsletterEmail(): Promise<void> {
    await this.navigate();
    await this.elements.fill('newsletterEmail', 'invalid-email');
    await this.elements.click('newsletterSubscribeButton');
    await expect(this.elements.getLocator('newsletterResult')).toHaveText(/Enter valid email/);
  }

  async verifyLogoNavigation(): Promise<void> {
    await this.page.goto('/jewelry', { waitUntil: 'domcontentloaded' });
    await this.elements.click('logoLink');
    await expect(this.page).toHaveURL(/\/$/);
  }

  async verifyFeaturedProductCart(): Promise<void> {
    await this.navigate();
    const laptop = this.page.locator(this.pageElements.elements.featuredProductCards.locator)
      .filter({ has: this.page.getByRole('link', { name: '14.1-inch Laptop', exact: true }) });
    await expect(laptop).toHaveCount(1);
    await laptop.locator(this.pageElements.elements.featuredAddToCartButton.locator).first().click();
    await expect(this.elements.getLocator('addToCartNotification')).toContainText('added to your shopping cart');
    await expect(this.elements.getLocator('cartCount')).toContainText('(1)');
  }

  async verifySidebarJewelryNavigation(): Promise<void> {
    await this.navigate();
    await this.elements.getLocator('sidebarCategoryNavigation')
      .getByRole('link', { name: 'Jewelry', exact: true }).click();
    await expect(this.page).toHaveURL(/\/jewelry$/);
    await expect(this.page.getByRole('heading', { name: 'Jewelry', exact: true })).toBeVisible();
  }

  async verifyMobileLayout(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 812 });
    await this.navigate();
    await expect(this.elements.getLocator('header')).toBeVisible();
    await expect(this.elements.getLocator('searchInput')).toBeVisible();
    await expect(this.page.locator('body')).not.toHaveCSS('overflow-x', 'scroll');
  }
}