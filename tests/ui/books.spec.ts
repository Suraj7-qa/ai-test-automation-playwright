import { test, expect } from '@playwright/test';
import { BooksPageSteps, BookProductDetailPageSteps, EmailFriendPageSteps, ProductReviewsPageSteps } from '../../page-objects/page-steps/books-steps';
import { HomePageSteps } from '../../page-objects/page-steps/home-steps';
import { LoginPageSteps } from '../../page-objects/page-steps/login-steps';
import { loadTestData } from '../../utilities/test-data-loader';

test.describe('Books Module - Category Page', () => {
  let booksSteps: BooksPageSteps;
  let homeSteps: HomePageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    homeSteps = new HomePageSteps(page);
    await booksSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-001: Verify Books category page loads successfully @smoke @regression', async () => {
    await booksSteps.verifyPageLoaded();
  });

  test('DWS-BOOKS-002: Verify all book products displayed on category page @smoke @regression', async () => {
    const productNames = await booksSteps.getProductNames();
    expect(productNames.length).toBeGreaterThanOrEqual(3);
    expect(productNames.some(name => name.includes('Computing and Internet'))).toBeTruthy();
    expect(productNames.some(name => name.includes('Copy of Computing and Internet'))).toBeTruthy();
    expect(productNames.some(name => name.includes('Fiction'))).toBeTruthy();
  });

  test('DWS-BOOKS-003: Verify product prices displayed correctly @regression', async () => {
    const prices = await booksSteps.getProductPrices();
    expect(prices.length).toBeGreaterThanOrEqual(3);
    // Check for discounted prices
    const hasDiscount = prices.some(p => p.includes('10.00') || p.includes('24.00'));
    expect(hasDiscount).toBeTruthy();
  });

  test('DWS-BOOKS-004: Verify product availability status on product detail page @regression', async ({ page }) => {
    // Availability only appears on product detail page, not category page
    const booksSteps = new BooksPageSteps(page);
    const detailSteps = new BookProductDetailPageSteps(page);
    await booksSteps.navigate();
    await booksSteps.clickProductByName('Computing and Internet');
    await detailSteps.verifyAvailability();
  });

  test('DWS-BOOKS-005: Verify free shipping indicator on product detail page @regression', async ({ page }) => {
    // Free shipping only appears on product detail page, not category page
    const booksSteps = new BooksPageSteps(page);
    const detailSteps = new BookProductDetailPageSteps(page);
    await booksSteps.navigate();
    await booksSteps.clickProductByName('Computing and Internet');
    await detailSteps.verifyFreeShipping();
  });

  test('DWS-BOOKS-038: Verify page title and heading on Books category @regression', async () => {
    await expect(booksSteps.page).toHaveTitle(/Books/);
    await expect(booksSteps.page.locator('h1:has-text("Books")')).toBeVisible();
  });
});

