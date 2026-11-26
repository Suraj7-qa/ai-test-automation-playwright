import { expect, Page } from '@playwright/test';
import { ElementHelper, loadPageElements } from '../../utilities/element-loader';

export class JewelryPageSteps {
  private readonly page: Page;
  private readonly elements: ElementHelper;
  private readonly pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.elements = new ElementHelper(page, 'jewelry-page');
    this.pageElements = loadPageElements('jewelry-page');
  }

  private selector(name: string): string {
    const element = this.pageElements.elements[name];
    if (!element) throw new Error(`Element '${name}' is not defined in jewelry-page.json`);
    return element.locator;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.pageElements.pageUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/\/jewelry$/);
    await expect(this.elements.getLocator('categoryHeading')).toHaveText('Jewelry');
  }

  async navigateFromHeader(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.elements.getLocator('headerTopMenu')
      .getByRole('link', { name: 'Jewelry', exact: true }).click();
    await this.navigate();
  }

  async verifyListing(): Promise<void> {
    await this.navigate();
    const cards = this.page.locator(this.selector('productCards'));
    await expect(cards).toHaveCount(5);

    const names = await this.page.locator(this.selector('productTitleLink')).allTextContents();
    expect(names).toEqual(expect.arrayContaining([
      'Create Your Own Jewelry',
      'Black & White Diamond Heart',
      'Diamond Pave Earrings',
      'Diamond Tennis Bracelet',
      'Vintage Style Three Stone Diamond Engagement Ring'
    ]));

    for (const card of await cards.all()) {
      await expect(card.locator(this.selector('productCardPrice'))).toContainText(/\d/);
      await expect(card.locator(this.selector('productCardImage'))).toBeVisible();
    }
  }

  async verifyPriceSortLowToHigh(): Promise<void> {
    await this.navigate();
    await this.elements.selectOption('sortByDropdown', { label: 'Price: Low to High' } as unknown as string);
  }

  async verifyPriceSort(): Promise<void> {
    await this.navigate();
    const sort = this.elements.getLocator('sortByDropdown');
    await sort.selectOption({ label: 'Price: Low to High' });
    await expect(sort.locator('option:checked')).toHaveText('Price: Low to High');

    const cards = this.page.locator(this.selector('productCards'));
    await expect(cards).toHaveCount(5);
    const prices = await this.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  }

  private async getPrices(): Promise<number[]> {
    const cards = this.page.locator(this.selector('productCards'));
    const prices: number[] = [];
    for (const card of await cards.all()) {
      const text = await card.locator(this.selector('productCardPrice')).first().innerText();
      const value = text.match(/\d+(?:\.\d+)?/)?.[0];
      if (value) prices.push(Number(value));
    }
    return prices;
  }

  async verifyPagination(): Promise<void> {
    await this.navigate();
    await this.elements.selectOption('pageSizeDropdown', '4');
    await expect(this.page.locator(this.selector('productCards'))).toHaveCount(4);
    await this.elements.click('nextPageLink');
    await expect(this.page.locator(this.selector('productCards'))).toHaveCount(1);
  }

  async verifyPriceFilter(): Promise<void> {
    await this.navigate();
    await this.elements.click('priceFilterUnder500');
    await expect(this.page).toHaveURL(/price=/);
    await expect(this.page.locator(this.selector('productCards'))).toHaveCount(3);
  }

  async verifyOutOfStockProduct(): Promise<void> {
    await this.page.goto('/diamond-pave-earrings', { waitUntil: 'domcontentloaded' });
    await expect(this.page.getByRole('heading', { name: 'Diamond Pave Earrings', exact: true })).toBeVisible();
    await expect(this.page.locator('body')).toContainText('Availability: Out of stock');
    await expect(this.page.locator('input[id^="add-to-cart-button"]')).toHaveCount(0);
  }

  async addConfiguredJewelry(): Promise<void> {
    await this.page.goto('/create-it-yourself-jewelry', { waitUntil: 'domcontentloaded' });
    await this.elements.selectOption('configMaterialSelect', '47');
    await this.elements.fill('configLengthInput', '20');
    await this.page.getByRole('radio', { name: 'Heart', exact: true }).check();
    await this.elements.click('detailAddToCart');
    await expect(this.elements.getLocator('addToCartNotification')).toContainText('added to your shopping cart');

    await this.page.goto('/cart', { waitUntil: 'domcontentloaded' });
    const cartRow = this.page.getByRole('row').filter({ hasText: 'Create Your Own Jewelry' });
    await expect(cartRow).toContainText('Silver (1 mm)');
    await expect(cartRow).toContainText('Length: 20');
    await expect(cartRow).toContainText('Pendant: Heart');
  }

  async rejectInvalidLength(length: string): Promise<void> {
    await this.page.goto('/create-it-yourself-jewelry', { waitUntil: 'domcontentloaded' });
    await this.elements.fill('configLengthInput', length);
    await this.elements.click('detailAddToCart');
    await expect(this.elements.getLocator('addToCartNotification')).toContainText(/Length|Enter/i);
    await expect(this.elements.getLocator('cartCount')).toContainText('(0)');
  }

  async addDiamondHeartQuantity(quantity: number): Promise<void> {
    await this.page.goto('/black-white-diamond-heart', { waitUntil: 'domcontentloaded' });
    await this.elements.fill('quantityInput', String(quantity));
    await this.elements.click('detailAddToCart');
    await expect(this.elements.getLocator('addToCartNotification')).toContainText('added to your shopping cart');
    await this.page.goto('/cart', { waitUntil: 'domcontentloaded' });
    const cartRow = this.page.getByRole('row').filter({ hasText: 'Black & White Diamond Heart' });
    await expect(cartRow).toContainText(String(quantity));
  }
}
