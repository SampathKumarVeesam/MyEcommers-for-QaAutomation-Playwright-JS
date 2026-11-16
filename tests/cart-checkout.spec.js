import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';
import { CartCheckoutPage } from '../pages/CartCheckoutPage.js';

const REAL_USER = {
  email: process.env.REAL_USER_EMAIL || 'user@mailto.plus',
  password: process.env.REAL_USER_PASSWORD || 'User@2$0$2$6',
};

const INDIAN_ADDRESS = {
  fullName: 'Sampath Kumar Veesam',
  street: 'Plot 42, Madhapur Main Road, HITEC City',
  city: 'Hyderabad',
  state: 'Telangana',
  postalCode: '500081',
  phone: '+91 98765 43210',
};

const DROPDOWN_PRODUCT_ID = 'prod_audio_02';

test.describe('ShopSphere Cart (Your Shopping Basket), Coupon & Multi-Step Checkout Suite', () => {
  let authPage;
  let pdp;
  let cartCheckout;

  test.beforeEach(async ({ page }) => {
    if (!REAL_USER.email || !REAL_USER.password) {
      throw new Error('Missing REAL_USER_EMAIL or REAL_USER_PASSWORD in .env');
    }

    authPage = new AuthPage(page);
    pdp = new ProductDetailPage(page);
    cartCheckout = new CartCheckoutPage(page);

    await authPage.goto();

    // 1. Login with registered customer account
    await authPage.login({
      email: REAL_USER.email,
      password: REAL_USER.password,
    });
    await expect(authPage.signInNavBtn).toBeHidden();

    // 2. Open Cart -> clear any leftover items -> click "Browse Catalog" when basket is empty
    await cartCheckout.ensureEmptyCartAndBrowseCatalog();

    // 3. Search "stu" -> select BassForge Studio Headphones from Quick Results dropdown -> Add to Basket -> Close PDP (w-5 h-5)
    await pdp.searchDropdownAndOpenProduct('stu', DROPDOWN_PRODUCT_ID);
    await pdp.clickAddToBasket();
    await expect(cartCheckout.navCartCount).toHaveText('1');

    if (await pdp.closeBtn.isVisible()) {
      await pdp.closeProductModal();
    }
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  // ==========================================
  // 1. CART DRAWER ("Your Shopping Basket") & STEPPERS (+ / - / REMOVE)
  // ==========================================

  test('TC-CART-01 (+ve): Open Cart displays "Your Shopping Basket" and + / - quantity steppers update count & subtotal', async () => {
    await cartCheckout.openCart();
    await expect(cartCheckout.basketHeading).toBeVisible();

    const qtyDisplay = cartCheckout.getCartItemQuantity(DROPDOWN_PRODUCT_ID);
    const increaseBtn = cartCheckout.getCartItemIncreaseBtn(DROPDOWN_PRODUCT_ID);
    const decreaseBtn = cartCheckout.getCartItemDecreaseBtn(DROPDOWN_PRODUCT_ID);

    await expect(qtyDisplay).toHaveText('1');

    // Click '+' twice -> quantity becomes 3
    await increaseBtn.click();
    await expect(qtyDisplay).toHaveText('2');
    await expect(cartCheckout.navCartCount).toHaveText('2');

    await increaseBtn.click();
    await expect(qtyDisplay).toHaveText('3');
    await expect(cartCheckout.navCartCount).toHaveText('3');

    // Click '-' once -> quantity drops back to 2
    await decreaseBtn.click();
    await expect(qtyDisplay).toHaveText('2');
    await expect(cartCheckout.navCartCount).toHaveText('2');
  });

  // ==========================================
  // 2. COUPON CODE ENTRY, APPLY & REMOVE
  // ==========================================

  test('TC-CART-02 (+ve): Apply valid coupon SPHERE20 inside Your Shopping Basket and remove coupon', async ({ page }) => {
    await cartCheckout.openCart();
    await expect(cartCheckout.basketHeading).toBeVisible();

    await cartCheckout.applyCoupon('SPHERE20');
    await expect(cartCheckout.removeCouponBtn).toBeVisible();
    await expect(page.getByText(/SPHERE20|discount|applied/i).first()).toBeVisible();

    await cartCheckout.removeCoupon();
    await expect(cartCheckout.removeCouponBtn).toBeHidden();
    await expect(cartCheckout.applyCouponBtn).toBeVisible();
  });

  test('TC-CART-03 (-ve): Invalid coupon code shows error and does not apply discount', async ({ page }) => {
    await cartCheckout.openCart();
    await expect(cartCheckout.basketHeading).toBeVisible();

    await cartCheckout.applyCoupon('INVALIDCODE999');
    await expect(page.getByText(/invalid|expired|not found|not valid/i).first()).toBeVisible();
    await expect(cartCheckout.removeCouponBtn).toBeHidden();
  });

  // ==========================================
  // 3. STEP 1: SECURE CHECKOUT & INDIAN ADDRESS
  // ==========================================

  test('TC-CHK-01 (+ve): Proceed to Checkout opens Secure Checkout card and accepts Indian shipping address', async () => {
    await cartCheckout.openCart();
    await cartCheckout.proceedToCheckout();

    await expect(cartCheckout.checkoutHeading).toBeVisible();
    await expect(cartCheckout.step1Heading).toBeVisible();

    await cartCheckout.fillIndianShippingAddress(INDIAN_ADDRESS);
    await expect(cartCheckout.cityInput).toHaveValue('Hyderabad');
    await expect(cartCheckout.stateInput).toHaveValue('Telangana');
    await expect(cartCheckout.postalCodeInput).toHaveValue('500081');

    await cartCheckout.continueToShippingBtn.click();
    await expect(cartCheckout.step2Heading).toBeVisible();
  });

  // ==========================================
  // 4. STEP 2: ALL 3 DELIVERY METHODS & BACK NAVIGATION
  // ==========================================

  test('TC-CHK-02 (+ve): Shipping Method 1 — Standard Ground Shipping (FREE) & Back button test', async () => {
    await cartCheckout.openCart();
    await cartCheckout.proceedToCheckout();
    await cartCheckout.fillIndianShippingAddress(INDIAN_ADDRESS);
    await cartCheckout.continueToShippingBtn.click();

    await cartCheckout.shippingStandard.click();
    await expect(cartCheckout.shippingStandard.locator('input[type="radio"]')).toBeChecked();

    await cartCheckout.shippingBackBtn.click();
    await expect(cartCheckout.step1Heading).toBeVisible();
    await expect(cartCheckout.cityInput).toHaveValue('Hyderabad');

    await cartCheckout.continueToShippingBtn.click();
    await cartCheckout.continueToPaymentBtn.click();
    await expect(cartCheckout.step3Heading).toBeVisible();
  });

  test('TC-CHK-03 (+ve): Shipping Method 2 — Express 2-Day Air ($14.99)', async () => {
    await cartCheckout.openCart();
    await cartCheckout.proceedToCheckout();
    await cartCheckout.fillIndianShippingAddress(INDIAN_ADDRESS);
    await cartCheckout.continueToShippingBtn.click();

    await cartCheckout.shippingExpress.click();
    await expect(cartCheckout.shippingExpress.locator('input[type="radio"]')).toBeChecked();

    await cartCheckout.continueToPaymentBtn.click();
    await expect(cartCheckout.step3Heading).toBeVisible();
  });

  test('TC-CHK-04 (+ve): Shipping Method 3 — Next-Day Priority Courier ($24.99)', async () => {
    await cartCheckout.openCart();
    await cartCheckout.proceedToCheckout();
    await cartCheckout.fillIndianShippingAddress(INDIAN_ADDRESS);
    await cartCheckout.continueToShippingBtn.click();

    await cartCheckout.shippingPriority.click();
    await expect(cartCheckout.shippingPriority.locator('input[type="radio"]')).toBeChecked();

    await cartCheckout.continueToPaymentBtn.click();
    await expect(cartCheckout.step3Heading).toBeVisible();
  });

  // ==========================================
  // 5. STEP 3: ALL PAYMENT GATEWAYS & BACK BUTTON
  // ==========================================

  test('TC-CHK-05 (+ve): Switch across all 4 Payment Gateways (UPI, Cards, Net Banking, COD) & test Back button', async () => {
    await cartCheckout.openCart();
    await cartCheckout.proceedToCheckout();
    await cartCheckout.fillIndianShippingAddress(INDIAN_ADDRESS);
    await cartCheckout.continueToShippingBtn.click();
    await cartCheckout.continueToPaymentBtn.click();

    await cartCheckout.payUpiBtn.click();
    await expect(cartCheckout.payUpiBtn).toHaveClass(/border-indigo-600/);

    await cartCheckout.payNetBankingBtn.click();
    await expect(cartCheckout.payNetBankingBtn).toHaveClass(/border-indigo-600/);

    await cartCheckout.payCodBtn.click();
    await expect(cartCheckout.payCodBtn).toHaveClass(/border-indigo-600/);

    await cartCheckout.payCardBtn.click();
    await expect(cartCheckout.cardNumberInput).toBeVisible();
    await cartCheckout.cardNumberInput.fill('4242 4242 4242 4242');
    await cartCheckout.cardExpiryInput.fill('12/29');
    await cartCheckout.cardCvvInput.fill('999');

    await cartCheckout.paymentBackBtn.click();
    await expect(cartCheckout.step2Heading).toBeVisible();
  });

  // ==========================================
  // 6. FULL END-TO-END FLOWS (DIRECT CART + PDP BUY NOW)
  // ==========================================

  test('TC-CHK-06 (+ve): Complete Direct Cart E2E Flow (Your Shopping Basket -> + Qty -> SPHERE20 -> India Address -> Shipping -> Payment -> OTP 123456 -> Order Confirmed -> Close)', async () => {
    await cartCheckout.openCart();
    await expect(cartCheckout.basketHeading).toBeVisible();

    // Test + and - quantity steppers in basket before applying coupon
    const increaseBtn = cartCheckout.getCartItemIncreaseBtn(DROPDOWN_PRODUCT_ID);
    const decreaseBtn = cartCheckout.getCartItemDecreaseBtn(DROPDOWN_PRODUCT_ID);
    await increaseBtn.click();
    await expect(cartCheckout.navCartCount).toHaveText('2');
    await decreaseBtn.click();
    await expect(cartCheckout.navCartCount).toHaveText('1');

    // Apply coupon SPHERE20 and proceed to checkout
    await cartCheckout.applyCoupon('SPHERE20');
    await expect(cartCheckout.removeCouponBtn).toBeVisible();
    await cartCheckout.proceedToCheckout();

    await cartCheckout.fillIndianShippingAddress(INDIAN_ADDRESS);
    await cartCheckout.continueToShippingBtn.click();

    await cartCheckout.shippingExpress.click();
    await cartCheckout.continueToPaymentBtn.click();

    await cartCheckout.payCardBtn.click();
    await cartCheckout.cardNumberInput.fill('4242 4242 4242 4242');
    await cartCheckout.cardExpiryInput.fill('12/28');
    await cartCheckout.cardCvvInput.fill('888');

    await cartCheckout.proceedToOtpBtn.click();
    await cartCheckout.enterAndVerifyOtp('123456');

    await expect(cartCheckout.orderConfirmedContainer).toBeVisible();
    await expect(cartCheckout.orderSuccessHeading).toHaveText('Order Placed Successfully!');
    await expect(cartCheckout.orderReferenceNumber).toContainText(/^ORD-/);
    await expect(cartCheckout.orderTrackingNumber).toContainText(/^TRK-/);
    await expect(cartCheckout.orderPaymentStatus).toHaveText(/paid/i);
    await expect(cartCheckout.orderTotalPaid).toContainText('$');
    await expect(cartCheckout.viewOrdersBtn).toBeVisible();
    await expect(cartCheckout.continueShoppingBtn).toBeVisible();

    await cartCheckout.closeCheckoutModal();
    await expect(cartCheckout.orderConfirmedContainer).toBeHidden();
  });

  test('TC-CHK-07 (-ve): OTP Gate rejects invalid/wrong OTP code', async ({ page }) => {
    await cartCheckout.openCart();
    await cartCheckout.proceedToCheckout();
    await cartCheckout.fillIndianShippingAddress(INDIAN_ADDRESS);
    await cartCheckout.continueToShippingBtn.click();
    await cartCheckout.continueToPaymentBtn.click();
    await cartCheckout.proceedToOtpBtn.click();

    await cartCheckout.enterAndVerifyOtp('000000');

    await expect(page.getByText(/invalid otp|incorrect otp|wrong otp|failed/i).first()).toBeVisible();
    await expect(cartCheckout.checkoutHeading).toBeVisible();
  });

  test('TC-CHK-09 (+ve): PDP "Buy Now" jumps directly into Secure Checkout -> OTP 123456 -> Order Placed Successfully', async () => {
    await pdp.searchAndOpenProduct('Pleated Satin Midi Cocktail Dress', 'prod_fash_04');
    await pdp.clickBuyNow();

    await expect(cartCheckout.checkoutHeading).toBeVisible();
    await expect(cartCheckout.step1Heading).toBeVisible();

    await cartCheckout.fillIndianShippingAddress(INDIAN_ADDRESS);
    await cartCheckout.continueToShippingBtn.click();

    await cartCheckout.shippingPriority.click();
    await cartCheckout.continueToPaymentBtn.click();

    await cartCheckout.payCardBtn.click();
    await cartCheckout.cardNumberInput.fill('4242 4242 4242 4242');
    await cartCheckout.cardExpiryInput.fill('12/28');
    await cartCheckout.cardCvvInput.fill('888');
    await cartCheckout.proceedToOtpBtn.click();

    await cartCheckout.enterAndVerifyOtp('123456');

    await expect(cartCheckout.orderConfirmedContainer).toBeVisible();
    await expect(cartCheckout.orderSuccessHeading).toHaveText('Order Placed Successfully!');
    await cartCheckout.closeCheckoutModal();
  });
});

// ==========================================
// 7. GUEST CHECKOUT AUTH GUARD -> FULL CHECKOUT UNTIL ORDER CONFIRMATION
// ==========================================

test.describe('ShopSphere Guest Checkout Auth Guard to Order Confirmation Flow', () => {
  test('TC-CHK-08 (+ve / Auth Guard E2E): Guest opens Your Shopping Basket -> Clicks Proceed to Checkout -> Sees Checkout Notice -> Signs In -> Completes Checkout & OTP -> Order Placed Successfully', async ({ page }) => {
    const authPage = new AuthPage(page);
    const pdp = new ProductDetailPage(page);
    const cartCheckout = new CartCheckoutPage(page);

    // 1. Start on home page as an unauthenticated guest
    await authPage.goto();
    await expect(authPage.signInNavBtn).toBeVisible();

    // 2. Type full product name + press Enter -> open PDP -> add to basket -> close PDP (w-5 h-5)
    await pdp.searchAndOpenProduct('Pleated Satin Midi Cocktail Dress', 'prod_fash_04');
    await pdp.clickAddToBasket();
    await expect(cartCheckout.navCartCount).toHaveText('1');

    if (await pdp.closeBtn.isVisible()) {
      await pdp.closeProductModal();
    }

    // 3. Open Cart ("Your Shopping Basket") and click "Proceed to Checkout" while logged out
    await cartCheckout.openCart();
    await expect(cartCheckout.basketHeading).toBeVisible();
    await cartCheckout.proceedToCheckoutBtn.click();

    // 4. Verify Secure Checkout is blocked and Auth Modal opens with the exact checkout notice
    await expect(cartCheckout.checkoutHeading).toBeHidden();
    await expect(authPage.modal).toBeVisible();
    await expect(cartCheckout.authCheckoutNotice).toBeVisible();
    await expect(cartCheckout.authCheckoutNotice).toContainText(
      'Please sign in or create an account first to proceed to checkout.'
    );

    // 5. Sign in directly from the prompted Auth Modal
    await authPage.loginEmailInput.fill(REAL_USER.email);
    await authPage.loginPasswordInput.fill(REAL_USER.password);
    await authPage.loginSubmitBtn.click();

    // 6. Verify customer is logged in
    await expect(authPage.modal).toBeHidden();
    await expect(authPage.signInNavBtn).toBeHidden();

    // 7. Enter Secure Checkout (re-open Your Shopping Basket if drawer closed after login)
    if (!(await cartCheckout.checkoutHeading.isVisible())) {
      if (!(await cartCheckout.proceedToCheckoutBtn.isVisible())) {
        await cartCheckout.openCart();
        await expect(cartCheckout.basketHeading).toBeVisible();
      }
      await cartCheckout.proceedToCheckout();
    }
    await expect(cartCheckout.checkoutHeading).toBeVisible();

    // 8. Step 1: Fill Indian Shipping Destination Address
    await cartCheckout.fillIndianShippingAddress(INDIAN_ADDRESS);
    await cartCheckout.continueToShippingBtn.click();

    // 9. Step 2: Select Next-Day Priority Courier Shipping
    await cartCheckout.shippingPriority.click();
    await cartCheckout.continueToPaymentBtn.click();

    // 10. Step 3: Select Cards Payment Gateway & Proceed to OTP Gate
    await cartCheckout.payCardBtn.click();
    await cartCheckout.cardNumberInput.fill('4242 4242 4242 4242');
    await cartCheckout.cardExpiryInput.fill('12/28');
    await cartCheckout.cardCvvInput.fill('888');
    await cartCheckout.proceedToOtpBtn.click();

    // 11. Step 4: Enter OTP 123456 & click Verify OTP & Authorize
    await cartCheckout.enterAndVerifyOtp('123456');

    // 12. Verify "Order Placed Successfully!" confirmation card & all order metadata
    await expect(cartCheckout.orderConfirmedContainer).toBeVisible();
    await expect(cartCheckout.orderSuccessHeading).toHaveText('Order Placed Successfully!');
    await expect(cartCheckout.orderReferenceNumber).toContainText(/^ORD-/);
    await expect(cartCheckout.orderTrackingNumber).toContainText(/^TRK-/);
    await expect(cartCheckout.orderPaymentStatus).toHaveText(/paid/i);
    await expect(cartCheckout.orderTotalPaid).toContainText('$');
    await expect(cartCheckout.viewOrdersBtn).toBeVisible();
    await expect(cartCheckout.continueShoppingBtn).toBeVisible();

    // 13. Close the confirmation card via checkout-close-button
    await cartCheckout.closeCheckoutModal();
    await expect(cartCheckout.orderConfirmedContainer).toBeHidden();

    await page.close();
  });
});