test.describe('Books Module - Product Detail Page', () => {
  let booksSteps: BooksPageSteps;
  let detailSteps: BookProductDetailPageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    detailSteps = new BookProductDetailPageSteps(page);
    await booksSteps.navigate();
    await booksSteps.clickProductByName('Computing and Internet');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-006: Navigate to Computing and Internet product detail page @smoke @regression', async () => {
    await detailSteps.verifyPageLoaded();
    expect(detailSteps.page.url()).toContain('/computing-and-internet');
  });

  test('DWS-BOOKS-007: Verify product detail page elements @regression', async () => {
    await detailSteps.verifyPageLoaded();
    await detailSteps.verifyProductName('Computing and Internet');
    await detailSteps.verifyProductPrice('10.00');
    await detailSteps.verifyOldPrice('30.00');
    await detailSteps.verifyAvailability();
    await detailSteps.verifyFreeShipping();
    await expect(detailSteps.elements.getLocator('reviewCountLink')).toBeVisible();
    await expect(detailSteps.elements.getLocator('addReviewLink')).toBeVisible();
  });

  test('DWS-BOOKS-008: Verify quantity input on product detail page @regression', async () => {
    await detailSteps.verifyQuantityDefaultValue('1');
    await detailSteps.setQuantity(3);
    await detailSteps.verifyQuantityDefaultValue('3');
  });

  test('DWS-BOOKS-009: Add Computing and Internet book to cart from product detail page @smoke @regression @critical', async () => {
    await detailSteps.clickAddToCart();
    await detailSteps.verifyAddToCartSuccess();
    // Verify cart count updated
    const homeSteps = new HomePageSteps(detailSteps.page);
    await homeSteps.verifyCartCount(1);
  });

  test('DWS-BOOKS-010: Add multiple quantities of book to cart @regression', async () => {
    await detailSteps.setQuantity(3);
    await detailSteps.clickAddToCart();
    await detailSteps.verifyAddToCartSuccess();
    const homeSteps = new HomePageSteps(detailSteps.page);
    await homeSteps.verifyCartCount(3);
  });

  test('DWS-BOOKS-039: Verify product image displayed on detail page @regression', async () => {
    await detailSteps.verifyProductImage();
  });

  test('DWS-BOOKS-040: Verify product description displayed @regression', async () => {
    await detailSteps.verifyProductDescription('More Than 100 tips about computing and internet.');
  });

  test('DWS-BOOKS-031: Verify related products displayed on product detail page @regression', async () => {
    await detailSteps.verifyRelatedProductsVisible();
    const relatedNames = await detailSteps.getRelatedProductNames();
    expect(relatedNames.length).toBeGreaterThan(0);
  });
});

test.describe('Books Module - Add to Cart from Category Page', () => {
  let booksSteps: BooksPageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    await booksSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-011: Add book to cart from category page @smoke @regression', async () => {
    await booksSteps.addFirstProductToCartFromCategory();
    await booksSteps.verifyAddToCartSuccess();
    await booksSteps.verifyCartCount(1);
  });

  test('DWS-BOOKS-012: Add Copy of Computing and Internet EX to cart @regression', async () => {
    await booksSteps.addToCartFromCategory('Copy of Computing and Internet EX');
    await booksSteps.verifyAddToCartSuccess();
    await booksSteps.verifyCartCount(1);
  });

  test('DWS-BOOKS-013: Add Fiction EX book to cart @regression', async () => {
    await booksSteps.addToCartFromCategory('Fiction EX');
    await booksSteps.verifyAddToCartSuccess();
    await booksSteps.verifyCartCount(1);
  });

  test('DWS-BOOKS-032: Add to cart with invalid quantity (zero) @negative @regression', async () => {
    // Navigate to detail page first to test quantity
    await booksSteps.clickProductByName('Computing and Internet');
    const detailSteps = new BookProductDetailPageSteps(booksSteps.page);
    await detailSteps.setQuantity(0);
    await detailSteps.clickAddToCart();
    // Should either show error or reset to 1
    const qtyValue = await detailSteps.elements.getLocator('quantityInput').inputValue();
    expect(['1', '0']).toContain(qtyValue);
  });

  test('DWS-BOOKS-033: Add to cart with negative quantity @negative @regression', async () => {
    await booksSteps.clickProductByName('Computing and Internet');
    const detailSteps = new BookProductDetailPageSteps(booksSteps.page);
    await detailSteps.setQuantity(-1);
    await detailSteps.clickAddToCart();
    const qtyValue = await detailSteps.elements.getLocator('quantityInput').inputValue();
    expect(qtyValue).toBe('1'); // Should reset to 1
  });
});

test.describe('Books Module - Email a Friend', () => {
  let booksSteps: BooksPageSteps;
  let detailSteps: BookProductDetailPageSteps;
  let emailFriendSteps: EmailFriendPageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    detailSteps = new BookProductDetailPageSteps(page);
    emailFriendSteps = new EmailFriendPageSteps(page);
    await booksSteps.navigate();
    await booksSteps.clickProductByName('Computing and Internet');
    await detailSteps.clickEmailFriend();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-014: Navigate to Email a Friend page from product detail @regression', async () => {
    await emailFriendSteps.verifyPageLoaded();
    expect(emailFriendSteps.page.url()).toContain('/productemailafriend/13');
  });

  test('DWS-BOOKS-015: Submit Email a Friend with valid data @regression', async () => {
    await emailFriendSteps.submitWithValidData('friend@test.com', 'user@test.com', 'Great book!');
  });

  test('DWS-BOOKS-016: Submit Email a Friend with invalid friend email @negative @regression', async () => {
    await emailFriendSteps.submitWithInvalidEmail('invalid-email', 'user@test.com');
  });

  test('DWS-BOOKS-017: Submit Email a Friend with empty fields @negative @regression', async () => {
    await emailFriendSteps.submitWithEmptyFields();
  });
});

