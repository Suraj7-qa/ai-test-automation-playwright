import { test, expect } from '@playwright/test';

test('test multiple add to cart from detail', async ({ page }) => {
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // Add Blue Jeans from listing
  await page.goto('https://demowebshop.tricentis.com/apparel-shoes');
  const blueJeansCard = page.locator('.item-box').filter({ has: page.getByRole('link', { name: 'Blue Jeans', exact: true }) });
  await expect(blueJeansCard).toHaveCount(1);
  await blueJeansCard.locator('input[value="Add to cart"]').first().click();
  await expect(page.locator('.bar-notification')).toContainText('added to your shopping cart');
  console.log('After Blue Jeans - Cart:', await page.locator('.cart-qty').innerText());

  // Add Rockabilly Top from detail page
  await page.goto('https://demowebshop.tricentis.com/50s-rockabilly-polka-dot-top-jr-plus-size');
  await page.locator('input[value="Add to cart"]').first().click();
  await expect(page.locator('.bar-notification')).toContainText('added to your shopping cart');
  console.log('After Rockabilly - Cart:', await page.locator('.cart-qty').innerText());
});