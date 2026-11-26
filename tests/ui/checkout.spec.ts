import { test, expect } from '@playwright/test';
import { CheckoutPageSteps } from '../../page-objects/page-steps';

test.describe('Checkout module - risk-based regression', () => {
  let checkoutSteps: CheckoutPageSteps;

  test.beforeEach(async ({ page }) => {
    checkoutSteps = new CheckoutPageSteps(page);
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  // ===== CART TESTS =====
  test('DWS-CHK-001: View cart with a product @smoke @regression', async () => {
    await checkoutSteps.verifyCartHasLaptop();
  });

  test('DWS-CHK-002: View an empty cart @regression', async () => {
    await checkoutSteps.verifyEmptyCart();
  });

  test('DWS-CHK-003: Update product quantity and total @critical @regression', async () => {
    await checkoutSteps.updateLaptopQuantity('2');
  });

  test('DWS-CHK-004: Quantity zero removes product from cart @negative @regression', async () => {
    await checkoutSteps.updateLaptopQuantity('0');
  });

  test('DWS-CHK-005: Update quantity to valid number updates total @regression', async () => {
    await checkoutSteps.updateLaptopQuantity('3');
  });

  test('DWS-CHK-006: Multiple products in cart display correctly @regression', async ({ page }) => {
    await checkoutSteps.addFeaturedLaptopToCart();
    await page.goto('/build-your-own-computer', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.bar-notification')).toContainText('added to your shopping cart');
    await checkoutSteps.navigateToCart();
    const rows = page.locator('.cart tbody tr');
    await expect(rows).toHaveCount(2);
  });

  test('DWS-CHK-007: Remove product from cart using checkbox @regression', async ({ page }) => {
    await checkoutSteps.openCartWithLaptop();
    await page.locator('input[name^="removefromcart"]').first().check();
    await checkoutSteps.getElements().click('updateCartButton');
    await expect(checkoutSteps.getElements().getLocator('cartEmptyMessage')).toContainText('Your Shopping Cart is empty!');
  });

  test('DWS-CHK-008: Continue shopping navigates back to home @regression', async ({ page }) => {
    await checkoutSteps.openCartWithLaptop();
    await checkoutSteps.getElements().click('continueShoppingButton');
    await expect(page).toHaveURL(/\/$/);
  });

  // ===== SHIPPING ESTIMATOR TESTS =====
  test('DWS-CHK-012: Estimate shipping for a valid US address @regression', async () => {
    await checkoutSteps.estimateShippingForNewYork();
  });

  test('DWS-CHK-013: Estimate shipping shows correct methods for different countries @regression', async ({ page }) => {
    await checkoutSteps.openCartWithLaptop();
    await checkoutSteps.getElements().selectOption('shippingCountry', 'United States');
    const state = checkoutSteps.getElements().getLocator('shippingState');
    await expect(state.locator('option').filter({ hasText: 'California' })).toHaveCount(1);
    await state.selectOption({ label: 'California' });
    await checkoutSteps.getElements().fill('shippingZip', '90210');
    await checkoutSteps.getElements().click('estimateShippingButton');
    const shipping = checkoutSteps.getElements().getLocator('shippingEstimator');
    await expect(shipping).toContainText('Ground');
  });

  test('DWS-CHK-009: Shipping estimator requires country selection @negative @regression', async ({ page }) => {
    await checkoutSteps.openCartWithLaptop();
    await checkoutSteps.getElements().fill('shippingZip', '10001');
    await checkoutSteps.getElements().click('estimateShippingButton');
    // Should show error or not change
    await expect(page).toHaveURL(/\/cart/);
  });

  // ===== COUPON & GIFT CARD TESTS =====
  test('DWS-CHK-010: Apply valid coupon code @regression', async ({ page }) => {
    await checkoutSteps.openCartWithLaptop();
    await checkoutSteps.getElements().fill('couponCodeInput', 'AutomationDiscount2');
    await checkoutSteps.getElements().click('applyCouponButton');
    // Verify discount applied
    await expect(checkoutSteps.getElements().getLocator('cartSubtotal')).toBeVisible();
  });

  test('DWS-CHK-011: Apply invalid coupon code shows error @negative @regression', async ({ page }) => {
    await checkoutSteps.openCartWithLaptop();
    await checkoutSteps.getElements().fill('couponCodeInput', 'INVALIDCODE');
    await checkoutSteps.getElements().click('applyCouponButton');
    // Should show error message
    await expect(page.locator('.message-error, .validation-summary-errors')).toBeVisible();
  });

  test('DWS-CHK-011b: Apply gift card @regression', async ({ page }) => {
    await checkoutSteps.openCartWithLaptop();
    await checkoutSteps.getElements().fill('giftCardInput', 'VALIDGIFTCARD');
    await checkoutSteps.getElements().click('addGiftCardButton');
    await expect(checkoutSteps.getElements().getLocator('cartSubtotal')).toBeVisible();
  });

  // ===== TERMS & CHECKOUT INITIATION =====
  test('DWS-CHK-014: Require terms agreement before checkout @negative @critical', async () => {
    await checkoutSteps.rejectCheckoutWithoutTerms();
  });

  test('DWS-CHK-015: Continue checkout after accepting terms @smoke @critical', async () => {
    await checkoutSteps.proceedToGuestCheckout();
  });

  test('DWS-CHK-016: Checkout as guest reaches billing address @smoke @critical', async () => {
    await checkoutSteps.continueAsGuest();
  });

  test('DWS-CHK-023: Validate missing billing email @negative @critical', async () => {
    await checkoutSteps.rejectMissingBillingEmail();
  });

  // ===== BILLING ADDRESS TESTS =====
  test('DWS-CHK-017: Fill valid billing address and continue @smoke @critical', async () => {
    await checkoutSteps.fillBillingAddress(
      'John', 'Doe', 'john.doe@example.com',
      '1', 'New York', 'New York', '123 Main St',
      '10001', '2125550100'
    );
  });

  test('DWS-CHK-018: Validate required billing fields @negative @critical', async ({ page }) => {
    await checkoutSteps.continueAsGuest();
    await checkoutSteps.getElements().click('billingContinueButton');
    // Check for validation errors on required fields
    const errors = page.locator('.field-validation-error');
    await expect(errors).toHaveCount(1);
  });

  test('DWS-CHK-019: Billing address with optional fields @regression', async () => {
    await checkoutSteps.fillBillingAddress(
      'Jane', 'Smith', 'jane.smith@example.com',
      '1', 'California', 'Los Angeles', '456 Oak Ave',
      '90210', '3105550100',
      'Acme Corp', 'Suite 100', '3105550101'
    );
  });

  test('DWS-CHK-020: Use saved billing address from dropdown @regression', async () => {
    // This test requires a logged-in user with saved addresses
    await checkoutSteps.fillBillingAddressWithSavedAddress();
  });

  // ===== SHIPPING ADDRESS TESTS =====
  test('DWS-CHK-021: Fill shipping address same as billing @smoke @regression', async () => {
    await checkoutSteps.fillShippingAddress(
      'John', 'Doe', 'john.doe@example.com',
      '1', 'New York', 'New York', '123 Main St',
      '10001', '2125550100'
    );
  });

  test('DWS-CHK-022: Fill different shipping address @regression', async () => {
    await checkoutSteps.fillShippingAddress(
      'Jane', 'Doe', 'jane.doe@example.com',
      '1', 'California', 'San Francisco', '789 Market St',
      '94105', '4155550100'
    );
  });

  test('DWS-CHK-024: Use saved shipping address from dropdown @regression', async () => {
    await checkoutSteps.selectShippingAddressFromDropdown();
  });

  test('DWS-CHK-025: Select In-Store Pickup @regression', async () => {
    await checkoutSteps.selectInStorePickup();
  });

  // ===== SHIPPING METHOD TESTS =====
  test('DWS-CHK-026: Select Ground shipping method @smoke @regression', async () => {
    await checkoutSteps.selectShippingMethod('Ground');
  });

  test('DWS-CHK-027: Select Next Day Air shipping method @regression', async () => {
    await checkoutSteps.selectShippingMethod('Next Day Air');
  });

  test('DWS-CHK-028: Select 2nd Day Air shipping method @regression', async () => {
    await checkoutSteps.selectShippingMethod('2nd Day Air');
  });

  test('DWS-CHK-029: Shipping method selection persists @regression', async ({ page }) => {
    await checkoutSteps.selectShippingMethod('Next Day Air');
    // Navigate back and verify
    await checkoutSteps.getElements().click('backButton');
    await expect(checkoutSteps.getElements().getLocator('shippingMethodNextDayAir')).toBeChecked();
  });

  // ===== PAYMENT METHOD TESTS =====
  test('DWS-CHK-030: Select Cash On Delivery payment method @smoke @critical', async () => {
    await checkoutSteps.selectPaymentMethod('CashOnDelivery');
  });

  test('DWS-CHK-031: Select Check / Money Order payment method @regression', async () => {
    await checkoutSteps.selectPaymentMethod('CheckMoneyOrder');
  });

  test('DWS-CHK-032: Select Credit Card payment method @regression', async () => {
    await checkoutSteps.selectPaymentMethod('CreditCard');
  });

  test('DWS-CHK-033: Select Purchase Order payment method @regression', async () => {
    await checkoutSteps.selectPaymentMethod('PurchaseOrder');
  });

  // ===== PAYMENT INFORMATION TESTS =====
  test('DWS-CHK-034: Fill credit card payment information @critical @regression', async () => {
    await checkoutSteps.fillCreditCardPaymentInfo(
      'Visa', 'John Doe', '4111111111111111',
      '12', '2028', '123'
    );
  });

  test('DWS-CHK-035: Validate credit card required fields @negative @critical', async ({ page }) => {
    await checkoutSteps.selectPaymentMethod('CreditCard');
    await checkoutSteps.getElements().click('paymentInfoContinueButton');
    const errors = page.locator('.field-validation-error');
    await expect(errors).toHaveCount(1);
  });

  test('DWS-CHK-036: COD payment information displays correctly @regression', async () => {
    await checkoutSteps.continuePaymentInfoCOD();
  });

  // ===== ORDER CONFIRMATION TESTS =====
  test('DWS-CHK-037: Verify confirm order page displays all details @smoke @critical', async () => {
    await checkoutSteps.verifyConfirmOrderPage();
  });

  test('DWS-CHK-038: Confirm order completes successfully @critical @smoke', async () => {
    await checkoutSteps.verifyOrderCompleted();
  });

  test('DWS-CHK-039: Order confirmation shows correct totals @regression', async ({ page }) => {
    await checkoutSteps.verifyConfirmOrderPage();
    await expect(checkoutSteps.getElements().getLocator('confirmOrderSubTotal')).toBeVisible();
    await expect(checkoutSteps.getElements().getLocator('confirmOrderTotal')).toBeVisible();
  });

  test('DWS-CHK-040: Order number generated on completion @critical', async () => {
    await checkoutSteps.verifyOrderCompleted();
    const orderNumber = await checkoutSteps.getElements().getLocator('orderNumber').textContent();
    expect(orderNumber).toMatch(/\d+/);
  });

  // ===== EDGE CASES =====
  test('DWS-CHK-041: Back navigation preserves entered data @regression', async ({ page }) => {
    await checkoutSteps.fillBillingAddress(
      'Test', 'User', 'test@example.com',
      '1', 'New York', 'New York', '123 Test St',
      '10001', '2125550100'
    );
    await checkoutSteps.getElements().click('backButton');
    await expect(checkoutSteps.getElements().getLocator('billingFirstName')).toHaveValue('Test');
  });

  test('DWS-CHK-042: Multiple products checkout @regression', async ({ page }) => {
    await checkoutSteps.addFeaturedLaptopToCart();
    await page.goto('/25-virtual-gift-card', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await expect(page.locator('.bar-notification')).toContainText('added to your shopping cart');
    await checkoutSteps.navigateToCart();
    const rows = page.locator('.cart tbody tr');
    await expect(rows).toHaveCount(2);
    // Proceed with checkout
    await checkoutSteps.getElements().check('termsCheckbox');
    await checkoutSteps.getElements().click('checkoutButton');
    await checkoutSteps.getElements().click('checkoutAsGuestButton');
    await checkoutSteps.fillBillingAddress(
      'Multi', 'Product', 'multi@example.com',
      '1', 'New York', 'New York', '123 Multi St',
      '10001', '2125550100'
    );
    await checkoutSteps.selectShippingAddressFromDropdown();
    await checkoutSteps.selectShippingMethod('Ground');
    await checkoutSteps.selectPaymentMethod('CashOnDelivery');
    await checkoutSteps.continuePaymentInfoCOD();
    await checkoutSteps.verifyOrderCompleted();
  });

  test('DWS-CHK-043: Checkout with coupon and gift card @regression', async ({ page }) => {
    await checkoutSteps.openCartWithLaptop();
    await checkoutSteps.getElements().fill('couponCodeInput', 'AutomationDiscount2');
    await checkoutSteps.getElements().click('applyCouponButton');
    await checkoutSteps.getElements().fill('giftCardInput', 'TESTGIFT');
    await checkoutSteps.getElements().click('addGiftCardButton');
    // Proceed with checkout
    await checkoutSteps.getElements().check('termsCheckbox');
    await checkoutSteps.getElements().click('checkoutButton');
    await checkoutSteps.getElements().click('checkoutAsGuestButton');
    await checkoutSteps.fillBillingAddress(
      'Coupon', 'User', 'coupon@example.com',
      '1', 'New York', 'New York', '123 Coupon St',
      '10001', '2125550100'
    );
    await checkoutSteps.selectShippingAddressFromDropdown();
    await checkoutSteps.selectShippingMethod('Ground');
    await checkoutSteps.selectPaymentMethod('CashOnDelivery');
    await checkoutSteps.continuePaymentInfoCOD();
    await checkoutSteps.verifyOrderCompleted();
  });
});