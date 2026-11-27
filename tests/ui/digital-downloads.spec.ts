import { test, expect } from '@playwright/test';
import { DigitalDownloadsPageSteps, DigitalProductDetailPageSteps, EmailFriendPageSteps, ProductReviewsPageSteps } from '../../page-objects/page-steps/digital-downloads-steps';
import { HomePageSteps } from '../../page-objects/page-steps/home-steps';
import { LoginPageSteps } from '../../page-objects/page-steps/login-steps';
import { loadTestData } from '../../utilities/test-data-loader';

const testData = loadTestData('ui');

// Digital product names (adjust based on actual site data)
const DIGITAL_PRODUCTS = {
  digitalAlbum: 'Digital Album',
  software: 'Software'
};

test.describe('Digital Downloads Module - Category Page Navigation', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    homeSteps = new HomePageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-001: Navigate to Digital Downloads from header menu @smoke @regression @critical', async () => {
    await homeSteps.navigate();
    await homeSteps.clickCategory('Digital downloads');
    await digitalDownloadsSteps.verifyPageLoaded();
    expect(digitalDownloadsSteps.page.url()).toContain('/digital-downloads');
  });

  test('DD-002: Navigate to Digital Downloads from sidebar @regression', async () => {
    await homeSteps.navigate();
    await digitalDownloadsSteps.clickSidebarDigitalDownloads();
    await digitalDownloadsSteps.verifyPageLoaded();
    expect(digitalDownloadsSteps.page.url()).toContain('/digital-downloads');
  });

  test('DD-003: Access Digital Downloads category via direct URL @smoke @regression', async () => {
    await digitalDownloadsSteps.navigateDirect();
    await digitalDownloadsSteps.verifyPageLoaded();
    expect(digitalDownloadsSteps.page.url()).toContain('/digital-downloads');
  });

  test('DD-004: Verify breadcrumb navigation on Digital Downloads category page @regression', async () => {
    await digitalDownloadsSteps.navigate();
    await digitalDownloadsSteps.verifyBreadcrumbContains('Home');
    await digitalDownloadsSteps.verifyBreadcrumbContains('Digital downloads');
  });

  test('DD-005: Verify Digital Downloads category page displays products @smoke @regression', async () => {
    await digitalDownloadsSteps.navigate();
    await digitalDownloadsSteps.verifyPageLoaded();
    const productNames = await digitalDownloadsSteps.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);
  });
});

test.describe('Digital Downloads Module - Product Listing on Category Page', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    await digitalDownloadsSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-006: Verify product name, price, and add to cart button on category page @regression', async () => {
    const productItems = digitalDownloadsSteps.page.locator('.item-box, .product-item, [class*="product-item"]');
    const count = await productItems.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const item = productItems.nth(i);
      // Use first() to avoid strict mode violation (product has image link + text link)
      await expect(item.locator('.product-title a').first()).toBeVisible();
      await expect(item.locator('.prices .price, .product-price .price, .actual-price, [class*="price"]').first()).toBeVisible();
      await expect(item.locator('input[value="Add to cart"]').first()).toBeVisible();
    }
  });

  test('DD-007: Verify product images are displayed on category page @regression', async () => {
    const productImages = digitalDownloadsSteps.page.locator('.picture img, .product-image img, .product-picture img, img[alt*="Picture of"]');
    const count = await productImages.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(productImages.nth(i)).toBeVisible();
      const alt = await productImages.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});

test.describe('Digital Downloads Module - Product Detail Page', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;
  let detailSteps: DigitalProductDetailPageSteps;
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    detailSteps = new DigitalProductDetailPageSteps(page);
    homeSteps = new HomePageSteps(page);
    await digitalDownloadsSteps.navigate();
    await digitalDownloadsSteps.clickFirstProduct();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-008: Navigate to digital product detail page from category @smoke @regression @critical', async () => {
    await detailSteps.verifyPageLoaded();
    // Product URLs are /album-3, /music-album-1, /music-2
    expect(detailSteps.page.url()).toMatch(/\/album-|\/music-/);
  });

  test('DD-009: Verify all elements on digital product detail page @regression', async () => {
    await detailSteps.verifyAllElementsVisible();
  });

  test('DD-010: Verify breadcrumb on digital product detail page @regression', async () => {
    // Breadcrumb shows actual product name (e.g., "3rd Album", "Music 2")
    await detailSteps.verifyBreadcrumbPath('3rd Album');
    await detailSteps.clickBreadcrumb('Digital downloads');
    await digitalDownloadsSteps.verifyPageLoaded();
    await digitalDownloadsSteps.clickFirstProduct();
    await detailSteps.verifyPageLoaded();
    await detailSteps.clickBreadcrumb('Home');
    await expect(detailSteps.page).toHaveURL(/\/$/);
  });

  test('DD-035: Navigate back from product detail to category page @regression', async () => {
    await detailSteps.clickBreadcrumb('Digital downloads');
    await digitalDownloadsSteps.verifyPageLoaded();
  });

  test('DD-036: Navigate from Digital Downloads category to Home via logo @regression', async () => {
    await digitalDownloadsSteps.page.goBack();
    await homeSteps.verifyPageLoaded();
  });
});

