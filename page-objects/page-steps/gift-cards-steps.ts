import { expect, Page } from '@playwright/test';
import { ElementHelper, loadPageElements } from '../../utilities/element-loader';

export class GiftCardsPageSteps {
  private readonly page: Page;
  private readonly elements: ElementHelper;
  private readonly pageElements: ReturnType<typeof loadPageElements>;
  private readonly detailElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.elements = new ElementHelper(page, 'gift-cards-page');
    this.pageElements = loadPageElements('gift-cards-page');
    this.detailElements = loadPageElements('gift-cards-detail-page');
  }

  private selector(name: string, useDetail = false): string {
    const elements = useDetail ? this.detailElements.elements : this.pageElements.elements;
    const element = elements[name];
    if (!element) {
      const source = useDetail ? 'gift-cards-detail-page.json' : 'gift-cards-page.json';
      throw new Error(`Element '${name}' is not defined in ${source}`);
    }
    return element.locator;
  }

  async navigateToCategory(): Promise<void> {
    await this.page.goto(this.pageElements.pageUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/\/gift-cards$/);
    await expect(this.elements.getLocator('pageHeading')).toHaveText('Gift Cards');
  }

  async getProductCards(): Promise<number> {
    await this.navigateToCategory();
    return await this.page.locator(this.selector('productCards')).count();
  }

  async clickProductByName(productName: string): Promise<void> {
    await this.navigateToCategory();
    const productLink = this.page.locator(this.selector('productTitleLink')).filter({ hasText: productName });
    await expect(productLink.first()).toBeVisible();
    await productLink.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyProductDetailPage(productName: string): Promise<void> {
    await expect(this.page.locator('h1')).toContainText(productName);
    await expect(this.page.locator(this.selector('productImage', true))).toBeVisible();
  }

  async verifyVirtualGiftCardFields(): Promise<void> {
    await expect(this.page.locator(this.selector('recipientName', true))).toBeVisible();
    await expect(this.page.locator(this.selector('recipientEmail', true))).toBeVisible();
    await expect(this.page.locator(this.selector('senderName', true))).toBeVisible();
    await expect(this.page.locator(this.selector('senderEmail', true))).toBeVisible();
    await expect(this.page.locator(this.selector('message', true))).toBeVisible();
  }

  async verifyPhysicalGiftCardFields(): Promise<void> {
    await expect(this.page.locator(this.selector('recipientName', true))).toBeVisible();
    await expect(this.page.locator(this.selector('senderName', true))).toBeVisible();
    await expect(this.page.locator(this.selector('message', true))).toBeVisible();
    // Physical gift cards should NOT have recipient email or sender email
    await expect(this.page.locator(this.selector('recipientEmail', true))).not.toBeVisible();
    await expect(this.page.locator(this.selector('senderEmail', true))).not.toBeVisible();
    // Should have delivery date (free shipping text may not be present on all physical gift cards)
    await expect(this.page.locator(this.selector('deliveryDate', true))).toBeVisible();
  }

  async fillGiftCardForm(details: {
    recipientName?: string;
    recipientEmail?: string;
    senderName?: string;
    senderEmail?: string;
    message?: string;
    quantity?: string;
  }): Promise<void> {
    if (details.recipientName) {
      await this.page.locator(this.selector('recipientName', true)).fill(details.recipientName);
    }
    if (details.recipientEmail) {
      const recipientEmailLocator = this.page.locator(this.selector('recipientEmail', true));
      if (await recipientEmailLocator.isVisible()) {
        await recipientEmailLocator.fill(details.recipientEmail);
      }
    }
    if (details.senderName) {
      await this.page.locator(this.selector('senderName', true)).fill(details.senderName);
    }
    if (details.senderEmail) {
      const senderEmailLocator = this.page.locator(this.selector('senderEmail', true));
      if (await senderEmailLocator.isVisible()) {
        await senderEmailLocator.fill(details.senderEmail);
      }
    }
    if (details.message) {
      await this.page.locator(this.selector('message', true)).fill(details.message);
    }
    if (details.quantity) {
      await this.page.locator(this.selector('quantityInput', true)).fill(details.quantity);
    }
  }

  async addToCart(): Promise<void> {
    await this.page.locator(this.selector('addToCartButton', true)).click();
    await expect(this.page.locator(this.selector('notification', true))).toContainText(/added to your shopping cart/i);
  }

  async addToWishlist(): Promise<void> {
    await this.page.locator(this.selector('addToWishlistButton', true)).click();
    await expect(this.page.locator(this.selector('notification', true))).toContainText(/added to your wishlist/i);
  }

  async clickEmailFriend(): Promise<void> {
    await this.page.locator(this.selector('emailFriendButton', true)).click();
    await expect(this.page).toHaveURL(/emailafriend/);
  }

  async verifyPrice(expectedPrice: string): Promise<void> {
    await expect(this.page.locator(this.selector('price', true))).toContainText(expectedPrice);
  }

  async verifyProductInCart(productName: string, expectedPrice: string): Promise<void> {
    await this.page.goto('/cart', { waitUntil: 'domcontentloaded' });
    const cartItemRow = this.page.locator('tbody tr.cart-item-row');
    await expect(cartItemRow).toContainText(productName);
    await expect(cartItemRow).toContainText(expectedPrice);
  }

  async navigateFromCategoryToProduct(productUrl: string): Promise<void> {
    await this.page.goto(productUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyCategorySorting(sortBy: string): Promise<void> {
    await this.navigateToCategory();
    await this.page.locator(this.selector('sortByDropdown')).selectOption(sortBy);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyCategoryViewMode(viewMode: string): Promise<void> {
    await this.navigateToCategory();
    await this.page.locator(this.selector('viewModeDropdown')).selectOption(viewMode);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyCategoryPageSize(pageSize: string): Promise<void> {
    await this.navigateToCategory();
    await this.page.locator(this.selector('pageSizeDropdown')).selectOption(pageSize);
    await this.page.waitForLoadState('domcontentloaded');
  }
}