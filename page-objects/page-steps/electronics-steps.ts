import { expect, Page } from '@playwright/test';
import { WebCommons } from '../../commons/ui/web-commons';
import { ElementHelper, loadPageElements } from '../../utilities/element-loader';

export class ElectronicsPageSteps {
  private readonly page: Page;
  private readonly commons: WebCommons;
  private readonly elements: ElementHelper;
  private readonly pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.commons = new WebCommons(page);
    this.elements = new ElementHelper(page, 'electronics-page');
    this.pageElements = loadPageElements('electronics-page');
  }

  async verifyElectronicsPageLoaded(): Promise<void> {
    await this.commons.navigate(this.pageElements.pageUrl, { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveTitle(this.pageElements.pageTitle);
    await expect(this.elements.getLocator('electronicsHeading')).toBeVisible();
  }

  async verifyElectronicsSubcategoryLinks(): Promise<void> {
    await this.verifyElectronicsPageLoaded();
    await expect(this.elements.getLocator('cameraPhotoLink')).toHaveAttribute('href', '/camera-photo');
    await expect(this.elements.getLocator('cellPhonesLink')).toHaveAttribute('href', '/cell-phones');
  }

  async verifyCameraPhotoUnder500Filter(): Promise<void> {
    await this.commons.navigate('/camera-photo', { waitUntil: 'domcontentloaded' });
    await expect(this.elements.getLocator('cameraPhotoHeading')).toBeVisible();
    await this.elements.click('under500Filter');
    await expect(this.page).toHaveURL(/price=-500/);
    await expect(this.elements.getLocator('handycamLink')).toBeVisible();
    await expect(this.elements.getLocator('handycamPrice')).toHaveText('349.00');
  }

  async verifyCameraPhotoOver500Filter(): Promise<void> {
    await this.commons.navigate('/camera-photo', { waitUntil: 'domcontentloaded' });
    await expect(this.elements.getLocator('cameraPhotoHeading')).toBeVisible();
    await this.elements.click('over500Filter');
    await expect(this.page).toHaveURL(/price=500-/);
    await expect(this.elements.getLocator('camcorderLink')).toBeVisible();
    await expect(this.elements.getLocator('digitalSlrLink')).toBeVisible();
    await expect(this.elements.getLocator('highDefinitionCamcorderLink')).toBeVisible();
  }
}