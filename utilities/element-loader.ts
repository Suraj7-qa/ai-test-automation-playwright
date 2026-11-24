import * as fs from 'fs';
import * as path from 'path';
import { Page, Locator } from '@playwright/test';

const ELEMENTS_DIR = path.resolve(__dirname, '../page-objects/page-elements');

export interface PageElement {
  locator: string;
  fallbackLocators?: string[];
  strategy?: 'role' | 'label' | 'placeholder' | 'text' | 'testId' | 'css';
  role?: 'button' | 'link' | 'textbox' | 'checkbox' | 'radio' | 'heading' | 'navigation' | 'main' | 'banner' | 'contentinfo';
  name?: string;
  exact?: boolean;
  testId?: string;
  type: string;
  description: string;
}

export interface PageElements {
  pageName: string;
  pageUrl: string;
  pageTitle: string;
  elements: Record<string, PageElement>;
  forms?: Record<string, any>;
}

export function loadPageElements(pageName: string): PageElements {
  const filePath = path.join(ELEMENTS_DIR, `${pageName}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Page elements not found: ${pageName} at ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as PageElements;
}

export function getElementLocator(pageName: string, elementName: string): string {
  const pageElements = loadPageElements(pageName);
  const element = pageElements.elements[elementName];
  if (!element) {
    throw new Error(`Element '${elementName}' not found in page '${pageName}'`);
  }
  return element.locator;
}

export function getElementFallbackLocators(pageName: string, elementName: string): string[] {
  const pageElements = loadPageElements(pageName);
  const element = pageElements.elements[elementName];
  if (!element) {
    throw new Error(`Element '${elementName}' not found in page '${pageName}'`);
  }
  return element.fallbackLocators || [];
}

export function getAllElementNames(pageName: string): string[] {
  const pageElements = loadPageElements(pageName);
  return Object.keys(pageElements.elements);
}

export class ElementHelper {
  private page: Page;
  private pageName: string;
  private pageElements: PageElements;

  constructor(page: Page, pageName: string) {
    this.page = page;
    this.pageName = pageName;
    this.pageElements = loadPageElements(pageName);
  }

  getLocator(elementName: string): Locator {
    const element = this.pageElements.elements[elementName];
    if (!element) {
      throw new Error(`Element '${elementName}' not found in page '${this.pageName}'`);
    }

    if (element.strategy === 'role' && element.role) {
      return this.page.getByRole(element.role as any, {
        name: element.name,
        exact: element.exact
      });
    }

    if (element.strategy === 'label' && element.name) {
      return this.page.getByLabel(element.name, { exact: element.exact });
    }

    if (element.strategy === 'placeholder' && element.name) {
      return this.page.getByPlaceholder(element.name, { exact: element.exact });
    }

    if (element.strategy === 'text' && element.name) {
      return this.page.getByText(element.name, { exact: element.exact });
    }

    if (element.strategy === 'testId' && element.testId) {
      return this.page.getByTestId(element.testId);
    }

    const locators = [element.locator, ...(element.fallbackLocators || [])];
    return this.page.locator(locators.join(', ')).first();
  }

  async waitForElement(elementName: string, options?: { state?: 'attached' | 'detached' | 'visible' | 'hidden'; timeout?: number }): Promise<Locator> {
    const locator = this.getLocator(elementName);
    await locator.waitFor(options);
    return locator;
  }

  async isVisible(elementName: string): Promise<boolean> {
    try {
      const locator = this.getLocator(elementName);
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  async isEnabled(elementName: string): Promise<boolean> {
    try {
      const locator = this.getLocator(elementName);
      return await locator.isEnabled();
    } catch {
      return false;
    }
  }

  async getText(elementName: string): Promise<string> {
    const locator = this.getLocator(elementName);
    return await locator.textContent() || '';
  }

  async click(elementName: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const locator = this.getLocator(elementName);
    await locator.click(options);
  }

  async fill(elementName: string, value: string, options?: { timeout?: number }): Promise<void> {
    const locator = this.getLocator(elementName);
    await locator.fill(value, options);
  }

  async type(elementName: string, value: string, options?: { delay?: number; timeout?: number }): Promise<void> {
    const locator = this.getLocator(elementName);
    await locator.type(value, options);
  }

  async selectOption(elementName: string, value: string | string[], options?: { timeout?: number }): Promise<void> {
    const locator = this.getLocator(elementName);
    await locator.selectOption(value, options);
  }

  async check(elementName: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const locator = this.getLocator(elementName);
    await locator.check(options);
  }

  async uncheck(elementName: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const locator = this.getLocator(elementName);
    await locator.uncheck(options);
  }

  async hover(elementName: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const locator = this.getLocator(elementName);
    await locator.hover(options);
  }
}