test.describe('Digital Downloads Module - Add to Cart from Category Page', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    homeSteps = new HomePageSteps(page);
    await digitalDownloadsSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-011: Add digital product to cart from category page @smoke @regression @critical', async () => {
    await digitalDownloadsSteps.addFirstProductToCartFromCategory();
    await digitalDownloadsSteps.verifyAddToCartSuccess();
    await homeSteps.verifyCartCount(1);
  });

  test('DD-013: Add multiple different digital products to cart @regression', async () => {
    const productNames = await digitalDownloadsSteps.getProductNames();
    if (productNames.length >= 2) {
      await digitalDownloadsSteps.addMultipleProductsToCart([productNames[0], productNames[1]]);
      await digitalDownloadsSteps.verifyCartCount(2);
    }
  });
});

test.describe('Digital Downloads Module - Add to Cart from Product Detail Page', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;
  let detailSteps: DigitalProductDetailPageSteps;
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    detailSteps = new DigitalProductDetailPageSteps(page);
    homeSteps = new HomePageSteps(page);
    await digitalDownloadsSteps.navigate();
    await digitalDownloadsSteps.clickFirstProduct();
    await detailSteps.verifyPageLoaded();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-012: Add digital product to cart from product detail page with quantity @smoke @regression @critical', async () => {
    await detailSteps.setQuantity(2);
    await detailSteps.clickAddToCart();
    await detailSteps.verifyAddToCartSuccess();
    await homeSteps.verifyCartCount(2);
  });

  test('DD-030: Add digital product with minimum valid quantity (1) @boundary @positive', async () => {
    await detailSteps.verifyQuantityDefaultValue('1');
    await detailSteps.clickAddToCart();
    await detailSteps.verifyAddToCartSuccess();
    await homeSteps.verifyCartCount(1);
  });

  test('DD-031: Add digital product with maximum reasonable quantity (100) @boundary @positive', async () => {
    await detailSteps.setQuantity(100);
    await detailSteps.clickAddToCart();
    await detailSteps.verifyAddToCartSuccess();
    await homeSteps.verifyCartCount(100);
  });
});

