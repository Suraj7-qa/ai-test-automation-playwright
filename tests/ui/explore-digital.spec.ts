import { test } from '@playwright/test';

test('explore search on digital downloads', async ({ page }) => {
  await page.goto('https://demowebshop.tricentis.com/digital-downloads');
  await page.waitForLoadState('networkidle');

  // Check search input
  const searchInputs = await page.locator('input[id="small-searchterms"], input[name="q"], input[type="search"], input[placeholder*="Search"]').all();
  for (const input of searchInputs) {
    console.log('SEARCH INPUT:', await input.getAttribute('id'), await input.getAttribute('name'), await input.getAttribute('placeholder'), await input.getAttribute('type'));
  }

  // Try to fill the search
  const searchInput = page.locator('input[id="small-searchterms"]').first();
  console.log('SEARCH INPUT COUNT:', await searchInput.count());
  if (await searchInput.count() > 0) {
    await searchInput.fill('digital');
    console.log('FILLED');
  }
});