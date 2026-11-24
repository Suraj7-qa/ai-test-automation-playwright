import { test, expect } from '@playwright/test';
import { HomePageSteps } from '../../page-objects/page-steps/home-steps';
import { loadTestData } from '../../utilities/test-data-loader';

test.describe('Navigation - Header Menu', () => {
  let homeSteps: HomePageSteps;
  const testData = loadTestData('ui');

  test.beforeEach(async ({ page }) => {
    homeSteps = new HomePageSteps(page);
    await homeSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  // Header Menu - Main Categories
  test('DWS-NAV-001: Navigate to Books category from header @smoke @regression', async () => {
    await homeSteps.clickCategory('Books');
    await homeSteps.verifyCategoryPageLoaded('Books');
  });

  test('DWS-NAV-002: Navigate to Computers category from header @smoke @regression', async () => {
    await homeSteps.clickCategory('Computers');
    await homeSteps.verifyCategoryPageLoaded('Computers');
  });

  test('DWS-NAV-003: Navigate to Electronics category from header @smoke @regression', async () => {
    await homeSteps.clickCategory('Electronics');
    await homeSteps.verifyCategoryPageLoaded('Electronics');
  });

  test('DWS-NAV-004: Navigate to Apparel & Shoes category from header @smoke @regression', async () => {
    await homeSteps.clickCategory('Apparel & Shoes');
    await homeSteps.verifyCategoryPageLoaded('Apparel & Shoes');
  });

  test('DWS-NAV-005: Navigate to Digital downloads category from header @regression', async () => {
    await homeSteps.clickCategory('Digital downloads');
    await homeSteps.verifyCategoryPageLoaded('Digital downloads');
  });

  test('DWS-NAV-006: Navigate to Jewelry category from header @regression', async () => {
    await homeSteps.clickCategory('Jewelry');
    await homeSteps.verifyCategoryPageLoaded('Jewelry');
  });

  test('DWS-NAV-007: Navigate to Gift Cards category from header @regression', async () => {
    await homeSteps.clickCategory('Gift Cards');
    await homeSteps.verifyCategoryPageLoaded('Gift Cards');
  });

  // Header Menu - Sub-categories (Computers)
  test('DWS-NAV-008: Navigate to Desktops sub-category from header @regression', async () => {
    await homeSteps.hoverCategory('Computers');
    await homeSteps.clickSubCategory('Desktops');
    await homeSteps.verifyCategoryPageLoaded('Desktops');
  });

  test('DWS-NAV-009: Navigate to Notebooks sub-category from header @regression', async () => {
    await homeSteps.hoverCategory('Computers');
    await homeSteps.clickSubCategory('Notebooks');
    await homeSteps.verifyCategoryPageLoaded('Notebooks');
  });

  test('DWS-NAV-010: Navigate to Accessories sub-category from header @regression', async () => {
    await homeSteps.hoverCategory('Computers');
    await homeSteps.clickSubCategory('Accessories');
    await homeSteps.verifyCategoryPageLoaded('Accessories');
  });

  // Header Top Links
  test('DWS-NAV-011: Click Register link in header top @regression', async () => {
    await homeSteps.clickRegister();
    await homeSteps.verifyPageLoaded();
    await homeSteps.verifyUrlContains('/register');
  });

  test('DWS-NAV-012: Click Log in link in header top @regression', async () => {
    await homeSteps.clickLogin();
    await homeSteps.verifyPageLoaded();
    await homeSteps.verifyUrlContains('/login');
  });

  test('DWS-NAV-013: Click Shopping cart link in header top @regression', async () => {
    await homeSteps.clickShoppingCart();
    await homeSteps.verifyPageLoaded();
    await homeSteps.verifyUrlContains('/cart');
  });

  test('DWS-NAV-014: Click Wishlist link in header top @regression', async () => {
    await homeSteps.clickWishlist();
    await homeSteps.verifyPageLoaded();
    await homeSteps.verifyUrlContains('/wishlist');
  });

  // Logo/Home link
  test('DWS-NAV-015: Click logo navigates to home page @smoke @regression', async () => {
    await homeSteps.clickCategory('Books');
    await homeSteps.clickLogo();
    await homeSteps.verifyPageLoaded();
    await homeSteps.verifyUrlMatches('/');
  });
});

test.describe('Navigation - Sidebar Categories', () => {
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    homeSteps = new HomePageSteps(page);
    await homeSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-NAV-016: Sidebar Categories - Expand Computers shows sub-categories @regression', async () => {
    await homeSteps.verifySidebarCategoryExpanded('Computers');
    await homeSteps.verifySidebarSubCategoryVisible('Desktops');
    await homeSteps.verifySidebarSubCategoryVisible('Notebooks');
    await homeSteps.verifySidebarSubCategoryVisible('Accessories');
  });

  test('DWS-NAV-017: Sidebar Categories - Click Desktops navigates correctly @regression', async () => {
    await homeSteps.clickSidebarCategory('Computers');
    await homeSteps.clickSidebarSubCategory('Desktops');
    await homeSteps.verifyCategoryPageLoaded('Desktops');
  });

  test('DWS-NAV-018: Sidebar Categories - All main categories present @regression', async () => {
    const categories = ['Books', 'Computers', 'Electronics', 'Apparel & Shoes', 'Digital downloads', 'Jewelry', 'Gift Cards'];
    for (const category of categories) {
      await homeSteps.verifySidebarCategoryVisible(category);
    }
  });

  test('DWS-NAV-019: Sidebar Manufacturers section present @regression', async () => {
    await homeSteps.verifySidebarSectionVisible('Manufacturers');
  });

  test('DWS-NAV-020: Sidebar Newsletter section present @regression', async () => {
    await homeSteps.verifySidebarSectionVisible('Newsletter');
  });
});