test.describe('Books Module - Compare List', () => {
  let booksSteps: BooksPageSteps;
  let detailSteps: BookProductDetailPageSteps;

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    detailSteps = new BookProductDetailPageSteps(page);
    await booksSteps.navigate();
    await booksSteps.clickProductByName('Computing and Internet');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-018: Add book to compare list @regression', async () => {
    await detailSteps.clickCompareList();
    await detailSteps.page.waitForTimeout(1000);
    // Verify success notification
    const notification = detailSteps.page.locator('.bar-notification, .notification-success, div:has-text("product comparison")').first();
    await expect(notification).toBeVisible();
    await expect(notification).toContainText('product comparison');
  });
});

test.describe('Books Module - Reviews', () => {
  let booksSteps: BooksPageSteps;
  let detailSteps: BookProductDetailPageSteps;
  let reviewsSteps: ProductReviewsPageSteps;

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    detailSteps = new BookProductDetailPageSteps(page);
    reviewsSteps = new ProductReviewsPageSteps(page);
    await booksSteps.navigate();
    await booksSteps.clickProductByName('Computing and Internet');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-019: View product reviews from product detail page @regression', async () => {
    await detailSteps.clickReviewCount();
    await reviewsSteps.verifyPageLoaded();
    expect(reviewsSteps.page.url()).toContain('/productreviews/13');
    await reviewsSteps.verifyReviewsDisplayed();
  });

  test('DWS-BOOKS-020: Navigate to Add Review page from product detail @regression', async () => {
    // Need to login first
    const loginSteps = new LoginPageSteps(detailSteps.page);
    const homeSteps = new HomePageSteps(detailSteps.page);
    await homeSteps.clickLogin();
    await loginSteps.loginWithValidCredentials();
    await loginSteps.verifyLoginSuccess();
    await homeSteps.verifyUserLoggedIn();

    // Go back to product detail
    await detailSteps.page.goto('/computing-and-internet', { waitUntil: 'networkidle' });
    await detailSteps.verifyPageLoaded();
    await detailSteps.clickAddReview();
    // Verify add review page loaded (should have rating, title, text fields)
    await expect(detailSteps.page.locator('select[id*="rating"], input[name*="rating"], textarea[name*="review"]')).toBeVisible();
  });
});

test.describe('Books Module - Sorting', () => {
  let booksSteps: BooksPageSteps;

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    await booksSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-021: Sort books by Name: A to Z @regression', async () => {
    await booksSteps.sortBy('Name: A to Z');
    const productNames = await booksSteps.getProductNames();
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  });

  test('DWS-BOOKS-022: Sort books by Price: Low to High @regression', async () => {
    await booksSteps.sortBy('Price: Low to High');
    const prices = await booksSteps.getProductPrices();
    // Extract numeric values and verify ascending order
    const numericPrices = prices.map(p => parseFloat(p.replace(/[^0-9.]/g, ''))).filter(p => !isNaN(p));
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
    }
  });

  test('DWS-BOOKS-023: Sort books by Price: High to Low @regression', async () => {
    await booksSteps.sortBy('Price: High to Low');
    const prices = await booksSteps.getProductPrices();
    const numericPrices = prices.map(p => parseFloat(p.replace(/[^0-9.]/g, ''))).filter(p => !isNaN(p));
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i - 1]);
    }
  });
});

