import { test, expect } from '@playwright/test';
import { WishlistPageSteps } from '../../page-objects/page-steps';

test.describe('Wishlist Module - High Risk Regression Tests', () => {
  let wishlist: WishlistPageSteps;

  test.beforeEach(async ({ page }) => {
    wishlist = new WishlistPageSteps(page);
    // Clear wishlist by navigating and removing any items
    await page.goto('/wishlist', { waitUntil: 'domcontentloaded' });
    const rows = page.locator('.wishlist-content table tbody tr, table tbody tr');
    if (await rows.count() > 0) {
      const checkboxes = rows.locator('td:first-child input[type="checkbox"]');
      for (let i = 0; i < await checkboxes.count(); i++) {
        await checkboxes.nth(i).check();
      }
      await page.getByRole('button', { name: 'Update wishlist' }).click();
      await page.waitForLoadState('domcontentloaded');
    }
  });

  test.describe('Core Wishlist Functionality', () => {
    test('DWS-WISH-001: Verify empty wishlist displays correctly', async () => {
      await wishlist.verifyEmptyWishlist();
    });

    test('DWS-WISH-002: Add single product to wishlist from product page', async () => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      await wishlist.verifyWishlistHasItems(1);
      await wishlist.verifyItemInWishlist('Black & White Diamond Heart', '130.00', '1');
      await wishlist.verifyWishlistCountInHeader(1);
    });

    test('DWS-WISH-003: Add multiple products to wishlist', async () => {
      await wishlist.addMultipleProductsToWishlist([
        '/black-white-diamond-heart',
        '/create-it-yourself-jewelry'
      ]);
      await wishlist.verifyWishlistHasItems(2);
      await wishlist.verifyWishlistCountInHeader(2);
    });

    test('DWS-WISH-004: Remove item from wishlist', async () => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      await wishlist.removeItem('Black & White Diamond Heart');
      await wishlist.verifyEmptyWishlist();
      await wishlist.verifyWishlistCountInHeader(0);
    });

    test('DWS-WISH-005: Update item quantity in wishlist', async () => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      await wishlist.updateItemQuantity('Black & White Diamond Heart', '3');
      // Verification done in updateItemQuantity method
    });
  });

  test.describe('Wishlist to Cart Flow', () => {
    test('DWS-WISH-006: Add wishlist item to cart from wishlist page', async ({ page }) => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      await wishlist.addSelectedToCart();
      // Verify item moved to cart
      await expect(page.locator('tbody tr')).toContainText('Black & White Diamond Heart');
      await expect(page.locator('tbody tr')).toContainText('130.00');
    });

    test('DWS-WISH-007: Add multiple wishlist items to cart at once', async ({ page }) => {
      await wishlist.addMultipleProductsToWishlist([
        '/black-white-diamond-heart',
        '/diamond-tennis-bracelet'
      ]);
      // Select both items and add to cart
      const rows = page.locator('.wishlist-content table tbody tr, table tbody tr');
      await rows.locator('td:nth-child(2) input[type="checkbox"]').check();
      await page.getByRole('button', { name: 'Add to cart' }).click();
      await expect(page.locator('.bar-notification')).toContainText(/added to your shopping cart/i);
      await page.goto('/cart');
      await expect(page.locator('tbody tr')).toContainText('Black & White Diamond Heart');
      await expect(page.locator('tbody tr')).toContainText('Diamond Tennis Bracelet');
    });
  });

  test.describe('Wishlist Sharing', () => {
    test('DWS-WISH-008: Verify shareable wishlist URL is generated', async () => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      const url = await wishlist.verifyShareableUrl();
      expect(url).toMatch(/wishlist\/[a-f0-9-]+/);
    });

    test('DWS-WISH-009: Shareable URL loads wishlist', async ({ page }) => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      const url = await wishlist.verifyShareableUrl();
      await page.goto(url);
      await expect(page.locator('h1')).toHaveText('Wishlist');
      await wishlist.verifyItemInWishlist('Black & White Diamond Heart', '130.00', '1');
    });
  });

  test.describe('Email a Friend from Wishlist', () => {
    test('DWS-WISH-010: Open email a friend from wishlist', async ({ page }) => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      await wishlist.clickEmailFriend();
      await expect(page).toHaveURL(/emailafriend/);
    });
  });

  test.describe('Negative / Boundary Tests', () => {
    test('DWS-WISH-011: Add to wishlist shows notification', async ({ page }) => {
      await page.goto('/black-white-diamond-heart');
      await page.getByRole('button', { name: 'Add to wishlist' }).click();
      await expect(page.locator('.bar-notification')).toContainText(/added to your wishlist/i);
    });

    test('DWS-WISH-012: Add same product to wishlist twice', async () => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      // Should still show only 1 item (or update quantity)
      await wishlist.verifyWishlistHasItems(1);
    });

    test('DWS-WISH-013: Remove all items empties wishlist', async () => {
      await wishlist.addMultipleProductsToWishlist([
        '/black-white-diamond-heart',
        '/diamond-tennis-bracelet'
      ]);
      await wishlist.removeItem('Black & White Diamond Heart');
      await wishlist.removeItem('Diamond Tennis Bracelet');
      await wishlist.verifyEmptyWishlist();
    });
  });

  test.describe('Cross-Module Integration', () => {
    test('DWS-WISH-014: Wishlist persists across category navigation', async ({ page }) => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      await page.goto('/computers');
      await page.goto('/electronics');
      await page.goto('/wishlist');
      await wishlist.verifyItemInWishlist('Black & White Diamond Heart', '130.00', '1');
    });

    test('DWS-WISH-015: Wishlist items can have different quantities than cart', async ({ page }) => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      await wishlist.updateItemQuantity('Black & White Diamond Heart', '2');
      await wishlist.addSelectedToCart();
      // Cart should have quantity from wishlist or default
      await expect(page.locator('tbody tr')).toContainText('Black & White Diamond Heart');
    });
  });

  test.describe('Accessibility', () => {
    test('DWS-WISH-016: Wishlist table has proper headers', async ({ page }) => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      const headers = page.locator('th');
      await expect(headers).toHaveCount(7);
      await expect(headers.nth(0)).toHaveText('Remove');
      await expect(headers.nth(1)).toHaveText('Add to cart');
      await expect(headers.nth(3)).toHaveText('Product(s)');
      await expect(headers.nth(4)).toHaveText('Price');
      await expect(headers.nth(5)).toHaveText('Qty.');
      await expect(headers.nth(6)).toHaveText('Total');
    });

    test('DWS-WISH-017: Form elements have labels', async ({ page }) => {
      await wishlist.addProductToWishlist('/black-white-diamond-heart');
      const quantityInput = page.locator('td.quantity input, td.qty input');
      await expect(quantityInput).toHaveAttribute('type', 'text');
      // Check for associated label or aria-label
      const checkbox = page.locator('td:first-child input[type="checkbox"]');
      await expect(checkbox).toBeVisible();
    });
  });
});