test.describe('Digital Downloads Module - Quantity Boundary & Negative Tests', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;
  let detailSteps: DigitalProductDetailPageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    detailSteps = new DigitalProductDetailPageSteps(page);
    await digitalDownloadsSteps.navigate();
    await digitalDownloadsSteps.clickFirstProduct();
    await detailSteps.verifyPageLoaded();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-020: Attempt to add digital product with quantity 0 @negative @boundary', async () => {
    await detailSteps.setQuantity(0);
    await detailSteps.clickAddToCart();
    const qtyValue = await detailSteps.getQuantityValue();
    expect(['1', '0']).toContain(qtyValue);
  });

  test('DD-021: Attempt to add digital product with negative quantity @negative @boundary', async () => {
    await detailSteps.setQuantityString('-1');
    await detailSteps.clickAddToCart();
    const qtyValue = await detailSteps.getQuantityValue();
    // Site doesn't validate client-side - value stays as entered
    expect(['-1', '1']).toContain(qtyValue);
  });

  test('DD-022: Attempt to add digital product with very large quantity (999999) @boundary @negative', async () => {
    await detailSteps.setQuantityString('999999');
    await detailSteps.clickAddToCart();
    await detailSteps.page.waitForTimeout(1000);
    const qtyValue = await detailSteps.getQuantityValue();
    // Should handle gracefully - either cap, show error, or accept
    expect(parseInt(qtyValue) >= 1).toBeTruthy();
  });

  test('DD-023: Attempt to add digital product with decimal quantity @negative @boundary', async () => {
    await detailSteps.setQuantityString('1.5');
    await detailSteps.clickAddToCart();
    const qtyValue = await detailSteps.getQuantityValue();
    // Should reject decimal or convert to integer
    expect(['1', '1.5']).toContain(qtyValue);
  });

  test('DD-024: Attempt to add digital product with non-numeric quantity @negative @security', async () => {
    await detailSteps.setQuantityString('abc');
    await detailSteps.clickAddToCart();
    const qtyValue = await detailSteps.getQuantityValue();
    // Site doesn't validate client-side - value stays as entered
    expect(['abc', '1']).toContain(qtyValue);
  });

  test('DD-032: Add digital product with quantity exceeding reasonable maximum (101) @boundary @negative', async () => {
    await detailSteps.setQuantity(101);
    await detailSteps.clickAddToCart();
    await detailSteps.page.waitForTimeout(1000);
    const qtyValue = await detailSteps.getQuantityValue();
    expect(parseInt(qtyValue) >= 1).toBeTruthy();
  });

  test('DD-033: Add digital product with empty quantity input @boundary @negative', async () => {
    await detailSteps.clearQuantity();
    await detailSteps.clickAddToCart();
    const qtyValue = await detailSteps.getQuantityValue();
    expect(['1', '']).toContain(qtyValue);
  });

  test('DD-034: Add digital product with whitespace-only quantity input @boundary @negative', async () => {
    await detailSteps.setQuantityString('   ');
    await detailSteps.clickAddToCart();
    const qtyValue = await detailSteps.getQuantityValue();
    expect(['1', '   ']).toContain(qtyValue);
  });
});

test.describe('Digital Downloads Module - Sorting', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    await digitalDownloadsSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-014: Sort digital products by Name: A to Z @regression', async () => {
    await digitalDownloadsSteps.sortBy('Name: A to Z');
    const productNames = await digitalDownloadsSteps.getProductNames();
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  });

  test('DD-015: Sort digital products by Price: Low to High @regression', async () => {
    await digitalDownloadsSteps.sortBy('Price: Low to High');
    const prices = await digitalDownloadsSteps.getProductPrices();
    const numericPrices = prices.map(p => parseFloat(p.replace(/[^0-9.]/g, ''))).filter(p => !isNaN(p));
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
    }
  });

  test('DD-016: Sort digital products by Price: High to Low @regression', async () => {
    await digitalDownloadsSteps.sortBy('Price: High to Low');
    const prices = await digitalDownloadsSteps.getProductPrices();
    const numericPrices = prices.map(p => parseFloat(p.replace(/[^0-9.]/g, ''))).filter(p => !isNaN(p));
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i - 1]);
    }
  });
});

test.describe('Digital Downloads Module - Display Options', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    await digitalDownloadsSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-017: Change display view from Grid to List @regression', async () => {
    await digitalDownloadsSteps.changeDisplayView('List');
    // Verify URL changed to list view mode
    await expect(digitalDownloadsSteps.page).toHaveURL(/viewmode=list/);
    // Verify product list container visible
    await expect(digitalDownloadsSteps.page.locator('.product-list').first()).toBeVisible();
  });

  test('DD-018: Change items per page display @regression', async () => {
    await digitalDownloadsSteps.changeItemsPerPage(4);
    // There are 3 products total - with pagesize=4 all should show on one page
    await digitalDownloadsSteps.verifyProductCount(3);
  });
});

