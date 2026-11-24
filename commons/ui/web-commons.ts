import { Page, Locator, expect, FrameLocator } from '@playwright/test';

export class WebCommons {
  private page: Page;
  private defaultTimeout: number = 15000;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async navigate(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit'; timeout?: number }): Promise<void> {
    await this.page.goto(url, {
      waitUntil: options?.waitUntil || 'networkidle',
      timeout: options?.timeout || this.defaultTimeout
    });
  }

  async waitForPageLoad(timeout?: number): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: timeout || this.defaultTimeout });
  }

  async waitForURL(url: string | RegExp, options?: { timeout?: number }): Promise<void> {
    await this.page.waitForURL(url, { timeout: options?.timeout || this.defaultTimeout });
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  async goForward(): Promise<void> {
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  // Element Interactions
  async click(locator: Locator | string, options?: { force?: boolean; timeout?: number; noWaitAfter?: boolean }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.click({
      force: options?.force || false,
      timeout: options?.timeout || this.defaultTimeout,
      noWaitAfter: options?.noWaitAfter || false
    });
  }

  async doubleClick(locator: Locator | string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.dblclick({
      force: options?.force || false,
      timeout: options?.timeout || this.defaultTimeout
    });
  }

  async rightClick(locator: Locator | string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.click({
      button: 'right',
      force: options?.force || false,
      timeout: options?.timeout || this.defaultTimeout
    });
  }

  async fill(locator: Locator | string, value: string, options?: { timeout?: number; noWaitAfter?: boolean }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.fill(value, {
      timeout: options?.timeout || this.defaultTimeout,
      noWaitAfter: options?.noWaitAfter || false
    });
  }

  async type(locator: Locator | string, value: string, options?: { delay?: number; timeout?: number; noWaitAfter?: boolean }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.type(value, {
      delay: options?.delay || 0,
      timeout: options?.timeout || this.defaultTimeout,
      noWaitAfter: options?.noWaitAfter || false
    });
  }

  async press(locator: Locator | string, key: string, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.press(key, { timeout: options?.timeout || this.defaultTimeout });
  }

  async selectOption(locator: Locator | string, value: string | string[], options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.selectOption(value, { timeout: options?.timeout || this.defaultTimeout });
  }

  async check(locator: Locator | string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.check({ force: options?.force || false, timeout: options?.timeout || this.defaultTimeout });
  }

  async uncheck(locator: Locator | string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.uncheck({ force: options?.force || false, timeout: options?.timeout || this.defaultTimeout });
  }

  async hover(locator: Locator | string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.hover({ force: options?.force || false, timeout: options?.timeout || this.defaultTimeout });
  }

  async focus(locator: Locator | string, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.focus({ timeout: options?.timeout || this.defaultTimeout });
  }

  // Wait Utilities
  async waitForVisible(locator: Locator | string, options?: { timeout?: number; state?: 'visible' | 'hidden' | 'attached' | 'detached' }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({ state: options?.state || 'visible', timeout: options?.timeout || this.defaultTimeout });
  }

  async waitForHidden(locator: Locator | string, options?: { timeout?: number }): Promise<void> {
    await this.waitForVisible(locator, { ...options, state: 'hidden' });
  }

  async waitForText(locator: Locator | string, text: string, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toContainText(text, { timeout: options?.timeout || this.defaultTimeout });
  }

  async waitForNotText(locator: Locator | string, text: string, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).not.toContainText(text, { timeout: options?.timeout || this.defaultTimeout });
  }

  async waitForCount(locator: Locator | string, count: number, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toHaveCount(count, { timeout: options?.timeout || this.defaultTimeout });
  }

  async waitForEnabled(locator: Locator | string, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toBeEnabled({ timeout: options?.timeout || this.defaultTimeout });
  }

  async waitForDisabled(locator: Locator | string, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toBeDisabled({ timeout: options?.timeout || this.defaultTimeout });
  }

  async waitForChecked(locator: Locator | string, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element).toBeChecked({ timeout: options?.timeout || this.defaultTimeout });
  }

  // Assertions
  async assertVisible(locator: Locator | string, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).toBeVisible();
  }

  async assertHidden(locator: Locator | string, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).toBeHidden();
  }

  async assertEnabled(locator: Locator | string, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).toBeEnabled();
  }

  async assertDisabled(locator: Locator | string, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).toBeDisabled();
  }

  async assertChecked(locator: Locator | string, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).toBeChecked();
  }

  async assertNotChecked(locator: Locator | string, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).not.toBeChecked();
  }

  async assertText(locator: Locator | string, expectedText: string | RegExp, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).toHaveText(expectedText);
  }

  async assertContainsText(locator: Locator | string, expectedText: string | RegExp, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).toContainText(expectedText);
  }

  async assertNotContainsText(locator: Locator | string, expectedText: string | RegExp, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).not.toContainText(expectedText);
  }

  async assertValue(locator: Locator | string, expectedValue: string | RegExp, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).toHaveValue(expectedValue);
  }

  async assertAttribute(locator: Locator | string, attribute: string, expectedValue: string | RegExp, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).toHaveAttribute(attribute, expectedValue);
  }

  async assertCount(locator: Locator | string, expectedCount: number, message?: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await expect(element, message).toHaveCount(expectedCount);
  }

  async assertTitle(expectedTitle: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveTitle(expectedTitle);
  }

  async assertURL(expectedURL: string | RegExp, message?: string): Promise<void> {
    await expect(this.page, message).toHaveURL(expectedURL);
  }

  // Screenshot & Trace
  async takeScreenshot(name: string, options?: { fullPage?: boolean; path?: string }): Promise<Buffer> {
    return await this.page.screenshot({
      fullPage: options?.fullPage || false,
      path: options?.path
    });
  }

  async takeElementScreenshot(locator: Locator | string, name: string, options?: { path?: string }): Promise<Buffer> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.screenshot({ path: options?.path });
  }

  // Alert/Dialog Handling
  async acceptDialog(promptText?: string): Promise<string> {
    return await this.page.waitForEvent('dialog', { timeout: this.defaultTimeout }).then(async (dialog) => {
      const message = dialog.message();
      if (promptText !== undefined && dialog.type() === 'prompt') {
        await dialog.accept(promptText);
      } else {
        await dialog.accept();
      }
      return message;
    });
  }

  async dismissDialog(): Promise<string> {
    return await this.page.waitForEvent('dialog', { timeout: this.defaultTimeout }).then(async (dialog) => {
      const message = dialog.message();
      await dialog.dismiss();
      return message;
    });
  }

  // Frame Handling
  async getFrame(locator: Locator | string): Promise<FrameLocator> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return element.contentFrame();
  }

  // Keyboard
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async typeText(text: string, options?: { delay?: number }): Promise<void> {
    await this.page.keyboard.type(text, { delay: options?.delay || 0 });
  }

  // Mouse
  async mouseClick(x: number, y: number, options?: { button?: 'left' | 'right' | 'middle'; clickCount?: number }): Promise<void> {
    await this.page.mouse.click(x, y, options);
  }

  async mouseMove(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y);
  }

  async mouseDown(x: number, y: number, options?: { button?: 'left' | 'right' | 'middle' }): Promise<void> {
    await this.page.mouse.down(options);
  }

  async mouseUp(x: number, y: number, options?: { button?: 'left' | 'right' | 'middle' }): Promise<void> {
    await this.page.mouse.up(options);
  }

  // Scroll
  async scrollToElement(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.scrollIntoViewIfNeeded();
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  // Utility
  async getText(locator: Locator | string): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return (await element.textContent()) || '';
  }

  async getAttribute(locator: Locator | string, attribute: string): Promise<string | null> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.getAttribute(attribute);
  }

  async getValue(locator: Locator | string): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.inputValue();
  }

  async isVisible(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isVisible();
  }

  async isEnabled(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isEnabled();
  }

  async isChecked(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isChecked();
  }

  async count(locator: Locator | string): Promise<number> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.count();
  }

  // Clear and type
  async clearAndType(locator: Locator | string, value: string, options?: { delay?: number; timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.clear({ timeout: options?.timeout || this.defaultTimeout });
    await element.type(value, { delay: options?.delay || 0, timeout: options?.timeout || this.defaultTimeout });
  }

  // Select by text
  async selectByText(locator: Locator | string, text: string, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.selectOption({ label: text }, { timeout: options?.timeout || this.defaultTimeout });
  }

  // Select by value
  async selectByValue(locator: Locator | string, value: string, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.selectOption({ value }, { timeout: options?.timeout || this.defaultTimeout });
  }

  // Select by index
  async selectByIndex(locator: Locator | string, index: number, options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.selectOption({ index }, { timeout: options?.timeout || this.defaultTimeout });
  }

  // Upload file
  async uploadFile(locator: Locator | string, filePath: string | string[], options?: { timeout?: number }): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.setInputFiles(filePath, { timeout: options?.timeout || this.defaultTimeout });
  }

  // Drag and drop
  async dragAndDrop(source: Locator | string, target: Locator | string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const sourceElement = typeof source === 'string' ? this.page.locator(source) : source;
    const targetElement = typeof target === 'string' ? this.page.locator(target) : target;
    await sourceElement.dragTo(targetElement, { force: options?.force || false, timeout: options?.timeout || this.defaultTimeout });
  }

  // Hover and click
  async hoverAndClick(hoverLocator: Locator | string, clickLocator: Locator | string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    await this.hover(hoverLocator, options);
    await this.click(clickLocator, options);
  }
}