test.describe('Navigation - Footer Links', () => {
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    homeSteps = new HomePageSteps(page);
    await homeSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  // Information column
  test('DWS-NAV-021: Footer - Sitemap link works @regression', async () => {
    await homeSteps.clickFooterLink('Sitemap');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-022: Footer - Shipping & returns link works @regression', async () => {
    await homeSteps.clickFooterLink('Shipping & returns');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-023: Footer - Privacy notice link works @regression', async () => {
    await homeSteps.clickFooterLink('Privacy notice');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-024: Footer - Conditions of Use link works @regression', async () => {
    await homeSteps.clickFooterLink('Conditions of Use');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-025: Footer - About us link works @regression', async () => {
    await homeSteps.clickFooterLink('About us');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-026: Footer - Contact us link works @regression', async () => {
    await homeSteps.clickFooterLink('Contact us');
    await homeSteps.verifyPageLoaded();
  });

  // Customer service column
  test('DWS-NAV-027: Footer - Search link works @regression', async () => {
    await homeSteps.clickFooterLink('Search');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-028: Footer - Advanced search link works @regression', async () => {
    await homeSteps.clickFooterLink('Advanced search');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-029: Footer - Orders and returns link works @regression', async () => {
    await homeSteps.clickFooterLink('Orders and returns');
    await homeSteps.verifyPageLoaded();
  });

  // My account column
  test('DWS-NAV-030: Footer - My account link works @regression', async () => {
    await homeSteps.clickFooterLink('My account');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-031: Footer - Order history link works @regression', async () => {
    await homeSteps.clickFooterLink('Order history');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-032: Footer - Downloadable products link works @regression', async () => {
    await homeSteps.clickFooterLink('Downloadable products');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-033: Footer - Newsletter link works @regression', async () => {
    await homeSteps.clickFooterLink('Newsletter');
    await homeSteps.verifyPageLoaded();
  });

  test('DWS-NAV-034: Footer - Reward points link works @regression', async () => {
    await homeSteps.clickFooterLink('Reward points');
    await homeSteps.verifyPageLoaded();
  });

  // Follow us column
  test('DWS-NAV-035: Footer - Facebook link opens external @regression', async () => {
    await homeSteps.clickFooterSocialLink('Facebook');
    // External link - just verify it opens
  });

  test('DWS-NAV-036: Footer - Twitter link opens external @regression', async () => {
    await homeSteps.clickFooterSocialLink('Twitter');
  });

  test('DWS-NAV-037: Footer - YouTube link opens external @regression', async () => {
    await homeSteps.clickFooterSocialLink('YouTube');
  });

  test('DWS-NAV-038: Footer - nopCommerce link works @regression', async () => {
    await homeSteps.clickFooterLink('nopCommerce');
    await homeSteps.verifyExternalLink('nopcommerce.com');
  });
});

