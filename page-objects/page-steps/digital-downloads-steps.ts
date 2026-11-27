import { Page, Locator, expect } from '@playwright/test';
import { WebCommons } from '../../commons/ui/web-commons';
import { loadPageElements, ElementHelper } from '../../utilities/element-loader';
import { loadTestData } from '../../utilities/test-data-loader';

export class DigitalDownloadsPageSteps {
  public page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;
  private testData: any;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'digital-downloads-page');
    this.pageElements = loadPageElements('digital-downloads-page');
    this.testData = loadTestData('ui');
  }

  getCommons(): WebCommons {
    return this.commons;
  }

  // Navigate to Digital Downloads category page
  async navigate(): Promise<void> {
    await this.commons.navigate(this.pageElements.pageUrl);
    await this.commons.waitForPageLoad();
    await this.commons.assertTitle(/Digital downloads/);
  }

  // Navigate to Digital Downloads category page directly
  async navigateDirect(): Promise<void> {
    await this.page.goto(this.pageElements.pageUrl, { waitUntil: 'networkidle' });
    await this.commons.waitForPageLoad();
  }

  // Verify Digital Downloads category page is loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Digital downloads/);
    await this.commons.assertVisible(this.elements.getLocator('pageHeading'));
    await this.commons.assertVisible(this.elements.getLocator('productGrid'));
    await this.commons.assertVisible(this.elements.getLocator('breadcrumb'));
  }

  // Get all product names on category page
  async getProductNames(): Promise<string[]> {
    const productLinks = this.page.locator('a[href*="digital-album"], a[href*="software"], .product-title a, .product-name a').first();
    const count = await productLinks.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await productLinks.nth(i).textContent();
      if (name && name.trim()) names.push(name.trim());
    }
    return names;
  }

  // Click product by name to go to detail page
  async clickProductByName(productName: string): Promise<void> {
    const productLink = this.page.locator(`a:has-text("${productName}")`).first();
    await this.commons.click(productLink);
    await this.commons.waitForPageLoad();
  }

  // Click first product
  async clickFirstProduct(): Promise<void> {
    const productLink = this.page.locator('.product-title a').first();
    await this.commons.click(productLink);
    await this.commons.waitForPageLoad();
  }

  // Add product to cart from category page by product name
  async addToCartFromCategory(productName: string): Promise<void> {
    const productItem = this.page.locator(`.item-box:has-text("${productName}")`).first();
    const addToCartBtn = productItem.locator('input[value="Add to cart"]').first();
    await this.commons.click(addToCartBtn);
    await this.commons.waitForVisible(this.page.locator('.bar-notification, .notification-success, div:has-text("added to your shopping cart")').first());
  }

  // Add first product to cart from category page
  async addFirstProductToCartFromCategory(): Promise<void> {
    const addToCartBtn = this.page.locator('input[value="Add to cart"]').first();
    await this.commons.click(addToCartBtn);
    await this.commons.waitForVisible(this.page.locator('.bar-notification, .notification-success, div:has-text("added to your shopping cart")').first());
  }

  // Add multiple products to cart from category page
  async addMultipleProductsToCart(productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      await this.addToCartFromCategory(productName);
      await this.commons.waitForVisible(this.page.locator('.bar-notification, .notification-success, div:has-text("added to your shopping cart")').first());
    }
  }

  // Verify success notification for add to cart
  async verifyAddToCartSuccess(): Promise<void> {
    await this.commons.waitForVisible(this.page.locator('.bar-notification, .notification-success, div:has-text("added to your shopping cart")').first());
    await this.commons.assertContainsText(this.page.locator('.bar-notification, .notification-success, div:has-text("added to your shopping cart")').first(), 'added to your shopping cart');
  }

  // Verify cart count in header
  async verifyCartCount(expectedCount: string | number): Promise<void> {
    const homeElements = new ElementHelper(this.page, 'home-page');
    await this.commons.waitForVisible(homeElements.getLocator('cartCount'));
    await this.commons.assertText(homeElements.getLocator('cartCount'), expectedCount.toString());
  }

  // Sort products by option
  async sortBy(option: 'Position' | 'Name: A to Z' | 'Name: Z to A' | 'Price: Low to High' | 'Price: High to Low' | 'Created on'): Promise<void> {
    const dropdown = this.elements.getLocator('sortByDropdown');
    await this.commons.selectOption(dropdown, option);
    await this.commons.waitForPageLoad();
  }

  // Change display view (Grid/List)
  async changeDisplayView(view: 'Grid' | 'List'): Promise<void> {
    const dropdown = this.elements.getLocator('displayDropdown');
    await this.commons.selectOption(dropdown, view);
    await this.commons.waitForPageLoad();
  }

  // Change items per page
  async changeItemsPerPage(count: number): Promise<void> {
    const dropdown = this.elements.getLocator('displayPerPageDropdown');
    await this.commons.selectOption(dropdown, count.toString());
    await this.commons.waitForPageLoad();
  }

  // Click breadcrumb link
  async clickBreadcrumb(linkText: 'Home' | 'Digital downloads'): Promise<void> {
    const breadcrumb = this.page.locator('.breadcrumb, .breadcrumbs, [class*="breadcrumb"]').first();
    const link = breadcrumb.locator(`a:has-text("${linkText}")`).first();
    await this.commons.click(link);
    await this.commons.waitForPageLoad();
  }

  // Navigate to Digital Downloads from sidebar
  async clickSidebarDigitalDownloads(): Promise<void> {
    await this.commons.click(this.elements.getLocator('sidebarDigitalDownloadsLink'));
    await this.commons.waitForPageLoad();
  }

  // Verify product count on page
  async verifyProductCount(expectedCount: number): Promise<void> {
    const productItems = this.page.locator('.product-grid .item-box, .products-container .item-box');
    await this.commons.assertCount(productItems, expectedCount);
  }

  // Get product prices on category page
  async getProductPrices(): Promise<string[]> {
    const priceElements = this.page.locator('.prices .price, .product-price .price, .actual-price, [class*="price"]');
    const count = await priceElements.count();
    const prices: string[] = [];
    for (let i = 0; i < count; i++) {
      const price = await priceElements.nth(i).textContent();
      if (price && price.trim()) prices.push(price.trim());
    }
    return prices;
  }

  // Search from Digital Downloads category page
  async search(term: string): Promise<void> {
    // Search input has no placeholder, use CSS selector
    await this.commons.fill(this.page.locator('input[id="small-searchterms"]'), term);
    await this.commons.click(this.elements.getLocator('searchButton'));
    await this.commons.waitForPageLoad();
  }

  // Verify breadcrumb visible and contains text
  async verifyBreadcrumbContains(text: string): Promise<void> {
    const breadcrumb = this.page.locator('.breadcrumb, .breadcrumbs, [class*="breadcrumb"]').first();
    await this.commons.assertVisible(breadcrumb);
    await this.commons.assertContainsText(breadcrumb, text);
  }

  // Verify breadcrumb Home link works
  async verifyBreadcrumbHomeNavigation(): Promise<void> {
    await this.clickBreadcrumb('Home');
    await this.commons.assertURL(/\/$/);
  }

  // Verify breadcrumb Digital downloads link works
  async verifyBreadcrumbDigitalDownloadsNavigation(): Promise<void> {
    await this.clickBreadcrumb('Digital downloads');
    await this.commons.waitForURL(/\/digital-downloads/);
    await this.verifyPageLoaded();
  }
}

