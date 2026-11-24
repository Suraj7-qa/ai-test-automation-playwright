import { Page, Locator, expect } from '@playwright/test';
import { WebCommons } from '../../commons/ui/web-commons';
import { loadPageElements, ElementHelper } from '../../utilities/element-loader';
import { loadTestData } from '../../utilities/test-data-loader';

export class BooksPageSteps {
  private page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;
  private testData: any;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'books-page');
    this.pageElements = loadPageElements('books-page');
    this.testData = loadTestData('ui');
  }

  // Navigate to Books category page
  async navigate(): Promise<void> {
    await this.commons.navigate(this.pageElements.pageUrl);
    await this.commons.waitForPageLoad();
    await this.commons.assertTitle(/Books/);
  }

  // Navigate to Books category page directly
  async navigateDirect(): Promise<void> {
    await this.page.goto(this.pageElements.pageUrl, { waitUntil: 'networkidle' });
    await this.commons.waitForPageLoad();
  }

  // Verify Books category page is loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Books/);
    await this.commons.assertVisible(this.elements.getLocator('pageHeading'));
    await this.commons.assertVisible(this.elements.getLocator('productGrid'));
    await this.commons.assertVisible(this.elements.getLocator('breadcrumb'));
  }

  // Get all product names on category page
  async getProductNames(): Promise<string[]> {
    const productLinks = this.page.locator('a[href*="computing-and-internet"], a[href*="copy-of-computing-and-internet"], a[href*="/fiction"], a[href*="/science"], a[href*="/health"], a[href*="/fiction-ex"]');
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
    const productLink = this.page.locator('a[href*="computing-and-internet"], a[href*="copy-of-computing-and-internet"], a[href*="/fiction"]').first();
    await this.commons.click(productLink);
    await this.commons.waitForPageLoad();
  }

  // Add product to cart from category page by product name
  async addToCartFromCategory(productName: string): Promise<void> {
    const productItem = this.page.locator(`.item-box:has-text("${productName}")`).first();
    const addToCartBtn = productItem.locator('button:has-text("Add to cart"), .add-to-cart-button').first();
    await this.commons.click(addToCartBtn);
    await this.commons.waitForVisible(this.page.locator('.bar-notification, .notification-success, div:has-text("added to your shopping cart")').first());
  }

  // Add first product to cart from category page
  async addFirstProductToCartFromCategory(): Promise<void> {
    const addToCartBtn = this.page.locator('button:has-text("Add to cart"), .add-to-cart-button').first();
    await this.commons.click(addToCartBtn);
    await this.commons.waitForVisible(this.page.locator('.bar-notification, .notification-success, div:has-text("added to your shopping cart")').first());
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

  // Filter by price range
  async filterByPrice(range: 'Under 25.00' | '25.00 - 50.00' | 'Over 50.00'): Promise<void> {
    let locator: Locator;
    switch (range) {
      case 'Under 25.00':
        locator = this.elements.getLocator('priceFilterUnder25');
        break;
      case '25.00 - 50.00':
        locator = this.elements.getLocator('priceFilter25to50');
        break;
      case 'Over 50.00':
        locator = this.elements.getLocator('priceFilterOver50');
        break;
    }
    await this.commons.click(locator);
    await this.commons.waitForPageLoad();
  }

  // Click breadcrumb link
  async clickBreadcrumb(linkText: 'Home' | 'Books'): Promise<void> {
    const breadcrumb = this.page.locator('.breadcrumb, .breadcrumbs, [class*="breadcrumb"]').first();
    const link = breadcrumb.locator(`a:has-text("${linkText}")`).first();
    await this.commons.click(link);
    await this.commons.waitForPageLoad();
  }

  // Navigate to Books from sidebar
  async clickSidebarBooks(): Promise<void> {
    await this.commons.click(this.elements.getLocator('sidebarBooksLink'));
    await this.commons.waitForPageLoad();
  }

  // Verify product count on page
  async verifyProductCount(expectedCount: number): Promise<void> {
    const productItems = this.page.locator('.item-box, .product-item, [class*="product-item"]');
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
}

export class BookProductDetailPageSteps {
  private page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'book-product-detail-page');
    this.pageElements = loadPageElements('book-product-detail-page');
  }

  // Verify product detail page loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Computing and Internet/);
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
    await this.commons.waitForVisible(this.page.locator('.bar-notification, .notification-success, div:has-text("product comparison")').first());
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
  async clickBreadcrumb(linkText: 'Home' | 'Books'): Promise<void> {
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
}

export class EmailFriendPageSteps {
  private page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'email-friend-page');
    this.pageElements = loadPageElements('email-friend-page');
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
    await this.commons.waitForVisible(this.elements.getLocator('successMessage'));
    await this.commons.assertContainsText(this.elements.getLocator('successMessage'), 'Your message has been sent');
  }

  // Verify validation error for invalid email
  async verifyInvalidEmailError(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('validationSummary'));
    await this.commons.assertContainsText(this.elements.getLocator('validationSummary'), 'Wrong email');
  }

  // Verify validation errors for empty fields
  async verifyEmptyFieldsError(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('validationSummary'));
    await this.commons.assertContainsText(this.elements.getLocator('validationSummary'), 'required');
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
}

export class ProductReviewsPageSteps {
  private page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'product-reviews-page');
    this.pageElements = loadPageElements('product-reviews-page');
  }

  // Verify product reviews page loaded
  async verifyPageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Product Reviews/);
    await this.commons.assertVisible(this.elements.getLocator('pageHeading'));
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