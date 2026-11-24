import { test } from '@playwright/test';
import { ElectronicsPageSteps } from '../../page-objects/page-steps';

test.describe('Electronics module - risk-based regression', () => {
  let electronicsSteps: ElectronicsPageSteps;

  test.beforeEach(async ({ page }) => {
    electronicsSteps = new ElectronicsPageSteps(page);
  });

  test('ELEC-003: Access Electronics category via direct URL @smoke @regression', async () => {
    await electronicsSteps.verifyElectronicsPageLoaded();
  });

  test('ELEC-030: Verify Electronics subcategory links @regression', async () => {
    await electronicsSteps.verifyElectronicsSubcategoryLinks();
  });

  test('ELEC-031: Filter Camera, photo products under 500.00 @regression', async () => {
    await electronicsSteps.verifyCameraPhotoUnder500Filter();
  });

  test('ELEC-032: Filter Camera, photo products over 500.00 @regression', async () => {
    await electronicsSteps.verifyCameraPhotoOver500Filter();
  });
});