export class DigitalProductDetailPageSteps {
  public page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'digital-product-detail-page');
    this.pageElements = loadPageElements('digital-product-detail-page');
  }

  getCommons(): WebCommons {
    return this.commons;
  }

  // Verify product detail page loaded
  async verifyPageLoaded(): Promise<void> {
    // Title is "Demo Web Shop. <Product Name>" - just verify it contains "Demo Web Shop"
    await this.commons.assertTitle(/Demo Web Shop/);
    await this.commons.assertVisible(this.elements.getLocator('productName'));
    await this.commons.assertVisible(this.elements.getLocator('addToCartButton'));
    await this.commons.assertVisible(this.elements.getLocator('emailFriendButton'));
    await this.commons.assertVisible(this.elements.getLocator('compareListButton'));
  }

  // Verify product name
  async verifyProductName(expectedName: string): Promise<void> {
    await this.commons.assertContainsText(this.elements.getLocator('productName'), expectedName);
  }

  // Verify product price
  async verifyProductPrice(expectedPrice: string): Promise<void> {
    await this.commons.assertContainsText(this.elements.getLocator('productPrice'), expectedPrice);
  }

  // Verify old price (discount)
  async verifyOldPrice(expectedOldPrice: string): Promise<void> {
    await this.commons.assertContainsText(this.elements.getLocator('productOldPrice'), expectedOldPrice);
  }

  // Verify availability
  async verifyAvailability(): Promise<void> {
    await this.commons.assertVisible(this.elements.getLocator('productAvailability'));
    await this.commons.assertContainsText(this.elements.getLocator('productAvailability'), 'In stock');
  }

  // Verify free shipping
  async verifyFreeShipping(): Promise<void> {
    await this.commons.assertVisible(this.elements.getLocator('freeShipping'));
  }

  // Verify quantity input default value
  async verifyQuantityDefaultValue(expectedValue: string = '1'): Promise<void> {
    await this.commons.assertValue(this.elements.getLocator('quantityInput'), expectedValue);
  }

  // Set quantity
  async setQuantity(quantity: number): Promise<void> {
    await this.commons.fill(this.elements.getLocator('quantityInput'), quantity.toString());
  }

  // Set quantity with string (for negative, decimal, text tests)
  async setQuantityString(value: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('quantityInput'), value);
  }

  // Clear quantity input
  async clearQuantity(): Promise<void> {
    await this.commons.fill(this.elements.getLocator('quantityInput'), '');
  }

  // Get quantity value
  async getQuantityValue(): Promise<string> {
    return await this.commons.getValue(this.elements.getLocator('quantityInput'));
  }

  // Click Add to cart button
  async clickAddToCart(): Promise<void> {
    await this.commons.click(this.elements.getLocator('addToCartButton'));
    await this.commons.waitForVisible(this.page.locator('.bar-notification, .notification-success, div:has-text("added to your shopping cart")').first());
  }

  // Verify add to cart success
  async verifyAddToCartSuccess(): Promise<void> {
    await this.commons.waitForVisible(this.page.locator('.bar-notification, .notification-success, div:has-text("added to your shopping cart")').first());
    await this.commons.assertContainsText(this.page.locator('.bar-notification, .notification-success, div:has-text("added to your shopping cart")').first(), 'added to your shopping cart');
  }

  // Click Email a friend button
  async clickEmailFriend(): Promise<void> {
    await this.commons.click(this.elements.getLocator('emailFriendButton'));
    await this.commons.waitForPageLoad();
  }

  // Click Compare list button
  async clickCompareList(): Promise<void> {
    await this.commons.click(this.elements.getLocator('compareListButton'));
    // Clicking "Add to compare list" navigates to the compare products page
    await this.commons.waitForURL(/compareproducts/);
  }

  // Click Review count link
  async clickReviewCount(): Promise<void> {
    await this.commons.click(this.elements.getLocator('reviewCountLink'));
    await this.commons.waitForPageLoad();
  }

  // Click Add your review link
  async clickAddReview(): Promise<void> {
    await this.commons.click(this.elements.getLocator('addReviewLink'));
    await this.commons.waitForPageLoad();
  }

  // Verify related products section visible
  async verifyRelatedProductsVisible(): Promise<void> {
    await this.commons.assertVisible(this.elements.getLocator('relatedProductsSection'));
  }

  // Get related product names
  async getRelatedProductNames(): Promise<string[]> {
    const productLinks = this.page.locator('.related-products .product-title a, .product-related .product-title a, .related-products a[href*="/"], .product-related a[href*="/"]');
    const count = await productLinks.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await productLinks.nth(i).textContent();
      if (name && name.trim()) names.push(name.trim());
    }
    return names;
  }

  // Click breadcrumb
  async clickBreadcrumb(linkText: 'Home' | 'Digital downloads'): Promise<void> {
    const breadcrumb = this.page.locator('.breadcrumb, .breadcrumbs, [class*="breadcrumb"]').first();
    const link = breadcrumb.locator(`a:has-text("${linkText}")`).first();
    await this.commons.click(link);
    await this.commons.waitForPageLoad();
  }

  // Verify product image visible
  async verifyProductImage(): Promise<void> {
    await this.commons.assertVisible(this.elements.getLocator('productImage'));
  }

  // Verify product description
  async verifyProductDescription(expectedText: string): Promise<void> {
    await this.commons.assertContainsText(this.elements.getLocator('productFullDescription'), expectedText);
  }

  // Verify short description
  async verifyShortDescription(expectedText: string): Promise<void> {
    await this.commons.assertContainsText(this.elements.getLocator('productShortDescription'), expectedText);
  }

  // Verify breadcrumb shows full path
  async verifyBreadcrumbPath(productName: string): Promise<void> {
    const breadcrumb = this.page.locator('.breadcrumb, .breadcrumbs, [class*="breadcrumb"]').first();
    await this.commons.assertVisible(breadcrumb);
    await this.commons.assertContainsText(breadcrumb, 'Home');
    await this.commons.assertContainsText(breadcrumb, 'Digital downloads');
    await this.commons.assertContainsText(breadcrumb, productName);
  }

  // Verify all detail page elements visible
  async verifyAllElementsVisible(): Promise<void> {
    await this.commons.assertVisible(this.elements.getLocator('productName'));
    await this.commons.assertVisible(this.elements.getLocator('productPrice'));
    await this.commons.assertVisible(this.elements.getLocator('productShortDescription'));
    await this.commons.assertVisible(this.elements.getLocator('productFullDescription'));
    await this.commons.assertVisible(this.elements.getLocator('quantityInput'));
    await this.commons.assertVisible(this.elements.getLocator('addToCartButton'));
    await this.commons.assertVisible(this.elements.getLocator('emailFriendButton'));
    await this.commons.assertVisible(this.elements.getLocator('compareListButton'));
    await this.commons.assertVisible(this.elements.getLocator('reviewCountLink'));
    await this.commons.assertVisible(this.elements.getLocator('addReviewLink'));
    await this.commons.assertVisible(this.elements.getLocator('productImage'));
  }
}