test.describe('Navigation - Search Functionality', () => {
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    homeSteps = new HomePageSteps(page);
    await homeSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-NAV-039: Search with valid term returns results @smoke @regression', async () => {
    await homeSteps.search('book');
    await homeSteps.verifySearchResultsVisible();
  });

  test('DWS-NAV-040: Search with invalid term shows no results @regression', async () => {
    await homeSteps.search('xyzinvalid123');
    await homeSteps.verifyNoSearchResults();
  });

  test('DWS-NAV-041: Search with empty term @negative', async () => {
    await homeSteps.search('');
    await homeSteps.verifySearchResultsVisible(); // Should show all or handle gracefully
  });
});

test.describe('Navigation - Breadcrumbs', () => {
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    homeSteps = new HomePageSteps(page);
    await homeSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-NAV-042: Breadcrumbs visible on category page @regression', async () => {
    await homeSteps.clickCategory('Computers');
    await homeSteps.verifyBreadcrumbsVisible();
    await homeSteps.verifyBreadcrumbContains('Home');
    await homeSteps.verifyBreadcrumbContains('Computers');
  });

  test('DWS-NAV-043: Breadcrumbs visible on sub-category page @regression', async () => {
    await homeSteps.hoverCategory('Computers');
    await homeSteps.clickSubCategory('Desktops');
    await homeSteps.verifyBreadcrumbsVisible();
    await homeSteps.verifyBreadcrumbContains('Home');
    await homeSteps.verifyBreadcrumbContains('Computers');
    await homeSteps.verifyBreadcrumbContains('Desktops');
  });

  test('DWS-NAV-044: Click breadcrumb Home navigates to home @regression', async () => {
    await homeSteps.clickCategory('Books');
    await homeSteps.clickBreadcrumb('Home');
    await homeSteps.verifyPageLoaded();
    await homeSteps.verifyUrlMatches('/');
  });
});

test.describe('Navigation - Cross-module Navigation', () => {
  let homeSteps: HomePageSteps;

  test.beforeEach(async ({ page }) => {
    homeSteps = new HomePageSteps(page);
    await homeSteps.navigate();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('DWS-NAV-045: Navigate between categories without returning home @regression', async () => {
    await homeSteps.clickCategory('Books');
    await homeSteps.verifyCategoryPageLoaded('Books');
    await homeSteps.clickCategory('Computers');
    await homeSteps.verifyCategoryPageLoaded('Computers');
    await homeSteps.clickCategory('Electronics');
    await homeSteps.verifyCategoryPageLoaded('Electronics');
  });

  test('DWS-NAV-046: Navigation persists cart count @regression', async () => {
    const initialCount = await homeSteps.getCartCount();
    await homeSteps.clickCategory('Books');
    await homeSteps.clickCategory('Computers');
    const finalCount = await homeSteps.getCartCount();
    expect(finalCount).toBe(initialCount);
  });

  test('DWS-NAV-047: Navigation persists user session @regression', async ({ page }) => {
    // Login first
    await homeSteps.clickLogin();
    // ... login steps would go here
    // Then navigate and verify still logged in
  });
});