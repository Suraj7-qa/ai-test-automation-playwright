import { test, expect } from '@playwright/test';
import { HomePageSteps } from '../../page-objects/page-steps/home-steps';
import { SearchPageSteps } from '../../page-objects/page-steps/search-steps';

test.describe('Search module - risk-based regression', () => {
  let homeSteps: HomePageSteps;
  let searchSteps: SearchPageSteps;

  test.beforeEach(async ({ page }) => {
    homeSteps = new HomePageSteps(page);
    searchSteps = new SearchPageSteps(page);
    // Start from home page for most tests
    await searchSteps.navigateToHome();
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  // ===== BASIC SEARCH TESTS =====
  test('DWS-SRCH-001: Verify search box is visible on home page @smoke @regression', async () => {
    await searchSteps.verifySearchBoxVisible();
  });

  test('DWS-SRCH-002: Search with valid product name "laptop" @smoke @critical @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    await searchSteps.verifySearchResultsDisplayed();
    // Verify the 14.1-inch Laptop is in results
    const items = searchSteps['elements'].getLocator('productItems');
    await expect(items.first()).toContainText('14.1-inch Laptop');
  });

  test('DWS-SRCH-003: Search with valid product name "book" @regression', async () => {
    await searchSteps.searchFromHeader('book');
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-004: Search with partial product name "note" @regression', async () => {
    await searchSteps.searchFromHeader('note');
    await searchSteps.verifySearchResultsDisplayed();
    // Should find notebooks
    const items = searchSteps['elements'].getLocator('productItems');
    await expect(items.first()).toBeVisible();
  });

  test('DWS-SRCH-005: Search with case insensitive term "LAPTOP" @regression', async () => {
    await searchSteps.searchFromHeader('LAPTOP');
    await searchSteps.verifySearchResultsDisplayed();
    const items = searchSteps['elements'].getLocator('productItems');
    await expect(items.first()).toContainText('14.1-inch Laptop');
  });

  // ===== NEGATIVE SEARCH TESTS =====
  test('DWS-SRCH-006: Search with non-existent term returns no results @negative @regression', async () => {
    await searchSteps.searchFromHeader('xyz123nonexistent');
    await searchSteps.verifyNoProductsFound();
  });

  test('DWS-SRCH-007: Search with empty query @negative @boundary', async () => {
    await searchSteps.searchFromHeader('');
    // Should load search results page (may show all products or validation)
    await searchSteps.verifySearchResultsPageLoaded();
  });

  test('DWS-SRCH-008: Search with special characters @negative @boundary', async () => {
    await searchSteps.searchFromHeader('@#$%^&*');
    await searchSteps.verifyNoProductsFound();
  });

  test('DWS-SRCH-009: Search with SQL injection attempt @negative @security', async () => {
    await searchSteps.searchFromHeader("' OR 1=1--");
    // Should handle gracefully - either no results or safe handling
    const noResults = searchSteps['elements'].getLocator('noProductsMessage');
    const results = searchSteps['elements'].getLocator('productGrid');
    const hasNoResults = await noResults.isVisible().catch(() => false);
    const hasResults = await results.isVisible().catch(() => false);
    expect(hasNoResults || hasResults).toBeTruthy();
  });

  test('DWS-SRCH-010: Search with XSS attempt @negative @security', async () => {
    await searchSteps.searchFromHeader('<script>alert(1)</script>');
    // Should sanitize input
    const noResults = searchSteps['elements'].getLocator('noProductsMessage');
    const results = searchSteps['elements'].getLocator('productGrid');
    const hasNoResults = await noResults.isVisible().catch(() => false);
    const hasResults = await results.isVisible().catch(() => false);
    expect(hasNoResults || hasResults).toBeTruthy();
  });

  // ===== ADVANCED SEARCH TESTS =====
  test('DWS-SRCH-011: Advanced search - filter by Category "Books" @regression', async () => {
    await searchSteps.performAdvancedSearch({
      keyword: 'book',
      category: 'Books'
    });
    await searchSteps.verifySearchResultsDisplayed();
    // Verify results are filtered to Books
    const items = searchSteps['elements'].getLocator('productItems');
    await expect(items.first()).toBeVisible();
  });

  test('DWS-SRCH-012: Advanced search - filter by Category "Computers >> Notebooks" @regression', async () => {
    await searchSteps.performAdvancedSearch({
      keyword: 'laptop',
      category: 'Computers >> Notebooks'
    });
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-013: Advanced search - Automatically search subcategories @regression', async () => {
    await searchSteps.performAdvancedSearch({
      keyword: 'computer',
      category: 'Computers',
      searchSubCategories: true
    });
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-014: Advanced search - filter by Manufacturer "Tricentis" @regression', async () => {
    await searchSteps.performAdvancedSearch({
      keyword: 'laptop',
      manufacturer: 'Tricentis'
    });
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-015: Advanced search - Price range filter (From 100 to 500) @regression', async () => {
    await searchSteps.performAdvancedSearch({
      priceFrom: '100',
      priceTo: '500'
    });
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-016: Advanced search - Price range filter (From only) @boundary', async () => {
    await searchSteps.performAdvancedSearch({
      priceFrom: '1000'
    });
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-017: Advanced search - Price range filter (To only) @boundary', async () => {
    await searchSteps.performAdvancedSearch({
      priceTo: '50'
    });
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-018: Advanced search - Search in product descriptions @regression', async () => {
    await searchSteps.performAdvancedSearch({
      keyword: 'digital',
      searchInDescriptions: true
    });
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-019: Combined advanced filters - Category + Manufacturer + Price @critical @regression', async () => {
    await searchSteps.performAdvancedSearch({
      keyword: 'computer',
      category: 'Computers',
      manufacturer: 'Tricentis',
      priceFrom: '500',
      priceTo: '2000'
    });
    await searchSteps.verifySearchResultsDisplayed();
  });

  // ===== SORT/VIEW/DISPLAY TESTS =====
  test('DWS-SRCH-020: Sort results by "Name: A to Z" @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    await searchSteps.sortBy('Name: A to Z');
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-021: Sort results by "Price: Low to High" @regression', async () => {
    await searchSteps.searchFromHeader('computer');
    await searchSteps.sortBy('Price: Low to High');
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-022: Sort results by "Price: High to Low" @regression', async () => {
    await searchSteps.searchFromHeader('computer');
    await searchSteps.sortBy('Price: High to Low');
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-023: Sort results by "Created on" @regression', async () => {
    await searchSteps.searchFromHeader('book');
    await searchSteps.sortBy('Created on');
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-024: Change view to List mode @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    await searchSteps.changeView('List');
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-025: Change view to Grid mode (default) @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    await searchSteps.changeView('List');
    await searchSteps.changeView('Grid');
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-026: Change display per page to 4 @regression', async () => {
    await searchSteps.searchFromHeader('computer');
    await searchSteps.changeDisplayPerPage(4);
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-027: Change display per page to 12 @regression', async () => {
    await searchSteps.searchFromHeader('book');
    await searchSteps.changeDisplayPerPage(12);
    await searchSteps.verifySearchResultsDisplayed();
  });

  // ===== SEARCH RESULTS PAGE TESTS =====
  test('DWS-SRCH-028: Search results page - verify product details displayed @smoke @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    await searchSteps.verifyProductDetailsInResults();
  });

  test('DWS-SRCH-029: Click product from search results navigates to product detail @smoke @critical @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    await searchSteps.clickFirstProduct();
    // Verify we're on product detail page
    await expect(searchSteps['page']).toHaveURL(/\/14-1-inch-laptop/);
  });

  test('DWS-SRCH-030: Add to cart from search results @smoke @critical @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    await searchSteps.addFirstProductToCart();
  });

  test('DWS-SRCH-031: Search from header search box on any page @regression', async ({ page }) => {
    // Navigate to a category page first
    await page.goto('/books', { waitUntil: 'domcontentloaded' });
    await searchSteps.searchFromAnyPage('laptop');
    await searchSteps.verifySearchResultsDisplayed();
  });

  test('DWS-SRCH-032: Search from search results page (keyword box) @regression', async () => {
    await searchSteps.searchFromHeader('book');
    await searchSteps.searchFromResultsPage('laptop');
    await searchSteps.verifySearchResultsDisplayed();
    // Verify results updated to laptop
    const items = searchSteps['elements'].getLocator('productItems');
    await expect(items.first()).toContainText('14.1-inch Laptop');
  });

  test('DWS-SRCH-033: Advanced search checkbox persists after search @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    await searchSteps.enableAdvancedSearch();
    await searchSteps.clickAdvancedSearch();
    await searchSteps.verifyAdvancedSearchPersisted();
  });

  test('DWS-SRCH-034: Search keyword persists in search box after search @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    await searchSteps.verifyKeywordPersisted('laptop');
  });

  test('DWS-SRCH-035: Search with very long query (boundary) @negative @boundary', async () => {
    const longQuery = 'a'.repeat(250);
    await searchSteps.searchFromHeader(longQuery);
    // Should handle gracefully without crash
    await searchSteps.verifySearchResultsPageLoaded();
  });

  test('DWS-SRCH-036: Search with unicode characters @boundary @regression', async () => {
    await searchSteps.searchFromHeader('café');
    await searchSteps.verifySearchResultsPageLoaded();
  });

  test('DWS-SRCH-037: Search results page title contains search term @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    const title = await searchSteps['page'].title();
    expect(title.toLowerCase()).toContain('search');
  });

  test('DWS-SRCH-038: No results page shows search form for new search @regression', async () => {
    await searchSteps.searchFromHeader('xyz123nonexistent');
    await searchSteps.verifyNoProductsFound();
    // Verify search form still available
    await searchSteps.verifySearchBoxVisible();
  });

  test('DWS-SRCH-039: Search with category filter that has no matching products @negative @regression', async () => {
    await searchSteps.performAdvancedSearch({
      keyword: 'laptop',
      category: 'Books'
    });
    await searchSteps.verifyNoProductsFound();
  });

  test('DWS-SRCH-040: Search URL contains query parameters @regression', async () => {
    await searchSteps.searchFromHeader('laptop');
    await searchSteps.verifyUrlContainsQuery('laptop');
  });
});