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

  async navigateFromHeader(): Promise<void> {
    await this.commons.navigate('/', { waitUntil: 'domcontentloaded' });
    await this.elements.getLocator('headerTopMenu')
      .getByRole('link', { name: 'Electronics', exact: true })
      .click();
    await expect(this.page).toHaveURL(/\/electronics$/);
    await expect(this.elements.getLocator('electronicsHeading')).toBeVisible();
  }

  async verifyElectronicsSubcategoryLinks(): Promise<void> {
    await this.verifyElectronicsPageLoaded();
    await expect(this.elements.getLocator('cameraPhotoLink')).toHaveAttribute('href', '/camera-photo');
    await expect(this.elements.getLocator('cellPhonesLink')).toHaveAttribute('href', '/cell-phones');
  }

  async navigateToCellPhones(): Promise<void> {
    await this.verifyElectronicsPageLoaded();
    await this.elements.click('cellPhonesLink');
    await expect(this.page).toHaveURL(/\/cell-phones$/);
    await expect(this.elements.getLocator('cellPhonesHeading')).toBeVisible();
  }

  async verifyCellPhonesCatalogue(): Promise<void> {
    await this.navigateToCellPhones();
    await expect(this.elements.getLocator('smartphoneLink')).toBeVisible();
    await expect(this.elements.getLocator('smartphonePrice')).toBeVisible();
  }

  async verifyCameraPhotoCatalogue(): Promise<void> {
    await this.commons.navigate('/camera-photo', { waitUntil: 'domcontentloaded' });
    await expect(this.elements.getLocator('cameraPhotoHeading')).toBeVisible();
    await expect(this.elements.getLocator('handycamLink')).toBeVisible();
    await expect(this.elements.getLocator('handycamPrice')).toBeVisible();
    await expect(this.elements.getLocator('digitalSlrLink')).toBeVisible();
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

  async verifySortCameraPhoto(option: 'Name: A to Z' | 'Price: Low to High' | 'Price: High to Low'): Promise<void> {
    await this.commons.navigate('/camera-photo', { waitUntil: 'domcontentloaded' });
    await this.elements.getLocator('sortByDropdown').selectOption({ label: option });
    await expect(this.page).toHaveURL(/orderby=/);
  }

  async verifyDisplayViewAndPageSize(): Promise<void> {
    await this.commons.navigate('/camera-photo', { waitUntil: 'domcontentloaded' });
    await this.elements.getLocator('viewModeDropdown').selectOption({ label: 'List' });
    await this.elements.getLocator('pageSizeDropdown').selectOption({ label: '4' });
  }

  async verifyAddHandycamToCart(): Promise<void> {
    await this.commons.navigate('/camera-photo', { waitUntil: 'domcontentloaded' });
    await this.elements.click('handycamLink');
    await expect(this.elements.getLocator('handycamDetailHeading')).toBeVisible();
    await this.elements.click('detailAddToCartButton');
    await expect(this.elements.getLocator('addToCartNotification')).toContainText('added to your shopping cart');
  }

  async verifyAddSmartphoneToCart(): Promise<void> {
    await this.navigateToCellPhones();
    await this.elements.click('smartphoneLink');
    await expect(this.elements.getLocator('smartphoneDetailHeading')).toBeVisible();
    await this.elements.click('detailAddToCartButton');
    await expect(this.elements.getLocator('addToCartNotification')).toContainText('added to your shopping cart');
  }

  async verifyEmailFriendHandycam(): Promise<void> {
    await this.commons.navigate('/camera-photo', { waitUntil: 'domcontentloaded' });
    await this.elements.click('handycamLink');
    await this.elements.click('detailEmailFriendButton');
    await expect(this.page).toHaveURL(/productemailafriend/);
  }

  async verifyCompareListHandycam(): Promise<void> {
    await this.commons.navigate('/camera-photo', { waitUntil: 'domcontentloaded' });
    await this.elements.click('handycamLink');
    await this.elements.click('detailCompareButton');
    await expect(this.elements.getLocator('addToCartNotification')).toContainText('product comparison');
  }

  async verifyReviewsHandycam(): Promise<void> {
    await this.commons.navigate('/camera-photo', { waitUntil: 'domcontentloaded' });
    await this.elements.click('handycamLink');
    await this.elements.click('detailReviewLink');
    await expect(this.page).toHaveURL(/productreviews/);
  }

  async verifySearchElectronics(): Promise<void> {
    await this.verifyElectronicsPageLoaded();
    await this.elements.getLocator('searchInput').fill('camera');
    await this.elements.getLocator('searchButton').click();
    await expect(this.page).toHaveURL(/search/);
  }
}