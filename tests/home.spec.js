import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage.js';

test.describe('ShopSphere Home Page Suite', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test('TC-01: Verify page title, branding, and header controls', async ({ page }) => {
    await expect(page).toHaveTitle(/ShopSphere - Multi-Category E-Commerce & QA Testing Platform/);

    await expect(homePage.logo).toContainText('ShopSphere');
    await expect(page.getByText('SPHERE20')).toBeVisible();
    await expect(page.getByRole('button', { name: /admin login|administrator login/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /customer demos/i })).toBeVisible();
    await expect(homePage.wishlistButton).toBeVisible();
    await expect(homePage.cartButton).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('TC-03: Search input filters the product catalog', async ({ page }) => {
    await homePage.searchProduct('Nova Fold');

    await expect(page.getByTestId('product-card-prod_elec_02')).toBeVisible();
    await expect(page.getByTestId('product-card-prod_fash_01')).toBeHidden();
  });

  test('TC-04: Category navigation tabs filter products by category', async ({ page }) => {
    // Switch to Smartphones & Tech
    await homePage.selectCategory('electronics');
    await expect(page.getByTestId('product-card-prod_elec_02')).toBeVisible();
    await expect(page.getByTestId('product-card-prod_fash_01')).toBeHidden();

    // Switch to Hi-Fi Audio
    await homePage.selectCategory('audio');
    await expect(page.getByTestId('product-card-prod_audio_01')).toBeVisible();

    // Reset to All Products
    await homePage.selectCategory('all');
    await expect(homePage.totalCount).toHaveText(/(16|17) items/i);
  });

  test('TC-05: Hero carousel slides navigate properly', async ({ page }) => {
    const nextSlideBtn = page.getByRole('button', { name: 'Next slide' });
    const initialHeading = await page.locator('h1').textContent();

    await nextSlideBtn.click();
    await expect(page.locator('h1')).not.toHaveText(initialHeading || '');
  });

  test('TC-06: Price slider, stock filter, and sorting update the catalog', async ({ page }) => {
    // Adjust Max Price slider to $200
    await homePage.priceSlider.fill('200');
    await expect(homePage.priceDisplay).toHaveText('$200');

    // Expensive item ($1399) should be filtered out
    await expect(page.getByTestId('product-card-prod_elec_02')).toBeHidden();

    // Toggle In Stock Only
    await homePage.inStockCheckbox.check();
    await expect(homePage.inStockCheckbox).toBeChecked();

    // Sort Low to High
    await homePage.sortSelect.selectOption('low-to-high');
    await expect(homePage.sortSelect).toHaveValue('low-to-high');
  });

  test('TC-07: Product card details and Add to Cart action', async ({ page }) => {
    const card = page.getByTestId('product-card-prod_fash_01');
    await expect(card.getByRole('heading', { level: 3 })).toHaveText('Silk Evening Flared Wrap Dress');
    await expect(card.getByText('$189.99')).toBeVisible();
    await expect(card.getByText('In Stock')).toBeVisible();

    await homePage.addProductToCart('prod_fash_01');
    await expect(homePage.cartButton).toContainText('1');
  });

  test('TC-08: Catalog pagination navigates between Page 1 and Page 2', async () => {
    await expect(homePage.paginationPrev).toBeDisabled();
    await expect(homePage.paginationIndicator).toHaveText('Page 1 of 2');

    await homePage.paginationNext.click();
    await expect(homePage.paginationIndicator).toHaveText('Page 2 of 2');
    await expect(homePage.paginationPrev).toBeEnabled();
  });

  test('TC-09: FAQ accordion expands and newsletter accepts email', async ({ page }) => {
    // Expand first FAQ item (Priority 1: getByRole)
    await page.getByRole('button', { name: /how long does express shipping take/i }).click();
    await expect(page.getByText(/express delivery arrives within 1-2 business days/i)).toBeVisible();

    // Newsletter input (Priority 2: getByPlaceholder, Priority 1: getByRole)
    const emailInput = page.getByPlaceholder(/enter your email address/i);
    await emailInput.fill('qa.tester@shopsphere.com');
    await page.getByRole('button', { name: /subscribe/i }).click();
  });

  test('TC-10: Mobile viewport swaps desktop search for mobile search input', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(homePage.searchInput).toBeHidden();
    await expect(homePage.mobileSearchInput).toBeVisible();

    await homePage.mobileSearchInput.fill('Perfume');
    await expect(page.getByTestId('product-card-prod_beau_01')).toBeVisible();
  });
});
