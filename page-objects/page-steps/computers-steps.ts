import { expect, Page } from '@playwright/test';
import { ElementHelper, loadPageElements } from '../../utilities/element-loader';

type ComputerCategory = 'Computers' | 'Desktops' | 'Notebooks' | 'Accessories';
type DesktopPriceFilter = 'Under 1000.00' | '1000.00 - 1200.00' | 'Over 1200.00';
type NotebookFilter = 'Intel' | '3 GB';

const categoryPaths: Record<ComputerCategory, string> = {
  Computers: '/computers', Desktops: '/desktops', Notebooks: '/notebooks', Accessories: '/accessories'
};

const desktopFilters: Record<DesktopPriceFilter, { element: string; matches: (price: number) => boolean }> = {
  'Under 1000.00': { element: 'desktopPriceUnder1000', matches: price => price < 1000 },
  '1000.00 - 1200.00': { element: 'desktopPrice1000To1200', matches: price => price >= 1000 && price <= 1200 },
  'Over 1200.00': { element: 'desktopPriceOver1200', matches: price => price >= 1200 }
};

export class ComputersPageSteps {
  private readonly page: Page;
  private readonly elements: ElementHelper;
  private readonly pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.elements = new ElementHelper(page, 'computers-page');
    this.pageElements = loadPageElements('computers-page');
  }

  private selector(name: string): string {
    const element = this.pageElements.elements[name];
    if (!element) throw new Error(`Element '${name}' is not defined in computers-page.json`);
    return element.locator;
  }

  async navigateTo(category: ComputerCategory): Promise<void> {
    await this.page.goto(categoryPaths[category], { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveTitle(new RegExp(category));
    if (category === 'Computers') {
      await expect(this.elements.getLocator('categoryHeading')).toHaveText('Computers');
    }
  }

  async verifyComputersSubcategories(): Promise<void> {
    await this.navigateTo('Computers');
    const links = this.page.locator(this.selector('computersSubcategoryLinks'));
    await expect(links).toHaveCount(3);
    for (const category of ['Desktops', 'Notebooks', 'Accessories']) {
      await expect(links.filter({ hasText: category })).toBeVisible();
    }
  }

  private async getCatalogPrices(): Promise<number[]> {
    const cards = this.page.locator(this.selector('productCards'));
    const prices: number[] = [];
    for (const card of await cards.all()) {
      const text = await card.locator(this.selector('productCardPrice')).first().innerText();
      const price = Number(text.replace(/[^\d.]/g, ''));
      if (Number.isFinite(price)) prices.push(price);
    }
    return prices;
  }

  async verifyDesktopCatalogue(): Promise<void> {
    await this.navigateTo('Desktops');
    const cards = this.page.locator(this.selector('productCards'));
    await expect(cards).toHaveCount(6);
    const productNames = await this.page.locator(this.selector('productNameLinks')).allTextContents();
    expect(productNames).toEqual(expect.arrayContaining([
      'Build your own cheap computer', 'Build your own computer', 'Build your own expensive computer'
    ]));
    await expect(cards.first().locator(this.selector('productCardImage'))).toBeVisible();
    expect(await this.getCatalogPrices()).toHaveLength(6);
  }

  async verifyNotebookCatalogue(): Promise<void> {
    await this.navigateTo('Notebooks');
    await expect(this.elements.getLocator('notebookProductLink')).toBeVisible();
    await expect(this.page.locator(this.selector('productCards')).first().locator(this.selector('productCardImage'))).toBeVisible();
    expect(await this.getCatalogPrices()).toHaveLength(1);
  }

  async verifyAccessoriesCatalogue(): Promise<void> {
    await this.navigateTo('Accessories');
    const cards = this.page.locator(this.selector('productCards'));
    await expect(cards).toHaveCount(7);
    await expect(this.elements.getLocator('accessoriesPriceUnder100')).toBeVisible();
    await expect(this.elements.getLocator('accessoriesPriceOver100')).toBeVisible();
    expect(await this.getCatalogPrices()).toHaveLength(7);
  }

  async verifyDesktopSort(order: 'Price: Low to High' | 'Price: High to Low'): Promise<void> {
    await this.navigateTo('Desktops');
    const sortControl = this.elements.getLocator('sortByDropdown');
    await sortControl.selectOption({ label: order });
    await expect(sortControl.locator('option:checked')).toHaveText(order);
    const prices = await this.getCatalogPrices();
    const sortedPrices = [...prices].sort((first, second) => order === 'Price: Low to High' ? first - second : second - first);
    expect(prices.length).toBeGreaterThan(1);
    expect(prices).toEqual(sortedPrices);
  }

  async verifyDesktopPriceFilters(): Promise<void> {
    for (const [label, filter] of Object.entries(desktopFilters) as [DesktopPriceFilter, typeof desktopFilters[DesktopPriceFilter]][]) {
      await this.navigateTo('Desktops');
      await this.elements.click(filter.element);
      await expect(this.page).toHaveURL(/price=/);
      const prices = await this.getCatalogPrices();
      expect(prices.length, `${label} should return products`).toBeGreaterThan(0);
      expect(prices.every(filter.matches), `${label} should only show matching prices`).toBeTruthy();
    }
  }

  async verifyNotebookAttributeFilter(filter: NotebookFilter): Promise<void> {
    await this.navigateTo('Notebooks');
    await this.elements.click(filter === 'Intel' ? 'notebookIntelFilter' : 'notebookMemoryFilter');
    await expect(this.page).toHaveURL(filter === 'Intel' ? /specs=6/ : /specs=8/);
    await expect(this.elements.getLocator('notebookProductLink')).toBeVisible();
  }

  private async getConfiguredDesktopPrice(): Promise<number> {
    const text = await this.elements.getLocator('desktopProductDetailPrice').innerText();
    return Number(text.replace(/[^\d.]/g, ''));
  }

  async verifyRamSelectionChangesPrice(): Promise<void> {
    await this.page.goto('/build-your-own-computer', { waitUntil: 'domcontentloaded' });
    await expect(this.elements.getLocator('desktopProductDetailHeading')).toHaveText('Build your own computer');
    await expect(this.elements.getLocator('desktopProductDetailsForm')).toBeVisible();
    const originalPrice = await this.getConfiguredDesktopPrice();

    // Use the page object's ramSelect
    const ramSelect = this.elements.getLocator('ramSelect');

    // Get all options with their values
    const optionElements = await ramSelect.locator('option').all();
    let option4GBValue = null;
    let option4GBLabel = null;

    for (const opt of optionElements) {
      const text = await opt.textContent();
      const value = await opt.getAttribute('value');
      if (text && (text.includes('4GB') || text.includes('4 GB'))) {
        option4GBLabel = text.trim();
        option4GBValue = value;
        break;
      }
    }

    // Try multiple selection strategies
    let selected = false;

    // Strategy 1: Select by label
    if (option4GBLabel) {
      try {
        await ramSelect.selectOption({ label: option4GBLabel });
        selected = true;
      } catch { }
    }

    // Strategy 2: Select by value
    if (!selected && option4GBValue) {
      try {
        await ramSelect.selectOption({ value: option4GBValue });
        selected = true;
      } catch { }
    }

    // Strategy 3: Select by index (second option)
    if (!selected) {
      try {
        await ramSelect.selectOption({ index: 1 });
        selected = true;
      } catch { }
    }

    // Strategy 4: Click the option directly
    if (!selected && option4GBValue) {
      try {
        await ramSelect.click();
        await this.page.locator(`option[value="${option4GBValue}"]`).click();
        selected = true;
      } catch { }
    }

    // Trigger multiple events to ensure price update
    await ramSelect.dispatchEvent('change');
    await ramSelect.dispatchEvent('input');
    await ramSelect.dispatchEvent('blur');

    // Wait for price to update (may be async)
    await expect.poll(() => this.getConfiguredDesktopPrice(), { timeout: 10000, interval: 500 })
      .toBeCloseTo(originalPrice + 20, 2);
  }

  private async addConfiguredDesktopToCart(quantity: number): Promise<void> {
    await this.page.goto('/build-your-own-computer', { waitUntil: 'domcontentloaded' });
    await this.elements.check('desktopHddOption');
    if (quantity !== 1) await this.elements.fill('desktopQuantityInput', String(quantity));
    await this.elements.click('desktopAddToCartButton');
    await expect(this.elements.getLocator('addToCartNotification')).toContainText('added to your shopping cart');
    await expect(this.elements.getLocator('cartCount')).toContainText(`(${quantity})`);
  }

  async verifyConfiguredDesktopAddedToCart(quantity: number): Promise<void> {
    await this.addConfiguredDesktopToCart(quantity);
    await this.page.goto('/cart');
    const cartRow = this.page.locator(this.selector('cartProductRow')).filter({ hasText: 'Build your own computer' });
    await expect(cartRow).toBeVisible();
    await expect(cartRow.locator(this.selector('cartQuantityInput'))).toHaveValue(String(quantity));
  }

  async verifyCartPersistsAcrossComputerCategories(): Promise<void> {
    await this.addConfiguredDesktopToCart(1);
    await this.elements.click('sidebarNotebooksLink');
    await expect(this.elements.getLocator('categoryHeading')).toHaveText('Notebooks');
    await expect(this.elements.getLocator('cartCount')).toContainText('(1)');
    await this.elements.click('sidebarAccessoriesLink');
    await expect(this.elements.getLocator('categoryHeading')).toHaveText('Accessories');
    await expect(this.elements.getLocator('cartCount')).toContainText('(1)');
    await this.page.goto('/cart');
    await expect(this.page.locator(this.selector('cartProductRow')).filter({ hasText: 'Build your own computer' })).toBeVisible();
  }

  // Additional high-value methods for missing test cases
  async navigateToComputersFromHeader(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.elements.getLocator('headerTopMenu')
      .getByRole('link', { name: 'Computers', exact: true })
      .click();
    await expect(this.page).toHaveURL(/\/computers$/);
    await expect(this.elements.getLocator('categoryHeading')).toHaveText('Computers');
  }

  async verifyBreadcrumbFromProduct(): Promise<void> {
    await this.page.goto('/build-your-own-computer', { waitUntil: 'domcontentloaded' });
    await expect(this.elements.getLocator('desktopProductDetailHeading')).toHaveText('Build your own computer');
    const breadcrumb = this.page.locator('.breadcrumb, .breadcrumbs, [class*="breadcrumb"]').first();
    await expect(breadcrumb.locator('a:has-text("Computers")')).toBeVisible();
    await breadcrumb.locator('a:has-text("Computers")').click();
    await expect(this.page).toHaveURL(/\/computers$/);
  }

  async verifyQuickAddDesktop(): Promise<void> {
    await this.navigateTo('Desktops');
    const cards = this.page.locator(this.selector('productCards'));
    // Quick-add the first desktop - try direct add to cart, if navigates to product page, configure and add
    const firstCard = cards.first();

    // Wait for navigation or notification
    const responsePromise = this.page.waitForResponse(r => r.url().includes('/addproducttocart') || r.url().includes('/cart'));
    await firstCard.locator(this.selector('cardAddToCartButton')).click();

    try {
      // Try to wait for AJAX response (direct add)
      await responsePromise;
      await expect(this.elements.getLocator('addToCartNotification')).toContainText('added to your shopping cart');
    } catch {
      // Navigation occurred - wait for product page
      await this.page.waitForURL('**/build-your-cheap-own-computer**');
      await expect(this.elements.getLocator('desktopProductDetailsForm')).toBeVisible();
      await this.elements.check('desktopHddOption');
      await this.elements.click('desktopAddToCartButton');
      await expect(this.elements.getLocator('addToCartNotification')).toContainText('added to your shopping cart');
    }
    await expect(this.elements.getLocator('cartCount')).toContainText('(1)');
  }

  async verifyRejectZeroQuantity(): Promise<void> {
    await this.page.goto('/build-your-own-computer', { waitUntil: 'domcontentloaded' });
    await this.elements.fill('desktopQuantityInput', '0');
    await this.elements.click('desktopAddToCartButton');
    await expect(this.elements.getLocator('addToCartNotification')).toContainText('Quantity should be positive');
    await expect(this.elements.getLocator('cartCount')).toContainText('(0)');
  }

  async verifyAddToCompare(): Promise<void> {
    await this.navigateTo('Desktops');
    const firstCard = this.page.locator(this.selector('productCards')).first();
    await firstCard.locator(this.selector('cardCompareButton')).click();
    await expect(this.elements.getLocator('addToCartNotification')).toContainText('product comparison');
  }

  async verifyOpenReviews(): Promise<void> {
    await this.navigateTo('Desktops');
    // Click the "Build your own computer" product (second one, not the cheap one)
    const productLinks = this.page.locator(this.selector('productNameLinks'));
    await productLinks.filter({ hasText: 'Build your own computer' }).first().click();
    await expect(this.elements.getLocator('desktopProductDetailHeading')).toBeVisible();
    await this.elements.getLocator('productReviewLink').click();
    await expect(this.page).toHaveURL(/productreviews/);
  }

  async verifyOpenEmailFriend(): Promise<void> {
    await this.navigateTo('Desktops');
    // Click the "Build your own computer" product (second one, not the cheap one)
    const productLinks = this.page.locator(this.selector('productNameLinks'));
    await productLinks.filter({ hasText: 'Build your own computer' }).first().click();
    await expect(this.elements.getLocator('desktopProductDetailHeading')).toBeVisible();
    await this.elements.getLocator('emailFriendButton').click();
    await expect(this.page).toHaveURL(/productemailafriend/);
  }

  async verifyDisplayViewAndPageSize(): Promise<void> {
    await this.navigateTo('Desktops');
    // Test view mode
    const viewMode = this.elements.getLocator('viewModeDropdown');
    await viewMode.selectOption({ label: 'List' });
    await expect(viewMode.locator('option:checked')).toHaveText('List');
    // Test page size
    const pageSize = this.elements.getLocator('pageSizeDropdown');
    await pageSize.selectOption({ label: '4' });
    await expect(pageSize.locator('option:checked')).toHaveText('4');
    await expect(this.page.locator(this.selector('productCards'))).toHaveCount(4);
  }

  async verifySubcategoryFromSidebar(category: 'Desktops' | 'Notebooks' | 'Accessories'): Promise<void> {
    await this.navigateTo('Computers');
    await this.elements.click(category === 'Desktops' ? 'sidebarDesktopsLink' : category === 'Notebooks' ? 'sidebarNotebooksLink' : 'sidebarAccessoriesLink');
    await expect(this.elements.getLocator('categoryHeading')).toHaveText(category);
    await expect(this.page).toHaveURL(categoryPaths[category]);
  }
}