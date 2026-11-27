import { test, expect } from '@playwright/test';

test('test electronics compare list click', async ({ page }) => {
  await page.goto('https://demowebshop.tricentis.com/digital-slr-camera');

  // Click the compare list button (input[value="Add to compare list"])
  await page.locator('input[value="Add to compare list"]').click();

  // Check URL
  console.log('URL:', page.url());
});