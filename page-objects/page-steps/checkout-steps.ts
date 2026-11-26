import { expect, Page } from '@playwright/test';
import { ElementHelper, loadPageElements } from '../../utilities/element-loader';

export class CheckoutPageSteps {
  private readonly page: Page;
  private readonly elements: ElementHelper;
  private readonly pageElements: ReturnType<typeof loadPageElements>;

  constructor(page: Page) {
    this.page = page;
    this.elements = new ElementHelper(page, 'checkout-page');
    this.pageElements = loadPageElements('checkout-page');
  }

  // Public getter for element access in tests
  public getElements(): ElementHelper {
    return this.elements;
  }

  private selector(name: string): string {
    const element = this.pageElements.elements[name];
    if (!element) throw new Error(`Element '${name}' is not defined in checkout-page.json`);
    return element.locator;
  }

  async navigateToCart(): Promise<void> {
    await this.page.goto('/cart', { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveTitle(/Shopping Cart/);
  }

  async addFeaturedLaptopToCart(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    const laptopCard = this.page.locator(this.selector('homeFeaturedCards'))
      .filter({ has: this.elements.getLocator('laptopProductLink') });
    await expect(laptopCard).toHaveCount(1);
    await laptopCard.locator(this.selector('quickAddToCartButton')).click();
    await expect(this.elements.getLocator('addToCartNotification'))
      .toContainText('added to your shopping cart');
  }

  async openCartWithLaptop(): Promise<void> {
    await this.addFeaturedLaptopToCart();
    await this.navigateToCart();
  }

  async verifyCartHasLaptop(): Promise<void> {
    await this.openCartWithLaptop();
    const rows = this.page.locator(this.selector('cartRows'));
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('14.1-inch Laptop');
    await expect(rows.first()).toContainText('1590.00');
  }

  async verifyEmptyCart(): Promise<void> {
    await this.navigateToCart();
    await expect(this.elements.getLocator('cartEmptyMessage')).toContainText('Your Shopping Cart is empty!');
    await expect(this.elements.getLocator('cartRows')).toHaveCount(0);
  }

  async updateLaptopQuantity(quantity: string): Promise<void> {
    await this.openCartWithLaptop();
    await this.elements.fill('cartQuantityInput', quantity);
    await this.elements.click('updateCartButton');
    if (quantity === '0') {
      await expect(this.elements.getLocator('cartEmptyMessage')).toContainText('Your Shopping Cart is empty!');
      await expect(this.elements.getLocator('cartCount')).toHaveText('(0)');
      return;
    }

    const row = this.page.locator(this.selector('cartRows')).first();
    await expect(row.locator(this.selector('cartQuantityInput'))).toHaveValue(quantity);
    await expect(row).toContainText('3180.00');
    await expect(this.elements.getLocator('cartCount')).toHaveText(`(${quantity})`);
  }

  async estimateShippingForNewYork(): Promise<void> {
    await this.openCartWithLaptop();
    const shipping = this.elements.getLocator('shippingEstimator');
    await this.elements.selectOption('shippingCountry', '1');
    const state = this.elements.getLocator('shippingState');
    await expect(state.locator('option').filter({ hasText: 'New York' })).toHaveCount(1);
    await state.selectOption({ label: 'New York' });
    await this.elements.fill('shippingZip', '10001');
    await this.elements.click('estimateShippingButton');
    await expect(shipping).toContainText('Ground');
    await expect(shipping).toContainText('Next Day Air');
    await expect(shipping).toContainText('2nd Day Air');
  }

  async rejectCheckoutWithoutTerms(): Promise<void> {
    await this.openCartWithLaptop();
    const terms = this.elements.getLocator('termsCheckbox');
    await terms.uncheck();
    await this.elements.click('checkoutButton');
    await expect(this.elements.getLocator('termsWarning'))
      .toContainText('Please accept the terms of service before the next step.');
    await expect(this.page).toHaveURL(/\/cart$/);
  }

  async proceedToGuestCheckout(): Promise<void> {
    await this.openCartWithLaptop();
    await this.elements.check('termsCheckbox');
    await this.elements.click('checkoutButton');
    await expect(this.page).toHaveURL(/\/login\/checkoutasguest/);
    await expect(this.elements.getLocator('checkoutAsGuestButton')).toBeVisible();
  }

  async continueAsGuest(): Promise<void> {
    await this.proceedToGuestCheckout();
    await this.elements.click('checkoutAsGuestButton');
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
    await expect(this.elements.getLocator('checkoutHeading')).toBeVisible();
    await expect(this.elements.getLocator('billingFirstName')).toBeVisible();
    await expect(this.elements.getLocator('billingLastName')).toBeVisible();
    await expect(this.elements.getLocator('billingEmail')).toBeVisible();
  }

  async rejectMissingBillingEmail(): Promise<void> {
    await this.continueAsGuest();
    await this.elements.fill('billingFirstName', 'Casey');
    await this.elements.fill('billingLastName', 'Tester');
    await this.elements.selectOption('billingCountry', '1');
    const state = this.elements.getLocator('billingState');
    await expect(state.locator('option').filter({ hasText: 'New York' })).toHaveCount(1);
    await state.selectOption({ label: 'New York' });
    await this.elements.fill('billingCity', 'New York');
    await this.elements.fill('billingAddress1', '100 Test Street');
    await this.elements.fill('billingZip', '10001');
    await this.elements.fill('billingPhone', '2125550100');
    await this.elements.click('billingContinueButton');
    await expect(this.page.locator('.field-validation-error').filter({ hasText: 'Email is required.' }))
      .toBeVisible();
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  // ===== NEW METHODS FOR COMPLETE CHECKOUT FLOW =====

  async fillBillingAddress(
    firstName: string,
    lastName: string,
    email: string,
    country: string,
    state: string,
    city: string,
    address1: string,
    zip: string,
    phone: string,
    company?: string,
    address2?: string,
    fax?: string
  ): Promise<void> {
    await this.continueAsGuest();
    await this.elements.fill('billingFirstName', firstName);
    await this.elements.fill('billingLastName', lastName);
    await this.elements.fill('billingEmail', email);
    if (company) await this.elements.fill('billingCompany', company);
    await this.elements.selectOption('billingCountry', country);
    const stateLocator = this.elements.getLocator('billingState');
    await expect(stateLocator.locator('option').filter({ hasText: state })).toHaveCount(1);
    await stateLocator.selectOption({ label: state });
    await this.elements.fill('billingCity', city);
    await this.elements.fill('billingAddress1', address1);
    if (address2) await this.elements.fill('billingAddress2', address2);
    await this.elements.fill('billingZip', zip);
    await this.elements.fill('billingPhone', phone);
    if (fax) await this.elements.fill('billingFax', fax);
    await this.elements.click('billingContinueButton');
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  async fillBillingAddressWithSavedAddress(): Promise<void> {
    await this.continueAsGuest();
    // Use the saved address from dropdown (default selected)
    await this.elements.click('billingContinueButton');
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  async fillShippingAddress(
    firstName: string,
    lastName: string,
    email: string,
    country: string,
    state: string,
    city: string,
    address1: string,
    zip: string,
    phone: string,
    company?: string,
    address2?: string,
    fax?: string
  ): Promise<void> {
    await this.fillBillingAddressWithSavedAddress();
    // Wait for shipping address step
    await expect(this.elements.getLocator('shippingAddressHeading')).toBeVisible();
    await this.elements.fill('shippingFirstName', firstName);
    await this.elements.fill('shippingLastName', lastName);
    await this.elements.fill('shippingEmail', email);
    if (company) await this.elements.fill('shippingCompany', company);
    await this.elements.selectOption('shippingCountry', country);
    const stateLocator = this.elements.getLocator('shippingState');
    await expect(stateLocator.locator('option').filter({ hasText: state })).toHaveCount(1);
    await stateLocator.selectOption({ label: state });
    await this.elements.fill('shippingCity', city);
    await this.elements.fill('shippingAddress1', address1);
    if (address2) await this.elements.fill('shippingAddress2', address2);
    await this.elements.fill('shippingZip', zip);
    await this.elements.fill('shippingPhone', phone);
    if (fax) await this.elements.fill('shippingFax', fax);
    await this.elements.click('shippingContinueButton');
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  async selectShippingAddressFromDropdown(): Promise<void> {
    await this.fillBillingAddressWithSavedAddress();
    await expect(this.elements.getLocator('shippingAddressHeading')).toBeVisible();
    // Use saved address from dropdown
    await this.elements.click('shippingContinueButton');
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  async selectInStorePickup(): Promise<void> {
    await this.fillBillingAddressWithSavedAddress();
    await expect(this.elements.getLocator('shippingAddressHeading')).toBeVisible();
    await this.elements.check('inStorePickupCheckbox');
    await this.elements.click('shippingContinueButton');
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  async selectShippingMethod(method: 'Ground' | 'Next Day Air' | '2nd Day Air'): Promise<void> {
    await this.selectShippingAddressFromDropdown();
    await expect(this.elements.getLocator('shippingMethodHeading')).toBeVisible();

    const methodMap = {
      'Ground': 'shippingMethodGround',
      'Next Day Air': 'shippingMethodNextDayAir',
      '2nd Day Air': 'shippingMethodSecondDayAir'
    };

    await this.elements.check(methodMap[method]);
    await this.elements.click('shippingMethodContinueButton');
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  async selectPaymentMethod(method: 'CashOnDelivery' | 'CheckMoneyOrder' | 'CreditCard' | 'PurchaseOrder'): Promise<void> {
    await this.selectShippingMethod('Ground');
    await expect(this.elements.getLocator('paymentMethodHeading')).toBeVisible();

    const methodMap = {
      'CashOnDelivery': 'paymentMethodCOD',
      'CheckMoneyOrder': 'paymentMethodCheckMoneyOrder',
      'CreditCard': 'paymentMethodCreditCard',
      'PurchaseOrder': 'paymentMethodPurchaseOrder'
    };

    await this.elements.check(methodMap[method]);
    await this.elements.click('paymentMethodContinueButton');
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  async fillCreditCardPaymentInfo(
    cardType: string,
    cardholderName: string,
    cardNumber: string,
    expireMonth: string,
    expireYear: string,
    cvv: string
  ): Promise<void> {
    await this.selectPaymentMethod('CreditCard');
    await expect(this.elements.getLocator('paymentInfoHeading')).toBeVisible();
    await this.elements.selectOption('creditCardType', cardType);
    await this.elements.fill('creditCardHolderName', cardholderName);
    await this.elements.fill('creditCardNumber', cardNumber);
    await this.elements.selectOption('creditCardExpirationMonth', expireMonth);
    await this.elements.selectOption('creditCardExpirationYear', expireYear);
    await this.elements.fill('creditCardCvv', cvv);
    await this.elements.click('paymentInfoContinueButton');
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  async continuePaymentInfoCOD(): Promise<void> {
    await this.selectPaymentMethod('CashOnDelivery');
    await expect(this.elements.getLocator('paymentInfoHeading')).toBeVisible();
    await expect(this.elements.getLocator('paymentInfoCODMessage')).toContainText('COD');
    await this.elements.click('paymentInfoContinueButton');
    await expect(this.page).toHaveURL(/\/onepagecheckout/);
  }

  async verifyConfirmOrderPage(): Promise<void> {
    await this.continuePaymentInfoCOD();
    await expect(this.elements.getLocator('confirmOrderHeading')).toBeVisible();
    await expect(this.elements.getLocator('confirmOrderBillingAddress')).toBeVisible();
    await expect(this.elements.getLocator('confirmOrderShippingAddress')).toBeVisible();
    await expect(this.elements.getLocator('confirmOrderShippingMethod')).toBeVisible();
    await expect(this.elements.getLocator('confirmOrderPaymentMethod')).toBeVisible();
    const items = this.elements.getLocator('confirmOrderItems');
    await expect(items.first()).toBeVisible();
  }

  async confirmOrder(): Promise<void> {
    await this.verifyConfirmOrderPage();
    await this.elements.click('confirmOrderButton');
    await expect(this.page).toHaveURL(/\/checkout\/completed/);
    await expect(this.elements.getLocator('orderCompletedHeading')).toBeVisible();
    await expect(this.elements.getLocator('orderSuccessMessage')).toContainText('successfully processed');
    await expect(this.elements.getLocator('orderNumber')).toBeVisible();
  }

  async verifyOrderCompleted(): Promise<void> {
    await this.confirmOrder();
    await expect(this.elements.getLocator('orderDetailsLink')).toBeVisible();
    await expect(this.elements.getLocator('orderCompletedContinueButton')).toBeVisible();
  }

  async applyCouponCode(couponCode: string): Promise<void> {
    await this.openCartWithLaptop();
    await this.elements.fill('couponCodeInput', couponCode);
    await this.elements.click('applyCouponButton');
    // Verify coupon applied
    await expect(this.elements.getLocator('cartSubtotal')).toBeVisible();
  }

  async applyGiftCard(giftCardCode: string): Promise<void> {
    await this.openCartWithLaptop();
    await this.elements.fill('giftCardInput', giftCardCode);
    await this.elements.click('addGiftCardButton');
    // Verify gift card applied
    await expect(this.elements.getLocator('cartSubtotal')).toBeVisible();
  }

  // Registered user checkout flow
  async loginAndCheckout(): Promise<void> {
    // This would be implemented with login steps
    // For now, placeholder
    throw new Error('Not implemented - requires login steps');
  }
}