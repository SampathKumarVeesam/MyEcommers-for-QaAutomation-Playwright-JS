import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';

test.describe('ShopSphere Product Detail Modal (PDP) & Cart Flow Suite', () => {
  let pdp;

  test.beforeEach(async ({ page }) => {
    pdp = new ProductDetailPage(page);
    await pdp.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('TC-PDP-01 (+ve): Search product, open PDP, and verify product details & controls', async () => {
    await pdp.searchAndOpenProduct('Nova', 'prod_elec_02');

    await expect(pdp.shareBtn).toBeVisible();
    await expect(pdp.shareBtn).toHaveAttribute('title', 'Share this product');
    await expect(pdp.addToBasketBtn).toBeVisible();
    await expect(pdp.buyNowBtn).toBeVisible();
    await expect(pdp.closeBtn).toBeVisible();
  });

  test('TC-PDP-02 (+ve): Quantity stepper (+ and -) updates quantity and dynamic button price', async () => {
    await pdp.searchAndOpenProduct('Silk', 'prod_fash_01');

    // Default quantity starts at 1
    await expect(pdp.addToBasketBtn).toContainText('$189.99');

    // Click '+' twice -> quantity becomes 3, total price updates to $569.97
    await pdp.increaseQuantity(2);
    await expect(pdp.addToBasketBtn).toContainText('$569.97');

    // Click '-' once -> quantity becomes 2, total price updates to $379.98
    await pdp.decreaseQuantity(1);
    await expect(pdp.addToBasketBtn).toContainText('$379.98');
  });

  test('TC-PDP-03 (-ve): Quantity stepper (-) does not drop below minimum quantity 1', async () => {
    await pdp.searchAndOpenProduct('Silk', 'prod_fash_01');

    if (await pdp.decreaseQtyBtn.isEnabled()) {
      await pdp.decreaseQtyBtn.click();
    } else {
      await expect(pdp.decreaseQtyBtn).toBeDisabled();
    }

    await expect(pdp.addToBasketBtn).toContainText('$189.99');
  });

  test('TC-PDP-04 (+ve): Add to Basket updates header cart badge count', async () => {
    await pdp.searchAndOpenProduct('Silk', 'prod_fash_01');

    await pdp.increaseQuantity(1);
    await pdp.clickAddToBasket();

    await expect(pdp.cartButton).toContainText('2');
  });

  test('TC-PDP-05 (+ve): Open Product -> Share -> Close Social Share Popup -> Close Product Modal', async () => {
    await pdp.searchAndOpenProduct('Silk', 'prod_fash_01');
    await expect(pdp.shareBtn).toBeVisible();

    await pdp.clickShare();
    await expect(pdp.closeSharePopupBtn).toBeVisible();

    await pdp.closeSharePopup();
    await expect(pdp.closeSharePopupBtn).toBeHidden();

    // Verify Product Detail Modal is still open underneath
    await expect(pdp.shareBtn).toBeVisible();

    await pdp.closeProductModal();
    await expect(pdp.shareBtn).toBeHidden();
  });

  test('TC-PDP-06 (+ve): Buy Now adds item and opens checkout / cart drawer immediately', async ({ page }) => {
    await pdp.searchAndOpenProduct('Silk', 'prod_fash_01');

    await pdp.clickBuyNow();

    await expect(pdp.cartButton).toContainText('1');
    await expect(page.getByText(/checkout|your cart|shopping bag|order summary/i).first()).toBeVisible();
  });

  test('TC-PDP-07 (+ve): Close icon (X) closes the opened Product Detail Modal', async ({ page }) => {
    await pdp.searchAndOpenProduct('Silk', 'prod_fash_01');
    await expect(pdp.shareBtn).toBeVisible();

    await pdp.closeProductModal();

    await expect(pdp.shareBtn).toBeHidden();
    await expect(page.getByTestId('product-card-prod_fash_01')).toBeVisible();
  });

  test('TC-PDP-08 (+ve): Full End-to-End flow (Search -> Open -> + Qty -> Share -> Close Share -> Add to Basket -> Close Product)', async () => {
    await pdp.searchAndOpenProduct('Silk', 'prod_fash_01');

    await pdp.increaseQuantity(1);

    await pdp.clickShare();
    await pdp.closeSharePopup();

    await pdp.clickAddToBasket();
    await expect(pdp.cartButton).toContainText('2');

    if (await pdp.closeBtn.isVisible()) {
      await pdp.closeProductModal();
    }
    await expect(pdp.shareBtn).toBeHidden();
  });
});