test.describe('Books Module - Display Options', () => {
  let booksSteps: BooksPageSteps;

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    await booksSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-024: Change display to List view @regression', async () => {
    await booksSteps.changeDisplayView('List');
    // Verify list view - products should be in vertical layout
    await expect(booksSteps.page.locator('.product-list, .list-view, [class*="list"]')).toBeVisible();
  });

  test('DWS-BOOKS-025: Change display items per page @regression', async () => {
    await booksSteps.changeItemsPerPage(4);
    // All 3 books should still be visible
    await booksSteps.verifyProductCount(3);
  });
});

test.describe('Books Module - Price Filter', () => {
  let booksSteps: BooksPageSteps;

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    await booksSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-026: Filter books by Under 25.00 @regression', async () => {
    await booksSteps.filterByPrice('Under 25.00');
    // Only Computing and Internet (10.00) should be visible
    const productNames = await booksSteps.getProductNames();
    expect(productNames.length).toBe(1);
    expect(productNames[0]).toContain('Computing and Internet');
  });

  test('DWS-BOOKS-027: Filter books by 25.00 - 50.00 @regression', async () => {
    await booksSteps.filterByPrice('25.00 - 50.00');
    // Copy of Computing and Internet EX (30.00) should be visible
    // Fiction EX (24.00) is under 25 so should not appear
    const productNames = await booksSteps.getProductNames();
    expect(productNames.some(name => name.includes('Copy of Computing and Internet'))).toBeTruthy();
  });

  test('DWS-BOOKS-028: Filter books by Over 50.00 @regression', async () => {
    await booksSteps.filterByPrice('Over 50.00');
    // No books over 50 in catalog
    const productNames = await booksSteps.getProductNames();
    expect(productNames.length).toBe(0);
  });
});

test.describe('Books Module - Breadcrumb Navigation', () => {
  let booksSteps: BooksPageSteps;
  let detailSteps: BookProductDetailPageSteps;

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    detailSteps = new BookProductDetailPageSteps(page);
    await booksSteps.navigate();
    await booksSteps.clickProductByName('Computing and Internet');
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-029: Navigate using breadcrumb from product detail to category @smoke @regression', async () => {
    await detailSteps.clickBreadcrumb('Books');
    await booksSteps.verifyPageLoaded();
    expect(detailSteps.page.url()).toContain('/books');
  });

  test('DWS-BOOKS-030: Navigate using breadcrumb from product detail to home @smoke @regression', async () => {
    await detailSteps.clickBreadcrumb('Home');
    await expect(detailSteps.page).toHaveURL(/\/$/);
  });
});

test.describe('Books Module - Navigation', () => {
  let booksSteps: BooksPageSteps;
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    booksSteps = new BooksPageSteps(page);
    homeSteps = new HomePageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-036: Navigate to Books from top menu @smoke @regression', async () => {
    await homeSteps.navigate();
    await homeSteps.clickCategory('Books');
    await booksSteps.verifyPageLoaded();
  });

  test('DWS-BOOKS-037: Navigate to Books from sidebar @smoke @regression', async () => {
    await homeSteps.navigate();
    await booksSteps.clickSidebarBooks();
    await booksSteps.verifyPageLoaded();
  });
});

test.describe('Books Module - Search', () => {
  let homeSteps: HomePageSteps;
  let booksSteps: BooksPageSteps;

  test.beforeEach(async ({ page }) => {
    homeSteps = new HomePageSteps(page);
    booksSteps = new BooksPageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-BOOKS-034: Search for book from home page @smoke @regression', async () => {
    await homeSteps.navigate();
    await homeSteps.search('computing');
    await expect(homeSteps.page).toHaveURL(/search/);
    await expect(homeSteps.page.locator('text=Computing and Internet')).toBeVisible();
  });

  test('DWS-BOOKS-035: Search for book from Books category page @regression', async () => {
    await booksSteps.navigate();
    await booksSteps.page.fill('input[id="small-searchterms"], input[name="q"]', 'fiction');
    await booksSteps.page.click('button[type="submit"][value="Search"], input[value="Search"], button:has-text("Search")');
    await booksSteps.commons.waitForPageLoad();
    await expect(booksSteps.page).toHaveURL(/search/);
    await expect(booksSteps.page.locator('text=Fiction')).toBeVisible();
  });
});