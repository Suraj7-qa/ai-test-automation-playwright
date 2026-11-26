import { Page, Locator, expect } from '@playwright/test';
import { WebCommons } from '../../commons/ui/web-commons';
import { loadPageElements, ElementHelper } from '../../utilities/element-loader';

export class SearchPageSteps {
  private page: Page;
  private commons: WebCommons;
  private elements: ElementHelper;
  private pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'search-page');
    this.pageElements = loadPageElements('search-page');
  }

  // Navigate to home page (where search is available in header)
  async navigateToHome(): Promise<void> {
    await this.commons.navigate('/');
    await this.commons.waitForPageLoad();
  }

  // Navigate to search results page via URL
  async navigateToSearchResults(query: string = ''): Promise<void> {
    const url = query ? `/search?q=${encodeURIComponent(query)}` : '/search';
    await this.page.goto(url, { waitUntil: 'networkidle' });
    await this.commons.waitForPageLoad();
  }

  // Verify home page is loaded
  async verifyHomePageLoaded(): Promise<void> {
    await this.commons.assertTitle(/Demo Web Shop/);
    await this.commons.assertURL(/\/$/);
  }

  // Verify search results page is loaded
  async verifySearchResultsPageLoaded(query?: string): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('searchResultsHeading'));
    await this.commons.assertVisible(this.elements.getLocator('searchResultsHeading'));
    if (query) {
      // Check if keyword is in URL or page content
      await expect(this.page).toHaveURL(new RegExp(query));
    }
  }

  // Search from header search box
  async searchFromHeader(keyword: string): Promise<void> {
    await this.elements.fill('searchInput', keyword);
    await this.elements.click('searchButton');
    await this.commons.waitForPageLoad();
    await this.verifySearchResultsPageLoaded(keyword);
  }

  // Search from search results page keyword box
  async searchFromResultsPage(keyword: string): Promise<void> {
    await this.elements.fill('searchResultsKeywordInput', keyword);
    await this.elements.click('searchButton');
    await this.commons.waitForPageLoad();
    await this.verifySearchResultsPageLoaded(keyword);
  }

  // Verify search box is visible on home page
  async verifySearchBoxVisible(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('searchInput'));
    await this.commons.assertVisible(this.elements.getLocator('searchInput'));
    await this.commons.waitForVisible(this.elements.getLocator('searchButton'));
    await this.commons.assertVisible(this.elements.getLocator('searchButton'));
  }

  // Verify no products found message
  async verifyNoProductsFound(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('noProductsMessage'));
    await this.commons.assertContainsText(this.elements.getLocator('noProductsMessage'), 'No products were found');
  }

  // Verify search results displayed
  async verifySearchResultsDisplayed(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('productGrid'));
    await this.commons.assertVisible(this.elements.getLocator('productGrid'));
    const items = this.elements.getLocator('productItems');
    await expect(items.first()).toBeVisible();
  }

  // Click first product in search results
  async clickFirstProduct(): Promise<void> {
    const firstProduct = this.elements.getLocator('productTitle').first();
    await this.commons.waitForVisible(firstProduct);
    await this.commons.click(firstProduct);
    await this.commons.waitForPageLoad();
  }

  // Add first product to cart from search results
  async addFirstProductToCart(): Promise<void> {
    const firstAddToCart = this.elements.getLocator('addToCartButton').first();
    await this.commons.waitForVisible(firstAddToCart);
    await this.commons.click(firstAddToCart);
    await this.commons.waitForVisible(this.elements.getLocator('addToCartNotification'));
    await this.commons.assertContainsText(this.elements.getLocator('addToCartNotification'), 'added to your shopping cart');
  }

  // Verify product details in search results
  async verifyProductDetailsInResults(): Promise<void> {
    const items = this.elements.getLocator('productItems');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    // Verify first product has title, price, image, add to cart
    const firstItem = items.first();
    await expect(firstItem.locator(this.pageElements.elements.productTitle.locator)).toBeVisible();
    await expect(firstItem.locator(this.pageElements.elements.productPrice.locator)).toBeVisible();
    await expect(firstItem.locator(this.pageElements.elements.productImage.locator)).toBeVisible();
    await expect(firstItem.locator(this.pageElements.elements.addToCartButton.locator)).toBeVisible();
  }

  // Advanced search - enable advanced search
  async enableAdvancedSearch(): Promise<void> {
    await this.elements.check('advancedSearchCheckbox');
  }

  // Advanced search - disable advanced search
  async disableAdvancedSearch(): Promise<void> {
    await this.elements.uncheck('advancedSearchCheckbox');
  }

  // Advanced search - select category
  async selectCategory(category: string): Promise<void> {
    await this.elements.selectOption('categoryDropdown', category);
  }

  // Advanced search - select manufacturer
  async selectManufacturer(manufacturer: string): Promise<void> {
    await this.elements.selectOption('manufacturerDropdown', manufacturer);
  }

  // Advanced search - set price range
  async setPriceRange(from?: string, to?: string): Promise<void> {
    if (from) {
      await this.elements.fill('priceFromInput', from);
    }
    if (to) {
      await this.elements.fill('priceToInput', to);
    }
  }

  // Advanced search - enable search in descriptions
  async enableSearchInDescriptions(): Promise<void> {
    await this.elements.check('searchInDescriptionCheckbox');
  }

  // Advanced search - enable search sub categories
  async enableSearchSubCategories(): Promise<void> {
    await this.elements.check('searchSubCategoriesCheckbox');
  }

  // Advanced search - click search button
  async clickAdvancedSearch(): Promise<void> {
    await this.elements.click('advancedSearchButton');
    await this.commons.waitForPageLoad();
  }

  // Perform advanced search with all filters
  async performAdvancedSearch(options: {
    keyword?: string;
    category?: string;
    manufacturer?: string;
    priceFrom?: string;
    priceTo?: string;
    searchInDescriptions?: boolean;
    searchSubCategories?: boolean;
  }): Promise<void> {
    if (options.keyword) {
      await this.elements.fill('searchInput', options.keyword);
    }
    await this.enableAdvancedSearch();

    if (options.category) {
      await this.selectCategory(options.category);
    }
    if (options.manufacturer) {
      await this.selectManufacturer(options.manufacturer);
    }
    if (options.priceFrom || options.priceTo) {
      await this.setPriceRange(options.priceFrom, options.priceTo);
    }
    if (options.searchInDescriptions) {
      await this.enableSearchInDescriptions();
    }
    if (options.searchSubCategories) {
      await this.enableSearchSubCategories();
    }

    await this.clickAdvancedSearch();
    await this.verifySearchResultsPageLoaded(options.keyword);
  }

  // Sort results
  async sortBy(option: 'Position' | 'Name: A to Z' | 'Name: Z to A' | 'Price: Low to High' | 'Price: High to Low' | 'Created on'): Promise<void> {
    await this.elements.selectOption('sortByDropdown', option);
    await this.commons.waitForPageLoad();
  }

  // Change view mode
  async changeView(mode: 'Grid' | 'List'): Promise<void> {
    await this.elements.selectOption('displayDropdown', mode);
    await this.commons.waitForPageLoad();
  }

  // Change display per page
  async changeDisplayPerPage(count: number): Promise<void> {
    await this.elements.selectOption('displayPerPageDropdown', count.toString());
    await this.commons.waitForPageLoad();
  }

  // Verify sort by dropdown options
  async verifySortByOptions(): Promise<string[]> {
    const dropdown = this.elements.getLocator('sortByDropdown');
    const options = await dropdown.locator('option').allTextContents();
    return options.map(o => o.trim());
  }

  // Verify display dropdown options
  async verifyDisplayOptions(): Promise<string[]> {
    const dropdown = this.elements.getLocator('displayDropdown');
    const options = await dropdown.locator('option').allTextContents();
    return options.map(o => o.trim());
  }

  // Verify display per page dropdown options
  async verifyDisplayPerPageOptions(): Promise<string[]> {
    const dropdown = this.elements.getLocator('displayPerPageDropdown');
    const options = await dropdown.locator('option').allTextContents();
    return options.map(o => o.trim());
  }

  // Verify advanced search checkbox persists
  async verifyAdvancedSearchPersisted(): Promise<void> {
    const checkbox = this.elements.getLocator('advancedSearchCheckbox');
    await expect(checkbox).toBeChecked();
  }

  // Verify search keyword persists in input
  async verifyKeywordPersisted(keyword: string): Promise<void> {
    const input = this.elements.getLocator('searchResultsKeywordInput');
    await expect(input).toHaveValue(keyword);
  }

  // Verify URL contains query parameter
  async verifyUrlContainsQuery(query: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`q=${encodeURIComponent(query)}`));
  }

  // Verify breadcrumbs visible
  async verifyBreadcrumbsVisible(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('breadcrumb'));
    await this.commons.assertVisible(this.elements.getLocator('breadcrumb'));
  }

  // Verify pagination visible
  async verifyPaginationVisible(): Promise<void> {
    await this.commons.waitForVisible(this.elements.getLocator('pagination'));
    await this.commons.assertVisible(this.elements.getLocator('pagination'));
  }

  // Search from any page (e.g., category page)
  async searchFromAnyPage(keyword: string): Promise<void> {
    await this.elements.fill('searchInput', keyword);
    await this.elements.click('searchButton');
    await this.commons.waitForPageLoad();
    await this.verifySearchResultsPageLoaded(keyword);
  }
}