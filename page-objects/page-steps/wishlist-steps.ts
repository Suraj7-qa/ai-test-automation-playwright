import { expect, Page } from '@playwright/test';
import { ElementHelper, loadPageElements } from '../../utilities/element-loader';

export class WishlistPageSteps {
  private readonly page: Page;
  private readonly elements: ElementHelper;
  private readonly pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.elements = new ElementHelper(page, 'wishlist-page');
    this.pageElements = loadPageElements('wishlist-page');
  }

  private selector(name: string): string {
    const element = this.pageElements.elements[name];
    if (!element) throw new Error(`Element '${name}' is not defined in wishlist-page.json`);
    return element.locator;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.pageElements.pageUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/\/wishlist$/);
    await expect(this.elements.getLocator('pageHeading')).toHaveText('Wishlist');
  }

  async verifyEmptyWishlist(): Promise<void> {
    await this.navigate();
    await expect(this.elements.getLocator('emptyWishlistMessage')).toBeVisible();
    await expect(this.elements.getLocator('wishlistTable')).toHaveCount(0);
  }

  async verifyWishlistHasItems(expectedCount: number): Promise<void> {
    await this.navigate();
    const rows = this.page.locator(this.selector('wishlistRows'));
    await expect(rows).toHaveCount(expectedCount);
  }

  async verifyItemInWishlist(productName: string, expectedPrice: string, expectedQuantity: string): Promise<void> {
    await this.navigate();
    const row = this.page.locator(this.selector('wishlistRows')).filter({ hasText: productName });
    await expect(row).toBeVisible();
    await expect(row.locator(this.selector('productNameLink'))).toHaveText(productName);
    await expect(row.locator(this.selector('productPrice')).first()).toContainText(expectedPrice);
    await expect(row.locator(this.selector('quantityInput'))).toHaveValue(expectedQuantity);
    await expect(row.locator(this.selector('productTotal')).first()).toContainText(expectedPrice);
  }

  async removeItem(productName: string): Promise<void> {
    await this.navigate();
    const row = this.page.locator(this.selector('wishlistRows')).filter({ hasText: productName });
    await row.locator(this.selector('removeCheckbox')).check();
    await this.elements.click('updateWishlistButton');
    await expect(this.elements.getLocator('wishlistNotification')).toContainText(/updated|removed/i);
    await this.verifyEmptyWishlist();
  }

  async updateItemQuantity(productName: string, newQuantity: string): Promise<void> {
    await this.navigate();
    const row = this.page.locator(this.selector('wishlistRows')).filter({ hasText: productName });
    await row.locator(this.selector('quantityInput')).fill(newQuantity);
    await this.elements.click('updateWishlistButton');
    await expect(this.elements.getLocator('wishlistNotification')).toContainText(/updated/i);
    await expect(row.locator(this.selector('quantityInput'))).toHaveValue(newQuantity);
  }

  async addSelectedToCart(): Promise<void> {
    await this.navigate();
    await this.elements.click('addToCartButton');
    await expect(this.elements.getLocator('wishlistNotification')).toContainText(/added to your shopping cart/i);
    await this.page.goto('/cart', { waitUntil: 'domcontentloaded' });
  }

  async verifyShareableUrl(): Promise<string> {
    await this.navigate();
    const urlLink = this.elements.getLocator('shareWishlistUrl');
    await expect(urlLink).toBeVisible();
    const href = await urlLink.getAttribute('href');
    expect(href).toMatch(/\/wishlist\/[a-f0-9-]+/);
    return href || '';
  }

  async clickEmailFriend(): Promise<void> {
    await this.navigate();
    await this.elements.click('emailFriendButton');
  }

  async addProductToWishlist(productUrl: string): Promise<void> {
    await this.page.goto(productUrl, { waitUntil: 'domcontentloaded' });
    await this.elements.click('addToWishlistButton');
    await expect(this.elements.getLocator('wishlistNotification')).toContainText(/added to your wishlist/i);
  }

  async verifyWishlistCountInHeader(expectedCount: number): Promise<void> {
    const headerLink = this.page.locator('a[href="/wishlist"]');
    await expect(headerLink).toContainText(`(${expectedCount})`);
  }

  async addMultipleProductsToWishlist(productUrls: string[]): Promise<void> {
    for (const url of productUrls) {
      await this.addProductToWishlist(url);
    }
  }
}