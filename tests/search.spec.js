import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';
import { ProductDetailPage } from '../pages/ProductDetailPage.js';

test.describe('ShopSphere Product Search & Quick Results Dropdown Suite', () => {
  let homePage;
  let pdp;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    pdp = new ProductDetailPage(page);
    await homePage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  // ==========================================
  // 1. POSITIVE SEARCH & DROPDOWN TEST CASES
  // ==========================================

  test('TC-SRCH-01 (+ve): Verify search input visibility, attributes, and placeholder', async () => {
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.searchInput).toBeEnabled();
    await expect(homePage.searchInput).toHaveAttribute('type', 'text');
    await expect(homePage.searchInput).toHaveAttribute(
      'placeholder',
      'Search dresses, smartphones, audio devices, perfumes...'
    );
    await expect(homePage.searchInput).toHaveValue('');
  });

  test('TC-SRCH-02 (+ve): Typing partial query "stu" opens Quick Results dropdown and selects matching product into PDP', async () => {
    await homePage.searchProduct('stu');

    // Verify Quick Results dropdown & matched preview items appear
    await expect(homePage.searchPreviewDropdown).toBeVisible();
    await expect(homePage.searchPreviewHeader).toBeVisible();
    await expect(homePage.searchPreviewDropdown).toContainText(/matches/i);

    const studioHeadphonesItem = homePage.getSearchPreviewItem('prod_audio_02');
    await expect(studioHeadphonesItem).toBeVisible();
    await expect(studioHeadphonesItem).toContainText('BassForge Studio Over-Ear Wireless Headphones');
    await expect(studioHeadphonesItem).toContainText('$289.00');

    // Click item directly from the dropdown -> opens PDP modal -> add to basket -> close PDP
    await studioHeadphonesItem.click();
    await expect(pdp.shareBtn).toBeVisible();
    await expect(pdp.addToBasketBtn).toContainText('$289.00');

    await pdp.clickAddToBasket();
    await expect(pdp.cartButton).toContainText('1');

    await pdp.closeProductModal();
    await expect(pdp.shareBtn).toBeHidden();
  });

  test('TC-SRCH-03 (+ve): Entering full product name and pressing Enter filters catalog and continues PDP -> Cart flow', async ({ page }) => {
    const fullProductName = 'Pleated Satin Midi Cocktail Dress';

    // Type full product name and press Enter
    await homePage.searchProduct(fullProductName, true);

    // Filtered catalog card is visible with exact $139.00 price
    const dressCard = page.getByTestId('product-card-prod_fash_04');
    await expect(dressCard).toBeVisible();
    await expect(dressCard.getByRole('heading', { level: 3 })).toHaveText(fullProductName);

    // Open product card -> verify $139.00 Add to Basket -> add to cart -> close modal
    await dressCard.getByRole('heading', { level: 3 }).click();
    await expect(pdp.addToBasketBtn).toContainText('$139.00');

    await pdp.clickAddToBasket();
    await expect(pdp.cartButton).toContainText('1');

    await pdp.closeProductModal();
    await expect(pdp.shareBtn).toBeHidden();
  });

  test('TC-SRCH-04 (+ve): Search query is case-insensitive (UPPERCASE and lowercase)', async ({ page }) => {
    await homePage.searchProduct('NOVA FOLD', true);
    await expect(page.getByTestId('product-card-prod_elec_02')).toBeVisible();

    await homePage.searchProduct('nova fold', true);
    await expect(page.getByTestId('product-card-prod_elec_02')).toBeVisible();
  });

  test('TC-SRCH-05 (+ve): Searching by product type keyword (Perfume) filters correctly', async ({ page }) => {
    await homePage.searchProduct('Perfume', true);

    await expect(page.getByTestId('product-card-prod_beau_01')).toBeVisible();
    await expect(page.getByTestId('product-card-prod_elec_02')).toBeHidden();
  });

  test('TC-SRCH-06 (+ve): Clearing search input restores full 16-item catalog', async ({ page }) => {
    await homePage.searchProduct('Nova Fold', true);
    await expect(page.getByTestId('product-card-prod_fash_01')).toBeHidden();

    await homePage.searchInput.clear();

    await expect(homePage.totalCount).toHaveText(/\d+\s+items/i);
    await expect(page.getByTestId('product-card-prod_fash_01')).toBeVisible();
  });

  test('TC-SRCH-07 (+ve): Leading and trailing spaces still match valid products', async ({ page }) => {
    await homePage.searchProduct('   Nova Fold   ', true);

    await expect(page.getByTestId('product-card-prod_elec_02')).toBeVisible();
  });

  // ==========================================
  // 2. NEGATIVE & SECURITY TEST CASES
  // ==========================================

  test('TC-SRCH-08 (-ve): Non-existent product search displays zero results gracefully', async ({ page }) => {
    await homePage.searchProduct('xyznonexistentproduct999', true);

    await expect(homePage.totalCount).toContainText('0 items');
    await expect(page.getByTestId('product-card-prod_fash_01')).toBeHidden();
  });

  test('TC-SRCH-09 (-ve): Special characters & XSS payload are safely neutralized', async ({ page }) => {
    let dialogTriggered = false;
    page.on('dialog', () => {
      dialogTriggered = true;
    });

    await homePage.searchProduct('<script>alert("XSS")</script> !@#$%^&*()', true);

    expect(dialogTriggered).toBe(false);
    await expect(homePage.searchInput).toHaveValue('<script>alert("XSS")</script> !@#$%^&*()');
    await expect(homePage.totalCount).toContainText('0 items');
  });

  test('TC-SRCH-10 (-ve): Whitespace-only input does not crash catalog filtering', async () => {
    await homePage.searchProduct('     ', true);

    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.totalCount).toBeVisible();
  });

  // ==========================================
  // 3. RESPONSIVE / VIEWPORT TEST CASE
  // ==========================================

  test('TC-SRCH-11 (Responsive): Mobile viewport swaps desktop search for mobile-search-input', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(homePage.searchInput).toBeHidden();
    await expect(homePage.mobileSearchInput).toBeVisible();

    await homePage.mobileSearchInput.fill('Perfume');
    await expect(page.getByTestId('product-card-prod_beau_01')).toBeVisible();
  });
});