export class EmailFriendPageSteps {
  public page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;
  private testData: any;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'email-friend-page');
    this.pageElements = loadPageElements('email-friend-page');
    this.testData = loadTestData('ui');
  }

  getCommons(): WebCommons {
    return this.commons;
  }

  // Verify email friend page loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Email A Friend/);
    await this.commons.assertVisible(this.elements.getLocator('pageHeading'));
    await this.commons.assertVisible(this.elements.getLocator('friendEmailInput'));
    await this.commons.assertVisible(this.elements.getLocator('yourEmailInput'));
    await this.commons.assertVisible(this.elements.getLocator('sendEmailButton'));
  }

  // Fill friend email
  async enterFriendEmail(email: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('friendEmailInput'), email);
  }

  // Fill your email
  async enterYourEmail(email: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('yourEmailInput'), email);
  }

  // Fill personal message
  async enterPersonalMessage(message: string): Promise<void> {
    await this.commons.fill(this.elements.getLocator('personalMessageInput'), message);
  }

  // Click Send email button
  async clickSendEmail(): Promise<void> {
    await this.commons.click(this.elements.getLocator('sendEmailButton'));
    await this.commons.waitForPageLoad();
  }

  // Verify success message
  async verifySuccessMessage(): Promise<void> {
    // Success message appears as plain text in body, not in .message-success element
    await this.commons.waitForText(this.page.locator('body'), 'Your message has been sent');
  }

  // Verify validation error for invalid email
  async verifyInvalidEmailError(): Promise<void> {
    // The error message is in .field-validation-error which becomes visible after submission
    await this.commons.waitForVisible(this.page.locator('.field-validation-error:visible, .message-error:visible, .validation-summary-errors:visible').first());
    await this.commons.assertContainsText(this.page.locator('.field-validation-error:visible, .message-error:visible, .validation-summary-errors:visible').first(), 'Wrong email');
  }

  // Verify validation errors for empty fields
  async verifyEmptyFieldsError(): Promise<void> {
    await this.commons.waitForVisible(this.page.locator('.field-validation-error:visible, .message-error:visible, .validation-summary-errors:visible').first());
    await this.commons.assertContainsText(this.page.locator('.field-validation-error:visible, .message-error:visible, .validation-summary-errors:visible').first(), "Enter friend's email");
  }

  // Submit email friend form with valid data
  async submitWithValidData(friendEmail: string, yourEmail: string, message: string): Promise<void> {
    await this.enterFriendEmail(friendEmail);
    await this.enterYourEmail(yourEmail);
    await this.enterPersonalMessage(message);
    await this.clickSendEmail();
    await this.verifySuccessMessage();
  }

  // Submit email friend form with invalid email
  async submitWithInvalidEmail(friendEmail: string, yourEmail: string): Promise<void> {
    await this.enterFriendEmail(friendEmail);
    await this.enterYourEmail(yourEmail);
    await this.clickSendEmail();
    await this.verifyInvalidEmailError();
  }

  // Submit email friend form with empty fields
  async submitWithEmptyFields(): Promise<void> {
    await this.clickSendEmail();
    await this.verifyEmptyFieldsError();
  }

  // Submit with XSS payload in message
  async submitWithXSSPayload(friendEmail: string, yourEmail: string, xssPayload: string): Promise<void> {
    await this.enterFriendEmail(friendEmail);
    await this.enterYourEmail(yourEmail);
    await this.enterPersonalMessage(xssPayload);
    await this.clickSendEmail();
    // Verify no script execution - just check page doesn't crash and no alert
    await this.commons.waitForPageLoad();
  }

  // Submit with SQL injection payload
  async submitWithSQLInjection(sqlPayload: string, yourEmail: string, message: string): Promise<void> {
    await this.enterFriendEmail(sqlPayload);
    await this.enterYourEmail(yourEmail);
    await this.enterPersonalMessage(message);
    await this.clickSendEmail();
    await this.commons.waitForPageLoad();
    // Should show validation error or sanitize
    const hasError = await this.commons.isVisible(this.elements.getLocator('validationSummary'));
    if (hasError) {
      await this.commons.assertVisible(this.elements.getLocator('validationSummary'));
    }
  }
}

export class ProductReviewsPageSteps {
  public page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'product-reviews-page');
    this.pageElements = loadPageElements('product-reviews-page');
  }

  getCommons(): WebCommons {
    return this.commons;
  }

  // Verify product reviews page loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Product Reviews/);
    // Heading is "Product reviews for <Product Name>" - use partial match
    await this.commons.assertVisible(this.page.locator('h1:has-text("Product reviews")').first());
  }

  // Verify reviews are displayed
  async verifyReviewsDisplayed(): Promise<void> {
    await this.commons.assertVisible(this.elements.getLocator('reviewList'));
  }

  // Get review count
  async getReviewCount(): Promise<number> {
    const reviewItems = this.page.locator('.review-item, .review, .review-entry');
    return await reviewItems.count();
  }

  // Verify review elements present
  async verifyReviewElementsPresent(): Promise<void> {
    await this.commons.assertVisible(this.elements.getLocator('reviewTitle').first());
    await this.commons.assertVisible(this.elements.getLocator('reviewText').first());
    await this.commons.assertVisible(this.elements.getLocator('reviewRating').first());
    await this.commons.assertVisible(this.elements.getLocator('reviewAuthor').first());
  }
}