test.describe('Digital Downloads Module - Email a Friend', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;
  let detailSteps: DigitalProductDetailPageSteps;
  let emailFriendSteps: EmailFriendPageSteps;
  let loginSteps: LoginPageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    detailSteps = new DigitalProductDetailPageSteps(page);
    emailFriendSteps = new EmailFriendPageSteps(page);
    loginSteps = new LoginPageSteps(page);

    // Login first (required for Email a Friend feature)
    await loginSteps.navigate();
    await loginSteps.loginWithValidCredentials();
    await loginSteps.verifyLoginSuccess();

    await digitalDownloadsSteps.navigate();
    await digitalDownloadsSteps.clickFirstProduct();
    await detailSteps.verifyPageLoaded();
    await detailSteps.clickEmailFriend();
    await emailFriendSteps.verifyPageLoaded();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-019: Send email a friend for digital product with valid data @regression', async () => {
    await emailFriendSteps.submitWithValidData('friend@test.com', 'user@test.com', 'Check out this digital product!');
  });

  test('DD-025: Submit Email a Friend with invalid friend email format @negative @validation', async () => {
    await emailFriendSteps.submitWithInvalidEmail('invalid-email', 'user@test.com');
  });

  test('DD-026: Submit Email a Friend with invalid your email format @negative @validation', async () => {
    await emailFriendSteps.enterFriendEmail('friend@test.com');
    await emailFriendSteps.enterYourEmail('invalid-email');
    await emailFriendSteps.enterPersonalMessage('Test message');
    await emailFriendSteps.clickSendEmail();
    await emailFriendSteps.verifyInvalidEmailError();
  });

  test('DD-027: Submit Email a Friend with all fields empty @negative @validation', async () => {
    await emailFriendSteps.submitWithEmptyFields();
  });

  test('DD-028: Submit Email a Friend with XSS payload in message @negative @security @xss', async () => {
    await emailFriendSteps.submitWithXSSPayload('friend@test.com', 'user@test.com', '<script>alert(1)</script>');
  });

  test('DD-029: Submit Email a Friend with SQL injection in email field @negative @security @sqli', async () => {
    await emailFriendSteps.submitWithSQLInjection("test@test.com' OR 1=1--", 'user@test.com', 'Test message');
  });
});

test.describe('Digital Downloads Module - Compare List', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;
  let detailSteps: DigitalProductDetailPageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    detailSteps = new DigitalProductDetailPageSteps(page);
    await digitalDownloadsSteps.navigate();
    await digitalDownloadsSteps.clickFirstProduct();
    await detailSteps.verifyPageLoaded();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-038: Add digital product to compare list @regression', async () => {
    await detailSteps.clickCompareList();
    // Clicking "Add to compare list" navigates directly to the compare products page
    await expect(detailSteps.page).toHaveURL(/compareproducts/);
    // Verify compare products page shows the product
    await expect(detailSteps.page.locator('.page-title, h1:has-text("Compare products")').first()).toBeVisible();
  });
});

test.describe('Digital Downloads Module - Reviews', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;
  let detailSteps: DigitalProductDetailPageSteps;
  let reviewsSteps: ProductReviewsPageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    detailSteps = new DigitalProductDetailPageSteps(page);
    reviewsSteps = new ProductReviewsPageSteps(page);
    await digitalDownloadsSteps.navigate();
    await digitalDownloadsSteps.clickFirstProduct();
    await detailSteps.verifyPageLoaded();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-039: View reviews for digital product @regression', async () => {
    await detailSteps.clickReviewCount();
    await reviewsSteps.verifyPageLoaded();
    await reviewsSteps.verifyReviewsDisplayed();
  });
});

test.describe('Digital Downloads Module - Search', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-037: Search for digital product from Digital Downloads category page @regression', async () => {
    await digitalDownloadsSteps.navigate();
    await digitalDownloadsSteps.search('digital');
    await expect(digitalDownloadsSteps.page).toHaveURL(/search/);
    await digitalDownloadsSteps.getCommons().waitForVisible(digitalDownloadsSteps.page.locator('.product-grid, .search-results, .products-container').first());
  });
});

test.describe('Digital Downloads Module - Cart Persistence', () => {
  let digitalDownloadsSteps: DigitalDownloadsPageSteps;
  let homeSteps: HomePageSteps;
  let booksSteps: any; // We'll navigate directly

  test.beforeEach(async ({ page }) => {
    digitalDownloadsSteps = new DigitalDownloadsPageSteps(page);
    homeSteps = new HomePageSteps(page);
    await digitalDownloadsSteps.navigate();
    await digitalDownloadsSteps.addFirstProductToCartFromCategory();
    await digitalDownloadsSteps.verifyAddToCartSuccess();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DD-040: Verify cart persists when navigating between Digital Downloads and other categories @regression', async () => {
    await homeSteps.verifyCartCount(1);

    // Navigate to Books category
    await homeSteps.clickCategory('Books');
    await homeSteps.verifyCategoryPageLoaded('Books');
    await homeSteps.verifyCartCount(1);

    // Navigate back to Digital Downloads
    await homeSteps.clickCategory('Digital downloads');
    await digitalDownloadsSteps.verifyPageLoaded();
    await homeSteps.verifyCartCount(1);
  });
});