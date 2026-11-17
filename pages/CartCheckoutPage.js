export class CartCheckoutPage {
  constructor(page) {
    this.page = page;

    // 1. Header Cart Trigger
    const header = page.locator('header');
    this.navCartBtn = header.getByRole('button', { name: /cart/i });
    this.navCartCount = header.getByTestId('cart-count');
    this.navCartSubtotal = header.getByTestId('cart-nav-subtotal');

    // 2. Shopping Basket Drawer ("Your Shopping Basket") & Empty State ("Browse Catalog")
    this.basketHeading = page.getByRole('heading', { name: 'Your Shopping Basket' });
    this.basketDrawer = page.locator('div.fixed.inset-0').filter({ has: this.basketHeading });
    this.browseCatalogBtn = this.basketDrawer.getByRole('button', { name: /browse catalog/i });
    this.closeBasketBtn = this.basketDrawer.locator('button:has(svg.lucide-x)').first();

    this.couponInput = page.getByPlaceholder('Coupon code (e.g. SPHERE20, SUMMER50)');
    this.applyCouponBtn = page.getByRole('button', { name: 'Apply', exact: true });
    this.removeCouponBtn = page.getByRole('button', { name: 'Remove', exact: true });
    this.proceedToCheckoutBtn = page.getByRole('button', { name: /proceed to checkout/i });

    // 3. Guest Checkout Auth Guard Notice (inside auth-modal)
    this.authCheckoutNotice = page.getByTestId('auth-checkout-notice');

    // 4. Secure Checkout Modal Container & Close Button
    this.checkoutHeading = page.getByRole('heading', { name: 'Secure Checkout' });
    this.checkoutModal = page.locator('div.fixed.inset-0').filter({ has: this.checkoutHeading });
    this.closeCheckoutBtn = this.checkoutModal.getByTestId('checkout-close-button');

    // 5. Step 1: Shipping Destination Address
    this.step1Heading = this.checkoutModal.getByRole('heading', { name: /step 1: shipping destination address/i });
    this.fullNameInput = this.checkoutModal.getByTestId('checkout-fullname');
    this.streetInput = this.checkoutModal.getByTestId('checkout-street');
    this.cityInput = this.checkoutModal.getByTestId('checkout-city');
    this.stateInput = this.checkoutModal.getByTestId('checkout-state');
    this.postalCodeInput = this.checkoutModal.getByTestId('checkout-postalcode');
    this.countryInput = this.checkoutModal.getByTestId('checkout-country');
    this.phoneInput = this.checkoutModal.getByTestId('checkout-phone');
    this.continueToShippingBtn = this.checkoutModal.getByRole('button', { name: /continue to shipping method/i });

    // 6. Step 2: Choose Delivery Method
    this.step2Heading = this.checkoutModal.getByRole('heading', { name: /step 2: choose delivery method/i });
    this.shippingStandard = this.checkoutModal.locator('label[data-testid="checkout-shipping-standard"]');
    this.shippingExpress = this.checkoutModal.locator('label[data-testid="checkout-shipping-express"]');
    this.shippingPriority = this.checkoutModal.locator('label[data-testid="checkout-shipping-priority"]');
    this.shippingBackBtn = this.checkoutModal.getByRole('button', { name: 'Back' });
    this.continueToPaymentBtn = this.checkoutModal.getByRole('button', { name: /continue to payment/i });

    // 7. Step 3: Select Payment Gateway
    this.step3Heading = this.checkoutModal.getByRole('heading', { name: /step 3: select payment gateway/i });
    this.payUpiBtn = this.checkoutModal.getByRole('button', { name: /upi \/ qr/i });
    this.payCardBtn = this.checkoutModal.getByRole('button', { name: /cards/i });
    this.payNetBankingBtn = this.checkoutModal.getByRole('button', { name: /net banking/i });
    this.payCodBtn = this.checkoutModal.getByRole('button', { name: /cash on delivery/i });

    // Card Gateway Inputs
    this.cardNumberInput = this.checkoutModal.getByTestId('checkout-card-number');
    this.cardExpiryInput = this.checkoutModal.getByTestId('checkout-card-expiry');
    this.cardCvvInput = this.checkoutModal.getByTestId('checkout-card-cvv');

    this.paymentBackBtn = this.checkoutModal.getByRole('button', { name: 'Back' });
    this.proceedToOtpBtn = this.checkoutModal.getByRole('button', { name: /proceed to otp gate/i });

    // 8. Step 4: OTP Gate Verification
    this.otpInput = this.checkoutModal.locator('input[inputmode="numeric"][maxlength="6"]');
    this.verifyOtpBtn = this.checkoutModal.getByRole('button', { name: /verify otp & authorize/i });

    // 9. Order Placed Successfully Confirmation Card
    this.orderConfirmedContainer = this.checkoutModal.getByTestId('order-confirmed-container');
    this.orderSuccessHeading = this.orderConfirmedContainer.getByRole('heading', { name: 'Order Placed Successfully!' });
    this.orderReferenceNumber = this.orderConfirmedContainer.getByTestId('order-reference-number');
    this.orderTrackingNumber = this.orderConfirmedContainer.getByTestId('order-tracking-number');
    this.orderPaymentStatus = this.orderConfirmedContainer.getByTestId('order-payment-status');
    this.orderTotalPaid = this.orderConfirmedContainer.getByTestId('order-total-paid');
    this.viewOrdersBtn = this.orderConfirmedContainer.getByRole('button', { name: /view in my orders/i });
    this.continueShoppingBtn = this.orderConfirmedContainer.getByRole('button', { name: /continue shopping/i });
  }

  getCartItemDecreaseBtn(productId) {
    return this.page.getByTestId(`cart-item-decrease-${productId}`);
  }

  getCartItemQuantity(productId) {
    return this.page.getByTestId(`cart-item-quantity-${productId}`);
  }

  getCartItemIncreaseBtn(productId) {
    return this.page.getByTestId(`cart-item-increase-${productId}`);
  }

  getCartItemRemoveBtn(productId) {
    return this.page.getByTestId(`cart-item-remove-${productId}`);
  }

  // Opens Cart after login: removes any leftover items, then clicks "Browse Catalog" to return to the store
  async ensureEmptyCartAndBrowseCatalog() {
    await this.navCartBtn.click();
    await this.basketHeading.waitFor({ state: 'visible' });

    const removeButtons = this.basketDrawer.locator('button[title="Remove item"]');
    while ((await removeButtons.count()) > 0) {
      const currentCount = await removeButtons.count();
      await removeButtons.first().click();
      await this.page.waitForFunction(
        (expectedMax) => document.querySelectorAll('button[title="Remove item"]').length < expectedMax,
        currentCount
      );
    }

    // Now the empty basket shows "Browse Catalog" -> click it to return to the catalog
    await this.browseCatalogBtn.waitFor({ state: 'visible' });
    await this.browseCatalogBtn.click();
    await this.basketHeading.waitFor({ state: 'hidden' });
  }

  async openCart() {
    await this.navCartBtn.click();
    await this.basketHeading.waitFor({ state: 'visible' });
  }

  async applyCoupon(code) {
    await this.couponInput.fill(code);
    await this.applyCouponBtn.click();
  }

  async removeCoupon() {
    await this.removeCouponBtn.click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutBtn.click();
    await this.checkoutHeading.waitFor({ state: 'visible' });
  }

  async fillIndianShippingAddress({ fullName, street, city, state, postalCode, country = 'India', phone }) {
    await this.fullNameInput.fill(fullName);
    await this.streetInput.fill(street);
    await this.cityInput.fill(city);
    await this.stateInput.fill(state);
    if (this.countryInput && await this.countryInput.isVisible().catch(() => false)) {
      await this.countryInput.fill(country);
    }
    await this.postalCodeInput.fill(postalCode);
    await this.phoneInput.fill(phone);
  }

  async enterAndVerifyOtp(otp = '123456') {
    await this.otpInput.waitFor({ state: 'visible' });
    await this.otpInput.fill(otp);
    await this.verifyOtpBtn.click();
  }

  async closeCheckoutModal() {
    await this.closeCheckoutBtn.click();
    await this.checkoutHeading.waitFor({ state: 'hidden' });
  }
}