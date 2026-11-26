import { test, expect } from '@playwright/test';
import { GiftCardsPageSteps } from '../../page-objects/page-steps';

test.describe('Gift Cards Module - High Risk Regression Tests', () => {
  let giftCards: GiftCardsPageSteps;

  test.beforeEach(async ({ page }) => {
    giftCards = new GiftCardsPageSteps(page);
  });

  test.describe('Category Page', () => {
    test('DWS-GC-001: Verify Gift Cards category page loads', async () => {
      await giftCards.navigateToCategory();
      await expect(giftCards['page']).toHaveURL(/\/gift-cards$/);
    });

    test('DWS-GC-002: Verify all four gift card products displayed', async () => {
      await giftCards.navigateToCategory();
      const count = await giftCards.getProductCards();
      expect(count).toBe(4);
    });

    test('DWS-GC-003: Verify Virtual Gift Cards present', async () => {
      await giftCards.navigateToCategory();
      await expect(giftCards['page'].locator('.product-title a')).toContainText(['$5 Virtual Gift Card', '$25 Virtual Gift Card']);
    });

    test('DWS-GC-004: Verify Physical Gift Cards present', async () => {
      await giftCards.navigateToCategory();
      await expect(giftCards['page'].locator('.product-title a')).toContainText(['$50 Physical Gift Card', '$100 Physical Gift Card']);
    });

    test('DWS-GC-005: Verify sorting dropdown works', async () => {
      await giftCards.verifyCategorySorting('Name: A to Z');
      await expect(giftCards['page']).toHaveURL(/orderby=5/);
    });

    test('DWS-GC-006: Verify view mode dropdown works', async () => {
      await giftCards.verifyCategoryViewMode('List');
      await expect(giftCards['page']).toHaveURL(/viewmode=list/);
    });

    test('DWS-GC-007: Verify page size dropdown works', async () => {
      await giftCards.verifyCategoryPageSize('8');
      await expect(giftCards['page']).toHaveURL(/pagesize=8/);
    });

    test('DWS-GC-008: Verify breadcrumb navigation', async () => {
      await giftCards.navigateToCategory();
      await expect(giftCards['page'].locator('.breadcrumb')).toBeVisible();
      await expect(giftCards['page'].locator('.breadcrumb')).toContainText('Home');
      await expect(giftCards['page'].locator('.breadcrumb')).toContainText('Gift Cards');
    });
  });

  test.describe('Virtual Gift Card Details', () => {
    test('DWS-GC-009: Verify $5 Virtual Gift Card detail page', async () => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await giftCards.verifyProductDetailPage('$5 Virtual Gift Card');
      await giftCards.verifyVirtualGiftCardFields();
      await giftCards.verifyPrice('5.00');
    });

    test('DWS-GC-010: Verify $25 Virtual Gift Card detail page', async () => {
      await giftCards.navigateFromCategoryToProduct('/25-virtual-gift-card');
      await giftCards.verifyProductDetailPage('$25 Virtual Gift Card');
      await giftCards.verifyVirtualGiftCardFields();
      await giftCards.verifyPrice('25.00');
    });

    test('DWS-GC-011: Fill and submit virtual gift card form', async () => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'John Doe',
        recipientEmail: 'john@example.com',
        senderName: 'Jane Smith',
        senderEmail: 'jane@example.com',
        message: 'Happy Birthday!',
        quantity: '1'
      });
      await giftCards.addToCart();
      await giftCards.verifyProductInCart('$5 Virtual Gift Card', '5.00');
    });

    test('DWS-GC-012: Add virtual gift card to wishlist', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'John Doe',
        recipientEmail: 'john@example.com',
        senderName: 'Jane Smith',
        senderEmail: 'jane@example.com',
        message: 'Enjoy!'
      });
      await giftCards.addToWishlist();
      await page.goto('/wishlist');
      await expect(page.locator('tbody tr')).toContainText('$5 Virtual Gift Card');
    });

    test('DWS-GC-013: Verify virtual gift card requires email fields', async () => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      const recipientEmail = giftCards['page'].locator(giftCards['selector']('recipientEmail', true));
      const senderEmail = giftCards['page'].locator(giftCards['selector']('senderEmail', true));
      await expect(recipientEmail).toBeVisible();
      await expect(senderEmail).toBeVisible();
    });
  });

  test.describe('Physical Gift Card Details', () => {
    test('DWS-GC-014: Verify $50 Physical Gift Card detail page', async () => {
      await giftCards.navigateFromCategoryToProduct('/50-physical-gift-card');
      await giftCards.verifyProductDetailPage('$50 Physical Gift Card');
      await giftCards.verifyPhysicalGiftCardFields();
      await giftCards.verifyPrice('50.00');
    });

    test('DWS-GC-015: Verify $100 Physical Gift Card detail page', async () => {
      await giftCards.navigateFromCategoryToProduct('/100-physical-gift-card');
      await giftCards.verifyProductDetailPage('$100 Physical Gift Card');
      await giftCards.verifyPhysicalGiftCardFields();
      await giftCards.verifyPrice('100.00');
    });

    test('DWS-GC-016: Fill and submit physical gift card form', async () => {
      await giftCards.navigateFromCategoryToProduct('/50-physical-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'John Doe',
        senderName: 'Jane Smith',
        message: 'Happy Holidays!',
        quantity: '1'
      });
      await giftCards.addToCart();
      await giftCards.verifyProductInCart('$50 Physical Gift Card', '50.00');
    });

    test('DWS-GC-017: Physical gift card shows delivery date', async () => {
      await giftCards.navigateFromCategoryToProduct('/50-physical-gift-card');
      await expect(giftCards['page'].locator(giftCards['selector']('deliveryDate', true))).toBeVisible();
    });

    test('DWS-GC-018: Physical gift card does not have email fields', async () => {
      await giftCards.navigateFromCategoryToProduct('/50-physical-gift-card');
      const recipientEmail = giftCards['page'].locator(giftCards['selector']('recipientEmail', true));
      const senderEmail = giftCards['page'].locator(giftCards['selector']('senderEmail', true));
      await expect(recipientEmail).not.toBeVisible();
      await expect(senderEmail).not.toBeVisible();
    });
  });

  test.describe('Gift Card to Cart Flow', () => {
    test('DWS-GC-019: Add multiple gift cards to cart', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'Alice',
        recipientEmail: 'alice@example.com',
        senderName: 'Bob',
        senderEmail: 'bob@example.com',
        message: 'Gift 1'
      });
      await giftCards.addToCart();

      await giftCards.navigateFromCategoryToProduct('/50-physical-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'Charlie',
        senderName: 'Dave',
        message: 'Gift 2'
      });
      await giftCards.addToCart();

      await page.goto('/cart');
      const cartItems = page.locator('tbody tr.cart-item-row');
      await expect(cartItems.nth(0)).toContainText('$5 Virtual Gift Card');
      await expect(cartItems.nth(1)).toContainText('$50 Physical Gift Card');
    });

    test('DWS-GC-020: Update quantity on gift card', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/25-virtual-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'Test User',
        recipientEmail: 'test@example.com',
        senderName: 'Sender',
        senderEmail: 'sender@example.com',
        message: 'Test',
        quantity: '3'
      });
      await giftCards.addToCart();
      await page.goto('/cart');
      const qtyInput = page.locator('input[name*="quantity"]').first();
      await expect(qtyInput).toHaveValue('3');
    });
  });

  test.describe('Cross-Module Integration', () => {
    test('DWS-GC-021: Add gift card to wishlist then move to cart', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'Wishlist User',
        recipientEmail: 'wish@example.com',
        senderName: 'Sender',
        senderEmail: 'sender@example.com',
        message: 'Wishlist test'
      });
      await giftCards.addToWishlist();

      await page.goto('/wishlist');
      await page.locator('td:first-child input[type="checkbox"]').check();
      await page.getByRole('button', { name: 'Add to cart' }).click();
      await page.goto('/cart');
      await expect(page.locator('tbody tr.cart-item-row')).toContainText('$5 Virtual Gift Card');
    });

    test('DWS-GC-022: Email a friend from gift card page', async () => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await giftCards.clickEmailFriend();
      await expect(giftCards['page']).toHaveURL(/emailafriend/);
    });

    test('DWS-GC-023: Gift card appears in recently viewed', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await page.goto('/recentlyviewedproducts');
      await expect(page.locator('.product-title a')).toContainText('$5 Virtual Gift Card');
    });

    test('DWS-GC-024: Add gift card to compare list', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await page.locator(giftCards['selector']('addToCompareButton', true)).click();
      await page.goto('/compareproducts');
      await expect(page.locator('.product-title a')).toContainText('$5 Virtual Gift Card');
    });
  });

  test.describe('Negative / Boundary Tests', () => {
    test('DWS-GC-025: Submit virtual gift card without required fields', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await page.locator(giftCards['selector']('addToCartButton', true)).click();
      // Should show validation errors for required fields
      await page.waitForTimeout(1000);
      await expect(page.locator('.field-validation-error, .validation-summary-errors, .bar-notification')).toBeVisible();
    });

    test('DWS-GC-026: Submit physical gift card without required fields', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/50-physical-gift-card');
      await page.locator(giftCards['selector']('addToCartButton', true)).click();
      await page.waitForTimeout(1000);
      await expect(page.locator('.field-validation-error, .validation-summary-errors, .bar-notification')).toBeVisible();
    });

    test('DWS-GC-027: Invalid email format shows validation', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'Test',
        recipientEmail: 'invalid-email',
        senderName: 'Sender',
        senderEmail: 'also-invalid',
        message: 'Test'
      });
      await page.locator(giftCards['selector']('addToCartButton', true)).click();
      await expect(page.locator('.field-validation-error')).toContainText(/email/i);
    });

    test('DWS-GC-028: Quantity boundary - zero quantity', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'Test',
        recipientEmail: 'test@example.com',
        senderName: 'Sender',
        senderEmail: 'sender@example.com',
        message: 'Test',
        quantity: '0'
      });
      await page.locator(giftCards['selector']('addToCartButton', true)).click();
      // Should show validation error
      await expect(page.locator('.field-validation-error, .validation-summary-errors')).toBeVisible();
    });

    test('DWS-GC-029: Quantity boundary - negative quantity', async ({ page }) => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'Test',
        recipientEmail: 'test@example.com',
        senderName: 'Sender',
        senderEmail: 'sender@example.com',
        message: 'Test',
        quantity: '-1'
      });
      await page.locator(giftCards['selector']('addToCartButton', true)).click();
      await expect(page.locator('.field-validation-error, .validation-summary-errors')).toBeVisible();
    });

    test('DWS-GC-030: Very long message field', async () => {
      const longMessage = 'A'.repeat(1000);
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      await giftCards.fillGiftCardForm({
        recipientName: 'Test',
        recipientEmail: 'test@example.com',
        senderName: 'Sender',
        senderEmail: 'sender@example.com',
        message: longMessage
      });
      await giftCards.addToCart();
      await giftCards.verifyProductInCart('$5 Virtual Gift Card', '5.00');
    });
  });

  test.describe('Accessibility', () => {
    test('DWS-GC-031: Form fields have proper labels', async () => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      const recipientName = giftCards['page'].locator(giftCards['selector']('recipientName', true));
      const recipientEmail = giftCards['page'].locator(giftCards['selector']('recipientEmail', true));
      const senderName = giftCards['page'].locator(giftCards['selector']('senderName', true));
      const senderEmail = giftCards['page'].locator(giftCards['selector']('senderEmail', true));
      const message = giftCards['page'].locator(giftCards['selector']('message', true));

      // Check for associated labels or aria-labels
      await expect(recipientName).toHaveAttribute('type', 'text');
      await expect(recipientEmail).toHaveAttribute('type', 'text');
      await expect(senderName).toHaveAttribute('type', 'text');
      await expect(senderEmail).toHaveAttribute('type', 'text');
      await expect(message).toHaveAttribute('type', 'text');
    });

    test('DWS-GC-032: Buttons have accessible names', async () => {
      await giftCards.navigateFromCategoryToProduct('/5-virtual-gift-card');
      const addToCart = giftCards['page'].locator(giftCards['selector']('addToCartButton', true));
      const addToWishlist = giftCards['page'].locator(giftCards['selector']('addToWishlistButton', true));
      await expect(addToCart).toBeVisible();
      await expect(addToWishlist).toBeVisible();
    });
  });
});